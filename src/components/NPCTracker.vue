<template>
  <div class="npc-tracker">
    <div class="header">
      <h2>NPCs</h2>
      <button @click="showModal = true">Add NPC</button>
    </div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <form @submit.prevent="addNPC">
          <div>
            <label for="npcName">Name:</label>
            <input type="text" v-model="npcName" id="npcName" required />
          </div>
          <div>
            <label for="npcDescription">Description:</label>
            <textarea v-model="npcDescription" id="npcDescription" required></textarea>
          </div>
          <button type="submit">Save NPC</button>
        </form>
      </div>
    </div>
    <div v-if="npcs.length" class="npc-list">
      <ul>
        <li v-for="(npc, index) in npcs" :key="npc.name">
          <details>
            <summary>{{ npc.name }}</summary>
            <p>{{ npc.description }}</p>
            <button @click="editNPC(index)">Edit</button>
          </details>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      npcName: '',
      npcDescription: '',
      npcs: JSON.parse(localStorage.getItem('npcs')) || [],
      showModal: false,
      editingIndex: null
    };
  },
  methods: {
    addNPC() {
      if (this.npcName && this.npcDescription) {
        if (this.editingIndex !== null) {
          this.npcs[this.editingIndex] = {
            name: this.npcName,
            description: this.npcDescription
          };
          this.editingIndex = null;
        } else {
          this.npcs.push({
            name: this.npcName,
            description: this.npcDescription
          });
        }
        localStorage.setItem('npcs', JSON.stringify(this.npcs));
        this.npcName = '';
        this.npcDescription = '';
        this.showModal = false;
      }
    },
    editNPC(index) {
      this.npcName = this.npcs[index].name;
      this.npcDescription = this.npcs[index].description;
      this.editingIndex = index;
      this.showModal = true;
    }
  }
};
</script>

<style scoped>
.npc-tracker {
  margin: 20px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}
.close {
  float: right;
  font-size: 24px;
  cursor: pointer;
}
.npc-list {
  margin-top: 20px;
}
li {
  list-style-type: none;
}
ul {
  padding-inline-start: 0;
}
</style>
