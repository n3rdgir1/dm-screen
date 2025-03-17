<template>
  <div class="npc-tracker">
    <div class="npc-header">
      <h3>NPCs</h3>
      <button @click="showModal = true" class="add-npc-button">Add NPC</button>
    </div>
    
    <!-- Modal for adding/editing NPCs -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingIndex !== null ? 'Edit NPC' : 'Add New NPC' }}</h3>
          <span class="close" @click="showModal = false">&times;</span>
        </div>
        <form @submit.prevent="addNPC" class="npc-form">
          <div class="form-group">
            <label for="npcName">Name:</label>
            <input type="text" v-model="npcName" id="npcName" required class="form-input" />
          </div>
          <div class="form-group">
            <label for="npcDescription">Description:</label>
            <textarea 
              v-model="npcDescription" 
              id="npcDescription" 
              required 
              class="form-textarea"
              rows="5"
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showModal = false" class="cancel-button">Cancel</button>
            <button type="submit" class="save-button">Save NPC</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- NPC List -->
    <div class="npc-list-container">
      <div v-if="npcs.length" class="npc-list">
        <div 
          v-for="(npc, index) in npcs" 
          :key="npc.name"
          class="npc-item"
        >
          <details class="npc-details">
            <summary class="npc-summary">{{ npc.name }}</summary>
            <div class="npc-content">
              <p class="npc-description">{{ npc.description }}</p>
              <div class="npc-actions">
                <button @click="editNPC(index)" class="edit-button">Edit</button>
                <button @click="removeNPC(index)" class="delete-button">Delete</button>
              </div>
            </div>
          </details>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No NPCs added yet. Click the "Add NPC" button to create one.</p>
      </div>
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
    },
    removeNPC(index) {
      if (confirm('Are you sure you want to delete this NPC?')) {
        this.npcs.splice(index, 1);
        localStorage.setItem('npcs', JSON.stringify(this.npcs));
      }
    }
  }
};
</script>

<style scoped>
.npc-tracker {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}

.npc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.npc-header h3 {
  margin: 0;
  color: #333;
}

.add-npc-button {
  padding: 8px 16px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.add-npc-button:hover {
  background-color: #4cae4c;
}

/* Modal Styles */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1100;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #4a6da7;
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: white;
}

.close {
  font-size: 24px;
  cursor: pointer;
  color: white;
  transition: color 0.2s;
}

.close:hover {
  color: #ddd;
}

/* Form Styles */
.npc-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #e9ecef;
}

.save-button {
  padding: 8px 16px;
  background-color: #4a6da7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #3a5d97;
}

/* NPC List Styles */
.npc-list-container {
  overflow-y: auto;
  max-height: 400px;
}

.npc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.npc-item {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
}

.npc-details {
  width: 100%;
}

.npc-summary {
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 500;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.npc-summary:hover {
  background-color: #e9ecef;
}

.npc-content {
  padding: 16px;
}

.npc-description {
  margin-top: 0;
  margin-bottom: 16px;
  color: #555;
  white-space: pre-line;
}

.npc-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.edit-button {
  padding: 6px 12px;
  background-color: #5bc0de;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #46b8da;
}

.delete-button {
  padding: 6px 12px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background-color: #c9302c;
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
