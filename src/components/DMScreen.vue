<template>
  <div class="dm-screen">
    <h1>DM Screen</h1>
    <button @click="openPlayerView">Open Player View</button>
    <ThinkingMode mode="dm" />
    <ImageUpload @image-uploaded="setImageUrl" mode="dm"/>
    <PlayerStats />
    <NPCTracker />
  </div>
</template>

<script>
import PlayerStats from './PlayerStats.vue';
import NPCTracker from './NPCTracker.vue';
import ImageUpload from './ImageUpload.vue';
import ThinkingMode from './ThinkingMode.vue';

export default {
  components: {
    PlayerStats,
    NPCTracker,
    ImageUpload,
    ThinkingMode,
  },
  data() {
    return {
    };
  },
  methods: {
    openPlayerView() {
      window.open('/player-view', '_blank');
    },
  },
};
</script>

<style scoped>
.dm-screen {
  /* Add your styles here */
}
</style>
