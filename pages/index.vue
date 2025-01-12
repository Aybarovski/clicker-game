<template>
  <div class="main-container">
    <!-- Animated Background -->
    <AnimatedBackground />

    <h1>My Nuxt Clicker Game</h1>

    <!-- Game Stats -->
    <div class="stats">
      <p class="stimulation">Stimulation: {{ stimulation }}</p>
      <p class="click-value">Click Value: {{ clickValue }}x</p>
      <p class="auto-click" v-if="autoClickPower > 0">
        Auto-Click Power: {{ autoClickPower }}/s
      </p>
      <p class="total-clicks">Total Clicks: {{ totalClicks }}</p>
      <p class="boost" v-if="boostActive">
        Boost Active: {{ boostMultiplier }}x multiplier!
      </p>
    </div>

    <!-- Progress Bars -->
    <div class="progress-section">
      <ProgressBar
        v-for="achievement in nextAchievements"
        :key="achievement.id"
        :current="getProgressValue(achievement)"
        :target="getProgressTarget(achievement)"
        :label="achievement.name"
      />
    </div>

    <!-- Main click button -->
    <button class="click-button" @click="handleClick" ref="clickButton">Click Me!</button>

    <div class="game-content">
      <!-- Upgrades -->
      <div class="section">
        <UpgradeList />
      </div>

      <!-- Achievements -->
      <div class="section achievements">
        <h2>Achievements</h2>
        <div class="achievements-grid">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-item"
            :class="{ 'unlocked': achievement.unlocked }"
          >
            <div class="achievement-icon">{{ achievement.unlocked ? '🏆' : '🔒' }}</div>
            <div class="achievement-details">
              <h3>{{ achievement.name }}</h3>
              <p>{{ achievement.description }}</p>
              <p class="reward" v-if="achievement.unlocked">
                Reward: {{ achievement.reward }} stimulation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boosts -->
    <div class="section">
      <BoostList />
    </div>

    <!-- Particle Effects -->
    <ParticleSystem ref="particles" />

    <!-- Click Effects -->
    <ClickEffects ref="clickEffects" />

    <!-- Achievement Popup -->
    <AchievementPopup ref="achievementPopup" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UpgradeList from '~/components/UpgradeList.vue'
import AchievementPopup from '~/components/AchievementPopup.vue'
import BoostList from '~/components/BoostList.vue'
import ClickEffects from '~/components/ClickEffects.vue'
import ProgressBar from '~/components/ProgressBar.vue'
import ParticleSystem from '~/components/ParticleSystem.vue'
import AnimatedBackground from '~/components/AnimatedBackground.vue'

export default {
  components: {
    UpgradeList,
    AchievementPopup,
    BoostList,
    ClickEffects,
    ProgressBar,
    ParticleSystem,
    AnimatedBackground
  },
  computed: {
    ...mapState('game', [
      'stimulation',
      'clickValue',
      'autoClickPower',
      'totalClicks',
      'achievements',
      'boostActive',
      'boostMultiplier'
    ]),
    nextAchievements() {
      return this.achievements
        .filter(a => !a.unlocked)
        .slice(0, 3)
    }
  },
  methods: {
    ...mapActions('game', ['increment']),
    handleClick(event) {
      // Get click position
      const x = event.clientX
      const y = event.clientY

      // Show click effect
      const value = this.boostActive ? this.clickValue * this.boostMultiplier : this.clickValue
      this.$refs.clickEffects.showClick(value, x, y, this.boostActive)

      // Create particle burst
      this.$refs.particles.createBurst(
        x, 
        y, 
        this.boostActive ? '#ff9800' : '#4CAF50',
        this.boostActive ? 30 : 20,
        this.boostActive
      )

      // Increment counter
      this.increment()
    },
    getProgressValue(achievement) {
      switch (achievement.id) {
        case 'reach100':
        case 'reach1000':
        case 'reach10000':
          return this.stimulation
        case 'clicks100':
          return this.totalClicks
        case 'upgrader':
          return this.achievements.filter(a => a.unlocked).length
        default:
          return 0
      }
    },
    getProgressTarget(achievement) {
      switch (achievement.id) {
        case 'reach100':
          return 100
        case 'reach1000':
          return 1000
        case 'reach10000':
          return 10000
        case 'clicks100':
          return 100
        case 'upgrader':
          return 3
        default:
          return 100
      }
    }
  }
}
</script>

<style scoped>
.main-container {
  text-align: center;
  margin: 20px auto;
  max-width: 1200px;
  padding: 0 20px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.progress-section {
  max-width: 600px;
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.game-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stats {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  display: inline-block;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stats p {
  font-size: 20px;
  margin: 10px 0;
}

.stimulation {
  color: #ff9800;
  font-weight: bold;
}

.click-value {
  color: #e1bee7;
}

.auto-click {
  color: #80cbc4;
}

.total-clicks {
  color: #90caf9;
}

.boost {
  color: #ff5252;
  font-weight: bold;
  animation: pulse 2s infinite;
}

.click-button {
  padding: 20px 40px;
  font-size: 24px;
  cursor: pointer;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.click-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
}

.click-button:active {
  transform: scale(0.95);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.achievement-item.unlocked {
  background: rgba(76, 175, 80, 0.2);
  opacity: 1;
}

.achievement-icon {
  font-size: 1.5em;
  margin-right: 15px;
}

.achievement-details {
  text-align: left;
}

.achievement-details h3 {
  margin: 0;
  color: white;
}

.achievement-details p {
  margin: 5px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9em;
}

.achievement-details .reward {
  color: #81c784;
  font-weight: bold;
}

h1, h2 {
  color: white;
  margin-bottom: 20px;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style> 