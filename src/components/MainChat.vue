<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import AppSidebar from './AppSidebar.vue'
import ChatArea from './ChatArea.vue'
import ModelSelector from './ModelSelector.vue'
import TTSSettingsModal from './TTSSettingsModal.vue'

interface Message {
  id: number
  role: string
  content: string
  time: string
  model: string
  loading?: boolean
  metrics?: {
    tokens_per_second: number
    generation_time: number
    completion_tokens: number
    is_fallback?: boolean
  }
  sources?: string[]
}

const showModelModal = ref(false)
const messages = ref<Message[]>([])
const input = ref('')
const ttsEnabled = ref(true)
const showSilence = ref(false)
const isRecording = ref(false)
const mediaRecorder = ref<MediaRecorder | null>(null)
const recordedChunks = ref<Blob[]>([])
const sidebarVisible = ref(true)
const sidebarCollapsed = ref(false)
const isThinking = ref(false)
const showTTSSettings = ref(false)
const ttsVoice = ref('M1')
const ttsSpeed = ref(1.0)
const modelName = ref('')
const modelId = ref('')
const currentProfile = ref('chat')
const currentConversationId = ref<number | null>(null) // State for current conversation

async function fetchModel() {
  try {
    const res = await fetch('http://localhost:8000/api/config')
    const data = await res.json()
    modelName.value = data.current_model || 'Unknown'
    modelId.value = data.current_model || ''
  } catch (e) {
    console.error('Failed to fetch model:', e)
  }
}

interface Conversation {
  id: number
  title: string
  created_at: string
}

const conversations = ref<Conversation[]>([])
async function fetchConversations() {
  try {
    const res = await fetch('http://localhost:8000/api/conversations')
    conversations.value = await res.json()
  } catch (e) {
    console.error('Failed to fetch conversations:', e)
  }
}

async function newChat() {
  try {
    const res = await fetch('http://localhost:8000/api/conversation/new', {
      method: 'POST',
    })
    const data = await res.json()
    currentConversationId.value = data.conversation_id
    messages.value = []
    fetchConversations()
  } catch (e) {
    console.error('Failed to start new conversation:', e)
  }
}

async function selectConversation(id: string) {
  // Mocking selection for now
  console.log('Selected conversation:', id)
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

async function sendMessage() {
  if (!input.value.trim() || isThinking.value) return

  const userMsg: Message = {
    id: Date.now(),
    role: 'user',
    content: input.value,
    time: new Date().toLocaleTimeString(),
    model: 'You',
  }

  messages.value.push(userMsg)
  const userText = input.value
  input.value = ''
  isThinking.value = true

  // Placeholder for AI response
  const placeholderIndex =
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      time: new Date().toLocaleTimeString(),
      model: modelName.value || 'BabbageBox AI',
      loading: true,
    }) - 1

  try {
    const res = await fetch('http://localhost:8000/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: userText,
        conversation_id: currentConversationId.value,
        persona_mode: currentProfile.value, // Pass selected profile
        context: messages.value.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        include_search: false,
        include_tts: ttsEnabled.value,
        tts_voice: ttsVoice.value,
        tts_speed: ttsSpeed.value,
      }),
    })
    const data = await res.json()

    // Update the placeholder message with the actual response
    messages.value[placeholderIndex] = {
      ...messages.value[placeholderIndex],
      loading: false,
      model: modelName.value || 'BabbageBox AI',
      content: data.reply || 'No response from LLM.',
      time: new Date().toLocaleTimeString(),
      metrics: data.metrics,
      sources: data.sources,
    }

    if (data.audio_base64 && ttsEnabled.value) {
      playAudio(data.audio_base64)
    }
  } catch (e) {
    console.error('Error processing message:', e)
    messages.value[placeholderIndex].loading = false
    messages.value[placeholderIndex].content = 'Error connecting to backend.'
  } finally {
    isThinking.value = false
    fetchConversations()
  }
}

const chatWindow = ref<HTMLElement | null>(null)

onMounted(() => {
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true
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
    console.log('[DEBUG] Playing audio, base64 length:', base64.length)
    const audio = new Audio('data:audio/wav;base64,' + base64)
    audio.playbackRate = ttsSpeed.value
    audioPlayer.value = audio

    audio.oncanplaythrough = () => {
      console.log(
        '[DEBUG] Audio can play through, playbackRate:',
        audio.playbackRate
      )
      audio.play().catch((e) => {
        console.error(
          'Audio playback failed (check if muted or browser blocked):',
          e
        )
        // Fallback for browser blocking - show a 'play' button?
      })
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

<template>
  <div class="chat-container">
    <AppSidebar
      v-if="sidebarVisible"
      :conversations="conversations"
      :collapsed="sidebarCollapsed"
      :current-profile="currentProfile"
      @new-chat="newChat"
      @select-conversation="selectConversation"
      @toggle-sidebar="toggleSidebar"
      @update:profile="(p) => (currentProfile = p)"
    />

    <main class="chat-main-content">
      <div class="chat-centered-wrapper">
        <ChatArea
          :messages="messages"
          v-model:input="input"
          v-model:tts-enabled="ttsEnabled"
          :audio-player="audioPlayer"
          :show-silence="showSilence"
          :is-recording="isRecording"
          :show-model-modal="showModelModal"
          :is-thinking="isThinking"
          @toggle-sidebar="toggleSidebar"
          @silence-tts="silenceTTS"
          @send-message="sendMessage"
          @show-model-modal="() => (showModelModal = true)"
          @show-tts-settings="() => (showTTSSettings = true)"
          @toggle-recording="toggleRecording"
          @clear-input="() => (input = '')"
        />
      </div>

      <ModelSelector
        v-if="showModelModal"
        :current-model="modelId"
        @close="() => (showModelModal = false)"
        @model-changed="fetchModel"
      />

      <TTSSettingsModal
        :show="showTTSSettings"
        v-model:voice="ttsVoice"
        v-model:speed="ttsSpeed"
        @close="showTTSSettings = false"
      />
    </main>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  width: 100%;
  position: relative;
  min-height: 0;
  flex: 1;
}

.chat-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-width: 0;
}

.chat-centered-wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
