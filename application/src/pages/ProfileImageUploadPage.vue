<template>
  <div class="main-container">
    <div class="profile-container">
      <ul class="profile-heading">
        <li class="title-page">Отправка фотографий</li>
        <li class="spisok"><a href="#">Мои списки</a></li>
      </ul>
    </div>

    <div class="upload-container">
      <form class="upload-form" @submit.prevent>
        <div class="images-list">
          <div
            v-for="(image, index) in uploadedImages"
            :key="index"
            class="image-item"
          >
            <img :src="image.url" :alt="'Uploaded image ' + (index + 1)" />
            <button @click="removeImage(index)" class="remove-btn" type="button">×</button>
          </div>

          <div class="upload-rectangle" @click="triggerFileInput">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              accept="image/*"
              style="display: none"
            />
            <p>Добавлять</p>
          </div>
        </div>

        <!-- ✅ Button is placed separately under the image list -->
        <button type="submit" class="upload">Подтверждать</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageUploader",
  data() {
    return {
      uploadedImages: []
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImages.push({
            url: e.target.result,
            file: files[0]
          });
        };
        reader.readAsDataURL(files[0]);
      }
      event.target.value = '';
    },
    removeImage(index) {
      this.uploadedImages.splice(index, 1);
    }
  }
};
</script>
