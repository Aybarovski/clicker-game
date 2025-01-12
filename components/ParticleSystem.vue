<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>

<script>
class Particle {
  constructor(x, y, color, velocity, size) {
    this.x = x
    this.y = y
    this.color = color
    this.velocity = velocity
    this.size = size
    this.alpha = 1
    this.gravity = 0.1
    this.drag = 0.98
    this.fadeSpeed = 0.02
  }

  update() {
    this.velocity.x *= this.drag
    this.velocity.y *= this.drag
    this.velocity.y += this.gravity
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.alpha -= this.fadeSpeed
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export default {
  data() {
    return {
      particles: [],
      animationFrame: null,
      ctx: null,
      width: 0,
      height: 0
    }
  },
  mounted() {
    this.initCanvas()
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
    },
    createBurst(x, y, color = '#4CAF50', count = 20, isBoosted = false) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = isBoosted ? 15 : 8
        const size = isBoosted ? Math.random() * 4 + 3 : Math.random() * 3 + 2
        
        this.particles.push(
          new Particle(
            x,
            y,
            color,
            {
              x: Math.cos(angle) * speed * (0.5 + Math.random()),
              y: Math.sin(angle) * speed * (0.5 + Math.random()) - 2
            },
            size
          )
        )
      }
    },
    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height)

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i]
        particle.update()
        particle.draw(this.ctx)

        if (particle.alpha <= 0) {
          this.particles.splice(i, 1)
        }
      }

      this.animationFrame = requestAnimationFrame(this.animate)
    }
  }
}
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
}
</style> 