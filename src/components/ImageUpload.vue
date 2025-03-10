<template>
  <div>
    <input v-if="mode === 'dm'" type="file" @change="onFileChange" accept="image/*" />
    <button v-if="mode === 'dm' && imageUrl" @click="removeImage">Remove Image</button>
    <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" />
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
img {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
}
</style>
