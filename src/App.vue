<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import MainChat from './components/MainChat.vue'
import MemoryManager from './components/MemoryManager.vue'
import McpSearch from './components/McpSearch.vue'
import SupertonicPlayground from './components/SupertonicPlayground.vue'
import LogsViewer from './components/LogsViewer.vue'
import AppFooter from './components/AppFooter.vue'

const view = ref('chat')
const theme = ref(localStorage.getItem('theme') || 'dark')
const menuOpen = ref(false)

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

function setView(newView: string) {
  view.value = newView
  menuOpen.value = false
}

watch(theme, (val) => {
  document.documentElement.classList.toggle('light', val === 'light')
  document.documentElement.classList.toggle('dark', val === 'dark')
})
onMounted(() => {
  document.documentElement.classList.toggle('light', theme.value === 'light')
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
})
</script>

<template>
  <div class="babbagebox-app" :class="theme">
    <nav class="premium-header nemesis-glass">
      <div class="header-left">
        <div class="nav-brand">
          <img
            src="https://brand.nemesisnet.co.za/assets/optimized/Nemesis_Logo_Icon@128.png"
            alt="NemesisNet logo"
            width="32"
            height="32"
          />
          <span class="brand-title">BabbageBox</span>
        </div>
      </div>

      <div class="header-center">
        <ul class="nav-pills hidden md:flex">
          <li :class="{ active: view === 'chat' }" @click="setView('chat')">
            <i class="fa-solid fa-comments"></i> <span>Chat</span>
          </li>
          <li :class="{ active: view === 'memory' }" @click="setView('memory')">
            <i class="fa-solid fa-brain"></i> <span>Memory</span>
          </li>
          <li :class="{ active: view === 'search' }" @click="setView('search')">
            <i class="fa-solid fa-magnifying-glass"></i> <span>MCP</span>
          </li>
          <li
            :class="{ active: view === 'supertonic' }"
            @click="setView('supertonic')"
          >
            <i class="fa-solid fa-microphone"></i> <span>TTS</span>
          </li>
          <li :class="{ active: view === 'logs' }" @click="setView('logs')">
            <i class="fa-solid fa-file-lines"></i> <span>Logs</span>
          </li>
        </ul>
      </div>

      <div class="header-right">
        <button
          class="nav-icon-btn"
          @click="toggleTheme"
          :title="theme === 'dark' ? 'Light Mode' : 'Dark Mode'"
        >
          <i v-if="theme === 'dark'" class="fa-solid fa-sun"></i>
          <i v-else class="fa-solid fa-moon"></i>
        </button>
        <button class="burger-menu md:hidden" @click="menuOpen = !menuOpen">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>

      <!-- Mobile Menu Overlay -->
      <transition name="fade">
        <div
          v-if="menuOpen"
          class="mobile-menu-overlay"
          @click="menuOpen = false"
        >
          <div class="mobile-menu glass" @click.stop>
            <li @click="setView('chat')">
              <i class="fa-solid fa-comments"></i> Chat
            </li>
            <li @click="setView('memory')">
              <i class="fa-solid fa-brain"></i> Memory
            </li>
            <li @click="setView('search')">
              <i class="fa-solid fa-magnifying-glass"></i> Search
            </li>
            <li @click="setView('supertonic')">
              <i class="fa-solid fa-microphone"></i> TTS
            </li>
            <li @click="setView('logs')">
              <i class="fa-solid fa-file-lines"></i> Logs
            </li>
          </div>
        </div>
      </transition>
    </nav>

    <main class="premium-main">
      <div class="content-container">
        <div v-if="view === 'chat'" class="view-item">
          <MainChat />
        </div>
        <div v-else-if="view === 'memory'" class="view-item">
          <MemoryManager />
        </div>
        <div v-else-if="view === 'search'" class="view-item">
          <McpSearch />
        </div>
        <div v-else-if="view === 'supertonic'" class="view-item">
          <SupertonicPlayground />
        </div>
        <div v-else-if="view === 'logs'" class="view-item">
          <LogsViewer />
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style>
.babbagebox-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Use min-height so it can grow */
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.3s ease;
}

/* Premium Header */
.premium-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  height: 64px;
  z-index: 100;
  border-bottom: 1px solid var(--border-subtle);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-center {
  display: flex;
  justify-content: center;
  flex: 2;
}

.header-right {
  justify-content: flex-end;
  gap: 1rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--accent-color);
}

/* Nav Pills */
.nav-pills {
  display: flex;
  background: var(--nav-pill-bg);
  padding: 4px;
  border-radius: 99px;
  list-style: none;
  border: 1px solid var(--border-subtle);
}

.nav-pills li {
  padding: 6px 16px;
  border-radius: 99px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.nav-pills li:hover {
  color: var(--text-primary);
  background: var(--nav-pill-hover);
}

.nav-pills li.active {
  background: var(--accent-color);
  color: white;
  box-shadow: 0 2px 10px var(--accent-shadow);
}

.nav-icon-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.nav-icon-btn:hover {
  background: var(--nav-pill-hover);
  color: var(--text-primary);
}

/* Mobile Menu */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 200;
}

.mobile-menu {
  position: absolute;
  top: 70px;
  right: 1.5rem;
  min-width: 200px;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  list-style: none;
}

.mobile-menu li {
  padding: 12px 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-radius: 8px;
}

.mobile-menu li:hover {
  background: var(--nav-pill-hover);
}

/* Main Content Area */
.premium-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-container {
  width: 100%;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  min-height: 0;
}

.view-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* CSS Variables for Themes */
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --border-subtle: #e5e5e5;
  --nav-pill-bg: #f5f5f5;
  --nav-pill-hover: #eeeeee;
  --accent-color: #4fd1c5;
  --accent-shadow: rgba(79, 209, 197, 0.3);
}

.dark {
  --bg-primary: #121421;
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --border-subtle: #2d3748;
  --nav-pill-bg: #1a202c;
  --nav-pill-hover: #2d3748;
  --accent-color: #4fd1c5;
  --accent-shadow: rgba(79, 209, 197, 0.2);
}

/* Responsive Helpers */
@media (min-width: 768px) {
  .md\:hidden {
    display: none !important;
  }
  .hidden.md\:flex {
    display: flex !important;
  }
}

@media (max-width: 767px) {
  .hidden {
    display: none !important;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
