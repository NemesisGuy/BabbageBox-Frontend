<template>
  <div class="chat-main-content">
    <button
      class="mobile-sidebar-toggle nemesis-btn"
      @click="$emit('toggle-sidebar')"
      aria-label="Toggle Sidebar"
    >
      <i class="fa-solid fa-bars"></i>
    </button>
    <div class="chatgpt-window" ref="chatWindow">
      <div v-if="!messages.length" class="chatgpt-fallback">
        No messages yet. Start the conversation!
      </div>
      <transition-group name="bubble-fade" tag="div">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['chatgpt-bubble', msg.role, { thinking: msg.loading }]"
        >
          <img
            v-if="msg.role === 'assistant'"
            class="avatar-img"
            src="/chatgpt-avatar.svg"
            alt="AI"
          />
          <div class="chatgpt-content">
            <GhostTyper v-if="msg.loading" />
            <div v-else>
              <div v-html="msg.content"></div>
              <div class="chatgpt-meta">
                {{ msg.role === 'user' ? 'You' : msg.model }} • {{ msg.time }}
              </div>
            </div>
          </div>
          <img
            v-if="msg.role === 'user'"
            class="avatar-img"
            src="/user-avatar.svg"
            alt="You"
          />
        </div>
      </transition-group>
    </div>
    <div class="chatgpt-tts-controls">
      <canvas
        ref="waveform"
        width="180"
        height="36"
        style="background: transparent; display: none"
      ></canvas>
      <button
        v-if="showSilence"
        @click="$emit('silence-tts')"
        class="btn-aurora"
        title="Silence TTS"
      >
        <i class="fa-solid fa-volume-xmark"></i> Silence
      </button>
    </div>
    <form
      class="chatgpt-form sexy-form"
      @submit.prevent="$emit('send-message')"
    >
      <input
        :value="input"
        @input="
          $emit('update:input', ($event.target as HTMLInputElement)?.value)
        "
        class="chatgpt-input sexy-input"
        placeholder="Type your message..."
        autocomplete="off"
        @keydown.enter.exact.prevent="$emit('send-message')"
      />
      <button
        type="submit"
        class="btn-primary"
        title="Send"
        :disabled="showModelModal || !input.trim()"
      >
        <i class="fa-solid fa-paper-plane"></i>
      </button>
      <button
        type="button"
        class="btn-ghost"
        @click="$emit('show-model-modal')"
        title="Select Model"
      >
        <i class="fa-solid fa-robot"></i>
      </button>
      <button
        type="button"
        class="btn-ghost"
        @click="$emit('update:ttsEnabled', !ttsEnabled)"
        :class="{ active: ttsEnabled }"
        :title="ttsEnabled ? 'Disable TTS' : 'Enable TTS'"
      >
        <i class="fa-solid fa-volume-high" v-if="ttsEnabled"></i>
        <i class="fa-solid fa-volume-xmark" v-else></i>
      </button>
      <button
        type="button"
        class="btn-primary"
        title="Record Audio"
        @click="$emit('toggle-recording')"
        :class="{ recording: isRecording }"
      >
        <i class="fa-solid fa-microphone"></i>
      </button>

      <button type="button" class="btn-ghost" title="Attachment">
        <i class="fa-solid fa-paperclip"></i>
      </button>
      <button
        type="button"
        class="btn-aurora"
        title="Clear"
        @click="$emit('clear-input')"
      >
        <i class="fa-solid fa-trash"></i>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import GhostTyper from './GhostTyper.vue'

interface Message {
  id: number
  role: string
  content: string
  time: string
  model: string
  loading?: boolean
}

const props = defineProps({
  messages: { type: Array as PropType<Message[]>, required: true },
  input: { type: String, required: true },
  ttsEnabled: { type: Boolean, required: true },
  showSilence: { type: Boolean, default: false },
  isRecording: { type: Boolean, default: false },
  showModelModal: { type: Boolean, default: false },
  isThinking: { type: Boolean, default: false },
})

defineEmits([
  'send-message',
  'update:input',
  'update:ttsEnabled',
  'silence-tts',
  'show-model-modal',
  'toggle-recording',
  'clear-input',
  'toggle-sidebar',
])
</script>

<style scoped>
.mobile-sidebar-toggle {
  display: none;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 40;
  padding: 8px 12px;
  font-size: 1.2rem;
  background: var(--nav-bg);
  border: 1px solid var(--nav-border);
  color: #4fd1c5;
  box-shadow: 0 2px 8px var(--glass-shadow);
}

@media (max-width: 768px) {
  .mobile-sidebar-toggle {
    display: inline-flex;
  }
}
</style>
