<template>
  <div class="ocean-background" :class="depthClass">
    <canvas ref="bubbleCanvas" class="bubble-canvas"></canvas>
    <div class="waves">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OceanBackground',
  data() {
    return {
      bubbles: [],
      animationFrame: null,
      ctx: null,
      width: 0,
      height: 0
    }
  },
  computed: {
    ...mapState('game', ['currentEvolution', 'planktonPoints']),
    depthClass() {
      return `depth-${this.currentEvolution}`
    }
  },
  mounted() {
    this.initCanvas()
    this.createBubbles(15)
    this.animate()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.bubbleCanvas
      this.ctx = canvas.getContext('2d')
      this.handleResize()
    },
    handleResize() {
      const canvas = this.$refs.bubbleCanvas
      this.width = canvas.width = window.innerWidth
      this.height = canvas.height = window.innerHeight
    },
    createBubbles(count) {
      this.bubbles = Array.from({ length: count }, () => ({
        x: Math.random() * this.width,
        y: this.height + Math.random() * 20,
        size: 2 + Math.random() * 4,
        speed: 1 + Math.random() * 2,
        wobble: Math.random() * Math.PI * 2
      }))
    },
    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height)
      
      this.bubbles.forEach(bubble => {
        // Update bubble position
        bubble.y -= bubble.speed
        bubble.wobble += 0.03
        bubble.x += Math.sin(bubble.wobble) * 0.5

        // Draw bubble
        this.ctx.beginPath()
        this.ctx.arc(
          bubble.x,
          bubble.y,
          bubble.size,
          0,
          Math.PI * 2
        )
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        this.ctx.fill()

        // Reset bubble if it goes off screen
        if (bubble.y < -10) {
          bubble.y = this.height + 10
          bubble.x = Math.random() * this.width
        }
      })

      this.animationFrame = requestAnimationFrame(() => this.animate())
    }
  }
}
</script>

<style scoped>
.ocean-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: background-color 1s ease;
}

.bubble-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.waves {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform-origin: 0 100%;
}

.wave1 {
  animation: wave 8s linear infinite;
  opacity: 0.3;
}

.wave2 {
  animation: wave 10s linear infinite;
  opacity: 0.2;
}

.wave3 {
  animation: wave 12s linear infinite;
  opacity: 0.1;
}

@keyframes wave {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.8);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
}

/* Depth-based backgrounds */
.depth-1 {
  background: linear-gradient(180deg, #2196f3 0%, #1976d2 100%);
}

.depth-2 {
  background: linear-gradient(180deg, #1976d2 0%, #0d47a1 100%);
}

.depth-3 {
  background: linear-gradient(180deg, #0d47a1 0%, #1a237e 100%);
}

.depth-4 {
  background: linear-gradient(180deg, #1a237e 0%, #0d004c 100%);
}

.depth-5 {
  background: linear-gradient(180deg, #0d004c 0%, #000033 100%);
}
</style> 