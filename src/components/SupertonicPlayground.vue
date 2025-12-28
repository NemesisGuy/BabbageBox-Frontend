<template>
  <div class="supertonic-playground">
    <div class="playground-header">
      <h1>Supertonic <span class="badge">TTS Playground</span></h1>
      <p class="subtitle">
        Directly interact with the Supertonic voice engine.
      </p>
    </div>

    <div class="playground-grid">
      <!-- Input Section -->
      <section class="control-panel glass">
        <div class="input-area">
          <label>Text to Speak</label>
          <textarea
            v-model="input"
            placeholder="Type something for BabbageBox to say..."
            rows="4"
          ></textarea>
        </div>

        <div class="controls-row">
          <div class="control-item">
            <label>Voice</label>
            <select v-model="voice" class="sexy-select">
              <optgroup label="Standard">
                <option value="M1">Male 1 (Default)</option>
                <option value="F1">Female 1</option>
              </optgroup>
              <optgroup label="Expressive">
                <option value="M2">Male 2 (Energetic)</option>
                <option value="F2">Female 2 (Clam)</option>
              </optgroup>
            </select>
          </div>

          <div class="control-item">
            <label>Speed ({{ speed }}x)</label>
            <input
              type="range"
              v-model="speed"
              min="0.5"
              max="2.0"
              step="0.1"
              class="sexy-range"
            />
          </div>
        </div>

        <button class="speak-btn" @click="onSubmit" :disabled="loading">
          <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
          <i v-else class="fa-solid fa-play"></i>
          Generate & Play
        </button>
      </section>

      <!-- Visualization Section -->
      <section class="visual-panel glass">
        <div class="waveform-container" :class="{ 'is-speaking': isSpeaking }">
          <SiriWaveform v-if="isSpeaking" :active="isSpeaking" />
          <div v-else class="vibe-check">
            <i class="fa-solid fa-volume-high"></i>
            <p>Ready for voice output</p>
          </div>
        </div>

        <div v-if="result" class="result-feedback">
          <p>{{ result }}</p>
        </div>

        <div v-if="error" class="error-msg">
          <i class="fa-solid fa-triangle-exclamation"></i>
          {{ error }}
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { API_BASE } from '../config/api'
import SiriWaveform from './SiriWaveform.vue'

const input = ref('')
const voice = ref('M1')
const speed = ref(1.0)
const loading = ref(false)
const error = ref('')
const result = ref('')
const isSpeaking = ref(false)

async function onSubmit() {
  if (!input.value.trim() || loading.value) return

  loading.value = true
  error.value = ''
  result.value = ''

  try {
    const resp = await fetch(`${API_BASE}/api/supertonic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: input.value,
        voice: voice.value,
        speed: speed.value,
      }),
    })

    if (!resp.ok) throw new Error('Generation failed: ' + resp.status)

    const data = await resp.json()
    result.value = data.result

    if (data.audio_base64) {
      playAudio(data.audio_base64)
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message
    } else {
      error.value = String(e)
    }
  } finally {
    loading.value = false
  }
}

function playAudio(base64: string) {
  const audio = new Audio('data:audio/wav;base64,' + base64)
  audio.playbackRate = speed.value

  audio.onplay = () => {
    isSpeaking.value = true
  }
  audio.onended = () => {
    isSpeaking.value = false
  }
  audio.onerror = () => {
    isSpeaking.value = false
    error.value = 'Playback error.'
  }

  audio.play()
}
</script>

<style scoped>
.supertonic-playground {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.playground-header h1 {
  font-size: 2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge {
  font-size: 0.75rem;
  background: var(--nav-pill-bg);
  padding: 4px 12px;
  border-radius: 99px;
  border: 1px solid var(--border-subtle);
  color: var(--accent-color);
  font-weight: 700;
  text-transform: uppercase;
}

.subtitle {
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.playground-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.control-panel,
.visual-panel {
  padding: 2rem;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-area label,
.control-item label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-area textarea {
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 1rem;
  color: var(--text-primary);
  font-family: inherit;
  resize: none;
  transition: border-color 0.2s;
}

.input-area textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

.controls-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sexy-select {
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 10px;
  color: var(--text-primary);
  cursor: pointer;
}

.sexy-range {
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border-subtle);
  border-radius: 5px;
  outline: none;
  margin: 15px 0;
}

.sexy-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: var(--accent-color);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px var(--accent-shadow);
}

.speak-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s;
  margin-top: 1rem;
}

.speak-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 10px 20px var(--accent-shadow);
}

.waveform-container {
  height: 160px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: all 0.5s ease;
}

.waveform-container.is-speaking {
  background: rgba(79, 209, 197, 0.05);
  box-shadow: inset 0 0 20px var(--accent-shadow);
}

.vibe-check {
  text-align: center;
  color: var(--text-secondary);
  opacity: 0.3;
}

.vibe-check i {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.result-feedback {
  background: rgba(255, 255, 255, 0.02);
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  border-left: 3px solid var(--accent-color);
}

.error-msg {
  color: #f56565;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 800px) {
  .playground-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .supertonic-playground {
    padding: 1.5rem 1rem;
  }
}
</style>
