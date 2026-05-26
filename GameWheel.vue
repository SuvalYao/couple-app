<template>
  <div class="game-container">
    <WheelCanvas ref="wheel" :size="wheelSize" />
    <button class="spin-btn" @click="spin" :disabled="spinning">
      {{ spinning ? '转起来...' : '开始' }}
    </button>
    <transition name="fade">
      <div v-if="result" class="result-card">
        <div class="result-type">
          {{ result.type === 'truth' ? '💖 真心话' : '🔥 大冒险' }}
        </div>
        <p class="result-content">{{ result.content }}</p>
        <button class="again-btn" @click="clearResult">再来一次</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import WheelCanvas from '../components/WheelCanvas.vue'
import { truths, dares } from '../questions.js'

const wheel = ref(null)
const spinning = ref(false)
const result = ref(null)
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

const wheelSize = computed(() => {
  return Math.min(windowWidth.value * 0.85, windowHeight.value * 0.55, 400)
})

function onResize() {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function spin() {
  if (spinning.value) return
  spinning.value = true
  result.value = null

  const type = Math.random() < 0.5 ? 'truth' : 'dare'
  const content = type === 'truth' ? getRandomItem(truths) : getRandomItem(dares)

  // 短暂延迟让动画自然
  await new Promise(resolve => setTimeout(resolve, 300))
  await wheel.value.rotateTo(type)

  result.value = { type, content }
  spinning.value = false
}

function clearResult() {
  result.value = null
  wheel.value.reset()
}
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(circle at center, #2d1b3a, #0a0a1a);
  overflow: hidden;
}

.spin-btn {
  margin-top: 20px;
  font-size: clamp(18px, 5vw, 24px);
  padding: 12px 40px;
  background: linear-gradient(135deg, #ff4d6d, #ff758f);
  border: none;
  color: white;
  border-radius: 50px;
  box-shadow: 0 5px 20px rgba(255,77,109,0.5);
  cursor: pointer;
}

.result-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(22,33,62,0.95);
  backdrop-filter: blur(10px);
  padding: clamp(15px, 5vw, 30px);
  border-radius: 20px;
  text-align: center;
  width: 85vw;
  max-width: 320px;
  box-shadow: 0 0 40px rgba(255,77,109,0.3);
  z-index: 10;
}

.result-type {
  font-size: clamp(22px, 6vw, 28px);
  margin-bottom: 10px;
}

.result-content {
  font-size: clamp(16px, 4vw, 22px);
  line-height: 1.4;
  margin-bottom: 20px;
  word-break: break-word;
}

.again-btn {
  background: #4d7cff;
  box-shadow: 0 5px 15px rgba(77,124,255,0.5);
  font-size: clamp(16px, 4vw, 18px);
  padding: 10px 30px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>