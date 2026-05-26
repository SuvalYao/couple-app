<template>
  <canvas
    ref="canvas"
    :width="size"
    :height="size"
    class="wheel-canvas"
    :style="{ width: size + 'px', height: size + 'px' }"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  size: { type: Number, default: 300 }
})

const canvas = ref(null)
let ctx = null
let currentAngle = 0
let spinning = false

const colors = {
  truth: '#ff4d6d',
  dare: '#4d7cff'
}

function drawWheel() {
  if (!ctx || !canvas.value) return
  const centerX = props.size / 2
  const centerY = props.size / 2
  const radius = props.size / 2 - 5

  ctx.clearRect(0, 0, props.size, props.size)
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(currentAngle)

  // 真心话半圆
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, radius, 0, Math.PI)
  ctx.fillStyle = colors.truth
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${Math.max(16, props.size * 0.07)}px "PingFang SC", sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('真心话', 0, -radius * 0.5)

  // 大冒险半圆
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, radius, Math.PI, 2 * Math.PI)
  ctx.fillStyle = colors.dare
  ctx.fill()
  ctx.fillText('大冒险', 0, radius * 0.5)

  ctx.restore()

  // 指针
  ctx.beginPath()
  ctx.moveTo(centerX - 8, 8)
  ctx.lineTo(centerX + 8, 8)
  ctx.lineTo(centerX, 24)
  ctx.closePath()
  ctx.fillStyle = '#ffd166'
  ctx.fill()
}

function rotateTo(target) {
  return new Promise((resolve) => {
    if (spinning) return resolve()
    spinning = true

    const targetAngleRaw = target === 'truth'
      ? Math.random() * Math.PI
      : Math.PI + Math.random() * Math.PI

    let targetCurrentAngle = -(targetAngleRaw + Math.PI / 2)
    targetCurrentAngle = ((targetCurrentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)

    const spins = 6 + Math.floor(Math.random() * 5)
    const totalAngle = targetCurrentAngle + spins * 2 * Math.PI
    const startAngle = currentAngle
    const duration = 3000
    const startTime = performance.now()

    function animate(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      currentAngle = startAngle + totalAngle * ease
      drawWheel()
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        currentAngle = targetCurrentAngle
        drawWheel()
        spinning = false
        resolve()
      }
    }
    requestAnimationFrame(animate)
  })
}

function reset() {
  currentAngle = 0
  drawWheel()
}

watch(() => props.size, () => {
  nextTick(() => {
    if (canvas.value) {
      ctx = canvas.value.getContext('2d')
      drawWheel()
    }
  })
})

onMounted(async () => {
  await nextTick()
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    drawWheel()
  }
})

defineExpose({ rotateTo, reset })
</script>

<style scoped>
.wheel-canvas {
  display: block;
  margin: 0 auto;
  filter: drop-shadow(0 0 30px rgba(255,77,109,0.6));
}
</style>