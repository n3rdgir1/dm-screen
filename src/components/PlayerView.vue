<template>
  <div class="player-view">
    <div v-if="thinkingMode" class="tips">
      <h2>DM Is Thinking...</h2>
      <p>{{ currentTip }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      thinkingMode: false,
      tips: [
        "Tip 1: Always check for traps.",
        "Tip 2: Communicate with your party.",
        "Tip 3: Keep track of your inventory.",
        // Add more tips here
      ],
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
  /* Add your styles here */
}
.tips {
  /* Add your styles here */
}
</style>
