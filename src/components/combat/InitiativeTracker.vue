<template>
  <div class="initiative-tracker">
    <div v-if="currentView === 'off' && mode === 'dm'">
      <button @click="rollInitiative">Roll Initiative</button>
    </div>
    <InitiativeMode 
      v-if="currentView === 'initiative'" 
      :mode="mode" 
      @start-combat="startCombat" 
    />
    <CombatMode 
      v-if="currentView === 'combat'" 
      :mode="mode" 
      @end-combat="endCombat" 
    />
  </div>
</template>

<script>
import InitiativeMode from './InitiativeMode.vue';
import CombatMode from './CombatMode.vue';

export default {
  components: {
    InitiativeMode,
    CombatMode
  },
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
