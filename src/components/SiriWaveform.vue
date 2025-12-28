<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  active: boolean
}>()

const container = ref<HTMLElement | null>(null)
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let uniforms: { [key: string]: THREE.IUniform }
let animationId: number

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform float amplitude;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float wave = 0.0;
    
    // Create multiple overlapping waves
    for(float i = 1.0; i < 6.0; i++) {
      wave += sin(p.x * 2.0 * i + time * 2.0) * (0.2 / i) * amplitude;
    }
    
    float dist = abs(p.y - wave);
    float glow = 0.02 / dist;
    
    // Multi-color gradient
    vec3 color1 = vec3(0.31, 0.82, 0.77); // #4fd1c5
    vec3 color2 = vec3(0.19, 0.51, 0.81); // #3182ce
    vec3 finalColor = mix(color1, color2, vUv.x) * glow;
    
    gl_FragColor = vec4(finalColor, clamp(glow, 0.0, 1.0));
  }
`

function init() {
  if (!container.value) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 1

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  const geometry = new THREE.PlaneGeometry(2, 2)
  uniforms = {
    time: { value: 0 },
    amplitude: { value: 0 },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  animate()
}

let targetAmplitude = 0
function animate() {
  animationId = requestAnimationFrame(animate)
  uniforms.time.value += 0.05

  // Smoothly transition amplitude
  targetAmplitude = props.active ? 1.0 : 0.0
  uniforms.amplitude.value += (targetAmplitude - uniforms.amplitude.value) * 0.1

  renderer.render(scene, camera)
}

onMounted(() => {
  init()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})

function onResize() {
  if (!container.value) return
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}
</script>

<template>
  <div ref="container" class="waveform-container"></div>
</template>

<style scoped>
.waveform-container {
  width: 100%;
  height: 60px;
  background: transparent;
  pointer-events: none;
}
</style>
