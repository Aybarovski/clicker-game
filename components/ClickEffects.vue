<template>
  <div class="click-effect-container">
    <div
      v-for="(fx, i) in effects"
      :key="i"
      :style="getStyle(fx)"
      class="click-float"
      :class="{ 'boosted': fx.boosted }"
    >
      +{{ formatValue(fx.value) }}
    </div>
    <!-- Audio elements -->
    <audio 
      id="clickSound" 
      :src="require('~/assets/sounds/click.mp3')" 
      preload="auto"
      @canplaythrough="onSoundLoaded('click')"
      @error="onSoundError('click', $event)"
    ></audio>
    <audio 
      id="achievementSound" 
      :src="require('~/assets/sounds/achievement.mp3')" 
      preload="auto"
      @canplaythrough="onSoundLoaded('achievement')"
      @error="onSoundError('achievement', $event)"
    ></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      effects: [],
      soundEnabled: true,
      clickSound: null,
      achievementSound: null,
      soundsLoaded: {
        click: false,
        achievement: false
      },
      debugMode: true // Set to true to see all debug messages
    }
  },
  mounted() {
    this.initializeAudio()

    // Listen for achievement unlocks
    window.addEventListener('achievementUnlocked', (event) => {
      this.log('Achievement unlocked:', event.detail.achievement.name)
      this.playAchievementSound()
    })
  },
  methods: {
    initializeAudio() {
      this.log('Initializing audio system...')
      
      // Initialize audio elements
      this.clickSound = document.getElementById('clickSound')
      this.achievementSound = document.getElementById('achievementSound')

      if (!this.clickSound || !this.achievementSound) {
        this.error('Failed to find audio elements in DOM')
        this.soundEnabled = false
        return
      }

      // Set initial volumes
      try {
        this.clickSound.volume = 0.3
        this.achievementSound.volume = 0.5
        this.log('Audio volumes set successfully')
      } catch (error) {
        this.error('Error setting audio volumes:', error)
      }

      // Enable sounds on first interaction
      document.addEventListener('click', () => {
        this.log('First user interaction detected, initializing audio playback...')
        if (this.soundEnabled) {
          this.initializeAudioPlayback()
        }
      }, { once: true })

      // Add load event listeners
      this.clickSound.addEventListener('loadeddata', () => {
        this.log('Click sound loaded successfully')
      })
      this.achievementSound.addEventListener('loadeddata', () => {
        this.log('Achievement sound loaded successfully')
      })
    },

    initializeAudioPlayback() {
      if (!this.clickSound) {
        this.error('Click sound not initialized')
        return
      }

      this.clickSound.play()
        .then(() => {
          this.log('Audio system initialized successfully')
          this.clickSound.pause()
          this.clickSound.currentTime = 0
        })
        .catch(error => {
          this.error('Audio initialization failed:', error)
          this.soundEnabled = false
        })
    },

    onSoundLoaded(type) {
      this.soundsLoaded[type] = true
      this.log(`${type} sound loaded successfully`)
    },

    onSoundError(type, event) {
      this.error(`Error loading ${type} sound:`, event)
      this.soundEnabled = false
    },

    playClickSound() {
      if (!this.soundEnabled) {
        this.log('Sound system disabled, skipping click sound')
        return
      }
      
      if (!this.clickSound) {
        this.error('Click sound not initialized')
        return
      }

      try {
        this.clickSound.currentTime = 0
        const playPromise = this.clickSound.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.log('Click sound played successfully')
            })
            .catch(error => {
              this.error('Click sound playback failed:', error)
              this.soundEnabled = false
            })
        }
      } catch (error) {
        this.error('Error playing click sound:', error)
      }
    },

    playAchievementSound() {
      if (!this.soundEnabled) {
        this.log('Sound system disabled, skipping achievement sound')
        return
      }

      if (!this.achievementSound) {
        this.error('Achievement sound not initialized')
        return
      }

      try {
        this.achievementSound.currentTime = 0
        const playPromise = this.achievementSound.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.log('Achievement sound played successfully')
            })
            .catch(error => {
              this.error('Achievement sound playback failed:', error)
              this.soundEnabled = false
            })
        }
      } catch (error) {
        this.error('Error playing achievement sound:', error)
      }
    },

    log(...args) {
      if (this.debugMode) {
        console.log('🔊 [Audio System]', ...args)
      }
    },

    error(...args) {
      console.error('🔊 [Audio System]', ...args)
    },

    showClick(value, x, y, boosted = false) {
      // Add random offset to prevent overlapping
      const offsetX = (Math.random() - 0.5) * 30
      const offsetY = (Math.random() - 0.5) * 30
      
      this.effects.push({
        value,
        x: x + offsetX,
        y: y + offsetY,
        alpha: 1,
        boosted
      })

      // Play click sound
      this.playClickSound()

      setTimeout(() => {
        this.effects.shift()
      }, 600)
    },

    getStyle(fx) {
      return {
        position: 'absolute',
        left: `${fx.x}px`,
        top: `${fx.y}px`,
        transform: `translate(-50%, -50%)`,
        pointerEvents: 'none'
      }
    },

    formatValue(value) {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
      }
      return value
    }
  },
  beforeDestroy() {
    this.log('Cleaning up audio system...')
    // Clean up audio elements
    if (this.clickSound) {
      this.clickSound.pause()
      this.clickSound = null
    }
    if (this.achievementSound) {
      this.achievementSound.pause()
      this.achievementSound = null
    }
    // Remove event listener
    window.removeEventListener('achievementUnlocked', this.playAchievementSound)
  }
}
</script>

<style scoped>
.click-effect-container {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.click-float {
  position: absolute;
  color: #4CAF50;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  animation: floatUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  user-select: none;
}

.click-float.boosted {
  color: #f57c00;
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: floatUpBoosted 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -80%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -120%) scale(1);
  }
}

@keyframes floatUpBoosted {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1.5);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -150%) scale(1);
  }
}
</style> 