// Vuex "game" module
const achievementConditions = {
  firstDVD: (state) => state.stimulation >= 100,
  collector: (state) => state.upgrades.filter(u => u.owned).length >= 3,
  enthusiast: (state) => state.stimulation >= 1000,
  hoarder: (state) => state.stimulation >= 10000,
  clickMaster: (state) => state.totalClicks >= 1000
}

// All possible upgrades
const allUpgrades = [
  // Tier 1 Upgrades
  {
    id: 'dvd1',
    name: 'Basic DVD',
    description: 'Your first DVD! Increases click value by 1',
    cost: 50,
    owned: false,
    type: 'dvd',
    power: 1,
    notification: true,
    tier: 1
  },
  {
    id: 'cursor1',
    name: 'Auto Clicker',
    description: 'A friendly robot that clicks once per second',
    cost: 100,
    owned: false,
    type: 'cursor',
    power: 1,
    tier: 1
  },
  {
    id: 'multiplier1',
    name: 'Lucky DVD',
    description: '5% chance to find a rare DVD (2x points)',
    cost: 200,
    owned: false,
    type: 'multiplier',
    power: 2,
    tier: 1
  },
  // Tier 2 Upgrades
  {
    id: 'dvd2',
    name: 'DVD Box Set',
    description: 'A complete series! Doubles your click value',
    cost: 500,
    owned: false,
    type: 'dvd',
    power: 2,
    tier: 2
  },
  {
    id: 'cursor2',
    name: 'DVD Sorter',
    description: 'Automatically sorts and clicks twice per second',
    cost: 600,
    owned: false,
    type: 'cursor',
    power: 2,
    tier: 2
  },
  {
    id: 'multiplier2',
    name: 'Collectors Edition',
    description: '10% chance of finding limited editions (3x points)',
    cost: 800,
    owned: false,
    type: 'multiplier',
    power: 3,
    tier: 2
  },
  // Special Upgrades
  {
    id: 'combo1',
    name: 'Click Combo',
    description: 'Each click builds combo meter for bonus points',
    cost: 1000,
    owned: false,
    type: 'combo',
    power: 1.5,
    tier: 2
  },
  {
    id: 'rainbow1',
    name: 'Rainbow DVD',
    description: 'Shiny! Random color effects give random bonuses',
    cost: 1200,
    owned: false,
    type: 'rainbow',
    power: 2,
    tier: 2
  },
  // Tier 3 Upgrades
  {
    id: 'store1',
    name: 'DVD Store',
    description: 'Your own store! Passive income every 5 seconds',
    cost: 1500,
    owned: false,
    type: 'store',
    power: 5,
    tier: 3
  },
  {
    id: 'dvd3',
    name: 'Platinum Collection',
    description: 'Ultra rare collection triples your click value',
    cost: 2000,
    owned: false,
    type: 'dvd',
    power: 3,
    tier: 3
  },
  {
    id: 'cursor3',
    name: 'DVD Factory',
    description: 'Mass production! Clicks four times per second',
    cost: 2500,
    owned: false,
    type: 'cursor',
    power: 4,
    tier: 3
  },
  {
    id: 'bonus1',
    name: 'Golden DVD',
    description: 'Everything you touch turns to gold! Random huge bonuses',
    cost: 3000,
    owned: false,
    type: 'bonus',
    power: 5,
    tier: 3
  }
]

export const state = () => ({
  stimulation: 0,
  clickValue: 1,
  autoClickPower: 0,
  totalClicks: 0,
  achievementsUnlocked: [],
  achievements: [
    {
      id: 'firstDVD',
      name: 'First Collection',
      description: 'Reach 100 stimulation',
      unlocked: false,
      reward: 50
    },
    {
      id: 'collector',
      name: 'DVD Collector',
      description: 'Own 3 different upgrades',
      unlocked: false,
      reward: 200
    },
    {
      id: 'enthusiast',
      name: 'DVD Enthusiast',
      description: 'Reach 1,000 stimulation',
      unlocked: false,
      reward: 500
    },
    {
      id: 'hoarder',
      name: 'DVD Hoarder',
      description: 'Reach 10,000 stimulation',
      unlocked: false,
      reward: 1000
    },
    {
      id: 'clickMaster',
      name: 'Click Master',
      description: 'Click 1,000 times',
      unlocked: false,
      reward: 500
    }
  ],
  // Start with no upgrades
  upgrades: []
})

// Add new getter for visible upgrades count
export const getters = {
  visibleUpgradesCount: (state) => {
    if (state.totalClicks >= 50) return 5
    if (state.totalClicks >= 25) return 3
    if (state.totalClicks >= 15) return 2
    if (state.totalClicks >= 10) return 1
    return 0
  }
}

export const mutations = {
  INCREMENT(state, amount) {
    state.stimulation += amount
  },
  SET_CLICK_VALUE(state, newValue) {
    state.clickValue = newValue
  },
  SET_AUTO_CLICK_POWER(state, power) {
    state.autoClickPower = power
  },
  INCREMENT_TOTAL_CLICKS(state) {
    state.totalClicks++
    // Update available upgrades based on total clicks
    const availableCount = getters.visibleUpgradesCount(state)
    const currentCount = state.upgrades.length
    
    if (availableCount > currentCount) {
      // Add new upgrades up to the available count
      const newUpgrades = allUpgrades
        .slice(currentCount, availableCount)
        .map(upgrade => ({ ...upgrade }))
      state.upgrades.push(...newUpgrades)
    }
  },
  BUY_UPGRADE(state, upgradeId) {
    const upgradeIndex = state.upgrades.findIndex(u => u.id === upgradeId)
    if (upgradeIndex !== -1) {
      // Mark the upgrade as owned
      state.upgrades[upgradeIndex].owned = true
      state.upgrades[upgradeIndex].notification = false

      // Find the next available upgrade
      const ownedUpgradeIds = new Set(state.upgrades.filter(u => u.owned).map(u => u.id))
      const nextUpgrade = allUpgrades.find(u => !ownedUpgradeIds.has(u.id) && 
                                               !state.upgrades.some(current => current.id === u.id))

      if (nextUpgrade) {
        // Replace the bought upgrade with the next one
        state.upgrades.splice(upgradeIndex, 1, { ...nextUpgrade })
      } else {
        // If no more upgrades, remove the bought one
        state.upgrades.splice(upgradeIndex, 1)
      }
    }
  },
  UNLOCK_ACHIEVEMENT(state, id) {
    const achievement = state.achievements.find(a => a.id === id)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      state.achievementsUnlocked.push(id)
      state.stimulation += achievement.reward
      if (window) {
        window.dispatchEvent(new CustomEvent('achievementUnlocked', { 
          detail: { achievement }
        }))
      }
    }
  }
}

export const actions = {
  increment({ commit, state, dispatch }) {
    // Calculate base click value
    let clickValue = state.clickValue

    // Check for critical hit (Lucky DVD)
    const criticalUpgrade = allUpgrades.find(u => u.id === 'multiplier1' && u.owned)
    if (criticalUpgrade && Math.random() < 0.05) {
      clickValue *= criticalUpgrade.power
    }

    // Check for collectors edition bonus
    const collectorUpgrade = allUpgrades.find(u => u.id === 'multiplier2' && u.owned)
    if (collectorUpgrade && Math.random() < 0.10) {
      clickValue *= collectorUpgrade.power
    }

    // Check for combo bonus
    const comboUpgrade = allUpgrades.find(u => u.id === 'combo1' && u.owned)
    if (comboUpgrade) {
      const comboMultiplier = Math.min(1 + (state.totalClicks % 10) * 0.1, 2)
      clickValue *= comboMultiplier
    }

    // Check for rainbow DVD bonus
    const rainbowUpgrade = allUpgrades.find(u => u.id === 'rainbow1' && u.owned)
    if (rainbowUpgrade && Math.random() < 0.15) {
      clickValue *= 1 + Math.random() * 2 // Random bonus between 1x and 3x
    }

    // Check for golden DVD bonus
    const goldenUpgrade = allUpgrades.find(u => u.id === 'bonus1' && u.owned)
    if (goldenUpgrade && Math.random() < 0.01) {
      clickValue *= 10 // Rare 10x bonus
    }

    commit('INCREMENT', clickValue)
    commit('INCREMENT_TOTAL_CLICKS')
    dispatch('checkAchievements')
  },

  buyUpgrade({ commit, state, dispatch }, upgradeId) {
    const upgrade = state.upgrades.find(u => u.id === upgradeId)
    if (upgrade && !upgrade.owned && state.stimulation >= upgrade.cost) {
      commit('INCREMENT', -upgrade.cost)
      commit('BUY_UPGRADE', upgradeId)

      if (upgrade.type === 'cursor') {
        commit('SET_AUTO_CLICK_POWER', state.autoClickPower + upgrade.power)
        dispatch('startAutoClick')
      } else if (upgrade.type === 'dvd') {
        if (upgrade.id === 'dvd2' || upgrade.id === 'dvd3') {
          commit('SET_CLICK_VALUE', state.clickValue * upgrade.power)
        } else {
          commit('SET_CLICK_VALUE', state.clickValue + upgrade.power)
        }
      } else if (upgrade.type === 'store') {
        // Start passive income for DVD store
        if (!this.storeInterval) {
          this.storeInterval = setInterval(() => {
            commit('INCREMENT', upgrade.power)
            dispatch('checkAchievements')
          }, 5000)
        }
      }
      
      dispatch('checkAchievements')
    }
  },

  startAutoClick({ commit, state, dispatch }) {
    if (!this.intervalRef && state.autoClickPower > 0) {
      this.intervalRef = setInterval(() => {
        commit('INCREMENT', state.autoClickPower)
        dispatch('checkAchievements')
      }, 1000)
    }
  },

  checkAchievements({ commit, state }) {
    state.achievements.forEach((achievement) => {
      if (!achievement.unlocked && achievementConditions[achievement.id](state)) {
        commit('UNLOCK_ACHIEVEMENT', achievement.id)
      }
    })
  }
} 