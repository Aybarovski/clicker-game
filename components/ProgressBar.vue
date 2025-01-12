<template>
  <div class="progress-container">
    <div class="progress-label">
      <span>{{ label }}</span>
      <span>{{ formatValue(current) }} / {{ formatValue(target) }}</span>
    </div>
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: `${percentage}%` }"
        :class="{ 'near-complete': percentage >= 90 }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    percentage() {
      return Math.min(100, (this.current / this.target) * 100)
    }
  },
  methods: {
    formatValue(value) {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
      }
      return value
    }
  }
}
</script>

<style scoped>
.progress-container {
  margin: 10px 0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #666;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease-out;
  border-radius: 4px;
}

.progress-fill.near-complete {
  animation: pulse 2s infinite;
  background-color: #f57c00;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
</style> 