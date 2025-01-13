<template>
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Achievements</h2>
          <button class="close-button" @click="$emit('close')">×</button>
        </div>
        <div class="modal-body">
          <div class="achievements-stats">
            <div class="stat">
              <span class="label">Completed</span>
              <span class="value">{{ completedCount }}/{{ achievements.length }}</span>
            </div>
            <div class="stat">
              <span class="label">Total Rewards</span>
              <span class="value">{{ totalRewards }} stimulation</span>
            </div>
          </div>
          <div class="achievements-list">
            <div v-for="achievement in achievements" 
                 :key="achievement.id" 
                 class="achievement-item"
                 :class="{ 'unlocked': achievement.unlocked }">
              <div class="achievement-icon">
                {{ achievement.unlocked ? '🏆' : '🔒' }}
              </div>
              <div class="achievement-info">
                <h3>{{ achievement.name }}</h3>
                <p>{{ achievement.description }}</p>
                <div class="achievement-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" 
                         :style="{ width: getProgressPercentage(achievement) + '%' }">
                    </div>
                  </div>
                  <span class="progress-text">
                    {{ getProgressText(achievement) }}
                  </span>
                </div>
                <div v-if="achievement.unlocked" class="reward">
                  +{{ achievement.reward }} stimulation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AchievementsModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    achievements: {
      type: Array,
      default: () => []
    },
    stimulation: {
      type: Number,
      default: 0
    },
    totalClicks: {
      type: Number,
      default: 0
    },
    upgrades: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    completedCount() {
      return this.achievements.filter(a => a.unlocked).length
    },
    totalRewards() {
      return this.achievements
        .filter(a => a.unlocked)
        .reduce((sum, a) => sum + a.reward, 0)
    }
  },
  methods: {
    getProgressPercentage(achievement) {
      const progress = this.getProgress(achievement)
      return Math.min(progress.current / progress.required * 100, 100)
    },
    getProgressText(achievement) {
      const progress = this.getProgress(achievement)
      return achievement.unlocked 
        ? 'Completed!' 
        : `${progress.current}/${progress.required}`
    },
    getProgress(achievement) {
      const conditions = {
        firstDVD: {
          current: this.stimulation,
          required: 100
        },
        collector: {
          current: this.upgrades.filter(u => u.owned).length,
          required: 3
        },
        enthusiast: {
          current: this.stimulation,
          required: 1000
        },
        hoarder: {
          current: this.stimulation,
          required: 10000
        },
        clickMaster: {
          current: this.totalClicks,
          required: 1000
        }
      }
      return conditions[achievement.id] || { current: 0, required: 1 }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.achievements-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat {
  flex: 1;
  text-align: center;
}

.stat .label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.stat .value {
  font-size: 18px;
  font-weight: bold;
  color: #2196f3;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.achievement-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.achievement-item.unlocked {
  opacity: 1;
  background: #e8f5e9;
}

.achievement-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.achievement-info {
  flex: 1;
}

.achievement-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.achievement-info p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.achievement-progress {
  margin: 10px 0;
}

.progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background: #4caf50;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

.reward {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 5px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style> 