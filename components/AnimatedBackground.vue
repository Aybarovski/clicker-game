<template>
  <canvas ref="canvas" class="background-canvas"></canvas>
</template>

<script>
class Star {
  constructor(x, y, speed, size) {
    this.x = x
    this.y = y
    this.speed = speed
    this.size = size
    this.angle = Math.random() * Math.PI * 2
    this.distance = Math.random() * 200 + 100
  }

  update(width, height, time) {
    this.angle += this.speed * 0.01
    const centerX = width / 2
    const centerY = height / 2
    this.x = centerX + Math.cos(this.angle) * (this.distance + Math.sin(time * 0.001) * 50)
    this.y = centerY + Math.sin(this.angle) * (this.distance + Math.sin(time * 0.001) * 50)
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(this.angle) * 0.5})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

export default {
  data() {
    return {
      stars: [],
      ctx: null,
      width: 0,
      height: 0,
      animationFrame: null,
      startTime: Date.now()
    }
  },
  mounted() {
    this.initCanvas()
    this.createStars()
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
      const canvas = this.$refs.canvas
      this.ctx = canvas.getContext('2d')
      this.handleResize()
    },
    handleResize() {
      const canvas = this.$refs.canvas
      this.width = window.innerWidth
      this.height = window.innerHeight
      canvas.width = this.width
      canvas.height = this.height
      this.createStars()
    },
    createStars() {
      this.stars = []
      const starCount = Math.min(150, (this.width * this.height) / 10000)
      
      for (let i = 0; i < starCount; i++) {
        this.stars.push(
          new Star(
            Math.random() * this.width,
            Math.random() * this.height,
            Math.random() * 0.5 + 0.1,
            Math.random() * 2 + 1
          )
        )
      }
    },
    animate() {
      const time = Date.now() - this.startTime
      
      // Create gradient background
      const gradient = this.ctx.createRadialGradient(
        this.width / 2, this.height / 2, 0,
        this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2
      )
      gradient.addColorStop(0, '#1a237e')
      gradient.addColorStop(1, '#000051')
      
      this.ctx.fillStyle = gradient
      this.ctx.fillRect(0, 0, this.width, this.height)

      // Update and draw stars
      this.stars.forEach(star => {
        star.update(this.width, this.height, time)
        star.draw(this.ctx)
      })

      this.animationFrame = requestAnimationFrame(this.animate)
    }
  }
}
</script>

<style scoped>
.background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style> 