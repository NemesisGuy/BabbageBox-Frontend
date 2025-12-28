<script setup lang="ts">
import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

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

const props = defineProps<{
  msg: Message
}>()

const showSources = ref(false)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch {
        // Fallback
      }
    }
    return '' // use external default escaping
  },
})

const renderedContent = computed(() => {
  if (props.msg.loading) return ''
  return md.render(props.msg.content)
})
</script>

<template>
  <div :class="['message-bubble', msg.role, { loading: msg.loading }]">
    <div class="bubble-avatar" v-if="msg.role === 'assistant'">
      <img
        src="https://brand.nemesisnet.co.za/assets/optimized/Nemesis_Logo_Icon@128.png"
        alt="AI"
      />
    </div>

    <div class="bubble-content-wrapper">
      <div class="bubble-header" v-if="msg.role === 'assistant'">
        <span class="model-name">{{ msg.model }}</span>
        <span class="bubble-time">{{ msg.time }}</span>
      </div>

      <div class="bubble-body">
        <div
          v-if="!msg.loading"
          class="markdown-body"
          v-html="renderedContent"
        ></div>
        <div v-else class="thinking-loader">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>

      <div
        class="bubble-footer"
        v-if="
          (msg.metrics || (msg.sources && msg.sources.length)) && !msg.loading
        "
      >
        <div class="footer-badges">
          <div v-if="msg.metrics" class="metrics-badge">
            <i class="fa-solid fa-bolt"></i>
            <span>{{ msg.metrics.tokens_per_second }} t/s</span>
            <span class="separator">|</span>
            <span>{{ msg.metrics.generation_time }}s</span>
            <span v-if="msg.metrics.is_fallback" class="fallback-tag">
              (Fallback)</span
            >
          </div>

          <button
            v-if="msg.sources && msg.sources.length"
            class="sources-toggle"
            @click="showSources = !showSources"
          >
            <i class="fa-solid fa-book"></i>
            Sources
            <i
              :class="[
                'fa-solid',
                showSources ? 'fa-chevron-up' : 'fa-chevron-down',
              ]"
            ></i>
          </button>
        </div>

        <transition name="fade-slide">
          <div
            v-if="showSources && msg.sources"
            class="sources-list nemesis-glass"
          >
            <div
              v-for="(source, idx) in msg.sources"
              :key="idx"
              class="source-item"
            >
              <i class="fa-solid fa-file-lines"></i>
              <span>{{ source }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="bubble-avatar user" v-if="msg.role === 'user'">
      <i class="fa-solid fa-user"></i>
    </div>
  </div>
</template>

<style scoped>
.message-bubble {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 850px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bubble-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--nav-pill-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}

.bubble-avatar img {
  width: 24px;
  height: 24px;
}

.bubble-avatar.user {
  background: var(--accent-color);
  color: white;
}

.bubble-content-wrapper {
  flex: 1;
  min-width: 0;
}

.bubble-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.model-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.bubble-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.bubble-body {
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 1rem;
}

.markdown-body :deep(pre) {
  background: #1e1e1e;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid #333;
}

.markdown-body :deep(code) {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

.bubble-footer {
  margin-top: 0.75rem;
  display: flex;
  justify-content: flex-start;
}

.metrics-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 2px 10px;
  background: var(--nav-pill-bg);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.metrics-badge i {
  color: var(--accent-color);
}

.metrics-badge .separator {
  opacity: 0.3;
}

.fallback-tag {
  color: #ed8936;
  font-weight: 600;
}

.footer-badges {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sources-toggle {
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.sources-toggle:hover {
  background: var(--nav-pill-hover);
  color: var(--text-primary);
}

.sources-list {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 100%;
}

.source-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.source-item i {
  color: var(--accent-color);
  font-size: 0.8rem;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Thinking Loader */
.thinking-loader {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Role Specifics */
.message-bubble.user .bubble-body {
  background: var(--nav-pill-bg);
  padding: 0.75rem 1.25rem;
  border-radius: 18px;
  display: inline-block;
  float: right;
  max-width: 80%;
  border: 1px solid var(--border-subtle);
}

.message-bubble.assistant {
  margin-right: auto;
}
</style>
