<template>
  <div class="dm-screen">
    <div class="fixed-header">
      <h1>DM Screen</h1>
      <div class="header-buttons">
        <ThinkingMode mode="dm" />
        <div class="dropdown">
          <button class="dropdown-toggle" @click.stop="toggleDropdown">
            <span>Menu</span>
            <span class="dropdown-icon">▼</span>
          </button>
          <div class="dropdown-menu" v-show="dropdownOpen" @click.stop>
            <a href="#" @click.prevent="openPlayerView">Open Player View</a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="content">
      <!-- Tab Navigation -->
      <div class="tabs">
        <button 
          @click="switchTab('dashboard')" 
          :class="['tab-button', { active: activeTab === 'dashboard' }]">
          <span class="tab-icon">📊</span> Dashboard
        </button>
        <button 
          @click="switchTab('combat')" 
          :class="['tab-button', { active: activeTab === 'combat' }]">
          <span class="tab-icon">⚔️</span> Combat
        </button>
      </div>
      
      <!-- Dashboard Tab Content -->
      <div v-if="activeTab === 'dashboard'" class="tab-content">
        <!-- Dashboard Sections -->
        <div class="dashboard-section">
          <h2 class="section-title">Game Resources</h2>
          <div class="card-container">
            <div class="card">
              <ImageUpload @image-uploaded="setImageUrl" mode="dm"/>
            </div>
          </div>
        </div>
        
        <div class="dashboard-section">
          <h2 class="section-title">Character Management</h2>
          <div class="card-container">
            <div class="card">
              <PlayerStats />
            </div>
            <div class="card">
              <NPCTracker />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Combat Tab Content -->
      <div v-if="activeTab === 'combat'" class="tab-content">
        <div class="dashboard-section">
          <h2 class="section-title">Combat Management</h2>
          <div class="combat-container">
            <div class="card combat-card">
              <InitiativeTracker mode="dm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerStats from './PlayerStats.vue';
import NPCTracker from './NPCTracker.vue';
import ImageUpload from './ImageUpload.vue';
import ThinkingMode from './ThinkingMode.vue';
import InitiativeTracker from './combat/InitiativeTracker.vue';

export default {
  components: {
    PlayerStats,
    NPCTracker,
    ImageUpload,
    ThinkingMode,
    InitiativeTracker,
  },
  data() {
    return {
      activeTab: 'dashboard',
      dropdownOpen: false,
    };
  },
  methods: {
    openPlayerView() {
      window.open('/player-view', '_blank');
      this.dropdownOpen = false;
    },
    toggleDropdown(event) {
      // Prevent the click from propagating to the document
      if (event) event.stopPropagation();
      this.dropdownOpen = !this.dropdownOpen;
    },
    handleClickOutside(event) {
      const dropdown = this.$el.querySelector('.dropdown');
      if (dropdown && !dropdown.contains(event.target) && this.dropdownOpen) {
        this.dropdownOpen = false;
      }
    },
    switchTab(tab) {
      this.activeTab = tab;
      // Save the active tab to localStorage for persistence between sessions
      localStorage.setItem('dmScreenActiveTab', tab);
    },
  },
  mounted() {
    // Load the previously active tab from localStorage if available
    const savedTab = localStorage.getItem('dmScreenActiveTab');
    if (savedTab) {
      this.activeTab = savedTab;
    }
    
    // Add click outside listener for dropdown
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    // Remove click outside listener when component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
.dm-screen {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4a6da7;
  color: white;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.fixed-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 16px; /* Space between buttons */
}

.header-buttons button {
  height: 36px; /* Fixed height for all buttons */
  padding: 0 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dropdown Menu Styling */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  background-color: #4a6da7;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-toggle:hover {
  background-color: #3c5a8a;
}

.dropdown-icon {
  font-size: 0.8em;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  min-width: 180px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  z-index: 1001;
  margin-top: 4px;
}

.dropdown-menu a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.2s;
}

.dropdown-menu a:hover {
  background-color: #f5f5f5;
  color: #4a6da7;
}

.content {
  margin-top: 80px; /* Space for the fixed header */
  padding: 0 20px 20px;
  overflow-y: auto;
  flex: 1;
}

/* Tabs Styling */
.tabs {
  display: flex;
  border-bottom: 2px solid #4a6da7;
  margin-bottom: 20px;
  padding: 0 10px;
}

.tab-button {
  padding: 12px 24px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 8px 8px 0 0;
  margin-right: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #555;
  border: 1px solid #ddd;
  border-bottom: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button:hover {
  background-color: #e9e9e9;
}

.tab-button.active {
  background-color: white;
  color: #4a6da7;
  border: 1px solid #4a6da7;
  border-bottom: 2px solid white;
  margin-bottom: -2px;
  font-weight: bold;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
}

.tab-icon {
  font-size: 1.2em;
}

.tab-content {
  padding: 10px 0;
}

.dashboard-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.3rem;
  color: #4a6da7;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

/* Card Styling */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  /* flex: 1 1 calc(50% - 16px); */
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  min-width: 300px;
}

.combat-container {
  display: flex;
  width: 100%;
}

.combat-card {
  flex: 1 1 100%;
  min-height: 500px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  background-color: #fcfcfc;
}
</style>
