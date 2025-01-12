<template>
  <transition-group name="slideIn" tag="div" class="achievement-container">
    <div
      v-for="achievement in recentAchievements"
      :key="achievement.id"
      class="achievement-popup"
      @click="hideAchievement(achievement.id)"
    >
      <div class="achievement-icon">🏆</div>
      <div class="achievement-content">
        <h3>Achievement Unlocked!</h3>
        <p class="achievement-name">{{ achievement.name }}</p>
        <p class="achievement-description">{{ achievement.description }}</p>
        <p class="achievement-reward">Reward: {{ achievement.reward }} stimulation</p>
      </div>
    </div>
  </transition-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      recentAchievements: [],
      timers: {}
    }
  },
  computed: {
    ...mapState('game', ['achievementsUnlocked', 'achievements'])
  },
  watch: {
    achievementsUnlocked: {
      handler(newVal, oldVal) {
        if (newVal.length > oldVal.length) {
          const lastId = newVal[newVal.length - 1]
          const achievement = this.achievements.find(a => a.id === lastId)
          if (achievement) {
            this.recentAchievements.push(achievement)
            this.setTimer(achievement.id)
            this.$parent.$refs.clickEffects.playAchievementSound()
          }
        }
      },
      deep: true
    }
  },
  methods: {
    setTimer(id) {
      if (this.timers[id]) {
        clearTimeout(this.timers[id])
      }
      this.timers[id] = setTimeout(() => {
        this.hideAchievement(id)
      }, 5000)
    },
    hideAchievement(id) {
      this.recentAchievements = this.recentAchievements.filter(a => a.id !== id)
      if (this.timers[id]) {
        clearTimeout(this.timers[id])
        delete this.timers[id]
      }
    }
  }
}
</script>

<style scoped>
.achievement-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.achievement-popup {
  display: flex;
  align-items: center;
  background: rgba(255, 202, 40, 0.95);
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  max-width: 300px;
}

.achievement-icon {
  font-size: 2em;
  margin-right: 12px;
}

.achievement-content {
  flex: 1;
}

.achievement-content h3 {
  margin: 0;
  color: #b71c1c;
  font-size: 1.1em;
}

.achievement-name {
  margin: 4px 0;
  color: #333;
  font-weight: bold;
}

.achievement-description {
  margin: 2px 0;
  color: #555;
  font-size: 0.9em;
}

.achievement-reward {
  margin: 4px 0 0;
  color: #2e7d32;
  font-weight: bold;
  font-size: 0.9em;
}

.slideIn-enter-active,
.slideIn-leave-active {
  transition: all 0.5s ease-out;
}

.slideIn-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slideIn-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 