<template>
  <div class="upgrades-container">
    <div class="upgrades-list">
      <div v-for="upgrade in upgrades" :key="upgrade.id" 
           class="upgrade-item" 
           :class="{ 'owned': upgrade.owned, 'can-buy': canBuyUpgrade(upgrade) }">
        <div class="upgrade-icon" :class="upgrade.type">
          <span v-if="upgrade.notification && canBuyUpgrade(upgrade)" class="notification"></span>
        </div>
        <div class="upgrade-info">
          <h3>{{ upgrade.name }}</h3>
          <p>{{ upgrade.description }}</p>
          <div class="upgrade-cost">
            Cost: {{ upgrade.cost }} stimulation
            <span v-if="upgrade.tier > 1" class="tier-badge">Tier {{ upgrade.tier }}</span>
          </div>
        </div>
        <button @click="buyUpgrade(upgrade.id)" 
                :disabled="!canBuyUpgrade(upgrade) || upgrade.owned"
                class="buy-button">
          {{ upgrade.owned ? 'Owned' : 'Buy' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UpgradeList',
  computed: {
    ...mapState({
      upgrades: state => state.game.upgrades,
      stimulation: state => state.game.stimulation
    })
  },
  methods: {
    canBuyUpgrade(upgrade) {
      return !upgrade.owned && this.stimulation >= upgrade.cost
    },
    buyUpgrade(upgradeId) {
      this.$store.dispatch('game/buyUpgrade', upgradeId)
    }
  }
}
</script>

<style scoped>
.upgrades-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.upgrades-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upgrade-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.upgrade-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.upgrade-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
}

.upgrade-icon.dvd::before { content: '💿'; }
.upgrade-icon.cursor::before { content: '👆'; }
.upgrade-icon.multiplier::before { content: '⚡'; }
.upgrade-icon.person::before { content: '👥'; }
.upgrade-icon.cloud::before { content: '☁️'; }

.notification {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  background: #ff4081;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.upgrade-info {
  flex: 1;
}

.upgrade-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
}

.upgrade-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.upgrade-cost {
  font-size: 0.9rem;
  color: #64b5f6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tier-badge {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #fff;
}

.buy-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #2196f3;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-button:hover:not(:disabled) {
  background: #1976d2;
  transform: scale(1.05);
}

.buy-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.owned .buy-button {
  background: #4caf50;
}

.can-buy .buy-button {
  animation: glow 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.5); }
  50% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.8); }
  100% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.5); }
}

@media (max-width: 768px) {
  .upgrade-item {
    flex-direction: column;
    text-align: center;
  }
  
  .upgrade-icon {
    margin: 0 auto;
  }
  
  .buy-button {
    width: 100%;
    padding: 1rem;
    margin-top: 0.5rem;
  }
}
</style> 