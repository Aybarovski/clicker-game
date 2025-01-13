<template>
  <div style="display: none;">
    <audio id="clickSound" preload="auto" ref="clickSound">
      <source src="/sounds/click.mp3" type="audio/mp3">
    </audio>
    <audio id="achievementSound" preload="auto" ref="achievementSound">
      <source src="/sounds/achievement.mp3" type="audio/mp3">
    </audio>
  </div>
</template>

<script>
export default {
  name: 'SoundEffects',
  data() {
    return {
      soundsLoaded: {
        click: false,
        achievement: false
      },
      debugMode: true
    }
  },
  mounted() {
    // Initialize audio after a user interaction
    const initializeOnInteraction = () => {
      this.initializeAudio()
      document.removeEventListener('click', initializeOnInteraction)
    }
    document.addEventListener('click', initializeOnInteraction)
    
    window.addEventListener('achievementUnlocked', this.playAchievementSound)
    
    // Also try to initialize immediately
    this.initializeAudio()
  },
  beforeDestroy() {
    window.removeEventListener('achievementUnlocked', this.playAchievementSound)
  },
  methods: {
    initializeAudio() {
      this.log('Initializing audio...')

      // Initialize click sound
      const clickSound = this.$refs.clickSound
      if (clickSound) {
        clickSound.addEventListener('canplaythrough', () => {
          this.soundsLoaded.click = true
          this.log('Click sound loaded')
        })
        clickSound.addEventListener('error', (e) => {
          this.error('Error loading click sound:', e)
        })
        clickSound.volume = 0.2
        
        // Try to load the sound
        clickSound.load()
      }

      // Initialize achievement sound
      const achievementSound = this.$refs.achievementSound
      if (achievementSound) {
        achievementSound.addEventListener('canplaythrough', () => {
          this.soundsLoaded.achievement = true
          this.log('Achievement sound loaded')
        })
        achievementSound.addEventListener('error', (e) => {
          this.error('Error loading achievement sound:', e)
        })
        achievementSound.volume = 0.4
        
        // Try to load the sound
        achievementSound.load()
      }
    },
    async playClickSound() {
      const sound = this.$refs.clickSound
      if (!sound) {
        this.error('Click sound element not found')
        return
      }

      try {
        sound.currentTime = 0
        await sound.play()
        this.log('Click sound played')
      } catch (e) {
        this.error('Error playing click sound:', e)
        // Try to reinitialize audio on error
        this.initializeAudio()
      }
    },
    async playAchievementSound() {
      const sound = this.$refs.achievementSound
      if (!sound) {
        this.error('Achievement sound element not found')
        return
      }

      try {
        sound.currentTime = 0
        await sound.play()
        this.log('Achievement sound played')
      } catch (e) {
        this.error('Error playing achievement sound:', e)
        // Try to reinitialize audio on error
        this.initializeAudio()
      }
    },
    log(...args) {
      if (this.debugMode) {
        console.log('[SoundEffects]', ...args)
      }
    },
    error(...args) {
      if (this.debugMode) {
        console.error('[SoundEffects]', ...args)
      }
    }
  }
}
</script> 