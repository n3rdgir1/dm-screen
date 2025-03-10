<template>
  <div class="dm-screen">
    <h1>DM Screen</h1>
    <button @click="openPlayerView">Open Player View</button>
    <button @click="toggleThinkingMode">{{ thinkingMode ? 'Stop Thinking Mode' : 'Start Thinking Mode' }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      thinkingMode: false,
    };
  },
  methods: {
    openPlayerView() {
      window.open('/player-view', '_blank');
    },
    toggleThinkingMode() {
      this.thinkingMode = !this.thinkingMode;
      localStorage.setItem('thinkingMode', this.thinkingMode);
    },
  },
  mounted() {
    this.thinkingMode = localStorage.getItem('thinkingMode') === 'true';
  },
};
</script>

<style scoped>
.dm-screen {
  /* Add your styles here */
}
</style>
