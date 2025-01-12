<template>
  <div class="boost-list">
    <h2>Power Boosts</h2>
    <div class="boost-grid">
      <div
        v-for="boost in boosts"
        :key="boost.id"
        class="boost-item"
        :class="{
          'active': isBoostActive && currentBoost.id === boost.id,
          'cooldown': isOnCooldown
        }"
      >
        <h3>{{ boost.name }}</h3>
        <p class="description">{{ boost.description }}</p>
        <p class="cost">Cost: {{ boost.cost }} stimulation</p>
        <div class="timer" v-if="isBoostActive && currentBoost.id === boost.id">
          Time left: {{ boostTimeLeft }}s
        </div>
        <div class="cooldown-timer" v-if="!isBoostActive && isOnCooldown">
          Cooldown: {{ cooldownTimeLeft }}s
        </div>
        <button
          @click="activateBoost(boost.id)"
          :disabled="!canActivateBoost(boost) || isBoostActive"
        >
          {{ getButtonText(boost) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      updateInterval: null
    }
  },
  computed: {
    ...mapState('game', [
      'stimulation',
      'boosts',
      'boostActive',
      'boostEndTime',
      'boostCooldownEndTime'
    ]),
    isBoostActive() {
      return this.boostActive
    },
    isOnCooldown() {
      return Date.now() < this.boostCooldownEndTime
    },
    currentBoost() {
      return this.boosts.find(b => 
        this.isBoostActive && 
        Date.now() < this.boostEndTime
      ) || this.boosts[0]
    },
    boostTimeLeft() {
      return Math.max(0, Math.ceil((this.boostEndTime - Date.now()) / 1000))
    },
    cooldownTimeLeft() {
      return Math.max(0, Math.ceil((this.boostCooldownEndTime - Date.now()) / 1000))
    }
  },
  methods: {
    ...mapActions('game', ['activateBoost']),
    canActivateBoost(boost) {
      return this.stimulation >= boost.cost && 
             !this.isBoostActive && 
             Date.now() >= this.boostCooldownEndTime
    },
    getButtonText(boost) {
      if (this.isBoostActive) {
        return 'Active'
      }
      if (this.isOnCooldown) {
        return 'Cooldown'
      }
      if (this.stimulation < boost.cost) {
        return 'Not enough stimulation'
      }
      return 'Activate'
    },
    startUpdateInterval() {
      this.updateInterval = setInterval(() => {
        // Force component update for timers
        this.$forceUpdate()
      }, 1000)
    }
  },
  mounted() {
    this.startUpdateInterval()
  },
  beforeDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  }
}
</script>

<style scoped>
.boost-list {
  margin: 20px 0;
}

.boost-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.boost-item {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.boost-item.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.boost-item.cooldown {
  background: #fff3e0;
  border-color: #ff9800;
}

.boost-item h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.description {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.cost {
  color: #f57c00;
  font-weight: bold;
  margin-bottom: 10px;
}

.timer, .cooldown-timer {
  font-weight: bold;
  margin: 10px 0;
}

.timer {
  color: #2196f3;
}

.cooldown-timer {
  color: #ff9800;
}

button {
  width: 100%;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #43a047;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.boost-item.active button {
  background-color: #2196f3;
}

.boost-item.cooldown button {
  background-color: #ff9800;
}
</style> 