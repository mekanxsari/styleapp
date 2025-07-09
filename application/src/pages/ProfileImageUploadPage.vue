<template>
  <div class="main-container">
    <div class="profile-container">
      <ul class="profile-heading">
        <li class="title-page">Отправка фотографий</li>
        <li class="spisok"><a href="#">Мои списки</a></li>
      </ul>
    </div>

    <div class="upload-container">
      <form class="upload-form" @submit.prevent="submitImages">
        <div class="images-list">
          <div
            v-for="(image, index) in uploadedImages"
            :key="index"
            class="image-item"
          >
            <img :src="image.url" :alt="'Uploaded image ' + (index + 1)" />
            <button
              @click="removeImage(index)"
              class="remove-btn"
              type="button"
            >
              ×
            </button>
          </div>

          <div class="upload-rectangle" @click="triggerFileInput">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              accept="image/*"
              multiple
              style="display: none"
            />
            <p>Добавить</p>
          </div>
        </div>

        <button type="submit" class="upload">Подтвердить</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '../api'

const router = useRouter()
const userId = localStorage.getItem('user_id')

const uploadedImages = ref([])
const fileInput = ref(null)

function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

function handleFileUpload(event) {
  const files = event.target.files
  if (!files || files.length === 0) {
    alert('Файл не выбран.')
    return
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (!file.type.startsWith('image/')) {
      continue // skip non-images
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      uploadedImages.value.push({
        url: e.target.result,
        file: file,
      })
    }

    reader.onerror = (err) => {
      console.error('FileReader error:', err)
      alert('Ошибка при чтении изображения.')
    }

    reader.readAsDataURL(file)
  }

  // Do not reset immediately — allow browser to handle it
  // On some mobile browsers (Telegram webview especially), resetting too early breaks previews
  setTimeout(() => {
    event.target.value = ''
  }, 100)
}

function removeImage(index) {
  uploadedImages.value.splice(index, 1)
}

async function submitImages() {
  if (uploadedImages.value.length === 0) {
    alert('Пожалуйста, добавьте хотя бы одно изображение.')
    return
  }

  if (!userId) {
    alert('User ID not found. Please log in.')
    return
  }

  const formData = new FormData()
  uploadedImages.value.forEach((imageObj) => {
    formData.append('images', imageObj.file)
  })

  try {
    const response = await fetch(`${API_URL}/user-image`, {
      method: 'POST',
      headers: {
        'x-user-id': userId,
      },
      body: formData,
    })

    const data = await response.json()

    if (response.ok && data.success) {
      uploadedImages.value = []
      router.push('/profile')
    } else {
      alert('Ошибка при загрузке: ' + (data.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('Ошибка при отправке:', error)
    alert('Произошла ошибка при отправке данных.')
  }
}
</script>