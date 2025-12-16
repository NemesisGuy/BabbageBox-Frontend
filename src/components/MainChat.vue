<template>
  <div class="chatgpt-chat-outer sexy-bg">
    <div
      class="chatgpt-chat-inner glass"
      :class="{ 'sidebar-hidden': !sidebarVisible }"
    >
      <Sidebar
        :conversations="conversations"
        :collapsed="!sidebarVisible"
        @toggle-sidebar="toggleSidebar"
        @new-chat="newChat"
        @select-conversation="loadConversation"
      />

      <ChatArea
        :messages="messages"
        v-model:input="input"
        v-model:tts-enabled="ttsEnabled"
        :show-silence="showSilence"
        :is-recording="isRecording"
        :show-model-modal="showModelModal"
        :is-thinking="isThinking"
        @toggle-sidebar="toggleSidebar"
        @silence-tts="silenceTTS"
        @send-message="sendMessage"
        @show-model-modal="() => (showModelModal = true)"
        @toggle-recording="toggleRecording"
        @clear-input="() => (input = '')"
      />

      <Teleport to="body">
        <div v-if="showModelModal" class="model-modal-overlay">
          <div class="model-modal glass">
            <button class="modal-close" @click="showModelModal = false">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <ModelSelector @model-set="onModelSet" />
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import Sidebar from './Sidebar.vue'
import ChatArea from './ChatArea.vue'
import ModelSelector from './ModelSelector.vue'

const props = defineProps<{}>()

const showModelModal = ref(false)
const messages = ref<
  Array<{
    id: number
    role: string
    content: string
    time: string
    model: string
    loading?: boolean
  }>
>([])
const input = ref('')
const showSilence = ref(false)
const ttsEnabled = ref(false)
const modelName = ref('Assistant')
const chatWindow = ref<HTMLElement | null>(null)
const loadingInterval = ref<number | null>(null)
const conversationId = ref<number | null>(null)
const conversations = ref<
  Array<{ id: number; title: string | null; created_at: string }>
>([])
const isRecording = ref(false)
const mediaRecorder = ref<MediaRecorder | null>(null)
const recordedChunks = ref<Blob[]>([])
const sidebarVisible = ref(true)
const isThinking = ref(false)

async function fetchModel() {
  try {
    const res = await fetch('http://localhost:8000/api/config')
    const data = await res.json()
    const path = data.llama_model_path
    if (path) {
      const filename = path.split(/[/\\]/).pop() || path
      modelName.value = filename.replace('.gguf', '')
    }
  } catch (err) {
    console.error('Failed to fetch model:', err)
  }
}

async function fetchConversations() {
  try {
    const res = await fetch('http://localhost:8000/api/conversations')
    conversations.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch conversations:', err)
  }
}

async function onModelSet() {
  await fetchModel()
  showModelModal.value = false
}

async function sendMessage() {
  if (!input.value.trim()) return
  const userMsg = {
    id: Date.now() + Math.random(),
    role: 'user',
    content: input.value,
    time: new Date().toLocaleTimeString(),
    model: modelName.value,
    loading: false,
  }
  messages.value.push(userMsg)

  // Push placeholder for assistant response immediately
  const responseMsg = {
    id: Date.now() + Math.random(),
    role: 'assistant',
    content: '',
    time: new Date().toLocaleTimeString(),
    model: modelName.value,
    loading: true,
  }
  messages.value.push(responseMsg)

  input.value = ''

  if (loadingInterval.value) {
    clearInterval(loadingInterval.value)
    loadingInterval.value = null
  }

  try {
    // Build context array: all completed user/assistant turns in order (exclude loading placeholders)
    const context = messages.value
      .filter(
        (m) =>
          (m.role === 'user' || m.role === 'assistant') &&
          !m.loading &&
          m.content.trim() !== ''
      )
      .map((m) => ({ role: m.role, content: m.content }))

    const res = await fetch('http://localhost:8000/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: userMsg.content,
        conversation_id: conversationId.value,
        context,
        include_tts: ttsEnabled.value,
      }),
    })
    const data = await res.json()

    const placeholderIndex = messages.value.length - 1

    // Update the placeholder message with the actual response
    messages.value[placeholderIndex] = {
      ...messages.value[placeholderIndex],
      loading: false,
      model: modelName.value,
      content: data.reply || 'No response from LLM.',
      time: new Date().toLocaleTimeString(),
    }

    if (data.audio_base64 && ttsEnabled.value) {
      playAudio(data.audio_base64)
    } else if (ttsEnabled.value) {
      console.warn('TTS was enabled but backend returned no audio.')
    }
  } catch (err) {
    // Find the placeholder and update it to show the error
    const placeholderIndex = messages.value.findIndex(
      (m) => m.id === responseMsg.id
    )
    if (placeholderIndex !== -1) {
      messages.value[placeholderIndex] = {
        ...messages.value[placeholderIndex],
        loading: false,
        model: 'System',
        content: 'Error: Unable to reach backend.',
        time: new Date().toLocaleTimeString(),
      }
    }
    console.error('Message Send Error:', err)
  }
}

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value
}

function newChat() {
  messages.value = []
  conversationId.value = null
}

function loadConversation(convId: number) {
  conversationId.value = convId
  fetch('http://localhost:8000/api/memory?conversation_id=' + convId)
    .then((res) => res.json())
    .then((memories: any[]) => {
      messages.value = []
      memories.forEach((mem) => {
        if (mem.content.startsWith('<|user|>\\n')) {
          const content = mem.content
            .slice('<|user|>\\n'.length)
            .replace('<|endoftext|>', '')
          messages.value.push({
            id: Date.now() + Math.random(),
            role: 'user',
            content,
            time: '',
            model: '',
            loading: false,
          })
        } else if (mem.content.startsWith('<|assistant|>\\n')) {
          const content = mem.content
            .slice('<|assistant|>\\n'.length)
            .replace('<|endoftext|>', '')
          messages.value.push({
            id: Date.now() + Math.random(),
            role: 'assistant',
            content,
            time: '',
            model: modelName.value,
            loading: false,
          })
        }
      })
    })
    .catch((err) => console.error('Failed to load conversation:', err))
}

onMounted(() => {
  if (window.innerWidth < 768) {
    sidebarVisible.value = false
  }
  fetchModel()
  fetchConversations()
  watch(
    messages,
    async () => {
      await nextTick()
      if (chatWindow.value)
        chatWindow.value.scrollTop = chatWindow.value.scrollHeight
    },
    { deep: true }
  )
})

const audioPlayer = ref<HTMLAudioElement | null>(null)

function playAudio(base64: string) {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value = null
  }

  try {
    const audio = new Audio('data:audio/wav;base64,' + base64)
    audioPlayer.value = audio

    audio.oncanplaythrough = () => {
      audio.play().catch((e) => {
        console.error('Audio playback failed:', e)
        alert('TTS Playback Failed: ' + e.message)
      })
    }

    audio.onerror = (e) => {
      console.error('Audio load error:', e)
    }

    showSilence.value = true
    audio.onended = () => {
      showSilence.value = false
      audioPlayer.value = null
    }
  } catch (e) {
    console.error('Error initializing audio:', e)
  }
}

function silenceTTS() {
  showSilence.value = false
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value = null
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

function toggleRecording() {
  if (isRecording.value) {
    if (mediaRecorder.value) {
      mediaRecorder.value.stop()
      isRecording.value = false
    }
    return
  }
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder.value = new MediaRecorder(stream)
      recordedChunks.value = []
      mediaRecorder.value.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) recordedChunks.value.push(event.data)
      }
      mediaRecorder.value.onstop = async () => {
        const blob = new Blob(recordedChunks.value, { type: 'audio/webm' })
        const arrayBuffer = await blob.arrayBuffer()
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
        try {
          const res = await fetch('http://localhost:8000/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio_base64: base64 }),
          })
          const data = await res.json()
          input.value = data.text || 'Transcription failed'
        } catch {
          input.value = 'Transcription failed'
        }
        stream.getTracks().forEach((track) => track.stop())
      }
      mediaRecorder.value.start()
      isRecording.value = true
    })
    .catch((err) => console.error('Microphone access denied', err))
}
</script>
