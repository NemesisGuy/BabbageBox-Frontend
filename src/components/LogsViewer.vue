<template>
  <div class="logs-viewer-container">
    <div class="logs-header">
      <div class="header-info">
        <h3>System Logs</h3>
        <span class="status-indicator" :class="{ active: autoRefresh }">
          {{ autoRefresh ? 'Live' : 'Paused' }}
        </span>
      </div>
      <div class="header-actions">
        <button
          class="icon-btn"
          @click="autoRefresh = !autoRefresh"
          :title="autoRefresh ? 'Pause' : 'Resume'"
        >
          <i :class="['fa-solid', autoRefresh ? 'fa-pause' : 'fa-play']"></i>
        </button>
        <button class="icon-btn" @click="fetchLogs" title="Refresh">
          <i class="fa-solid fa-rotate"></i>
        </button>
        <button class="icon-btn" @click="clearDisplay" title="Clear Display">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>

    <div class="logs-content glass" ref="logContainer">
      <div v-if="logs.length === 0" class="empty-logs">
        <i class="fa-solid fa-terminal"></i>
        <p>Waiting for system logs...</p>
      </div>
      <div
        v-for="(log, idx) in logs"
        :key="idx"
        class="log-line"
        :class="log.level.toLowerCase()"
      >
        <span class="log-time">[{{ log.timestamp }}]</span>
        <span class="log-level">{{ log.level }}</span>
        <span class="log-msg">{{ log.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { API_BASE } from '../config/api'

interface LogEntry {
  timestamp: string
  level: string
  message: string
}

const logs = ref<LogEntry[]>([])
const autoRefresh = ref(true)
let timer: ReturnType<typeof setInterval> | null = null

async function fetchLogs() {
  try {
    const res = await fetch(`${API_BASE}/api/logs`)
    if (res.ok) {
      logs.value = await res.json()
      await nextTick()
      scrollToBottom()
    }
  } catch (e) {
    console.error('Failed to fetch logs:', e)
  }
}

function scrollToBottom() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  })
}

function clearDisplay() {
  logs.value = []
}

onMounted(() => {
  fetchLogs()
  timer = setInterval(() => {
    if (autoRefresh.value) fetchLogs()
  }, 2000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.logs-viewer-container {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logs-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.status-indicator {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 99px;
  background: var(--border-subtle);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.status-indicator.active {
  background: rgba(79, 209, 197, 0.2);
  color: var(--accent-color);
  box-shadow: 0 0 10px var(--accent-shadow);
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--nav-pill-hover);
  color: var(--text-primary);
  border-color: var(--accent-color);
}

.logs-content {
  flex: 1;
  padding: 1rem;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.85rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.2);
}

.empty-logs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  gap: 1rem;
  opacity: 0.5;
}

.empty-logs i {
  font-size: 2rem;
}

.log-line {
  display: flex;
  gap: 0.75rem;
  line-height: 1.4;
  padding: 2px 4px;
  border-radius: 4px;
}

.log-time {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.log-level {
  font-weight: 700;
  width: 50px;
  flex-shrink: 0;
}

.info .log-level {
  color: #4fd1c5;
}
.warning .log-level {
  color: #ed8936;
}
.error .log-level {
  color: #f56565;
}

.log-msg {
  color: var(--text-primary);
  word-break: break-all;
}

/* Responsive adjustment */
@media (max-width: 640px) {
  .logs-viewer-container {
    padding: 1rem;
  }
  .log-line {
    font-size: 0.75rem;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  .log-level {
    width: auto;
  }
}
</style>
