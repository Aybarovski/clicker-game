<template>
  <transition name="slide-fade">
    <div v-if="show" class="achievement-notification">
      <div class="achievement-icon">💡</div>
      <div class="achievement-content">
        <div class="achievement-title">{{ achievement.name }}</div>
        <div class="achievement-reward">+{{ achievement.reward }} stimulation</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AchievementNotification',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    achievement: {
      type: Object,
      default: () => ({
        name: '',
        reward: 0
      })
    }
  }
}
</script>

<style scoped>
.achievement-notification {
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 250px;
}

.achievement-icon {
  font-size: 28px;
  background: rgba(255, 255, 255, 0.2);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.achievement-reward {
  font-size: 14px;
  opacity: 0.9;
}

/* Transition animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style> 