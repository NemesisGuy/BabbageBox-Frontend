<template>
  <div class="chat-area-container fluid-width">
    <button
      class="mobile-sidebar-toggle nemesis-btn"
      @click="$emit('toggle-sidebar')"
      aria-label="Toggle Sidebar"
    >
      <i class="fa-solid fa-bars"></i>
    </button>
    <div class="chat-viewport" ref="chatWindow">
      <div v-if="!messages.length" class="chat-intro">
        <div class="intro-card nemesis-glass">
          <img
            src="https://brand.nemesisnet.co.za/assets/optimized/Nemesis_Logo_Icon@128.png"
            alt="Logo"
            class="intro-logo"
          />
          <h2>How can I help you today?</h2>
        </div>
      </div>
      <div class="messages-container">
        <MessageBubble v-for="msg in messages" :key="msg.id" :msg="msg" />
      </div>
    </div>

    <div class="audio-overlay-zone">
      <SiriWaveform :active="showSilence" />
      <AudioControls
        :audio-player="audioPlayer"
        :show="showSilence"
        @close="$emit('silence-tts')"
      />
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
        class="btn-ghost"
        @click="$emit('show-tts-settings')"
        title="TTS Settings"
      >
        <i class="fa-solid fa-sliders"></i>
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
import MessageBubble from './MessageBubble.vue'
import SiriWaveform from './SiriWaveform.vue'
import AudioControls from './AudioControls.vue'

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
}

defineProps({
  messages: { type: Array as PropType<Message[]>, required: true },
  input: { type: String, required: true },
  ttsEnabled: { type: Boolean, required: true },
  audioPlayer: {
    type: Object as PropType<HTMLAudioElement | null>,
    default: null,
  },
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
  'show-tts-settings',
  'toggle-recording',
  'clear-input',
  'toggle-sidebar',
])
</script>

<style scoped>
.chat-area-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-height: 0;
  background: var(--bg-primary);
}

.fluid-width {
  width: 100%;
  margin: 0 auto;
}

.chat-viewport {
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

.messages-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.chat-intro {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-card {
  text-align: center;
  padding: 3rem;
  border-radius: 24px;
  max-width: 500px;
}

.intro-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 20px var(--accent-shadow));
}

.intro-card h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.chatgpt-form {
  position: relative;
  margin: 2rem auto;
  max-width: 1000px;
  width: calc(100% - 2rem);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 10;
  backdrop-filter: blur(10px);
}

.chatgpt-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 1rem;
  padding: 0.5rem;
}

.btn-primary,
.btn-ghost,
.btn-aurora {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--accent-shadow);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: var(--nav-pill-hover);
  color: var(--text-primary);
}

.btn-ghost.active {
  color: var(--accent-color);
}

.btn-aurora {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-aurora:hover {
  background: #ef4444;
  color: white;
}

.audio-overlay-zone {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 60;
}

.audio-overlay-zone > * {
  pointer-events: auto;
}

.mobile-sidebar-toggle {
  display: none;
  position: fixed;
  top: 80px; /* Below header */
  left: 1rem;
  z-index: 150;
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-sidebar-toggle:hover {
  background: var(--nav-pill-hover);
}

@media (max-width: 768px) {
  .mobile-sidebar-toggle {
    display: flex;
  }

  .chat-viewport {
    padding: 1rem;
    padding-bottom: 120px; /* More space for mobile */
  }

  .chatgpt-form {
    width: calc(100% - 2rem);
    bottom: 30px; /* More space for footer and mobile UI */
  }
}
</style>
