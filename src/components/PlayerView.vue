<template>
  <div class="player-view" :class="{ 'modal-mode': isModal }">
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
  props: {
    isModal: {
      type: Boolean,
      default: false
    }
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

.player-view.modal-mode {
  height: 100%; /* Full height of the modal */
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}
.tips {
  /* Add your styles here */
}
</style>
