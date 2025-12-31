<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="model-modal-card nemesis-glass">
      <div class="modal-header">
        <h3><i class="fa-solid fa-robot"></i> Model Settings</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="model-select">Active Model</label>
          <div class="select-wrapper">
            <select
              id="model-select"
              v-model="selectedModel"
              :disabled="loading || !models.length"
              class="nemesis-select"
            >
              <option v-if="loading" disabled>Loading...</option>
              <option v-for="model in models" :key="model" :value="model">
                {{ model }}
              </option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button
            @click="setModel"
            class="btn-primary"
            :disabled="loading || setting || !selectedModel"
          >
            <i class="fa-solid fa-check"></i> <span>Apply Changes</span>
          </button>
          <button
            @click="fetchModels"
            class="btn-ghost"
            :disabled="loading"
            title="Refresh list"
          >
            <i
              class="fa-solid fa-arrows-rotate"
              :class="{ 'fa-spin': loading }"
            ></i>
            <span>Refresh</span>
          </button>
        </div>

        <div
          v-if="status"
          class="status-msg"
          :class="{ error: status.includes('Error') }"
        >
          {{ status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
defineProps<{
  currentModel: string
}>()
const emit = defineEmits(['model-set', 'close', 'model-changed'])
import { API_BASE } from '../config/api'

const BASE = API_BASE
const models = ref<string[]>([])
const selectedModel = ref('')
const status = ref('')
const loading = ref(false)
const setting = ref(false)

async function fetchModels() {
  loading.value = true
  status.value = ''
  try {
    const res = await fetch(`${BASE}/api/models`)
    const data = await res.json()
    models.value = data.models || []
    if (models.value.length) {
      // Fetch current model
      const configRes = await fetch(`${BASE}/api/config`)
      const configData = await configRes.json()
      const currentModel = configData.llama_model_path
      const currentFilename = currentModel
        ? currentModel.split(/[/\\]/).pop()
        : ''
      if (currentFilename && models.value.includes(currentFilename)) {
        selectedModel.value = currentFilename
      } else {
        selectedModel.value = models.value[0] || ''
      }
    }
    status.value = models.value.length ? '' : 'No models found.'
  } catch {
    models.value = []
    status.value = 'Error loading models'
  } finally {
    loading.value = false
  }
}

async function setModel() {
  if (!selectedModel.value || setting.value) return
  setting.value = true
  status.value = 'Setting model...'
  try {
    const res = await fetch(`${BASE}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ llama_model_path: selectedModel.value }),
    })
    if (!res.ok) throw new Error('Failed to set model')
    status.value = 'Model set!'
    // Fetch current model to confirm
    try {
      const configRes = await fetch(`${BASE}/api/config`)
      const configData = await configRes.json()
      const currentModel = configData.llama_model_path
      const currentFilename = currentModel
        ? currentModel.split(/[/\\]/).pop()
        : ''
      if (currentFilename && models.value.includes(currentFilename)) {
        selectedModel.value = currentFilename
      }
    } catch {
      // ignore
    }
    emit('model-set', selectedModel.value)
  } catch {
    status.value = 'Error setting model'
  } finally {
    setting.value = false
  }
}

onMounted(fetchModels)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.model-modal-card {
  width: 100%;
  max-width: 450px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-subtle);
}

.modal-header {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.nemesis-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-actions button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem;
  border-radius: 12px;
  font-weight: 600;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  cursor: pointer;
}

.status-msg {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--accent-color);
}

.status-msg.error {
  color: #ef4444;
}

.fa-spin {
  animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
</style>
