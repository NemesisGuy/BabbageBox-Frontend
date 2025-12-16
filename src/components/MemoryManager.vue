<template>
  <div class="memory-manager">
    <div class="manager-header">
      <h3>Memory Management</h3>
      <div class="search-box sexy-form">
        <i class="fa-solid fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search memories..."
          class="sexy-input"
        />
      </div>
    </div>

    <div class="memory-list glass">
      <div v-if="loading" class="empty-state">Loading memories...</div>
      <div v-else-if="filteredMemories.length === 0" class="empty-state">
        No memories found.
      </div>
      <div v-for="mem in filteredMemories" :key="mem.id" class="memory-item">
        <div class="mem-content">
          <div class="mem-header">
            <span class="mem-id">#{{ mem.id }}</span>
            <span class="mem-time" v-if="mem.created_at">
              {{ new Date(mem.created_at).toLocaleString() }}
            </span>
          </div>
          <p class="mem-text">{{ truncate(mem.content, 120) }}</p>
        </div>
        <div class="mem-actions">
          <button class="btn-ghost" @click="startEdit(mem)" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            class="btn-aurora"
            @click="deleteMemory(mem.id)"
            title="Delete"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div
        v-if="editingMem"
        class="model-modal-overlay"
        @click.self="cancelEdit"
      >
        <div class="model-modal glass edit-modal">
          <h3>Edit Memory #{{ editingMem.id }}</h3>
          <textarea
            v-model="editContent"
            class="sexy-input edit-area"
            rows="6"
          ></textarea>
          <div class="modal-actions">
            <button class="nemesis-btn" @click="cancelEdit">Cancel</button>
            <button class="nemesis-btn nemesis-btn-primary" @click="saveEdit">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Memory {
  id: number
  conversation_id: number | null
  content: string
  created_at?: string
}

const memories = ref<Memory[]>([])
const loading = ref(false)
const searchQuery = ref('')
const editingMem = ref<Memory | null>(null)
const editContent = ref('')

const filteredMemories = computed(() => {
  if (!searchQuery.value.trim()) return memories.value
  const q = searchQuery.value.toLowerCase()
  return memories.value.filter((m) => m.content.toLowerCase().includes(q))
})

async function fetchMemories() {
  loading.value = true
  try {
    const res = await fetch('http://localhost:8000/api/memory')
    if (res.ok) {
      memories.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch memories:', err)
  } finally {
    loading.value = false
  }
}

async function deleteMemory(id: number) {
  if (!confirm('Are you sure you want to delete this memory?')) return
  try {
    const res = await fetch(`http://localhost:8000/api/memory/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      memories.value = memories.value.filter((m) => m.id !== id)
    }
  } catch (err) {
    console.error('Failed to delete memory:', err)
  }
}

function startEdit(mem: Memory) {
  editingMem.value = mem
  editContent.value = mem.content
}

function cancelEdit() {
  editingMem.value = null
  editContent.value = ''
}

async function saveEdit() {
  if (!editingMem.value) return
  try {
    const res = await fetch(
      `http://localhost:8000/api/memory/${editingMem.value.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.value }),
      }
    )
    if (res.ok) {
      const updated = await res.json()
      // Update in list
      const idx = memories.value.findIndex((m) => m.id === updated.id)
      if (idx !== -1) {
        memories.value[idx] = updated
      }
      cancelEdit()
    }
  } catch (err) {
    console.error('Failed to update memory:', err)
  }
}

function truncate(text: string, len: number) {
  return text.length > len ? text.substring(0, len) + '...' : text
}

onMounted(fetchMemories)
</script>

<style scoped>
.memory-manager {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  color: var(--text-main);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  width: 300px;
}

.search-box i {
  color: var(--text-muted);
}

.search-box input {
  border: none;
  background: transparent;
  padding: 4px;
  width: 100%;
}
.search-box input:focus {
  outline: none;
  box-shadow: none;
}

.memory-list {
  flex: 1;
  overflow-y: auto;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

.memory-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s;
  border-radius: 8px;
}

.memory-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.mem-content {
  flex: 1;
  margin-right: 16px;
}

.mem-header {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.mem-id {
  color: #4fd1c5;
  font-weight: 600;
}

.mem-time {
  color: var(--text-muted);
}

.mem-text {
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--text-main);
  white-space: pre-wrap;
}

.mem-actions {
  display: flex;
  gap: 8px;
}

.edit-modal {
  width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.edit-area {
  width: 100%;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:global(:root.light) .memory-item:hover {
  background: rgba(0, 0, 0, 0.02);
}
:global(:root.light) .memory-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
