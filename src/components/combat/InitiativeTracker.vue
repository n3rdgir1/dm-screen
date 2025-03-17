<template>
  <div class="initiative-tracker">
    <div v-if="currentView === 'off' && mode === 'dm'">
      <h3>Initiative Tracker</h3>
      <div class="action-buttons">
        <button @click="rollInitiative" class="roll-initiative-button">Roll Initiative</button>
      </div>
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

      localStorage.removeItem('individualEnemies');
      localStorage.removeItem('initiativeData');
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
  width: 100%;
  gap: 16px;
}

.initiative-start-container {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h3 {
  margin: 0;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4a6da7;
  color: white;
  font-weight: bold;
}

.roll-initiative-button {
  background-color: #5cb85c;
  font-size: 1em;
}
</style>
