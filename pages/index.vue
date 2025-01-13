<template>
  <div class="game-container">
    <!-- Sound Effects -->
    <SoundEffects ref="soundEffects" />

    <!-- Achievement Notification -->
    <AchievementNotification 
      :show="showNotification"
      :achievement="lastAchievement"
    />

    <!-- Upgrades Modal -->
    <UpgradesModal
      :show="showUpgradesModal"
      :upgrades="upgrades"
      :totalClicks="totalClicks"
      @close="showUpgradesModal = false"
    />

    <!-- Achievements Modal -->
    <AchievementsModal
      :show="showAchievementsModal"
      :achievements="achievements"
      :stimulation="stimulation"
      :totalClicks="totalClicks"
      :upgrades="upgrades"
      @close="showAchievementsModal = false"
    />

    <!-- Stats -->
    <div class="stats-container">
      <div class="stimulation-count">{{ stimulation }} stimulation</div>
      <div class="rate-count">{{ autoClickPower }} stimulation per second</div>
    </div>

    <!-- Navigation -->
    <div class="nav-buttons">
      <button class="nav-btn" 
              @click="showUpgradesModal = true"
              :class="{ 'pop': showUpgradesPop }">
        <span class="icon">⚡</span>
        Upgrades
        <span v-if="hasNewUpgrades" class="notification-dot"></span>
      </button>
      <button class="nav-btn" 
              @click="showAchievementsModal = true"
              :class="{ 'pop': showAchievementsPop }">
        <span class="icon">🏆</span>
        Achievements
        <span v-if="hasNewAchievements" class="notification-dot"></span>
      </button>
    </div>

    <!-- Main Click Area -->
    <div class="click-area">
      <button 
        class="click-button" 
        :class="{ 'clicking': isClicking }" 
        @click="handleClick"
      >
        Click me!
      </button>
    </div>

    <!-- Available Upgrades -->
    <div class="upgrades-section">
      <div v-if="getUnlockMessage()" class="unlock-message">
        {{ getUnlockMessage() }}
      </div>
      <div class="upgrades-row" :class="{ 'empty': visibleUpgrades.length === 0 }">
        <div v-for="upgrade in visibleUpgrades" 
             :key="upgrade.id" 
             class="upgrade-icon"
             :class="{ 'can-buy': canBuyUpgrade(upgrade) }"
             @click="buyUpgrade(upgrade.id)"
             @mouseover="showTooltip(upgrade)"
             @mouseleave="hideTooltip">
          <div v-if="upgrade.notification" class="notification">1</div>
          <img :src="getUpgradeIcon(upgrade)" :alt="upgrade.name">
          <div v-if="selectedUpgrade === upgrade" class="tooltip">
            <h3>{{ upgrade.name }}</h3>
            <p>{{ upgrade.description }}</p>
            <p class="cost">Cost: {{ upgrade.cost }} stimulation</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fff;
}

.stats-container {
  text-align: center;
  margin: 20px 0;
}

.stimulation-count {
  font-size: 24px;
  font-weight: bold;
}

.rate-count {
  font-size: 18px;
  color: #666;
}

.nav-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.nav-btn {
  position: relative;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-btn .icon {
  font-size: 20px;
}

.nav-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.nav-btn.active {
  background: #2196f3;
  color: white;
}

.nav-btn.pop {
  animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.notification-dot {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  background: #ff4081;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.click-area {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
}

.click-button {
  padding: 20px 40px;
  font-size: 24px;
  border: none;
  border-radius: 8px;
  background: #2196f3;
  color: white;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.click-button:hover {
  background: #1976d2;
}

.click-button.clicking {
  transform: scale(0.95);
}

.upgrades-section {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.unlock-message {
  text-align: center;
  color: #666;
  font-size: 16px;
  padding: 10px 20px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 8px;
  animation: pulse 2s infinite;
}

.upgrades-row {
  display: flex;
  gap: 20px;
  min-height: 64px;
  transition: all 0.3s ease;
}

.upgrades-row.empty {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 20px;
  justify-content: center;
  align-items: center;
}

.upgrade-icon {
  position: relative;
  width: 64px;
  height: 64px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upgrade-icon:hover {
  transform: translateY(-2px);
}

.upgrade-icon.can-buy {
  background: #e3f2fd;
}

.notification {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 200px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 100;
  margin-bottom: 10px;
  pointer-events: none;
}

.tooltip h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.tooltip p {
  margin: 5px 0;
  font-size: 14px;
}

.tooltip .cost {
  color: #f44336;
  font-weight: bold;
}

.upgrade-icon img {
  width: 100%;
  height: 100%;
  padding: 12px;
}

.achievements-list {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 10px;
  opacity: 0.7;
}

.achievement-item.unlocked {
  background: #e8f5e9;
  opacity: 1;
}

.achievement-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-info {
  flex: 1;
}

.achievement-info h3 {
  margin: 0 0 5px 0;
}

.achievement-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.reward {
  color: #4caf50 !important;
  font-weight: bold;
  margin-top: 5px !important;
}
</style>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import AchievementNotification from '~/components/AchievementNotification.vue'
import UpgradesModal from '~/components/UpgradesModal.vue'
import AchievementsModal from '~/components/AchievementsModal.vue'
import SoundEffects from '~/components/SoundEffects.vue'

export default {
  components: {
    AchievementNotification,
    UpgradesModal,
    AchievementsModal,
    SoundEffects
  },
  data() {
    return {
      isClicking: false,
      selectedUpgrade: null,
      showUpgradesModal: false,
      showAchievementsModal: false,
      showUpgradesPop: false,
      showAchievementsPop: false,
      showNotification: false,
      lastAchievement: null,
      notificationTimeout: null
    }
  },
  computed: {
    ...mapState('game', [
      'stimulation',
      'autoClickPower',
      'upgrades',
      'achievements',
      'totalClicks'
    ]),
    ...mapGetters('game', ['visibleUpgradesCount']),
    visibleUpgrades() {
      return this.upgrades.slice(0, this.visibleUpgradesCount)
    },
    hasNewUpgrades() {
      return this.upgrades.some(u => !u.owned && this.stimulation >= u.cost)
    },
    hasNewAchievements() {
      return this.achievements.some(a => !a.unlocked && this.isAchievementNearlyComplete(a))
    }
  },
  mounted() {
    window.addEventListener('achievementUnlocked', this.handleAchievementUnlock)
  },
  beforeDestroy() {
    window.removeEventListener('achievementUnlocked', this.handleAchievementUnlock)
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout)
    }
  },
  methods: {
    ...mapActions('game', ['increment', 'buyUpgrade']),
    handleClick() {
      this.increment()
      this.isClicking = true
      // Play click sound
      this.$refs.soundEffects?.playClickSound()
      setTimeout(() => {
        this.isClicking = false
      }, 100)
    },
    showTooltip(upgrade) {
      this.selectedUpgrade = upgrade
    },
    hideTooltip() {
      this.selectedUpgrade = null
    },
    canBuyUpgrade(upgrade) {
      return this.stimulation >= upgrade.cost && !upgrade.owned
    },
    getUpgradeIcon(upgrade) {
      const icons = {
        'dvd': require('~/assets/dvd-logo.svg'),
        'cursor': require('~/assets/cursor.svg'),
        'multiplier': require('~/assets/plus.svg'),
        'person': require('~/assets/person.svg'),
        'cloud': require('~/assets/cloud.svg')
      }
      return icons[upgrade.type] || icons.dvd
    },
    handleAchievementUnlock(event) {
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout)
        this.showNotification = false
      }

      this.lastAchievement = event.detail.achievement
      this.$nextTick(() => {
        this.showNotification = true
        this.notificationTimeout = setTimeout(() => {
          this.showNotification = false
        }, 3000)
      })
    },
    isAchievementNearlyComplete(achievement) {
      const conditions = {
        firstDVD: () => this.stimulation >= 80,
        collector: () => this.upgrades.filter(u => u.owned).length >= 2,
        enthusiast: () => this.stimulation >= 800,
        hoarder: () => this.stimulation >= 8000,
        clickMaster: () => this.totalClicks >= 800
      }
      return conditions[achievement.id] ? conditions[achievement.id]() : false
    },
    getUnlockMessage() {
      if (this.totalClicks < 10) return 'Click 10 times to unlock your first upgrade!'
      if (this.totalClicks < 15) return 'Click 5 more times to unlock another upgrade!'
      if (this.totalClicks < 25) return 'Click until 25 to unlock more upgrades!'
      if (this.totalClicks < 50) return 'Almost there! 50 clicks will unlock all upgrades!'
      return ''
    }
  }
}
</script> 