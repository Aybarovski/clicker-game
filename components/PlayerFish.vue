<template>
  <div class="player-fish" :class="[evolutionClass, { swimming: isSwimming }]">
    <div class="fish-body">
      <div class="fish-tail"></div>
      <div class="fish-fin top"></div>
      <div class="fish-fin bottom"></div>
      <div class="fish-eye"></div>
    </div>
    <div class="bubbles" v-if="showBubbles">
      <div class="bubble" v-for="n in 3" :key="n"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PlayerFish',
  data() {
    return {
      isSwimming: false,
      showBubbles: false
    }
  },
  computed: {
    ...mapState('game', ['currentEvolution']),
    evolutionClass() {
      return `evolution-${this.currentEvolution}`
    }
  },
  methods: {
    swim() {
      this.isSwimming = true
      this.showBubbles = true
      setTimeout(() => {
        this.isSwimming = false
        setTimeout(() => {
          this.showBubbles = false
        }, 500)
      }, 1000)
    }
  }
}
</script>

<style scoped>
.player-fish {
  position: relative;
  width: 60px;
  height: 40px;
  transition: all 0.3s ease;
}

.fish-body {
  position: relative;
  width: 100%;
  height: 100%;
  background: #64b5f6;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transition: all 0.5s ease;
}

.fish-tail {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: #64b5f6;
  clip-path: polygon(0 0, 0 100%, 100% 50%);
}

.fish-fin {
  position: absolute;
  width: 15px;
  height: 10px;
  background: #64b5f6;
  border-radius: 50%;
}

.fish-fin.top {
  top: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(-30deg);
}

.fish-fin.bottom {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(30deg);
}

.fish-eye {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  top: 30%;
  left: 20%;
}

.fish-eye::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: black;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Evolution Styles */
.evolution-1 {
  /* Plankton */
  transform: scale(0.5);
  opacity: 0.8;
}

.evolution-2 {
  /* Small Fish */
  transform: scale(1);
}

.evolution-3 {
  /* Medium Fish */
  transform: scale(1.5);
}

.evolution-4 {
  /* Large Fish */
  transform: scale(2);
}

.evolution-5 {
  /* Whale */
  transform: scale(3);
}

/* Swimming Animation */
.swimming {
  animation: swim 1s ease-in-out;
}

@keyframes swim {
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(5px) rotate(5deg);
  }
  75% {
    transform: translateX(-5px) rotate(-5deg);
  }
}

/* Evolution-specific colors */
.evolution-1 .fish-body,
.evolution-1 .fish-tail,
.evolution-1 .fish-fin {
  background: #90caf9;
}

.evolution-2 .fish-body,
.evolution-2 .fish-tail,
.evolution-2 .fish-fin {
  background: #64b5f6;
}

.evolution-3 .fish-body,
.evolution-3 .fish-tail,
.evolution-3 .fish-fin {
  background: #42a5f5;
}

.evolution-4 .fish-body,
.evolution-4 .fish-tail,
.evolution-4 .fish-fin {
  background: #2196f3;
}

.evolution-5 .fish-body,
.evolution-5 .fish-tail,
.evolution-5 .fish-fin {
  background: #1976d2;
}

/* Bubbles */
.bubbles {
  position: absolute;
  top: 0;
  right: -30px;
  height: 100%;
}

.bubble {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 1s ease-out;
}

.bubble:nth-child(1) { top: 20%; animation-delay: 0s; }
.bubble:nth-child(2) { top: 40%; animation-delay: 0.2s; }
.bubble:nth-child(3) { top: 60%; animation-delay: 0.4s; }

@keyframes float {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-20px) scale(1);
    opacity: 0;
  }
}
</style> 