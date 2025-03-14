<template>
  <div class="combat-mode">
    <!-- DM View -->
    <div v-if="mode === 'dm'" class="combat-container">
      <div class="combat-header">
        <div class="combat-title">
          <h3>Combat Mode</h3>
          <div class="round-counter">Round: {{ currentRound }}</div>
        </div>
        <div class="combat-controls">
          <button @click="nextTurn" class="next-turn-button">Next Turn</button>
          <button @click="endCombat" class="end-combat-button">End Combat</button>
        </div>
      </div>
      
      <div class="initiative-order">
        <h4>Initiative Order</h4>
        <div class="order-list">
          <!-- Players and individual enemies -->
          <template v-for="(group, groupIndex) in groupedInitiative" :key="'initiative-' + groupIndex">
            <!-- Individual entries for this initiative value -->
            <div v-for="(entity, entityIndex) in group.entities" 
                 :key="'entity-' + groupIndex + '-' + entityIndex"
                 :class="['order-item', entity.isPlayer ? 'player-item' : 'enemy-item', 
                          isCurrentTurn(entity, groupIndex, entityIndex) ? 'current-turn' : '']">
              <!-- For players or enemies with count=1 -->
              <div v-if="entity.isPlayer || entity.count <= 1" class="entity-row">
                <div class="entity-name">
                  {{ entity.name }}
                </div>
                <div class="hp-tracking">
                  <div class="hp-inputs">
                    <input 
                      type="number" 
                      v-model="entity.currentHP" 
                      class="hp-input current-hp" 
                      placeholder="HP"
                      @input="updateEntityHP(entity)"
                    />
                    <span class="hp-separator">/</span>
                    <input 
                      type="number" 
                      v-model="entity.maxHP" 
                      class="hp-input max-hp" 
                      placeholder="Max"
                      @input="updateEntityHP(entity)"
                    />
                    <input 
                      type="number" 
                      v-model="entity.tempHP" 
                      class="hp-input temp-hp" 
                      placeholder="Temp"
                      @input="updateEntityHP(entity)"
                    />
                  </div>
                  <div class="hp-bar-container">
                    <div 
                      class="hp-bar" 
                      :style="{ width: calculateHPPercentage(entity) + '%', backgroundColor: getHPColor(entity) }"
                    ></div>
                  </div>
                </div>
              </div>
              
              <!-- For enemies with count > 1, show individual entries -->
              <div v-else class="enemy-group">
                <div v-for="n in entity.count" 
                     :key="'enemy-' + entityIndex + '-' + n"
                     class="entity-row">
                  <div class="entity-name">{{ entity.name }} {{ n }}</div>
                  <div class="hp-tracking">
                    <div class="hp-inputs">
                      <input 
                        type="number" 
                        v-model="getIndividualEnemy(entity, n - 1).currentHP" 
                        class="hp-input current-hp" 
                        placeholder="HP"
                        @input="updateIndividualEnemyHP(entity, n - 1)"
                      />
                      <span class="hp-separator">/</span>
                      <input 
                        type="number" 
                        v-model="getIndividualEnemy(entity, n - 1).maxHP" 
                        class="hp-input max-hp" 
                        placeholder="Max"
                        @input="updateIndividualEnemyHP(entity, n - 1)"
                      />
                      <input 
                        type="number" 
                        v-model="getIndividualEnemy(entity, n - 1).tempHP" 
                        class="hp-input temp-hp" 
                        placeholder="Temp"
                        @input="updateIndividualEnemyHP(entity, n - 1)"
                      />
                    </div>
                    <div class="hp-bar-container">
                      <div 
                        class="hp-bar" 
                        :style="{ width: calculateHPPercentage(getIndividualEnemy(entity, n - 1)) + '%', backgroundColor: getHPColor(getIndividualEnemy(entity, n - 1)) }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Player View -->
    <div v-if="mode === 'player'" class="combat-container">
      <div class="combat-header">
        <div class="combat-title">
          <h3>Combat</h3>
          <div class="round-counter">Round: {{ currentRound }}</div>
        </div>
      </div>
      
      <div class="initiative-order">
        <h4>Initiative Order</h4>
        <div class="order-list">
          <!-- Players and individual enemies for player view -->
          <template v-for="(group, groupIndex) in groupedInitiativeForPlayers" :key="'player-initiative-' + groupIndex">
            <!-- Individual entries for this initiative value -->
            <div v-for="(entity, entityIndex) in group.entities" 
                 :key="'player-entity-' + groupIndex + '-' + entityIndex"
                 :class="['order-item', entity.isPlayer ? 'player-item' : 'enemy-item',
                          isCurrentTurn(entity, groupIndex, entityIndex) ? 'current-turn' : '']">
              <!-- For players -->
              <div v-if="entity.isPlayer" class="entity-name">
                {{ entity.name }}
              </div>
              
              <!-- For enemies, just show 'Enemy' -->
              <div v-else class="entity-name">
                Enemy
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['mode'],
  data() {
    return {
      players: [],
      enemies: [],
      currentTurnIndex: 0,
      currentRound: 1,
      combatData: {
        currentTurnIndex: 0,
        currentRound: 1,
        timestamp: Date.now()
      },
      individualEnemies: {}, // Stores HP data for individual enemies in groups
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
      
      // Sort by initiative (high to low)
      return allCombatants.sort((a, b) => b.initiative - a.initiative);
    },
    
    // Group entities by initiative value
    groupedInitiative() {
      // First sort all combatants
      const sorted = this.sortedCombatants;
      
      // Group by initiative value
      const groups = [];
      let currentGroup = null;
      
      sorted.forEach(entity => {
        if (!currentGroup || currentGroup.initiative !== entity.initiative) {
          // Start a new group when initiative changes
          currentGroup = {
            initiative: entity.initiative,
            entities: [entity]
          };
          groups.push(currentGroup);
        } else {
          // Add to existing group with same initiative
          currentGroup.entities.push(entity);
        }
      });
      
      return groups;
    },
    playerInitiatives() {
      // Only players with initiative values, sorted by initiative
      return this.players
        .filter(player => player.initiative !== null && player.initiative !== undefined)
        .sort((a, b) => b.initiative - a.initiative);
    },
    
    // Get flattened list of all combatants in initiative order
    flattenedCombatants() {
      let flattened = [];
      this.groupedInitiative.forEach(group => {
        group.entities.forEach(entity => {
          flattened.push({
            ...entity,
            initiative: group.initiative
          });
        });
      });
      return flattened;
    },
    
    // Get the current entity whose turn it is
    currentEntity() {
      if (this.flattenedCombatants.length === 0) return null;
      return this.flattenedCombatants[this.currentTurnIndex];
    },
    
    // For player view - show all combatants but hide enemy names
    groupedInitiativeForPlayers() {
      // Create a simplified version of all combatants for players
      const allCombatants = [
        ...this.players.map(player => ({
          ...player,
          isPlayer: true
        })),
        ...this.enemies.map(enemy => ({
          ...enemy,
          name: 'Enemy', // Replace enemy name with generic 'Enemy'
          isPlayer: false
        }))
      ].filter(entity => entity.initiative !== null && entity.initiative !== undefined);
      
      // Sort by initiative (high to low)
      const sorted = allCombatants.sort((a, b) => b.initiative - a.initiative);
      
      // Group by initiative value
      const groups = [];
      let currentGroup = null;
      
      sorted.forEach(entity => {
        if (!currentGroup || currentGroup.initiative !== entity.initiative) {
          // Start a new group when initiative changes
          currentGroup = {
            initiative: entity.initiative,
            entities: [entity]
          };
          groups.push(currentGroup);
        } else {
          // Add to existing group with same initiative
          currentGroup.entities.push(entity);
        }
      });
      
      return groups;
    }
  },
  methods: {
    isCurrentTurn(entity, groupIndex, entityIndex) {
      // Find the absolute index of this entity in the flattened list
      let absoluteIndex = 0;
      for (let i = 0; i < groupIndex; i++) {
        absoluteIndex += this.groupedInitiative[i].entities.length;
      }
      absoluteIndex += entityIndex;
      
      return absoluteIndex === this.currentTurnIndex;
    },
    
    nextTurn() {
      // Move to the next turn
      this.currentTurnIndex++;
      
      // If we've reached the end of the initiative order, start a new round
      if (this.currentTurnIndex >= this.flattenedCombatants.length) {
        this.currentTurnIndex = 0;
        this.currentRound++;
      }
      
      // Save combat state
      this.saveCombatData();
    },
    
    saveCombatData() {
      const data = {
        currentTurnIndex: this.currentTurnIndex,
        currentRound: this.currentRound,
        timestamp: Date.now()
      };
      localStorage.setItem('combatData', JSON.stringify(data));
      
      // Dispatch event for other tabs/views
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'combatData',
        newValue: JSON.stringify(data)
      }));
      
      // Also save HP data
      this.saveHPData();
    },
    
    loadCombatData() {
      const savedData = localStorage.getItem('combatData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          this.currentTurnIndex = data.currentTurnIndex || 0;
          this.currentRound = data.currentRound || 1;
        } catch (e) {
          console.error('Error parsing combat data:', e);
        }
      }
    },
    
    syncCombatData(event) {
      if (event.key === 'combatData') {
        this.loadCombatData();
      }
    },
    
    // HP tracking methods
    initializeIndividualEnemies(enemy) {
      if (!this.individualEnemies[enemy.name]) {
        this.individualEnemies[enemy.name] = [];
      }
      
      // Ensure we have the right number of individual enemies
      while (this.individualEnemies[enemy.name].length < enemy.count) {
        this.individualEnemies[enemy.name].push({
          currentHP: enemy.currentHP,
          maxHP: enemy.maxHP,
          tempHP: 0
        });
      }
      
      // Trim if we have too many
      if (this.individualEnemies[enemy.name].length > enemy.count) {
        this.individualEnemies[enemy.name] = this.individualEnemies[enemy.name].slice(0, enemy.count);
      }
    },
    
    getIndividualEnemy(enemy, index) {
      if (!this.individualEnemies[enemy.name]) {
        this.initializeIndividualEnemies(enemy);
      }
      
      return this.individualEnemies[enemy.name][index] || { currentHP: null, maxHP: null, tempHP: 0 };
    },
    
    updateEntityHP(entity) {
      // Ensure values are numbers or null
      entity.currentHP = entity.currentHP !== null ? Number(entity.currentHP) : null;
      entity.maxHP = entity.maxHP !== null ? Number(entity.maxHP) : null;
      entity.tempHP = entity.tempHP !== null ? Number(entity.tempHP) : 0;
      
      // For enemies with count > 1, update all individual enemies
      if (!entity.isPlayer && entity.count > 1) {
        this.initializeIndividualEnemies(entity);
        
        // Update all individual enemies with the new values
        this.individualEnemies[entity.name].forEach(individual => {
          if (entity.maxHP !== null) individual.maxHP = entity.maxHP;
          if (entity.currentHP !== null) individual.currentHP = entity.currentHP;
        });
      }
      
      this.saveHPData();
    },
    
    updateIndividualEnemyHP(enemy, index) {
      const individual = this.getIndividualEnemy(enemy, index);
      
      // Ensure values are numbers or null
      individual.currentHP = individual.currentHP !== null ? Number(individual.currentHP) : null;
      individual.maxHP = individual.maxHP !== null ? Number(individual.maxHP) : null;
      
      this.saveHPData();
    },
    
    calculateHPPercentage(entity) {
      if (!entity.currentHP || !entity.maxHP) return 100;
      
      const percentage = (entity.currentHP / entity.maxHP) * 100;
      return Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100
    },
    
    getHPColor(entity) {
      if (!entity.currentHP || !entity.maxHP) return '#4caf50'; // Default green
      
      const percentage = (entity.currentHP / entity.maxHP) * 100;
      
      if (percentage > 50) return '#4caf50'; // Green
      if (percentage > 25) return '#ff9800'; // Orange
      return '#f44336'; // Red
    },
    
    saveHPData() {
      const hpData = {
        players: this.players.map(player => ({
          name: player.name,
          currentHP: player.currentHP,
          maxHP: player.maxHP,
          tempHP: player.tempHP
        })),
        enemies: this.enemies.map(enemy => ({
          name: enemy.name,
          currentHP: enemy.currentHP,
          maxHP: enemy.maxHP,
          tempHP: enemy.tempHP
        })),
        individualEnemies: this.individualEnemies,
        timestamp: Date.now()
      };
      
      localStorage.setItem('combatHPData', JSON.stringify(hpData));
    },
    
    loadHPData() {
      const savedData = localStorage.getItem('combatHPData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          
          // Update player HP
          if (data.players) {
            data.players.forEach(savedPlayer => {
              const player = this.players.find(p => p.name === savedPlayer.name);
              if (player) {
                player.currentHP = savedPlayer.currentHP;
                player.maxHP = savedPlayer.maxHP;
                player.tempHP = savedPlayer.tempHP || 0;
              }
            });
          }
          
          // Update enemy HP
          if (data.enemies) {
            data.enemies.forEach(savedEnemy => {
              const enemy = this.enemies.find(e => e.name === savedEnemy.name);
              if (enemy) {
                enemy.currentHP = savedEnemy.currentHP;
                enemy.maxHP = savedEnemy.maxHP;
                enemy.tempHP = savedEnemy.tempHP || 0;
              }
            });
          }
          
          // Update individual enemies
          if (data.individualEnemies) {
            this.individualEnemies = data.individualEnemies;
          }
          
        } catch (e) {
          console.error('Error parsing HP data:', e);
        }
      }
    },
    
    syncHPData(event) {
      if (event.key === 'combatHPData') {
        this.loadHPData();
      }
    },
    
    endCombat() {
      // Clear combat data when ending combat
      localStorage.removeItem('combatData');
      localStorage.removeItem('combatHPData');
      this.$emit('end-combat');
    },
    loadInitiativeData() {
      const savedData = localStorage.getItem('initiativeData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.players) {
            this.players = data.players;
            
            // Initialize HP values for players if not already set
            this.players.forEach(player => {
              if (player.currentHP === undefined) player.currentHP = null;
              if (player.maxHP === undefined) player.maxHP = null;
              if (player.tempHP === undefined) player.tempHP = 0;
            });
          }
          if (data.enemies) {
            this.enemies = data.enemies;
            
            // Initialize HP values for enemies if not already set
            this.enemies.forEach(enemy => {
              if (enemy.currentHP === undefined) enemy.currentHP = null;
              if (enemy.maxHP === undefined) enemy.maxHP = null;
              if (enemy.tempHP === undefined) enemy.tempHP = 0;
              
              // Initialize individual enemies for groups
              if (enemy.count > 1) {
                this.initializeIndividualEnemies(enemy);
              }
            });
          }
        } catch (e) {
          console.error('Error parsing initiative data:', e);
        }
      }
      
      // Load HP data if available
      this.loadHPData();
    },
    syncInitiativeData(event) {
      if (event.key === 'initiativeData') {
        this.loadInitiativeData();
      }
    }
  },
  mounted() {
    this.loadInitiativeData();
    this.loadCombatData();
    
    // Listen for changes from other tabs/views
    window.addEventListener('storage', this.syncInitiativeData);
    window.addEventListener('storage', this.syncCombatData);
    window.addEventListener('storage', this.syncHPData);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncInitiativeData);
    window.removeEventListener('storage', this.syncCombatData);
    window.removeEventListener('storage', this.syncHPData);
  }
};
</script>

<style scoped>
.combat-mode {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.combat-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.combat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.combat-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.combat-controls {
  display: flex;
  gap: 8px;
}

.round-counter {
  font-size: 0.9em;
  color: #555;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.initiative-order {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-item {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
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

.initiative-value {
  font-weight: bold;
  min-width: 30px;
  margin-right: 12px;
  text-align: center;
}

.enemy-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.enemy-group-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.individual-enemies {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}

.individual-enemy {
  padding: 4px 0;
  border-left: 2px solid #eee;
  padding-left: 8px;
  margin-top: 2px;
  font-size: 0.9em;
  color: #555;
}

.entity-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.entity-name {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  flex: 1;
}

.hp-tracking {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 200px;
}

.hp-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.hp-input {
  width: 45px;
  padding: 2px 4px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.current-hp {
  font-weight: bold;
}

.temp-hp {
  color: #2196f3;
  width: 40px;
}

.hp-separator {
  color: #999;
}

.hp-bar-container {
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  overflow: hidden;
  width: 100%;
}

.hp-bar {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.individual-enemy-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.individual-enemy-name {
  flex: 1;
}

.individual-hp-tracking {
  display: flex;
  align-items: center;
  gap: 4px;
}

.enemy-count {
  font-size: 0.85em;
  color: #666;
  font-weight: normal;
}

.next-turn-button {
  padding: 8px 16px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.end-combat-button {
  padding: 8px 16px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.current-turn {
  background-color: #fffde7;
  border: 1px solid #ffd54f;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

h3, h4 {
  margin: 0;
  color: #333;
}

h4 {
  margin-bottom: 12px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}
</style>
