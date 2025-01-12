<template>
  <div class="upgrade-list">
    <div class="evolution-status">
      <h2>Current Evolution: {{ getEvolutionName }}</h2>
      <div class="evolution-progress">
        <div class="progress-bar" :style="{ width: evolutionProgress + '%' }"></div>
        <span class="progress-text">{{ evolutionProgress }}% to next stage</span>
      </div>
    </div>
    
    <!-- Basic Tier -->
    <div class="tier-section">
      <div class="tier-header">
        <h3>Basic Upgrades</h3>
        <span class="evolution-stage">Plankton Stage</span>
      </div>
      <div class="upgrade-grid">
        <div
          v-for="upgrade in availableBasicUpgrades"
          :key="upgrade.id"
          class="upgrade-item"
          :class="{
            'owned': upgrade.owned,
            'can-buy': !upgrade.owned && canBuyUpgrade(upgrade)
          }"
        >
          <div class="upgrade-header">
            <h3>{{ upgrade.name }}</h3>
            <span class="type-badge" :class="upgrade.type">
              {{ getUpgradeTypeName(upgrade.type) }}
            </span>
          </div>
          <p class="description">{{ upgrade.description }}</p>
          <div class="upgrade-stats">
            <p class="cost">
              <span class="label">Cost:</span>
              <span class="value">{{ upgrade.cost }} plankton</span>
            </p>
            <p class="power">
              <span class="label">Power:</span>
              <span class="value">{{ upgrade.power }}{{ upgrade.type === 'multiplier' ? 'x' : '/s' }}</span>
            </p>
          </div>
          <div class="fun-fact" v-if="upgrade.fact">
            <span class="fact-icon">🐠</span>
            <p>{{ upgrade.fact }}</p>
          </div>
          <button
            :disabled="upgrade.owned || !canBuyUpgrade(upgrade)"
            @click="buyUpgrade(upgrade.id)"
          >
            {{ getButtonText(upgrade) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Advanced Tier -->
    <div class="tier-section">
      <div class="tier-header">
        <h3>Advanced Upgrades</h3>
        <span class="evolution-stage">Small Fish Stage</span>
        <span class="tier-unlock" v-if="!hasUnlockedTier(2)">
          Unlocks at 500 plankton
        </span>
      </div>
      <div v-if="hasUnlockedTier(2)" class="upgrade-grid">
        <div
          v-for="upgrade in availableAdvancedUpgrades"
          :key="upgrade.id"
          class="upgrade-item"
          :class="{
            'owned': upgrade.owned,
            'can-buy': !upgrade.owned && canBuyUpgrade(upgrade)
          }"
        >
          <div class="upgrade-header">
            <h3>{{ upgrade.name }}</h3>
            <span class="type-badge" :class="upgrade.type">
              {{ getUpgradeTypeName(upgrade.type) }}
            </span>
          </div>
          <p class="description">{{ upgrade.description }}</p>
          <div class="upgrade-stats">
            <p class="cost">
              <span class="label">Cost:</span>
              <span class="value">{{ upgrade.cost }} plankton</span>
            </p>
            <p class="power">
              <span class="label">Power:</span>
              <span class="value">{{ upgrade.power }}{{ upgrade.type === 'multiplier' ? 'x' : '/s' }}</span>
            </p>
          </div>
          <div class="fun-fact" v-if="upgrade.fact">
            <span class="fact-icon">🐟</span>
            <p>{{ upgrade.fact }}</p>
          </div>
          <button
            :disabled="upgrade.owned || !canBuyUpgrade(upgrade)"
            @click="buyUpgrade(upgrade.id)"
          >
            {{ getButtonText(upgrade) }}
          </button>
        </div>
      </div>
      <div v-else class="locked-tier">
        <p>Keep swimming to evolve into a bigger fish!</p>
      </div>
    </div>

    <!-- Elite Tier -->
    <div class="tier-section">
      <div class="tier-header">
        <h3>Elite Upgrades</h3>
        <span class="evolution-stage">Large Fish Stage</span>
        <span class="tier-unlock" v-if="!hasUnlockedTier(3)">
          Unlocks at 2000 plankton
        </span>
      </div>
      <div v-if="hasUnlockedTier(3)" class="upgrade-grid">
        <div
          v-for="upgrade in availableEliteUpgrades"
          :key="upgrade.id"
          class="upgrade-item"
          :class="{
            'owned': upgrade.owned,
            'can-buy': !upgrade.owned && canBuyUpgrade(upgrade)
          }"
        >
          <div class="upgrade-header">
            <h3>{{ upgrade.name }}</h3>
            <span class="type-badge" :class="upgrade.type">
              {{ getUpgradeTypeName(upgrade.type) }}
            </span>
          </div>
          <p class="description">{{ upgrade.description }}</p>
          <div class="upgrade-stats">
            <p class="cost">
              <span class="label">Cost:</span>
              <span class="value">{{ upgrade.cost }} plankton</span>
            </p>
            <p class="power">
              <span class="label">Power:</span>
              <span class="value">{{ upgrade.power }}{{ upgrade.type === 'multiplier' ? 'x' : '/s' }}</span>
            </p>
          </div>
          <div class="fun-fact" v-if="upgrade.fact">
            <span class="fact-icon">🐋</span>
            <p>{{ upgrade.fact }}</p>
          </div>
          <button
            :disabled="upgrade.owned || !canBuyUpgrade(upgrade)"
            @click="buyUpgrade(upgrade.id)"
          >
            {{ getButtonText(upgrade) }}
          </button>
        </div>
      </div>
      <div v-else class="locked-tier">
        <p>Keep growing to unlock the secrets of the deep!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('game', ['planktonPoints', 'upgrades', 'currentEvolution']),
    availableBasicUpgrades() {
      return this.upgrades.filter(u => u.tier === 1)
    },
    availableAdvancedUpgrades() {
      return this.upgrades.filter(u => u.tier === 2)
    },
    availableEliteUpgrades() {
      return this.upgrades.filter(u => u.tier === 3)
    },
    getEvolutionName() {
      const names = {
        1: 'Plankton',
        2: 'Small Fish',
        3: 'Medium Fish',
        4: 'Large Fish',
        5: 'Whale'
      }
      return names[this.currentEvolution] || 'Unknown'
    },
    evolutionProgress() {
      const evolutionThresholds = {
        1: { next: 1000 },    // To Small Fish
        2: { next: 10000 },   // To Medium Fish
        3: { next: 100000 },  // To Large Fish
        4: { next: 1000000 }, // To Whale
        5: { next: Infinity } // Final form
      }
      
      const current = evolutionThresholds[this.currentEvolution]
      if (!current || this.currentEvolution >= 5) return 100
      
      const progress = (this.planktonPoints / current.next) * 100
      return Math.min(Math.round(progress), 100)
    }
  },
  methods: {
    ...mapActions('game', ['buyUpgrade']),
    hasUnlockedTier(tier) {
      const tierThresholds = {
        2: 500,
        3: 2000
      }
      return this.planktonPoints >= tierThresholds[tier]
    },
    canBuyUpgrade(upgrade) {
      return !upgrade.owned && 
             this.planktonPoints >= upgrade.cost && 
             this.currentEvolution >= upgrade.evolutionRequired
    },
    getButtonText(upgrade) {
      if (upgrade.owned) {
        return 'Owned'
      }
      if (this.currentEvolution < upgrade.evolutionRequired) {
        return `Requires ${this.getEvolutionName(upgrade.evolutionRequired)}`
      }
      if (this.planktonPoints < upgrade.cost) {
        return 'Not enough plankton'
      }
      return 'Buy'
    },
    getUpgradeTypeName(type) {
      const types = {
        'auto': 'Auto-Swimmer',
        'multiplier': 'Multiplier',
        'reef': 'Coral Reef'
      }
      return types[type] || type
    }
  }
}
</script>

<style scoped>
.upgrade-list {
  margin: 20px 0;
}

.evolution-status {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
}

.evolution-progress {
  background: rgba(255, 255, 255, 0.1);
  height: 20px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin-top: 15px;
}

.progress-bar {
  background: linear-gradient(90deg, #4fc3f7, #2196f3);
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.tier-section {
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.tier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.tier-header h3 {
  color: #e1bee7;
  font-size: 1.3em;
  margin: 0;
}

.evolution-stage {
  background: rgba(33, 150, 243, 0.2);
  color: #90caf9;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
}

.tier-unlock {
  color: #ff9800;
  font-size: 0.9em;
}

.upgrade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.upgrade-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  text-align: left;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  backdrop-filter: blur(10px);
}

.upgrade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.upgrade-header h3 {
  margin: 0;
  color: white;
  font-size: 1.1em;
}

.type-badge {
  font-size: 0.8em;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
}

.type-badge.auto {
  background: rgba(144, 202, 249, 0.2);
  color: #90caf9;
}

.type-badge.multiplier {
  background: rgba(244, 143, 177, 0.2);
  color: #f48fb1;
}

.type-badge.reef {
  background: rgba(129, 199, 132, 0.2);
  color: #81c784;
}

.upgrade-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 10px 0;
}

.upgrade-item.owned {
  background: rgba(76, 175, 80, 0.2);
  border-color: #81c784;
}

.upgrade-item.can-buy {
  border-color: #64b5f6;
}

.description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9em;
  margin: 10px 0;
  min-height: 2.7em;
}

.fun-fact {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.fact-icon {
  font-size: 1.2em;
}

.fun-fact p {
  margin: 0;
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
}

.cost, .power {
  margin: 0;
  display: flex;
  flex-direction: column;
}

.label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8em;
  margin-bottom: 2px;
}

.value {
  color: #ff9800;
  font-weight: bold;
}

.power .value {
  color: #f48fb1;
}

button {
  width: 100%;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  font-weight: bold;
}

button:hover:not(:disabled) {
  background-color: #43a047;
  transform: scale(1.02);
}

button:disabled {
  background-color: rgba(204, 204, 204, 0.3);
  cursor: not-allowed;
}

.upgrade-item.owned button {
  background-color: #81c784;
}

.locked-tier {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  .upgrade-grid {
    grid-template-columns: 1fr;
  }

  .upgrade-item {
    padding: 20px;
  }

  button {
    padding: 12px 20px;
    font-size: 16px;
  }
  
  .tier-header {
    flex-direction: column;
    text-align: center;
    gap: 5px;
  }
}
</style> 