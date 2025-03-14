<template>
  <div class="initiative-mode">
    <div v-if="mode === 'dm'">
      <button @click="startCombat">Start Combat</button>
    </div>
    <div v-if="mode === 'player'">
      <div>Roll Initiative</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['mode'],
  methods: {
    startCombat() {
      this.$emit('start-combat');
    }
  }
};
</script>

<style scoped>
.initiative-mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>
