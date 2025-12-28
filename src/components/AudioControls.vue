<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  audioPlayer: HTMLAudioElement | null
  show: boolean
}>()

const emit = defineEmits(['close'])

const currentTime = ref(0)
const duration = ref(0)
const isPlaying = ref(false)
const playbackRate = ref(1.0)

watch(
  () => props.audioPlayer,
  (player) => {
    if (player) {
      duration.value = isNaN(player.duration) ? 0 : player.duration
      isPlaying.value = !player.paused
      playbackRate.value = player.playbackRate

      player.onloadedmetadata = () => {
        duration.value = player.duration
      }
      player.ondurationchange = () => {
        duration.value = player.duration
      }
      player.onplay = () => {
        isPlaying.value = true
      }
      player.onpause = () => {
        isPlaying.value = false
      }
      player.ontimeupdate = () => {
        currentTime.value = player.currentTime
      }
      player.onended = () => {
        isPlaying.value = false
        emit('close')
      }
    }
  },
  { immediate: true }
)

function togglePlay() {
  if (!props.audioPlayer) return
  if (isPlaying.value) {
    props.audioPlayer.pause()
  } else {
    props.audioPlayer.play()
  }
  isPlaying.value = !isPlaying.value
}

function seek(e: Event) {
  const target = e.target as HTMLInputElement
  if (props.audioPlayer) {
    // eslint-disable-next-line vue/no-mutating-props
    props.audioPlayer.currentTime = parseFloat(target.value)
  }
}

function setSpeed(speed: number) {
  playbackRate.value = speed
  if (props.audioPlayer) {
    // eslint-disable-next-line vue/no-mutating-props
    props.audioPlayer.playbackRate = speed
  }
}

function formatTime(seconds: number | string) {
  const s = parseFloat(String(seconds))
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const mins = Math.floor(s / 60)
  const secs = Math.floor(s % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div v-if="show" class="audio-controls nemesis-glass">
    <div class="controls-left">
      <button class="action-btn" @click="togglePlay">
        <i :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
      </button>
      <div class="time-display">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
    </div>

    <div class="controls-center">
      <input
        type="range"
        min="0"
        :max="duration"
        step="0.1"
        :value="currentTime"
        @input="seek"
        class="seek-bar"
      />
    </div>

    <div class="controls-right">
      <div class="speed-selector">
        <button
          v-for="s in [1.0, 1.2, 1.5]"
          :key="s"
          :class="['speed-btn', { active: playbackRate === s }]"
          @click="setSpeed(s)"
        >
          {{ s }}x
        </button>
      </div>
      <button class="action-btn close" @click="$emit('close')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.audio-controls {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 2rem);
  max-width: 800px;
  padding: 0.75rem 1.5rem;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  z-index: 50;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.controls-center {
  flex: 1;
}

.time-display {
  font-size: 0.8rem;
  font-family: monospace;
  color: var(--text-secondary);
  min-width: 80px;
}

.seek-bar {
  width: 100%;
  accent-color: var(--accent-color);
  background: var(--nav-pill-bg);
  height: 4px;
  border-radius: 2px;
  cursor: pointer;
}

.action-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1.1rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.action-btn:hover {
  background: var(--nav-pill-hover);
}

.action-btn.close {
  color: var(--text-secondary);
}

.speed-selector {
  display: flex;
  gap: 4px;
  background: var(--nav-pill-bg);
  padding: 2px;
  border-radius: 99px;
}

.speed-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 99px;
  cursor: pointer;
}

.speed-btn.active {
  background: var(--accent-color);
  color: white;
}
</style>
