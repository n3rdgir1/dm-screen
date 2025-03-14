<template>
  <div class="initiative-tracker">
    <div v-if="mode === 'dm'">
      <button v-if="currentView === 'off'" @click="rollInitiative">Roll Initiative</button>
      <button v-if="currentView === 'initiative'" @click="startCombat">Start Combat</button>
      <button v-if="currentView === 'combat'" @click="endCombat">End Combat</button>
    </div>
    <div v-if="mode === 'player'">
      <div v-if="currentView === 'initiative'">Roll Initiative</div>
      <div v-if="currentView === 'combat'">Combat Started</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['mode'],
  data() {
    return {
      currentView: localStorage.getItem('initiativeTrackerView') || 'off',
    };
  },
  methods: {
    rollInitiative() {
      this.currentView = 'initiative';
      this.updateInitiativeState();
    },
    startCombat() {
      this.currentView = 'combat';
      this.updateInitiativeState();
    },
    endCombat() {
      this.currentView = 'off';
      this.updateInitiativeState();
    },
    updateInitiativeState() {
      localStorage.setItem('initiativeTrackerView', this.currentView);
      // Dispatch a custom event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'initiativeTrackerView',
        newValue: this.currentView
      }));
    },
    syncInitiativeState(event) {
      if (event.key === 'initiativeTrackerView') {
        this.currentView = event.newValue;
      }
    }
  },
  mounted() {
    window.addEventListener('storage', this.syncInitiativeState);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncInitiativeState);
  },
};
</script>

<style scoped>
.initiative-tracker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>
