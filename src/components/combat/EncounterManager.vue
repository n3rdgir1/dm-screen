<template>
  <div class="encounter-manager">
    <h3>Encounter Manager</h3>
    
    <!-- Create New Encounter Section -->
    <div class="encounter-form">
      <input 
        type="text" 
        v-model="newEncounterName" 
        placeholder="Encounter name" 
        class="encounter-name-input"
      />
      <button 
        @click="saveCurrentAsEncounter" 
        class="save-encounter-button" 
        :disabled="!canSaveEncounter"
      >
        Save Current as Encounter
      </button>
    </div>
    
    <!-- Saved Encounters Section -->
    <div class="saved-encounters">
      <h4>Saved Encounters</h4>
      <div v-if="savedEncounters.length === 0" class="empty-message">
        No saved encounters. Create one by adding enemies and saving in the Roll Initiative section.
      </div>
      <div v-else class="encounter-list">
        <div 
          v-for="(encounter, index) in savedEncounters" 
          :key="'encounter-' + index" 
          class="encounter-item"
        >
          <div class="encounter-details">
            <div class="encounter-name">{{ encounter.name }}</div>
            <div class="encounter-info">
              {{ encounter.enemies.length }} enemies
            </div>
          </div>
          <div class="encounter-actions">
            <button @click="loadEncounter(index)" class="load-button">Load</button>
            <button @click="deleteEncounter(index)" class="delete-button">×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentEnemies: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      newEncounterName: '',
      savedEncounters: [],
    };
  },
  computed: {
    canSaveEncounter() {
      return this.newEncounterName.trim() !== '' && this.currentEnemies.length > 0;
    }
  },
  methods: {
    saveCurrentAsEncounter() {
      if (!this.canSaveEncounter) return;
      
      const encounter = {
        name: this.newEncounterName.trim(),
        enemies: JSON.parse(JSON.stringify(this.currentEnemies)),
        timestamp: Date.now()
      };
      
      this.savedEncounters.push(encounter);
      this.saveEncountersToStorage();
      this.newEncounterName = '';
    },
    
    loadEncounter(index) {
      if (index >= 0 && index < this.savedEncounters.length) {
        const encounter = this.savedEncounters[index];
        this.$emit('load-encounter', encounter.enemies);
      }
    },
    
    deleteEncounter(index) {
      if (index >= 0 && index < this.savedEncounters.length) {
        this.savedEncounters.splice(index, 1);
        this.saveEncountersToStorage();
      }
    },
    
    saveEncountersToStorage() {
      localStorage.setItem('savedEncounters', JSON.stringify(this.savedEncounters));
      // Dispatch event for other tabs/views
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'savedEncounters',
        newValue: JSON.stringify(this.savedEncounters)
      }));
    },
    
    loadEncountersFromStorage() {
      const savedEncounters = localStorage.getItem('savedEncounters');
      if (savedEncounters) {
        try {
          this.savedEncounters = JSON.parse(savedEncounters);
        } catch (e) {
          console.error('Error parsing saved encounters:', e);
          this.savedEncounters = [];
        }
      }
    },
    
    syncEncounters(event) {
      if (event.key === 'savedEncounters') {
        try {
          this.savedEncounters = JSON.parse(event.newValue || '[]');
        } catch (e) {
          console.error('Error parsing saved encounters from storage event:', e);
        }
      }
    }
  },
  mounted() {
    this.loadEncountersFromStorage();
    window.addEventListener('storage', this.syncEncounters);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncEncounters);
  }
};
</script>

<style scoped>
.encounter-manager {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h3, h4 {
  margin: 0;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

h4 {
  font-size: 1em;
  margin-bottom: 8px;
}

.encounter-form {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.encounter-name-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-encounter-button {
  padding: 8px 16px;
  background-color: #4a6da7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save-encounter-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.encounter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.encounter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.encounter-details {
  display: flex;
  flex-direction: column;
}

.encounter-name {
  font-weight: bold;
}

.encounter-info {
  font-size: 0.8em;
  color: #666;
}

.encounter-actions {
  display: flex;
  gap: 8px;
}

.load-button {
  padding: 4px 8px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button {
  padding: 4px 8px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty-message {
  color: #666;
  font-style: italic;
  margin-top: 8px;
}
</style>
