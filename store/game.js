// Vuex "game" module
// Achievement condition checkers
const achievementConditions = {
  tinyFish: (state) => state.planktonPoints >= 100,
  reefRuler: (state) => state.upgrades.filter(u => u.type === 'reef' && u.owned).length >= 2,
  humpbackHero: (state) => state.planktonPoints >= 1000000,
  whaleWatcher: (state) => state.currentEvolution >= 5,
  oceanCleaner: (state) => state.totalClicks >= 1000
}

export const state = () => ({
  planktonPoints: 0,
  clickValue: 1,
  autoSwimPower: 0,
  totalClicks: 0,
  currentEvolution: 1, // 1: Plankton, 2: Small Fish, 3: Medium Fish, 4: Large Fish, 5: Whale
  boostActive: false,
  boostMultiplier: 1,
  boostEndTime: 0,
  boostCooldownEndTime: 0,
  boosts: [
    {
      id: 'schoolBoost',
      name: 'School of Fish',
      description: 'Join a school of fish to double your gathering power for 30 seconds',
      cost: 150,
      multiplier: 2,
      duration: 30000,
      cooldown: 60000
    },
    {
      id: 'feedingFrenzy',
      name: 'Feeding Frenzy',
      description: 'Triple your gathering power in a feeding frenzy for 15 seconds',
      cost: 300,
      multiplier: 3,
      duration: 15000,
      cooldown: 90000
    }
  ],
  achievementsUnlocked: [],
  achievements: [
    {
      id: 'tinyFish',
      name: 'Nemo\'s Cousin',
      description: 'Reach 100 plankton points',
      unlocked: false,
      reward: 50,
      fact: 'Clownfish can live in anemones without getting stung!'
    },
    {
      id: 'reefRuler',
      name: 'Reef Ruler',
      description: 'Own 2 different reef upgrades',
      unlocked: false,
      reward: 200,
      fact: 'Coral reefs support 25% of all marine life!'
    },
    {
      id: 'humpbackHero',
      name: 'Humpback Hero',
      description: 'Reach 1,000,000 plankton points',
      unlocked: false,
      reward: 1000,
      fact: 'Humpback whales can sing for hours underwater!'
    },
    {
      id: 'whaleWatcher',
      name: 'Whale Watcher',
      description: 'Reach the final whale evolution',
      unlocked: false,
      reward: 2000,
      fact: 'Blue whales are the largest animals to ever exist on Earth!'
    },
    {
      id: 'oceanCleaner',
      name: 'Ocean Guardian',
      description: 'Click 1,000 times to clean the ocean',
      unlocked: false,
      reward: 500,
      fact: 'Every piece of plastic ever made still exists somewhere in our oceans.'
    }
  ],
  upgrades: [
    // Basic Tier (Plankton Stage)
    {
      id: 'biggerMouth1',
      name: 'Tiny Mouth Upgrade',
      description: 'Grow a slightly bigger mouth to catch more plankton per click',
      cost: 50,
      owned: false,
      type: 'multiplier',
      power: 2,
      unlockAt: 0,
      tier: 1,
      evolutionRequired: 1,
      fact: 'Even tiny plankton have specialized feeding structures!'
    },
    {
      id: 'autoSwim1',
      name: 'Auto-Swimmer I',
      description: 'Develop better fins to automatically gather plankton',
      cost: 100,
      owned: false,
      type: 'auto',
      power: 1,
      unlockAt: 0,
      tier: 1,
      evolutionRequired: 1,
      fact: 'Fish never stop swimming, even when they sleep!'
    },
    // Advanced Tier (Small Fish Stage)
    {
      id: 'coralReef1',
      name: 'Coral Home',
      description: 'Establish a home in a coral reef for passive plankton generation',
      cost: 200,
      owned: false,
      type: 'reef',
      power: 2,
      unlockAt: 500,
      tier: 2,
      evolutionRequired: 2,
      fact: 'Coral reefs grow just 0.3 to 2 centimeters per year!'
    },
    {
      id: 'schoolFish1',
      name: 'Small School',
      description: 'Join a small school of fish to increase gathering power',
      cost: 300,
      owned: false,
      type: 'multiplier',
      power: 3,
      unlockAt: 500,
      tier: 2,
      evolutionRequired: 2,
      fact: 'Fish in schools can react to danger in under 0.15 seconds!'
    },
    // Elite Tier (Large Fish Stage)
    {
      id: 'deepDive1',
      name: 'Deep Sea Explorer',
      description: 'Venture into deeper waters for rare plankton species',
      cost: 1000,
      owned: false,
      type: 'auto',
      power: 5,
      unlockAt: 2000,
      tier: 3,
      evolutionRequired: 3,
      fact: 'The deep sea begins at 200 meters below the surface!'
    },
    {
      id: 'whaleMode',
      name: 'Whale Evolution',
      description: 'Evolve into a majestic whale for massive plankton gathering',
      cost: 1500,
      owned: false,
      type: 'multiplier',
      power: 5,
      unlockAt: 2000,
      tier: 3,
      evolutionRequired: 3,
      fact: 'Whales can consume up to 6 tons of krill per day!'
    }
  ]
})

export const mutations = {
  INCREMENT_PLANKTON(state, amount) {
    const multipliedAmount = state.boostActive ? amount * state.boostMultiplier : amount
    state.planktonPoints += multipliedAmount
  },
  SET_CLICK_VALUE(state, newValue) {
    state.clickValue = newValue
  },
  SET_AUTOSWIM_POWER(state, power) {
    state.autoSwimPower += power
  },
  INCREMENT_TOTAL_CLICKS(state) {
    state.totalClicks++
  },
  EVOLVE(state, level) {
    state.currentEvolution = level
  },
  BUY_UPGRADE(state, upgradeId) {
    const upgrade = state.upgrades.find(u => u.id === upgradeId)
    if (upgrade) {
      upgrade.owned = true
    }
  },
  UNLOCK_ACHIEVEMENT(state, id) {
    const achievement = state.achievements.find(a => a.id === id)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      state.achievementsUnlocked.push(id)
      state.planktonPoints += achievement.reward
      if (window) {
        window.dispatchEvent(new CustomEvent('achievementUnlocked', { 
          detail: { achievement }
        }))
      }
    }
  },
  SET_BOOST(state, { active, multiplier, duration, cooldown }) {
    state.boostActive = active
    state.boostMultiplier = multiplier
    state.boostEndTime = Date.now() + duration
    state.boostCooldownEndTime = Date.now() + cooldown
  },
  END_BOOST(state) {
    state.boostActive = false
    state.boostMultiplier = 1
  }
}

export const actions = {
  increment({ commit, state, dispatch }) {
    commit('INCREMENT_PLANKTON', state.clickValue)
    commit('INCREMENT_TOTAL_CLICKS')
    dispatch('checkEvolution')
    dispatch('checkAchievements')
    dispatch('checkBoostEnd')
  },

  buyUpgrade({ commit, state, dispatch }, upgradeId) {
    const upgrade = state.upgrades.find(u => u.id === upgradeId)
    if (upgrade && 
        !upgrade.owned && 
        state.planktonPoints >= upgrade.cost &&
        state.planktonPoints >= upgrade.unlockAt &&
        state.currentEvolution >= upgrade.evolutionRequired) {
      commit('INCREMENT_PLANKTON', -upgrade.cost)
      commit('BUY_UPGRADE', upgrade.id)

      if (upgrade.type === 'multiplier') {
        commit('SET_CLICK_VALUE', state.clickValue * upgrade.power)
      } else if (upgrade.type === 'auto' || upgrade.type === 'reef') {
        commit('SET_AUTOSWIM_POWER', upgrade.power)
        dispatch('startAutoSwim')
      }
      
      dispatch('checkAchievements')
    }
  },

  checkEvolution({ commit, state }) {
    const evolutionThresholds = {
      2: 1000,      // Small Fish
      3: 10000,     // Medium Fish
      4: 100000,    // Large Fish
      5: 1000000    // Whale
    }

    for (const [level, threshold] of Object.entries(evolutionThresholds)) {
      if (state.planktonPoints >= threshold && state.currentEvolution < level) {
        commit('EVOLVE', parseInt(level))
        // Could dispatch an event for evolution animation/notification
      }
    }
  },

  activateBoost({ commit, state }, boostId) {
    const boost = state.boosts.find(b => b.id === boostId)
    if (boost && 
        state.planktonPoints >= boost.cost && 
        !state.boostActive && 
        Date.now() >= state.boostCooldownEndTime) {
      commit('INCREMENT_PLANKTON', -boost.cost)
      commit('SET_BOOST', {
        active: true,
        multiplier: boost.multiplier,
        duration: boost.duration,
        cooldown: boost.cooldown
      })
    }
  },

  startAutoSwim({ commit, state, dispatch }) {
    if (!this.intervalRef) {
      this.intervalRef = setInterval(() => {
        commit('INCREMENT_PLANKTON', state.autoSwimPower)
        dispatch('checkEvolution')
        dispatch('checkAchievements')
        dispatch('checkBoostEnd')
      }, 1000)
    }
  },

  checkBoostEnd({ state, commit }) {
    if (state.boostActive && Date.now() >= state.boostEndTime) {
      commit('END_BOOST')
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