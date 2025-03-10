<template>
  <div>
    <button v-if="mode === 'dm'" @click="toggleThinkingMode">{{ thinkingMode ? 'Stop Thinking Mode' : 'Start Thinking Mode' }}</button>
    <div v-if="thinkingMode" class="tips">
      <h2>DM Is Thinking...</h2>
      <p>{{ currentTip }}</p>
    </div>
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
.tips {
  /* Add your styles here */
}
</style>
