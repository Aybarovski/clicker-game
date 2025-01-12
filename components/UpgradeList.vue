<template>
  <div class="upgrade-list">
    <h2>Upgrades</h2>
    <div class="upgrade-grid">
      <div
        v-for="upgrade in upgrades"
        :key="upgrade.id"
        class="upgrade-item"
        :class="{ 'owned': upgrade.owned, 'can-buy': !upgrade.owned && stimulation >= upgrade.cost }"
      >
        <h3>{{ upgrade.name }}</h3>
        <p class="cost">Cost: {{ upgrade.cost }} stimulation</p>
        <p class="type">Type: {{ upgrade.type === 'auto' ? 'Auto-Clicker' : 'Multiplier' }}</p>
        <p class="power">Power: {{ upgrade.power }}{{ upgrade.type === 'multiplier' ? 'x' : '/s' }}</p>
        <button
          :disabled="upgrade.owned || stimulation < upgrade.cost"
          @click="buyUpgrade(upgrade.id)"
        >
          {{ upgrade.owned ? 'Owned' : 'Buy' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('game', ['stimulation', 'upgrades'])
  },
  methods: {
    ...mapActions('game', ['buyUpgrade'])
  }
}
</script>

<style scoped>
.upgrade-list {
  margin: 20px;
}

.upgrade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.upgrade-item {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.upgrade-item.owned {
  background-color: #e8f5e9;
  border-color: #81c784;
}

.upgrade-item.can-buy {
  border-color: #64b5f6;
}

.upgrade-item h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.upgrade-item p {
  margin: 5px 0;
  color: #666;
}

.upgrade-item button {
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #2196F3;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upgrade-item button:hover:not(:disabled) {
  background-color: #1976D2;
}

.upgrade-item button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.upgrade-item.owned button {
  background-color: #4CAF50;
}

.cost {
  font-weight: bold;
  color: #f57c00 !important;
}

.type {
  font-style: italic;
}

.power {
  color: #7b1fa2 !important;
  font-weight: bold;
}
</style> 