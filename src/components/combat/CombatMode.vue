<template>
  <div class="combat-mode">
    <div v-if="mode === 'dm'">
      <button @click="endCombat">End Combat</button>
    </div>
    <div v-if="mode === 'player'">
      <div>Combat Started</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['mode'],
  methods: {
    endCombat() {
      this.$emit('end-combat');
    }
  }
};
</script>

<style scoped>
.combat-mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>
