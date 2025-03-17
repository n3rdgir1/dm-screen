<template>
  <div class="initiative-tracker">
    <div v-if="currentView === 'off' && mode === 'dm'">
      <h3>Initiative Tracker</h3>
      <div class="action-buttons">
        <button @click="rollInitiative" class="roll-initiative-button">Roll Initiative</button>
        <button @click="manageEncounters" class="manage-encounters-button" v-if="!showEncounterManager">Manage Encounters</button>
        <button @click="hideEncounterManager" class="hide-button" v-if="showEncounterManager">Hide Encounters</button>
      </div>
      <EncounterManager 
        v-if="showEncounterManager"
        :current-enemies="[]"
        @load-encounter="loadEncounterAndRoll"
      />
    </div>
    <InitiativeMode 
      v-if="currentView === 'initiative'" 
      :mode="mode" 
      @start-combat="startCombat"
      @close-initiative="endCombat"
      ref="initiativeMode"
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
import EncounterManager from './EncounterManager.vue';

export default {
  components: {
    InitiativeMode,
    CombatMode,
    EncounterManager
  },
  props: ['mode'],
  data() {
    return {
      currentView: localStorage.getItem('initiativeTrackerView') || 'off',
      showEncounterManager: false,
      encounterToLoad: null
    };
  },
  methods: {
    rollInitiative() {
      this.currentView = 'initiative';
      this.updateInitiativeState();
    },
    manageEncounters() {
      this.showEncounterManager = true;
    },
    hideEncounterManager() {
      this.showEncounterManager = false;
    },
    loadEncounterAndRoll(enemies) {
      this.encounterToLoad = enemies;
      this.rollInitiative();
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
    
    // Pass the encounter to the initiative mode if needed
    this.$nextTick(() => {
      if (this.encounterToLoad && this.currentView === 'initiative') {
        // Use $refs to access the InitiativeMode component
        const initiativeMode = this.$refs.initiativeMode;
        if (initiativeMode) {
          initiativeMode.loadEncounterEnemies(this.encounterToLoad);
          this.encounterToLoad = null;
        }
      }
    });
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

.manage-encounters-button {
  background-color: #4a6da7;
  font-size: 1em;
}

.hide-button {
  background-color: #f0ad4e;
  font-size: 1em;
}

.close-button {
  background-color: #d9534f;
  font-size: 1em;
}
</style>
