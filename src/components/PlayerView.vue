<template>
  <div class="player-view">
    <ImageUpload mode="player"/>
    <div v-if="thinkingMode" class="tips">
      <h2>DM Is Thinking...</h2>
      <p>{{ currentTip }}</p>
    </div>
  </div>
</template>

<script>
import { tips } from '../tips';
import ImageUpload from './ImageUpload.vue';
export default {
  components: {
    ImageUpload,
  },
  data() {
    return {
      thinkingMode: false,
      tips: tips,
      currentTip: '',
      thinkingModeInterval: null,
    };
  },
  methods: {
    getRandomTip() {
      const randomIndex = Math.floor(Math.random() * this.tips.length);
      this.currentTip = this.tips[randomIndex];
    },
    checkThinkingMode() {
      // Logic to check if thinking mode is activated
      console.log('Checking thinking mode...');
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
.player-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  text-align: center;
  flex-direction: column;
}
.tips {
  /* Add your styles here */
}
</style>
