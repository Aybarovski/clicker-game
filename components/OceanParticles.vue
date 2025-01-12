<template>
  <div class="ocean-particles">
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    <div class="floating-elements">
      <div v-for="(element, index) in floatingElements" 
           :key="index"
           class="floating-element"
           :class="element.type"
           :style="element.style">
        {{ element.icon }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OceanParticles',
  data() {
    return {
      ctx: null,
      width: 0,
      height: 0,
      particles: [],
      animationFrame: null,
      floatingElements: [],
      marineElements: [
        { type: 'seaweed', icon: '🌿' },
        { type: 'coral', icon: '🪸' },
        { type: 'shell', icon: '🐚' },
        { type: 'starfish', icon: '⭐' },
        { type: 'jellyfish', icon: '🎐' },
        { type: 'seahorse', icon: '🌊' }
      ]
    }
  },
  mounted() {
    this.initCanvas()
    this.createFloatingElements()
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
      const canvas = this.$refs.particleCanvas
      this.ctx = canvas.getContext('2d')
      this.handleResize()
    },
    handleResize() {
      const canvas = this.$refs.particleCanvas
      this.width = canvas.width = window.innerWidth
      this.height = canvas.height = window.innerHeight
    },
    createBurst(x, y, color = '#ffffff', count = 20) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const velocity = 2 + Math.random() * 2
        const particle = {
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: 2 + Math.random() * 3,
          color,
          life: 1,
          type: Math.random() > 0.7 ? 'bubble' : 'particle'
        }
        this.particles.push(particle)
      }
    },
    createFloatingElements() {
      const count = Math.floor(this.width / 300) // Adjust density based on screen width
      this.floatingElements = Array.from({ length: count }, () => this.createFloatingElement())
    },
    createFloatingElement() {
      const element = this.marineElements[Math.floor(Math.random() * this.marineElements.length)]
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = 15 + Math.random() * 20
      const delay = Math.random() * -20
      
      return {
        ...element,
        style: {
          left: `${x}vw`,
          top: `${y}vh`,
          animation: `float ${duration}s ${delay}s infinite`
        }
      }
    },
    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height)
      
      // Update and draw particles
      this.particles.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.02

        if (particle.type === 'bubble') {
          particle.vy -= 0.1 // Bubbles float up
          this.drawBubble(particle)
        } else {
          this.drawParticle(particle)
        }

        if (particle.life <= 0) {
          this.particles.splice(index, 1)
        }
      })

      this.animationFrame = requestAnimationFrame(() => this.animate())
    },
    drawParticle(particle) {
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.life * 0.8})`
      this.ctx.fill()
    },
    drawBubble(particle) {
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${particle.life * 0.5})`
      this.ctx.lineWidth = 1
      this.ctx.stroke()
      
      // Bubble shine
      this.ctx.beginPath()
      this.ctx.arc(
        particle.x - particle.size * 0.3,
        particle.y - particle.size * 0.3,
        particle.size * 0.2,
        0,
        Math.PI * 2
      )
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.life * 0.8})`
      this.ctx.fill()
    }
  }
}
</script>

<style scoped>
.ocean-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.floating-element {
  position: absolute;
  font-size: 2em;
  opacity: 0.6;
  filter: blur(0.5px);
  transform-origin: center;
}

.floating-element.seaweed {
  filter: hue-rotate(20deg);
}

.floating-element.coral {
  filter: hue-rotate(-20deg);
}

.floating-element.starfish {
  filter: hue-rotate(50deg);
}

.floating-element.jellyfish {
  animation-timing-function: ease-in-out !important;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-40px) rotate(-2deg);
  }
  75% {
    transform: translateY(-20px) rotate(3deg);
  }
}

/* Add subtle pulse animation for some elements */
.floating-element.jellyfish,
.floating-element.coral {
  animation: float, pulse 3s ease-in-out infinite !important;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    filter: blur(0.5px);
  }
  50% {
    opacity: 0.8;
    filter: blur(0);
  }
}
</style> 