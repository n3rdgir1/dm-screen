<template>
  <!-- DM View -->
  <button v-if="mode === 'dm'" @click="toggleThinkingMode" :class="thinkingMode ? 'stop-thinking-button' : 'start-thinking-button'">
    {{ thinkingMode ? 'Stop Thinking Mode' : 'Start Thinking Mode' }}
  </button>
  
  <!-- Thinking Section (visible in both DM and player views) -->
  <div v-if="thinkingMode && mode === 'player'" class="thinking-section">
    <h3 class="tip-title">{{ currentTip }}</h3>
    <p class="thinking-status">DM Is Thinking...</p>
  </div>
</template>

<script>
import { tips } from '../tips';

export default {
  props: ['mode'],
  data() {
    return {
      thinkingMode: false,
      tips: tips, // Use imported tips
      currentTip: '',
      thinkingModeInterval: null,
    };
  },
  methods: {
    toggleThinkingMode() {
      this.thinkingMode = !this.thinkingMode;
      localStorage.setItem('thinkingMode', this.thinkingMode);
      if (this.thinkingMode) {
        this.getRandomTip();
      }
    },
    getRandomTip() {
      const randomIndex = Math.floor(Math.random() * this.tips.length);
      this.currentTip = this.tips[randomIndex];
    },
    checkThinkingMode() {
      this.thinkingMode = localStorage.getItem('thinkingMode') === 'true';
      if (this.thinkingMode) {
        this.getRandomTip();
      }
    },
  },
  mounted() {
    this.checkThinkingMode();
    this.thinkingModeInterval = setInterval(this.checkThinkingMode, 5000);
  },
  beforeUnmount() {
    clearInterval(this.thinkingModeInterval);
  },
};
</script>

<style scoped>

.thinking-header {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.thinking-section {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h3 {
  margin: 0;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.tip-title {
  font-size: 1.2em;
  margin-top: 0;
  border-bottom: none;
}

.thinking-status {
  font-style: italic;
  color: #888;
  padding: 8px;
  text-align: center;
  font-size: 1.1em;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4a6da7;
  color: white;
  font-weight: bold;
}

.start-thinking-button {
  background-color: #5cb85c;
  font-size: 1em;
}

.stop-thinking-button {
  background-color: #d9534f;
  font-size: 1em;
}

.player-thinking-placeholder {
  min-height: 10px; /* Minimal height when not active */
}
</style>
