<template>
  <div class="dm-screen">
    <div class="header">
      <h1>DM Screen</h1>
      <button @click="openPlayerView">Open Player View</button>
    </div>
    <div class="card-container">
      <div class="card">
        <ThinkingMode mode="dm" />
      </div>
      <div class="card">
        <ImageUpload @image-uploaded="setImageUrl" mode="dm"/>
      </div>
      <div class="card">
        <PlayerStats />
      </div>
      <div class="card">
        <NPCTracker />
      </div>
      <div class="card">
        <InitiativeTracker mode="dm" />
      </div>
    </div>
  </div>
</template>

<script>
import PlayerStats from './PlayerStats.vue';
import NPCTracker from './NPCTracker.vue';
import ImageUpload from './ImageUpload.vue';
import ThinkingMode from './ThinkingMode.vue';
import InitiativeTracker from './InitiativeTracker.vue';

export default {
  components: {
    PlayerStats,
    NPCTracker,
    ImageUpload,
    ThinkingMode,
    InitiativeTracker,
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 calc(50% - 16px);
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
}
</style>
