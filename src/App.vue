<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import MainChat from './components/MainChat.vue'
import MemoryManager from './components/MemoryManager.vue'
import McpSearch from './components/McpSearch.vue'
import Supertonic from './components/Supertonic.vue'
import LogsViewer from './components/LogsViewer.vue'
import Footer from './components/Footer.vue'

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
  <div class="babbagebox-app">
    <nav class="main-nav nemesis-glass">
      <div class="nav-brand">
        <img
          src="https://brand.nemesisnet.co.za/assets/optimized/Nemesis_Logo_Icon@128.png"
          alt="NemesisNet logo"
          width="32"
          height="32"
        />
        <span class="brand-title">BabbageBox</span>
      </div>
      <button
        class="burger-menu lg:hidden"
        @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation menu"
      >
        <i class="fa-solid fa-bars"></i>
      </button>
      <ul
        class="nav-menu hidden md:flex md:flex-row"
        :class="{ 'flex flex-col': menuOpen }"
      >
        <li :class="{ active: view === 'chat' }" @click="setView('chat')">
          <button class="nemesis-btn nemesis-btn-primary">
            <i class="fa-solid fa-comments"></i> Chat
          </button>
        </li>
        <li :class="{ active: view === 'memory' }" @click="setView('memory')">
          <button class="nemesis-btn nemesis-btn-model">
            <i class="fa-solid fa-brain"></i> Memory
          </button>
        </li>
        <li :class="{ active: view === 'search' }" @click="setView('search')">
          <button class="nemesis-btn nemesis-btn-primary">
            <i class="fa-solid fa-magnifying-glass"></i> MCP/Search
          </button>
        </li>
        <li
          :class="{ active: view === 'supertonic' }"
          @click="setView('supertonic')"
        >
          <button class="nemesis-btn nemesis-btn-model">
            <i class="fa-solid fa-microphone"></i> Supertonic
          </button>
        </li>
        <li :class="{ active: view === 'logs' }" @click="setView('logs')">
          <button class="nemesis-btn nemesis-btn-primary">
            <i class="fa-solid fa-file-lines"></i> Logs
          </button>
        </li>
        <li>
          <button
            class="nemesis-btn theme-toggle-btn"
            @click="toggleTheme"
            :title="
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            "
          >
            <i v-if="theme === 'dark'" class="fa-solid fa-sun"></i>
            <i v-else class="fa-solid fa-moon"></i>
          </button>
        </li>
      </ul>
    </nav>
    <main class="main-content">
      <div v-if="view === 'chat'">
        <MainChat />
      </div>
      <div v-else-if="view === 'memory'">
        <MemoryManager />
      </div>
      <div v-else-if="view === 'search'">
        <McpSearch />
      </div>
      <div v-else-if="view === 'supertonic'">
        <Supertonic />
      </div>
      <div v-else-if="view === 'logs'">
        <LogsViewer />
      </div>
    </main>
    <Footer class="nemesis-glass" />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
.babbagebox-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #23263a 0%, #4fd1c5 100%);
}
.main-nav {
  width: 100%;
  background: rgba(24, 28, 47, 0.85);
  box-shadow:
    0 8px 32px rgba(30, 136, 229, 0.18),
    0 0 0 1.5px #4fd1c533;
  backdrop-filter: blur(12px) saturate(1.2);
  border-bottom: 1.5px solid #4fd1c533;
  padding: 0.5em 0 0.5em 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.7em;
  font-size: 1.3em;
  font-weight: 700;
  color: #4fd1c5;
  margin-left: 1.2em;
}
.brand-title {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 0.04em;
}
.theme-toggle-btn {
  background: transparent;
  border: none;
  color: #4fd1c5;
  font-size: 1.3em;
  padding: 0.3em 0.7em;
  border-radius: 50%;
  transition:
    background 0.18s,
    color 0.18s;
}
.theme-toggle-btn:hover {
  background: #4fd1c5;
  color: #23263a;
}
.burger-menu {
  background: transparent;
  border: none;
  color: #4fd1c5;
  font-size: 1.3em;
  padding: 0.3em 0.7em;
  border-radius: 8px;
  transition:
    background 0.18s,
    color 0.18s;
}
.burger-menu:hover {
  background: #4fd1c5;
  color: #23263a;
}
@media (min-width: 1024px) {
  .burger-menu {
    display: none;
  }
}
.nav-menu {
  display: flex;
  gap: 0.8em;
  list-style: none;
  margin: 0 1.2em 0 0;
  padding: 0;
}
.nav-menu.flex {
  display: flex;
  flex-direction: column;
  background: rgba(24, 28, 47, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 1em;
  gap: 0.5em;
}

/* Smaller nav buttons */
.main-nav .nemesis-btn {
  padding: 8px 16px;
  font-size: 0.9rem;
}
.nav-menu.flex .nemesis-btn {
  width: 100%;
  justify-content: flex-start;
}
.nav-menu li {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1.08em;
  font-weight: 500;
  color: #eaf6fb;
  padding: 0.3em 0.8em;
  border-radius: 16px;
  cursor: pointer;
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s;
}
.nav-menu li.active,
.nav-menu li:hover {
  background: linear-gradient(135deg, #4fd1c5 60%, #3182ce 100%);
  color: #23263a;
  box-shadow: 0 2px 8px #4fd1c533;
}
.main-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
</style>
