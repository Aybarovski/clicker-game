<template>
  <div class="ocean-container">
    <OceanBackground />
    <OceanParticles ref="particles" />
    
    <div class="game-content">
      <!-- Evolution Status -->
      <div class="status-panel">
        <PlayerFish ref="playerFish" class="player-character" />
        <div class="stats">
          <h1>
            <span class="title-icon">🌊</span>
            Ocean Explorer
            <span class="title-icon">🐋</span>
          </h1>
          <p class="plankton-count">
            <span class="resource-icon">🦐</span>
            {{ planktonPoints }} Plankton
          </p>
          <p class="click-power">
            <span class="stat-icon">💪</span>
            Power: {{ clickValue }} per click
          </p>
          <p class="auto-power" v-if="autoSwimPower > 0">
            <span class="stat-icon">🌊</span>
            Auto-Swim: {{ autoSwimPower }} per second
          </p>
        </div>
      </div>

      <!-- Main Click Area -->
      <div class="click-area" @click="handleClick">
        <div class="ocean-depth-marker">Depth: {{ currentDepth }}m</div>
        <div class="click-button" :class="{ 'clicking': isClicking }">
          <span class="button-icon">🌊</span>
          <span class="button-text">Swim & Collect</span>
          <div class="ripple-container" v-if="showRipple">
            <div class="ripple" v-for="(ripple, index) in ripples" 
                 :key="index"
                 :style="ripple.style">
            </div>
          </div>
        </div>
      </div>

      <!-- Boosts Section -->
      <div class="boosts-panel">
        <h2>Power Boosts</h2>
        <div class="boost-buttons">
          <button
            v-for="boost in boosts"
            :key="boost.id"
            class="boost-button"
            :class="{ 'active': isBoostActive(boost.id) }"
            :disabled="!canActivateBoost(boost)"
            @click="activateBoost(boost.id)"
          >
            <div class="boost-info">
              <h3>{{ boost.name }}</h3>
              <p>{{ boost.description }}</p>
              <p class="boost-cost">Cost: {{ boost.cost }} plankton</p>
            </div>
            <div class="boost-timer" v-if="isBoostActive(boost.id)">
              {{ getBoostTimeLeft(boost.id) }}s
            </div>
          </button>
        </div>
      </div>

      <!-- Upgrades Section -->
      <UpgradeList class="upgrades-section" />

      <!-- Achievements Panel -->
      <div class="achievements-panel">
        <h2>Ocean Discoveries</h2>
        <div class="achievements-grid">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-card"
            :class="{ 'unlocked': achievement.unlocked }"
          >
            <div class="achievement-icon">
              {{ getAchievementIcon(achievement) }}
            </div>
            <div class="achievement-info">
              <h3>{{ achievement.name }}</h3>
              <p>{{ achievement.description }}</p>
              <p class="achievement-fact" v-if="achievement.unlocked">
                {{ achievement.fact }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import OceanBackground from '~/components/OceanBackground.vue'
import OceanParticles from '~/components/OceanParticles.vue'
import PlayerFish from '~/components/PlayerFish.vue'
import UpgradeList from '~/components/UpgradeList.vue'

export default {
  components: {
    OceanBackground,
    OceanParticles,
    PlayerFish,
    UpgradeList
  },
  data() {
    return {
      isClicking: false,
      showRipple: false,
      ripples: [],
      rippleCount: 0,
      boostInterval: null
    }
  },
  computed: {
    ...mapState('game', [
      'planktonPoints',
      'clickValue',
      'autoSwimPower',
      'boosts',
      'boostActive',
      'boostEndTime',
      'boostCooldownEndTime',
      'achievements',
      'currentEvolution'
    ]),
    currentDepth() {
      const baseDepth = Math.floor(Math.log10(this.planktonPoints + 1) * 100)
      return baseDepth > 0 ? baseDepth : 0
    }
  },
  methods: {
    ...mapActions('game', ['increment', 'activateBoost']),
    handleClick() {
      this.increment()
      this.isClicking = true
      this.$refs.playerFish.swim()
      this.createRipple(event)
      
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const colors = ['#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1976d2']
      const color = colors[this.currentEvolution - 1] || colors[0]
      const particleCount = 10 + (this.currentEvolution * 5)
      
      this.$refs.particles.createBurst(x, y, color, particleCount)
      
      setTimeout(() => {
        this.isClicking = false
      }, 100)
    },
    createRipple(event) {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      const ripple = {
        id: this.rippleCount++,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${x}px`,
          top: `${y}px`
        }
      }

      this.ripples.push(ripple)
      this.showRipple = true

      setTimeout(() => {
        this.ripples = this.ripples.filter(r => r.id !== ripple.id)
        if (this.ripples.length === 0) {
          this.showRipple = false
        }
      }, 1000)
    },
    isBoostActive(boostId) {
      return this.boostActive && this.boosts.find(b => b.id === boostId)
    },
    canActivateBoost(boost) {
      return this.planktonPoints >= boost.cost && 
             Date.now() >= this.boostCooldownEndTime
    },
    getBoostTimeLeft(boostId) {
      if (!this.boostActive) return 0
      const timeLeft = Math.max(0, Math.ceil((this.boostEndTime - Date.now()) / 1000))
      return timeLeft
    },
    getAchievementIcon(achievement) {
      const icons = {
        tinyFish: '🐠',
        reefRuler: '🏰',
        humpbackHero: '🐋',
        whaleWatcher: '👑',
        oceanCleaner: '🌊'
      }
      return icons[achievement.id] || '🎯'
    }
  },
  mounted() {
    // Update boost timers
    this.boostInterval = setInterval(() => {
      if (this.boostActive) {
        this.$forceUpdate()
      }
    }, 1000)
  },
  beforeDestroy() {
    if (this.boostInterval) {
      clearInterval(this.boostInterval)
    }
  }
}
</script>

<style scoped>
.ocean-container {
  min-height: 100vh;
  padding: 20px;
  color: white;
}

.game-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.status-panel {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  backdrop-filter: blur(10px);
}

.player-character {
  flex-shrink: 0;
}

.stats {
  flex-grow: 1;
}

.stats h1 {
  margin: 0 0 10px 0;
  font-size: 2em;
  background: linear-gradient(45deg, #64b5f6, #2196f3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.plankton-count {
  font-size: 1.5em;
  font-weight: bold;
  color: #ff9800;
  margin: 5px 0;
}

.click-power, .auto-power {
  color: rgba(255, 255, 255, 0.8);
  margin: 5px 0;
}

.click-area {
  text-align: center;
  margin: 30px 0;
}

.click-button {
  display: inline-block;
  padding: 20px 40px;
  font-size: 1.2em;
  background: linear-gradient(45deg, #2196f3, #1976d2);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

.click-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
}

.clicking {
  transform: scale(0.95);
}

.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 1s linear;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.boosts-panel {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
}

.boost-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.boost-button {
  background: rgba(33, 150, 243, 0.2);
  border: 2px solid #2196f3;
  border-radius: 8px;
  padding: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.boost-button:hover:not(:disabled) {
  background: rgba(33, 150, 243, 0.3);
  transform: translateY(-2px);
}

.boost-button.active {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4caf50;
}

.boost-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.boost-info h3 {
  margin: 0 0 5px 0;
}

.boost-info p {
  margin: 5px 0;
  font-size: 0.9em;
  opacity: 0.8;
}

.boost-cost {
  color: #ff9800;
  font-weight: bold;
}

.boost-timer {
  margin-top: 10px;
  font-weight: bold;
  color: #4caf50;
}

.achievements-panel {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  gap: 15px;
  opacity: 0.7;
  filter: grayscale(1);
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  opacity: 1;
  filter: none;
  background: rgba(76, 175, 80, 0.2);
}

.achievement-icon {
  font-size: 2em;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.achievement-info {
  flex-grow: 1;
}

.achievement-info h3 {
  margin: 0 0 5px 0;
}

.achievement-info p {
  margin: 5px 0;
  font-size: 0.9em;
  opacity: 0.8;
}

.achievement-fact {
  font-style: italic;
  color: #81d4fa;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 5px;
  margin-top: 10px;
}

.title-icon {
  font-size: 0.8em;
  vertical-align: middle;
  margin: 0 5px;
}

.resource-icon,
.stat-icon {
  display: inline-block;
  margin-right: 8px;
  font-size: 1.2em;
  vertical-align: middle;
}

.ocean-depth-marker {
  position: absolute;
  right: 20px;
  top: -30px;
  background: rgba(0, 0, 0, 0.3);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9em;
  backdrop-filter: blur(5px);
}

.click-button {
  background: linear-gradient(45deg, #2196f3, #1976d2);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3),
              inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.button-icon {
  display: inline-block;
  margin-right: 10px;
  font-size: 1.2em;
  vertical-align: middle;
  animation: wave 2s infinite;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

.achievement-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.achievement-card.unlocked {
  background: linear-gradient(135deg, 
    rgba(76, 175, 80, 0.2),
    rgba(129, 199, 132, 0.2)
  );
  border-color: rgba(129, 199, 132, 0.3);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
}

.status-panel,
.boosts-panel,
.achievements-panel {
  position: relative;
  overflow: hidden;
}

.status-panel::after,
.boosts-panel::after,
.achievements-panel::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: shine 10s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  20%, 100% {
    transform: translateX(100%) rotate(45deg);
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .ocean-container {
    padding: 10px;
  }

  .status-panel {
    flex-direction: column;
    text-align: center;
  }

  .click-button {
    width: 100%;
    max-width: 300px;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .ocean-depth-marker {
    position: relative;
    top: 0;
    right: 0;
    margin-bottom: 10px;
    text-align: center;
  }
}
</style> 