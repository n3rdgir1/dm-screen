<template>
  <div class="player-stats">
    <h2>Player Stats</h2>
    <button @click="toggleMode">{{ editMode ? 'View' : 'Edit' }}</button>
    <button v-if="editMode" @click="addPlayer">Add Player</button>
    <table>
      <thead>
        <tr>
          <th></th>
          <template v-for="(player, index) in players" :key="'header-' + index">
            <th>{{ player.name }}</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-if="editMode">
          <td>Name</td>
          <template v-for="(player, index) in players" :key="'name-' + index">
            <td>
              <input type="text" v-model="player.name" @change="savePlayers" />
            </td>
          </template>
        </tr>
        <tr>
          <td>Perception</td>
          <template v-for="(player, index) in players" :key="'perception-' + index">
            <td>
              <span v-if="!editMode">{{ player.passivePerception }}</span>
              <input v-else type="number" v-model="player.passivePerception" @change="savePlayers" />
            </td>
          </template>
        </tr>
        <tr>
          <td>Investigation</td>
          <template v-for="(player, index) in players" :key="'investigation-' + index">
            <td>
              <span v-if="!editMode">{{ player.passiveInvestigation }}</span>
              <input v-else type="number" v-model="player.passiveInvestigation" @change="savePlayers" />
            </td>
          </template>
        </tr>
        <tr>
          <td>Insight</td>
          <template v-for="(player, index) in players" :key="'insight-' + index">
            <td>
              <span v-if="!editMode">{{ player.passiveInsight }}</span>
              <input v-else type="number" v-model="player.passiveInsight" @change="savePlayers" />
            </td>
          </template>
        </tr>
        <tr>
          <td>HP</td>
          <template v-for="(player, index) in players" :key="'hp-' + index">
            <td>
              <span v-if="!editMode">{{ player.hp }}</span>
              <input v-else type="number" v-model="player.hp" @change="savePlayers" />
            </td>
          </template>
        </tr>
        <tr>
          <td>Speed</td>
          <template v-for="(player, index) in players" :key="'speed-' + index">
            <td>
              <span v-if="!editMode">{{ player.speed }}</span>
              <input v-else type="number" v-model="player.speed" @change="savePlayers" />
            </td>
          </template>
        </tr>
        <tr>
          <td>Darkvision</td>
          <template v-for="(player, index) in players" :key="'darkvision-' + index">
            <td>
              <span v-if="!editMode">{{ player.darkvision ? 'Yes' : 'No' }}</span>
              <input v-else type="checkbox" v-model="player.darkvision" @change="savePlayers" />
            </td>
          </template>
        </tr>
      </tbody>
    </table>
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
        passivePerception: 0,
        passiveInvestigation: 0,
        passiveInsight: 0,
        hp: 0,
        speed: 0,
        darkvision: false,
      });
      this.savePlayers();
    },
    removePlayer(index) {
      this.players.splice(index, 1);
      this.savePlayers();
    },
    savePlayers() {
      localStorage.setItem('players', JSON.stringify(this.players));
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
  margin-top: 20px;
}
.player {
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
.player label {
  display: block;
  margin-bottom: 5px;
}
</style>
