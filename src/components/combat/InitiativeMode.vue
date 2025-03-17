<template>
  <div class="initiative-mode">
    <div v-if="mode === 'dm'">
      <div class="initiative-sections">
        <!-- Players Section -->
        <div class="initiative-section">
          <h3>Players</h3>
          <div class="initiative-list">
            <div v-for="(player, index) in players" :key="'player-' + index" class="initiative-item">
              <div class="initiative-name">{{ player.name }}</div>
              <div class="initiative-controls">
                <input 
                  type="number" 
                  v-model="player.initiative" 
                  class="initiative-input" 
                  placeholder="Init"
                  @input="saveInitiativeData"
                />
              </div>
            </div>
            <div v-if="players.length === 0" class="empty-message">
              No players found. Add players in the Player Stats component.
            </div>
          </div>
        </div>

        <!-- Enemies Section -->
        <div class="initiative-section">
          <h3>Enemies</h3>
          <div class="add-enemy">
            <input 
              type="text" 
              v-model="newEnemyName" 
              placeholder="Enemy name" 
              class="enemy-name-input"
            />
            <input 
              type="number" 
              v-model="newEnemyModifier" 
              placeholder="Init modifier" 
              class="enemy-modifier-input"
            />
            <input 
              type="number" 
              v-model="newEnemyCount" 
              placeholder="Count" 
              class="enemy-count-input"
              min="1"
            />
            <input 
              type="number" 
              v-model="newEnemyHP" 
              placeholder="HP" 
              class="enemy-hp-input"
              min="1"
            />
            <button @click="addEnemy" class="add-button">Add</button>
          </div>
          <div class="initiative-list">
            <div v-for="(enemy, index) in enemies" :key="'enemy-' + index" class="initiative-item">
              <div class="initiative-name">
                {{ enemy.name }}
                <span v-if="enemy.count > 1" class="enemy-count">({{ enemy.count }})</span>
              </div>
              <div class="initiative-controls">
                <input 
                  type="number" 
                  v-model="enemy.initiative" 
                  class="initiative-input" 
                  placeholder="Init"
                />
                <input 
                  type="number" 
                  v-model="enemy.count" 
                  class="count-input" 
                  min="1"
                  @input="saveInitiativeData"
                />
                <input 
                  type="number" 
                  v-model="enemy.maxHP" 
                  class="enemy-hp-input" 
                  placeholder="HP"
                  @input="saveInitiativeData"
                />
                <div class="hide-control">
                  <input 
                    type="checkbox" 
                    v-model="enemy.hiddenFromPlayers" 
                    @change="saveInitiativeData"
                  />
                  <label>Hidden</label>
                </div>
                <button @click="rollForEntity(enemy)" class="roll-button">Roll</button>
                <button @click="removeEnemy(index)" class="remove-button">×</button>
              </div>
            </div>
            <div v-if="enemies.length === 0" class="empty-message">
              No enemies added yet.
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="rollForAll" class="roll-all-button">Roll For Enemies</button>
        <button @click="startCombat" class="start-combat-button" :disabled="!canStartCombat">
          Start Combat
        </button>
        <button @click="closeInitiative" class="close-button">
          Close
        </button>
      </div>
      
      <!-- Encounter Manager Component -->
      <EncounterManager 
        :current-enemies="enemies" 
        @load-encounter="loadEncounterEnemies"
      />
    </div>

    <div v-if="mode === 'player'">
      <div class="initiative-order">
        <h3>Roll for Initiative</h3>
        <div class="order-list">
          <div 
            v-for="(player, index) in playerInitiatives" 
            :key="'order-' + index"
            class="order-item player-item"
          >
            <span class="initiative-value">{{ player.initiative }}</span>
            <span class="entity-name">{{ player.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EncounterManager from './EncounterManager.vue';

export default {
  components: {
    EncounterManager
  },
  props: ['mode'],
  data() {
    return {
      players: [],
      enemies: [],
      newEnemyName: '',
      newEnemyModifier: null,
      newEnemyCount: null,
      newEnemyHP: null,
      initiativeData: {
        players: [],
        enemies: []
      }
    };
  },
  computed: {
    sortedCombatants() {
      const allCombatants = [
        ...this.players.map(player => ({
          ...player,
          isPlayer: true
        })),
        ...this.enemies.map(enemy => ({
          ...enemy,
          isPlayer: false
        }))
      ].filter(entity => entity.initiative !== null && entity.initiative !== undefined);
      
      return allCombatants.sort((a, b) => b.initiative - a.initiative);
    },
    playerInitiatives() {
      // Only players with initiative values, sorted by initiative
      return this.players
        .filter(player => player.initiative !== null && player.initiative !== undefined)
        .sort((a, b) => b.initiative - a.initiative);
    },
    canStartCombat() {
      return this.sortedCombatants.length > 0;
    }
  },
  methods: {
    startCombat() {
      // Save the initiative order before starting combat
      this.saveInitiativeData();
      this.$emit('start-combat');
    },
    
    closeInitiative() {
      // Emit close event to parent component
      this.$emit('close-initiative');
    },
    
    saveInitiativeData() {
      const data = {
        players: this.players,
        enemies: this.enemies,
        timestamp: Date.now()
      };
      localStorage.setItem('initiativeData', JSON.stringify(data));
      // Dispatch event for other tabs/views
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'initiativeData',
        newValue: JSON.stringify(data)
      }));
    },
    loadPlayers() {
      const savedPlayers = localStorage.getItem('players');
      if (savedPlayers) {
        const playerData = JSON.parse(savedPlayers);
        this.players = playerData.map(player => ({
          ...player,
          initiative: null,
          currentHP: player.hp,
          maxHP: player.hp,
          tempHP: 0
        }));
      }
    },
    addEnemy() {
      if (this.newEnemyName.trim()) {
        this.enemies.push({
          name: this.newEnemyName.trim(),
          initiativeModifier: this.newEnemyModifier || 0,
          initiative: null,
          count: Math.max(1, parseInt(this.newEnemyCount) || 1),
          maxHP: this.newEnemyHP || null,
          currentHP: this.newEnemyHP || null,
          tempHP: 0
        });
        this.newEnemyName = '';
        this.newEnemyModifier = null;
        this.newEnemyCount = null;
        this.newEnemyHP = null;
        
        // Save after adding enemy
        this.saveInitiativeData();
      }
    },
    removeEnemy(index) {
      this.enemies.splice(index, 1);
      
      // Save after removing enemy
      this.saveInitiativeData();
    },
    rollDice(sides) {
      return Math.floor(Math.random() * sides) + 1;
    },
    rollForEntity(entity) {
      const d20 = this.rollDice(20);
      const modifier = entity.initiativeModifier || 0;
      entity.initiative = d20 + modifier;
      
      // Save after each roll to update player view
      if (this.mode === 'dm') {
        this.saveInitiativeData();
      }
    },
    rollForAll() {
      // DM only rolls for enemies, not players
      // Group enemies by name to handle shared initiative
      const enemyGroups = {};
      
      // First, organize enemies into groups by name
      this.enemies.forEach(enemy => {
        if (!enemyGroups[enemy.name]) {
          enemyGroups[enemy.name] = [];
        }
        enemyGroups[enemy.name].push(enemy);
      });
      
      // Roll once for each unique enemy name
      Object.values(enemyGroups).forEach(group => {
        if (group.length > 0) {
          // Roll initiative for the first enemy in the group
          const d20 = this.rollDice(20);
          const modifier = group[0].initiativeModifier || 0;
          const initiativeValue = d20 + modifier;
          
          // Apply the same initiative to all enemies with the same name
          group.forEach(enemy => {
            enemy.initiative = initiativeValue;
          });
        }
      });
      
      // Save after rolling all
      if (this.mode === 'dm') {
        this.saveInitiativeData();
      }
    },
    
    loadEncounterEnemies(enemies) {
      // Clear existing enemies
      this.enemies = [];
      
      // Add enemies from the loaded encounter
      enemies.forEach(enemy => {
        this.enemies.push({
          ...enemy,
          initiative: null // Reset initiative for new combat
        });
      });
      
      // Save the updated initiative data
      this.saveInitiativeData();
    },
    
    loadInitiativeData() {
      const savedData = localStorage.getItem('initiativeData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.players) {
            // If we're in DM mode, we already loaded players from PlayerStats
            // Just update their initiative values
            if (this.mode === 'dm') {
              this.players.forEach(player => {
                const savedPlayer = data.players.find(p => p.name === player.name);
                if (savedPlayer && savedPlayer.initiative !== undefined) {
                  player.initiative = savedPlayer.initiative;
                }
              });
            } else {
              // In player mode, we need the full player data
              this.players = data.players;
            }
          }
          if (data.enemies) {
            this.enemies = data.enemies;
          }
        } catch (e) {
          console.error('Error parsing initiative data:', e);
        }
      }
    },
    
    syncInitiativeData(event) {
      if (event.key === 'initiativeData') {
        this.loadInitiativeData();
      }
    }
  },
  mounted() {
    if (this.mode === 'dm') {
      this.loadPlayers();
    }
    this.loadInitiativeData();
    
    // Listen for changes from other tabs/views
    window.addEventListener('storage', this.syncInitiativeData);
  },
  
  beforeUnmount() {
    window.removeEventListener('storage', this.syncInitiativeData);
  }
};
</script>

<style scoped>
.initiative-mode {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}

.initiative-sections {
  display: flex;
  gap: 20px;
  width: 100%;
}

.initiative-section {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  background-color: #f9f9f9;
}

h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.initiative-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.initiative-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #eee;
}

.initiative-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.initiative-input {
  width: 60px;
  padding: 4px;
  text-align: center;
}

.enemy-name-input {
  flex: 2;
  padding: 6px;
}

.enemy-modifier-input, .enemy-count-input, .enemy-hp-input, .count-input {
  width: 60px;
  padding: 6px;
  text-align: center;
}

.add-enemy {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4a6da7;
  color: white;
  font-weight: bold;
}

.roll-button {
  background-color: #5cb85c;
}

.remove-button {
  background-color: #d9534f;
  padding: 2px 8px;
  font-size: 16px;
}

.add-button {
  background-color: #5bc0de;
}

.empty-message {
  font-style: italic;
  color: #888;
  padding: 8px;
}

.initiative-order {
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  background-color: #f9f9f9;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  background-color: white;
  border-left: 4px solid #ccc;
}

.player-item {
  border-left-color: #4a6da7;
}

.enemy-item {
  border-left-color: #d9534f;
}

.enemy-count {
  font-size: 0.85em;
  color: #666;
  font-weight: normal;
}

.initiative-value {
  font-weight: bold;
  min-width: 30px;
  text-align: center;
  margin-right: 12px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.roll-all-button {
  background-color: #f0ad4e;
}

.start-combat-button {
  background-color: #d9534f;
}

.start-combat-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.close-button {
  background-color: #d9534f;
}

.player-initiative {
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>
