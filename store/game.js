// Vuex "game" module
// Achievement condition checkers
const achievementConditions = {
  reach100: (state) => state.stimulation >= 100,
  reach1000: (state) => state.stimulation >= 1000,
  reach10000: (state) => state.stimulation >= 10000,
  clicks100: (state) => state.totalClicks >= 100,
  upgrader: (state) => state.upgrades.filter(u => u.owned).length >= 3
}

export const state = () => ({
  stimulation: 0,
  clickValue: 1,
  autoClickPower: 0,
  totalClicks: 0,
  boostActive: false,
  boostMultiplier: 1,
  boostEndTime: 0,
  boostCooldownEndTime: 0,
  boosts: [
    {
      id: 'boost2x',
      name: 'Double Power',
      description: 'Double your click and auto-click power for 30 seconds',
      cost: 150,
      multiplier: 2,
      duration: 30000,
      cooldown: 60000
    },
    {
      id: 'boost3x',
      name: 'Triple Power',
      description: 'Triple your click and auto-click power for 15 seconds',
      cost: 300,
      multiplier: 3,
      duration: 15000,
      cooldown: 90000
    }
  ],
  achievementsUnlocked: [],
  achievements: [
    {
      id: 'reach100',
      name: 'Getting Started',
      description: 'Reach 100 stimulation',
      unlocked: false,
      reward: 50
    },
    {
      id: 'reach1000',
      name: 'Stimulation Master',
      description: 'Reach 1,000 stimulation',
      unlocked: false,
      reward: 200
    },
    {
      id: 'reach10000',
      name: 'Stimulation God',
      description: 'Reach 10,000 stimulation',
      unlocked: false,
      reward: 1000
    },
    {
      id: 'clicks100',
      name: 'Dedicated Clicker',
      description: 'Click 100 times',
      unlocked: false,
      reward: 100
    },
    {
      id: 'upgrader',
      name: 'Upgrade Enthusiast',
      description: 'Own 3 different upgrades',
      unlocked: false,
      reward: 150
    }
  ],
  upgrades: [
    {
      id: 'autoclick1',
      name: 'Auto-Clicker I',
      cost: 50,
      owned: false,
      type: 'auto',
      power: 1
    },
    {
      id: 'autoclick2',
      name: 'Auto-Clicker II',
      cost: 200,
      owned: false,
      type: 'auto',
      power: 2
    },
    {
      id: 'multi1',
      name: 'Double Click Value',
      cost: 100,
      owned: false,
      type: 'multiplier',
      power: 2
    },
    {
      id: 'multi2',
      name: 'Triple Click Value',
      cost: 300,
      owned: false,
      type: 'multiplier',
      power: 3
    }
  ]
})

export const mutations = {
  INCREMENT_STIMULATION(state, amount) {
    const multipliedAmount = state.boostActive ? amount * state.boostMultiplier : amount
    state.stimulation += multipliedAmount
  },
  SET_CLICK_VALUE(state, newValue) {
    state.clickValue = newValue
  },
  SET_AUTOCLICK_POWER(state, power) {
    state.autoClickPower += power
  },
  INCREMENT_TOTAL_CLICKS(state) {
    state.totalClicks++
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
      state.stimulation += achievement.reward
      // Emit a custom event when achievement is unlocked
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
    commit('INCREMENT_STIMULATION', state.clickValue)
    commit('INCREMENT_TOTAL_CLICKS')
    dispatch('checkAchievements')
    dispatch('checkBoostEnd')
  },

  buyUpgrade({ commit, state, dispatch }, upgradeId) {
    const upgrade = state.upgrades.find(u => u.id === upgradeId)
    if (upgrade && !upgrade.owned && state.stimulation >= upgrade.cost) {
      commit('INCREMENT_STIMULATION', -upgrade.cost)
      commit('BUY_UPGRADE', upgrade.id)

      if (upgrade.type === 'multiplier') {
        commit('SET_CLICK_VALUE', state.clickValue * upgrade.power)
      } else if (upgrade.type === 'auto') {
        commit('SET_AUTOCLICK_POWER', upgrade.power)
        dispatch('startAutoClick')
      }
      
      dispatch('checkAchievements')
    }
  },

  activateBoost({ commit, state }, boostId) {
    const boost = state.boosts.find(b => b.id === boostId)
    if (boost && 
        state.stimulation >= boost.cost && 
        !state.boostActive && 
        Date.now() >= state.boostCooldownEndTime) {
      commit('INCREMENT_STIMULATION', -boost.cost)
      commit('SET_BOOST', {
        active: true,
        multiplier: boost.multiplier,
        duration: boost.duration,
        cooldown: boost.cooldown
      })
    }
  },

  startAutoClick({ commit, state, dispatch }) {
    if (!this.intervalRef) {
      this.intervalRef = setInterval(() => {
        commit('INCREMENT_STIMULATION', state.autoClickPower)
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