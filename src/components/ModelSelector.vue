<template>
  <div class="model-selector">
    <label for="model-select">LLM Model</label>
    <select
      id="model-select"
      v-model="selectedModel"
      :disabled="loading || !models.length"
      @change="setModel"
    >
      <option v-if="loading" disabled>Loading...</option>
      <option v-for="model in models" :key="model" :value="model">
        {{ model }}
      </option>
    </select>
    <button
      @click="setModel"
      class="nemesis-btn nemesis-btn-primary"
      :disabled="loading || setting || !selectedModel"
      title="Set Model"
    >
      <i class="fa-solid fa-check"></i> Set
    </button>
    <button
      @click="fetchModels"
      class="nemesis-btn nemesis-btn-model"
      :disabled="loading"
      title="Refresh Models"
      style="margin-left: 4px"
    >
      <i class="fa-solid fa-arrows-rotate"></i> Refresh
    </button>
    <span class="status">
      <span v-if="loading">Loading models...</span>
      <span v-else>{{ status }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const emit = defineEmits(['model-set'])

const BASE = 'http://127.0.0.1:8000'
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
      if (currentModel && models.value.includes(currentModel)) {
        selectedModel.value = currentModel
      } else {
        selectedModel.value = models.value[0] || ''
      }
    }
    status.value = models.value.length ? '' : 'No models found.'
  } catch (err) {
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
      if (currentModel && models.value.includes(currentModel)) {
        selectedModel.value = currentModel
      }
    } catch (err) {
      // ignore
    }
    emit('model-set', selectedModel.value)
  } catch (err) {
    status.value = 'Error setting model'
  } finally {
    setting.value = false
  }
}

onMounted(fetchModels)
</script>

<style scoped>
.nemesis-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 16px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s;
  box-shadow: 0 2px 8px #4fd1c533;
}
.nemesis-btn-primary {
  background: linear-gradient(135deg, #4fd1c5 60%, #3182ce 100%);
  color: #181c2f;
}
.nemesis-btn-primary:hover {
  background: linear-gradient(135deg, #63e6be 70%, #4299e1 100%);
  color: #181c2f;
}
.nemesis-btn-model {
  background: linear-gradient(135deg, #23263a 60%, #4fd1c5 100%);
  color: #4fd1c5;
}
.nemesis-btn-model:hover {
  background: linear-gradient(135deg, #4fd1c5 70%, #3182ce 100%);
  color: #181c2f;
}
.model-selector {
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.btn-ghost {
  background: transparent;
  border: 1px solid #4fd1c5;
  color: #4fd1c5;
  border-radius: 8px;
  padding: 0.4em 1em;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-ghost:hover {
  background: #4fd1c5;
  color: #23263a;
}
.status {
  font-size: 0.95em;
  color: #4fd1c5;
  margin-top: 0.2em;
}
</style>
