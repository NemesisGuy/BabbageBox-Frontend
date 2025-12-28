<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card glass">
      <div class="modal-header">
        <h3><i class="fa-solid fa-sliders"></i> TTS Settings</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="setting-group">
          <label>Voice Style</label>
          <select
            :value="voice"
            @change="
              $emit('update:voice', ($event.target as HTMLSelectElement).value)
            "
            class="sexy-select"
          >
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

        <div class="setting-group">
          <label>Playback Speed ({{ speed }}x)</label>
          <input
            type="range"
            :value="speed"
            @input="
              $emit(
                'update:speed',
                parseFloat(($event.target as HTMLInputElement).value)
              )
            "
            min="0.5"
            max="2.0"
            step="0.1"
            class="sexy-range"
          />
        </div>

        <div class="info-note">
          <p>
            <i class="fa-solid fa-circle-info"></i> Adjusting these settings
            will affect subsequent chat responses and TTS playground generation.
          </p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" @click="$emit('close')">
          Apply Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  voice: string
  speed: number
}>()

defineEmits(['close', 'update:voice', 'update:speed'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  width: 90%;
  max-width: 450px;
  background: var(--nav-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.setting-group label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.sexy-select {
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 12px;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.sexy-range {
  height: 6px;
  background: var(--border-subtle);
  border-radius: 3px;
  appearance: none;
}

.sexy-range::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--accent-color);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px var(--accent-shadow);
}

.info-note {
  background: rgba(79, 209, 197, 0.05);
  border: 1px solid rgba(79, 209, 197, 0.1);
  padding: 10px;
  border-radius: 10px;
}

.info-note p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.modal-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}
</style>
