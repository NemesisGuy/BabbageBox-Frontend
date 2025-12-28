<template>
  <div class="memory-manager">
    <div class="manager-header">
      <h3>Memory Management</h3>
      <div class="search-box">
        <i class="fa-solid fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search memories..."
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
          <button class="btn-icon" @click="startEdit(mem)" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            class="btn-icon delete"
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
          <textarea v-model="editContent" class="edit-area" rows="6"></textarea>
          <div class="modal-actions">
            <button class="btn-premium" @click="cancelEdit">Cancel</button>
            <button class="btn-premium btn-premium-primary" @click="saveEdit">
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
  padding: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  width: 100%;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.manager-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  width: 100%;
  max-width: 320px;
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 99px;
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-shadow);
}

.search-box i {
  color: var(--text-secondary);
}

.search-box input {
  border: none;
  background: transparent;
  padding: 4px;
  width: 100%;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.search-box input:focus {
  outline: none;
}

.memory-list {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-secondary);
  opacity: 0.6;
}

.memory-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  transition: all 0.2s;
}

.memory-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

.mem-content {
  flex: 1;
  margin-right: 1.5rem;
}

.mem-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
}

.mem-id {
  color: var(--accent-color);
  font-weight: 700;
  opacity: 0.8;
}

.mem-time {
  color: var(--text-secondary);
}

.mem-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.mem-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: transparent;
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

.btn-icon:hover {
  background: var(--nav-pill-hover);
  color: var(--text-primary);
}

.btn-icon.delete:hover {
  background: rgba(245, 101, 101, 0.1);
  color: #f56565;
  border-color: #f56565;
}

/* Modal Overlay matches existing app style */
.model-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-modal {
  width: 90%;
  max-width: 600px;
  padding: 2rem;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.edit-modal h3 {
  margin: 0;
  font-size: 1.25rem;
}

.edit-area {
  width: 100%;
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 1rem;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
}

.edit-area:focus {
  outline: none;
  border-color: var(--accent-color);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-premium {
  padding: 8px 20px;
  border-radius: 99px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-subtle);
  background: var(--nav-pill-bg);
  color: var(--text-primary);
}

.btn-premium-primary {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
  box-shadow: 0 4px 15px var(--accent-shadow);
}

.btn-premium:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

/* Responsive fixes */
@media (max-width: 768px) {
  .memory-manager {
    padding: 1rem;
  }
  .manager-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .search-box {
    max-width: 100%;
  }
  .memory-item {
    flex-direction: column;
    gap: 1rem;
  }
  .mem-actions {
    align-self: flex-end;
  }
}
</style>
