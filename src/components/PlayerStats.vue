<template>
  <div class="player-stats">
    <div class="player-header">
      <h3>Player Characters</h3>
      <div class="header-actions">
        <button @click="toggleMode" class="toggle-button">
          {{ editMode ? 'View Mode' : 'Edit Mode' }}
        </button>
        <button v-if="editMode" @click="addPlayer" class="add-button">
          <span class="button-icon">+</span> Add Player
        </button>
      </div>
    </div>
    
    <div v-if="players.length === 0" class="empty-state">
      <p>No players added yet. Click "Edit Mode" and then "Add Player" to get started.</p>
    </div>
    
    <div v-else class="player-table-container">
      <table class="player-table">
        <thead>
          <tr>
            <th class="stat-label">Stat</th>
            <template v-for="(player, index) in players" :key="'header-' + index">
              <th class="player-column">
                {{ player.name || 'Unnamed' }}
                <button 
                  v-if="editMode" 
                  @click="removePlayer(index)" 
                  class="remove-player-button"
                  title="Remove player"
                >×</button>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-if="editMode">
            <td class="stat-label">Name</td>
            <template v-for="(player, index) in players" :key="'name-' + index">
              <td>
                <span v-if="!editMode">{{ player.name || 'Unnamed' }}</span>
                <input 
                  v-else 
                  type="text" 
                  v-model="player.name" 
                  @change="savePlayers" 
                  class="text-input"
                  placeholder="Character name"
                />
              </td>
            </template>
          </tr>
          <tr>
            <td class="stat-label">Perception</td>
            <template v-for="(player, index) in players" :key="'perception-' + index">
              <td>
                <span v-if="!editMode" class="stat-value">{{ player.passivePerception }}</span>
                <input 
                  v-else 
                  type="number" 
                  v-model="player.passivePerception" 
                  @change="savePlayers" 
                  class="number-input"
                />
              </td>
            </template>
          </tr>
          <tr>
            <td class="stat-label">Investigation</td>
            <template v-for="(player, index) in players" :key="'investigation-' + index">
              <td>
                <span v-if="!editMode" class="stat-value">{{ player.passiveInvestigation }}</span>
                <input 
                  v-else 
                  type="number" 
                  v-model="player.passiveInvestigation" 
                  @change="savePlayers" 
                  class="number-input"
                />
              </td>
            </template>
          </tr>
          <tr>
            <td class="stat-label">Insight</td>
            <template v-for="(player, index) in players" :key="'insight-' + index">
              <td>
                <span v-if="!editMode" class="stat-value">{{ player.passiveInsight }}</span>
                <input 
                  v-else 
                  type="number" 
                  v-model="player.passiveInsight" 
                  @change="savePlayers" 
                  class="number-input"
                />
              </td>
            </template>
          </tr>
          <tr>
            <td class="stat-label">HP</td>
            <template v-for="(player, index) in players" :key="'hp-' + index">
              <td>
                <span v-if="!editMode" class="stat-value hp-value">{{ player.hp }}</span>
                <input 
                  v-else 
                  type="number" 
                  v-model="player.hp" 
                  @change="savePlayers" 
                  class="number-input"
                />
              </td>
            </template>
          </tr>
          <tr>
            <td class="stat-label">Speed</td>
            <template v-for="(player, index) in players" :key="'speed-' + index">
              <td>
                <span v-if="!editMode" class="stat-value">{{ player.speed }} ft</span>
                <input 
                  v-else 
                  type="number" 
                  v-model="player.speed" 
                  @change="savePlayers" 
                  class="number-input"
                />
              </td>
            </template>
          </tr>
          <tr>
            <td class="stat-label">Darkvision</td>
            <template v-for="(player, index) in players" :key="'darkvision-' + index">
              <td>
                <span v-if="!editMode" class="stat-value">
                  <span :class="{'has-darkvision': player.darkvision}">
                    {{ player.darkvision ? 'Yes' : 'No' }}
                  </span>
                </span>
                <div v-else class="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    :id="'darkvision-' + index" 
                    v-model="player.darkvision" 
                    @change="savePlayers" 
                    class="checkbox-input"
                  />
                  <label :for="'darkvision-' + index">{{ player.darkvision ? 'Yes' : 'No' }}</label>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      players: [],
      editMode: false,
    };
  },
  methods: {
    toggleMode() {
      this.editMode = !this.editMode;
    },
    addPlayer() {
      this.players.push({
        name: '',
        passivePerception: 10,
        passiveInvestigation: 10,
        passiveInsight: 10,
        hp: 10,
        speed: 30,
        darkvision: false,
      });
      this.savePlayers();
    },
    removePlayer(index) {
      if (confirm('Are you sure you want to remove this player?')) {
        this.players.splice(index, 1);
        this.savePlayers();
      }
    },
    savePlayers() {
      localStorage.setItem('players', JSON.stringify(this.players));
      // Dispatch event for other components that might be listening
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'players',
        newValue: JSON.stringify(this.players)
      }));
    },
  },
  mounted() {
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      this.players = JSON.parse(savedPlayers);
    }
  },
};
</script>

<style scoped>
.player-stats {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.player-header h3 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.toggle-button {
  padding: 8px 12px;
  background-color: #4a6da7;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  color: white;
  border-color: #4a6da7;
}

.add-button {
  padding: 8px 12px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #4cae4c;
}

.button-icon {
  font-weight: bold;
  font-size: 1.2em;
}

.player-table-container {
  overflow-x: auto;
  max-width: 100%;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: white;
}

.player-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95em;
}

.player-table th, .player-table td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.player-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  position: relative;
}

.player-table tr:last-child td {
  border-bottom: none;
}

.player-column {
  min-width: 100px;
}

.stat-label {
  text-align: left;
  font-weight: 500;
  color: #555;
  background-color: #f8f9fa;
}

.stat-value {
  font-weight: 500;
}

.hp-value {
  color: #d9534f;
  font-weight: bold;
}

.has-darkvision {
  color: #5bc0de;
}

.text-input, .number-input {
  width: 90%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.number-input {
  width: 60px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.checkbox-input {
  margin: 0;
  cursor: pointer;
}

.checkbox-wrapper label {
  cursor: pointer;
  user-select: none;
}

.remove-player-button {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #d9534f;
  color: white;
  border: none;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.remove-player-button:hover {
  opacity: 1;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px dashed #ddd;
}
</style>
