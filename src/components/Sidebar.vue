<template>
  <div class="sidebar glass" :class="{ collapsed }">
    <button
      v-if="collapsed"
      class="sidebar-expand nemesis-btn"
      @click="$emit('toggle-sidebar')"
      title="Expand Sidebar"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
    <div class="sidebar-header">
      <h3 class="sidebar-title">Conversations</h3>
      <button
        v-if="!collapsed"
        class="sidebar-toggle nemesis-btn"
        @click="$emit('toggle-sidebar')"
        title="Toggle Sidebar"
      >
        <i
          class="fa-solid"
          :class="collapsed ? 'fa-chevron-right' : 'fa-chevron-left'"
        ></i>
      </button>
      <button
        v-if="!collapsed"
        @click="$emit('new-chat')"
        class="btn-primary new-chat-btn"
      >
        New Chat
      </button>
    </div>
    <ul class="conversation-list">
      <li
        v-for="conv in conversations"
        :key="conv.id"
        @click="$emit('select-conversation', conv.id)"
        class="conversation-item"
      >
        <i class="fa-solid fa-message"></i>
        <span class="conversation-text"
          >{{ conv.title || 'Untitled' }} -
          {{ new Date(conv.created_at).toLocaleDateString() }}</span
        >
      </li>
    </ul>
    <button
      v-if="collapsed"
      @click="$emit('new-chat')"
      class="btn-primary new-chat-btn-collapsed"
    >
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Conversation {
  id: number
  title: string | null
  created_at: string
}
const props = defineProps<{
  conversations: Conversation[]
  collapsed: boolean
}>()
defineEmits(['toggle-sidebar', 'new-chat', 'select-conversation'])
</script>

<style scoped>
.sidebar {
  width: 270px;
  min-width: 220px;
  max-width: 320px;
  flex-shrink: 0;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  z-index: 50;
  border-right: 1px solid var(--nav-border);
  background: var(--nav-bg);
  transition: transform 0.3s ease, width 0.3s ease;
}

.sidebar-title, .conversation-text {
  color: var(--text-main);
}

.conversation-item {
  color: var(--text-muted);
}
.conversation-item:hover, .conversation-item.active {
  background: var(--glass-shadow);
  color: var(--text-main);
}

.sidebar.collapsed {
  /* Desktop collapsed state */
  width: 64px;
  min-width: 64px;
  max-width: 64px;
  padding: 8px 6px;
  overflow: visible;
  border-right: 1px solid var(--nav-border);
  z-index: 50;
}

.sidebar .sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  padding: 12px;
}
.sidebar.collapsed .sidebar-title {
  display: none;
}
.sidebar.collapsed .conversation-list .conversation-text {
  display: none;
}
.sidebar.collapsed .conversation-item {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  cursor: pointer;
}
.sidebar.collapsed .conversation-item i {
  font-size: 18px;
  color: #4fd1c5;
}
.sidebar .sidebar-toggle {
  flex: 0 0 auto;
}
.sidebar .new-chat-btn {
  width: 100%;
}
.sidebar .new-chat-btn-collapsed {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  font-size: 16px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 80%;
    max-width: 300px;
    transform: translateX(0);
    box-shadow: 2px 0 10px rgba(0,0,0,0.3);
  }
  
  .sidebar.collapsed {
    transform: translateX(-100%);
    width: 0;
    min-width: 0;
    max-width: 0;
    padding: 0;
    border: none;
    overflow: hidden;
  }
}
</style>
