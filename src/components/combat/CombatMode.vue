<template>
  <div class="combat-mode">
    <!-- DM View -->
    <div v-if="mode === 'dm'" class="combat-container">
      <div class="combat-header">
        <h3>Combat Mode</h3>
        <button @click="endCombat" class="end-combat-button">End Combat</button>
      </div>
      
      <div class="initiative-order">
        <h4>Initiative Order</h4>
        <div class="order-list">
          <div 
            v-for="(entity, index) in sortedCombatants" 
            :key="'combat-' + index"
            :class="['order-item', entity.isPlayer ? 'player-item' : 'enemy-item']"
          >
            <span class="initiative-value">{{ entity.initiative }}</span>
            <span class="entity-name">
              {{ entity.name }}
              <span v-if="!entity.isPlayer && entity.count > 1" class="enemy-count">({{ entity.count }})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Player View -->
    <div v-if="mode === 'player'" class="combat-container">
      <div class="combat-header">
        <h3>Combat Started</h3>
      </div>
      
      <div class="initiative-order">
        <h4>Initiative Order</h4>
        <div class="order-list">
          <div 
            v-for="(player, index) in playerInitiatives" 
            :key="'player-combat-' + index"
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
export default {
  props: ['mode'],
  data() {
    return {
      players: [],
      enemies: [],
      currentTurn: 0
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
    }
  },
  methods: {
    endCombat() {
      this.$emit('end-combat');
    },
    loadInitiativeData() {
      const savedData = localStorage.getItem('initiativeData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.players) {
            this.players = data.players;
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
  align-items: center;
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

.entity-name {
  display: flex;
  align-items: center;
  gap: 5px;
}

.enemy-count {
  font-size: 0.85em;
  color: #666;
  font-weight: normal;
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
