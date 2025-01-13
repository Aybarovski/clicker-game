<template>
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Active Upgrades</h2>
          <button class="close-button" @click="$emit('close')">×</button>
        </div>
        <div class="modal-body">
          <div v-if="activeUpgrades.length === 0" class="no-upgrades">
            No upgrades purchased yet!
          </div>
          <div v-else class="upgrades-list">
            <div v-for="upgrade in activeUpgrades" 
                 :key="upgrade.id" 
                 class="upgrade-item">
              <div class="upgrade-icon" :class="upgrade.type">
                <span class="icon">{{ getUpgradeEmoji(upgrade.type) }}</span>
              </div>
              <div class="upgrade-info">
                <h3>{{ upgrade.name }}</h3>
                <p>{{ upgrade.description }}</p>
                <div class="upgrade-stats">
                  <span class="stat">
                    Power: {{ getUpgradePower(upgrade) }}
                  </span>
                  <span class="stat">
                    Total Generated: {{ getUpgradeTotal(upgrade) }}
                  </span>
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
  name: 'UpgradesModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    upgrades: {
      type: Array,
      default: () => []
    },
    totalClicks: {
      type: Number,
      default: 0
    }
  },
  computed: {
    activeUpgrades() {
      return this.upgrades.filter(u => u.owned)
    }
  },
  methods: {
    getUpgradeEmoji(type) {
      const emojis = {
        dvd: '💿',
        cursor: '👆',
        multiplier: '⚡',
        combo: '🔄',
        rainbow: '🌈',
        store: '🏪',
        bonus: '✨'
      }
      return emojis[type] || '💿'
    },
    getUpgradePower(upgrade) {
      switch (upgrade.type) {
        case 'cursor':
          return `${upgrade.power}/second`
        case 'multiplier':
          return `${upgrade.power}x (${upgrade.id === 'multiplier1' ? '5%' : '10%'} chance)`
        case 'combo':
          return 'Up to 2x multiplier'
        case 'rainbow':
          return '1-3x random bonus'
        case 'bonus':
          return '10x rare bonus'
        default:
          return `+${upgrade.power}`
      }
    },
    getUpgradeTotal(upgrade) {
      // This is a simplified calculation - you might want to track actual totals in the store
      let total = 0
      if (upgrade.type === 'cursor') {
        total = upgrade.power * Math.floor(this.totalClicks / 10) // Rough estimate
      } else if (upgrade.type === 'store') {
        total = upgrade.power * Math.floor(this.totalClicks / 50) // Rough estimate
      }
      return total > 0 ? `${total} stimulation` : 'N/A'
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

.no-upgrades {
  text-align: center;
  color: #666;
  padding: 40px;
}

.upgrades-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upgrade-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.upgrade-item:hover {
  transform: translateX(5px);
}

.upgrade-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(33, 150, 243, 0.1);
}

.upgrade-icon .icon {
  font-size: 24px;
}

.upgrade-info {
  flex: 1;
}

.upgrade-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.upgrade-info p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.upgrade-stats {
  display: flex;
  gap: 15px;
  font-size: 14px;
}

.stat {
  background: rgba(33, 150, 243, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  color: #2196f3;
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