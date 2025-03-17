<template>
  <div class="entity-row">
    <div class="entity-name" :class="{ 'entity-defeated': localEntity.currentHP === 0 }">
      {{ localEntity.name }}
    </div>
    <div class="hp-tracking">
      <div class="hp-inputs">
        <input type="number" v-model="localEntity.currentHP" class="hp-input current-hp" placeholder="HP"
          @input="updateHP()" />
        <span class="hp-separator">/</span>
        <input type="number" v-model="localEntity.maxHP" class="hp-input max-hp" placeholder="Max"
          @input="updateHP()" />
        <input type="number" v-model="localEntity.tempHP" class="hp-input temp-hp" placeholder="Temp"
          @input="updateHP()" />
        <input type="number" class="hp-input hp-modify" placeholder="±HP"
          @change="handleHPChange($event.target.value)" @blur="$event.target.value = ''" />
      </div>
      <div class="hp-bar-container">
        <div class="hp-bar"
          :style="{ width: calculateHPPercentage() + '%', backgroundColor: getHPColor() }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['entity'],
  data() {
    return {
      localEntity: {}
    };
  },
  created() {
    // Create a deep copy of the entity prop when component is created
    this.localEntity = JSON.parse(JSON.stringify(this.entity));
  },
  watch: {
    // Update local copy when prop changes
    entity: {
      handler(newValue) {
        this.localEntity = JSON.parse(JSON.stringify(newValue));
      },
      deep: true
    }
  },
  methods: {
    updateHP() {
      // Ensure values are numbers or null
      this.localEntity.currentHP = this.localEntity.currentHP !== null ? Number(this.localEntity.currentHP) : null;
      this.localEntity.maxHP = this.localEntity.maxHP !== null ? Number(this.localEntity.maxHP) : null;
      this.localEntity.tempHP = this.localEntity.tempHP !== null ? Number(this.localEntity.tempHP) : 0;

      // Ensure currentHP doesn't exceed maxHP
      if (this.localEntity.currentHP !== null && this.localEntity.maxHP !== null && this.localEntity.currentHP > this.localEntity.maxHP) {
        this.localEntity.currentHP = this.localEntity.maxHP;
      }

      // Ensure HP values don't go below 0
      if (this.localEntity.currentHP !== null && this.localEntity.currentHP < 0) this.localEntity.currentHP = 0;
      if (this.localEntity.maxHP !== null && this.localEntity.maxHP < 0) this.localEntity.maxHP = 0;
      if (this.localEntity.tempHP < 0) this.localEntity.tempHP = 0;

      // For enemies with count > 1, update all individual enemies
      if (!this.localEntity.isPlayer && this.localEntity.count > 1) {
        this.$emit('initialize-individual-enemies', this.localEntity);
      }

      // Emit the updated entity to parent component
      this.$emit('update:entity', this.localEntity);
      this.$emit('save-hp-data');
    },
    modifyHP(amount) {
      if (!this.localEntity || this.localEntity.currentHP === null || this.localEntity.maxHP === null) return;

      // Healing
      if (amount > 0) {
        this.localEntity.currentHP = Math.min(this.localEntity.maxHP, this.localEntity.currentHP + amount);
      }
      // Damage
      else if (amount < 0) {
        const damage = Math.abs(amount);
        // Apply damage to temp HP first
        if (this.localEntity.tempHP > 0) {
          if (this.localEntity.tempHP >= damage) {
            this.localEntity.tempHP -= damage;
          } else {
            const remainingDamage = damage - this.localEntity.tempHP;
            this.localEntity.tempHP = 0;
            this.localEntity.currentHP = Math.max(0, this.localEntity.currentHP - remainingDamage);
          }
        } else {
          this.localEntity.currentHP = Math.max(0, this.localEntity.currentHP - damage);
        }
      }

      this.updateHP();
    },

    handleHPChange(amount) {
      const value = parseInt(amount);
      if (!isNaN(value)) {
        this.modifyHP(value);
      }
    },

    getHPColor() {
      // If currentHP is exactly 0, return red
      if (this.localEntity.currentHP === 0) return '#f44336'; // Red for 0 HP
      
      if (!this.localEntity.currentHP || !this.localEntity.maxHP) return '#4caf50'; // Default green
      
      const percentage = (this.localEntity.currentHP / this.localEntity.maxHP) * 100;
      
      if (percentage > 50) return '#4caf50'; // Green
      if (percentage > 25) return '#ff9800'; // Orange
      return '#f44336'; // Red
    },
    
    calculateHPPercentage() {
      if (!this.localEntity.currentHP || !this.localEntity.maxHP) return 100;

      const percentage = (this.localEntity.currentHP / this.localEntity.maxHP) * 100;
      return Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100
    },
  }

};
</script>

<style scoped>

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

.entity-defeated {
  color: #888; /* Grey color for defeated entities */
  text-decoration: line-through;
  opacity: 0.7;
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
  flex-wrap: wrap;
}
.hp-modify {
  width: 60px;
  background-color: #2c3e50;
  color: white;
  border: 1px solid #34495e;
  text-align: center;
  margin-left: 4px;
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
</style>