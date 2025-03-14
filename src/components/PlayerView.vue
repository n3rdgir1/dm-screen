<template>
  <div class="player-view">
    <ImageUpload mode="player"/>
    <ThinkingMode mode="player" />
    <InitiativeTracker mode="player" />
  </div>
</template>

<script>
import { tips } from '../tips';
import ImageUpload from './ImageUpload.vue';
import ThinkingMode from './ThinkingMode.vue';
import InitiativeTracker from './combat/InitiativeTracker.vue';
export default {
  components: {
    ImageUpload,
    ThinkingMode,
    InitiativeTracker,
  },
  data() {
    return {
      tips: tips,
    };
  },
  mounted() {},
  beforeUnmount() {},
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
