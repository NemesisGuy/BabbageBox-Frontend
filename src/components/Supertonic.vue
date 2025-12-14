<template>
  <div class="supertonic">
    <h3>Supertonic</h3>
    <form @submit.prevent="onSubmit">
      <div class="input-group mb-3">
        <input
          v-model="input"
          type="text"
          class="form-control"
          placeholder="Enter Supertonic command..."
        />
        <button class="btn btn-success" type="submit">Send</button>
      </div>
    </form>
    <div style="margin-bottom: 1em">
      <label style="display: flex; align-items: center; gap: 0.5em">
        <input type="checkbox" v-model="ttsEnabled" />
        <span>TTS</span>
      </label>
    </div>
    <div v-if="loading" class="text-muted">Processing...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="result" class="alert alert-info mt-3">
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const input = ref('')
const result = ref('')
const audioBase64 = ref('')
const loading = ref(false)
const error = ref('')
const ttsEnabled = ref(false)

async function onSubmit() {
  loading.value = true
  error.value = ''
  result.value = ''
  audioBase64.value = ''
  try {
    const resp = await fetch('http://localhost:8000/api/supertonic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: input.value }),
    })
    if (!resp.ok) throw new Error('Supertonic failed: ' + resp.status)
    const data = await resp.json()
    result.value = data.result || JSON.stringify(data)
    audioBase64.value = data.audio_base64 || ''
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function playAudio(base64) {
  const audio = new Audio('data:audio/wav;base64,' + base64)
  audio.play()
}

watch(result, (val) => {
  if (ttsEnabled.value && audioBase64.value) {
    playAudio(audioBase64.value)
  }
})
</script>

<style scoped>
.supertonic {
  margin-top: 2rem;
}
</style>
