<template>
  <div class="image-tracker">
    <div v-if="mode === 'dm'" class="image-header">
      <h3>Image Display</h3>
      <div class="image-controls">
        <label class="upload-button">
          <span>Upload Image</span>
          <input type="file" @change="onFileChange" accept="image/*" class="file-input" />
        </label>
        <button v-if="imageUrl" @click="removeImage" class="remove-button">Remove</button>
      </div>
    </div>
    
      <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" class="display-image" />
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imageUrl: localStorage.getItem('uploadedImageUrl') || null,
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageUrl = URL.createObjectURL(file);
        localStorage.setItem('uploadedImageUrl', this.imageUrl);
        this.$emit('image-uploaded', this.imageUrl);
      }
    },
    removeImage() {
      this.imageUrl = null;
      localStorage.removeItem('uploadedImageUrl');
      this.$emit('image-uploaded', null);
    },
    syncImageUrl(event) {
      if (event.key === 'uploadedImageUrl') {
        this.imageUrl = event.newValue;
      }
    },
  },
  mounted() {
    window.addEventListener('storage', this.syncImageUrl);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncImageUrl);
  },
};
</script>

<style scoped>
.image-tracker {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}

.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.image-header h3 {
  margin: 0;
  color: #333;
  padding-bottom: 8px;
}

.image-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.upload-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: #4a6da7;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.upload-button:hover {
  background-color: #3a5d97;
}

.file-input {
  display: none;
}

.remove-button {
  padding: 8px 16px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: #c9302c;
}

.image-container {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f8f8f8;
  position: relative;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.display-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.no-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.placeholder-text {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>
