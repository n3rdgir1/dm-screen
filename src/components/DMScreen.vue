<template>
  <div class="dm-screen">
    <h1>DM Screen</h1>
    <button @click="openPlayerView">Open Player View</button>
    <button @click="toggleThinkingMode">{{ thinkingMode ? 'Stop Thinking Mode' : 'Start Thinking Mode' }}</button>
    <ImageUpload @image-uploaded="setImageUrl" mode="dm"/>
    <PlayerStats />
    <NPCTracker />
  </div>
</template>

<script>
import PlayerStats from './PlayerStats.vue';
import NPCTracker from './NPCTracker.vue';
import ImageUpload from './ImageUpload.vue';

export default {
  components: {
    PlayerStats,
    NPCTracker,
    ImageUpload,
  },
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
