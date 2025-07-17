<template>
  <div class="main-container">
    <div class="profile-container">
      <ul class="profile-heading">
        <li class="title-page">Отправка фотографий</li>
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
            <img :src="image.url" :alt="'Image ' + (index + 1)" />
            <button type="button" class="remove-btn" @click="removeImage(index)">×</button>
          </div>

          <div class="upload-rectangle" @click="triggerFileInput">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              @change="handleFileUpload"
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
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL, SITE_URL } from '../api'

const router = useRouter()
const userId = localStorage.getItem('user_id')

const uploadedImages = ref([])
const fileInput = ref(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const files = event.target.files
  if (!files || files.length === 0) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!file.type.startsWith('image/')) continue

    const url = URL.createObjectURL(file)
    uploadedImages.value.push({ file, url })
  }

  setTimeout(() => {
    event.target.value = ''
  }, 100)
}

function removeImage(index) {
  const image = uploadedImages.value[index]
  if (image?.url) URL.revokeObjectURL(image.url)
  uploadedImages.value.splice(index, 1)
}

onUnmounted(() => {
  uploadedImages.value.forEach((img) => URL.revokeObjectURL(img.url))
})

async function submitImages() {
  if (!userId) {
    alert('User ID not found.')
    return
  }

  if (uploadedImages.value.length === 0) {
    alert('Добавьте хотя бы одно изображение.')
    return
  }

  const formData = new FormData()
  uploadedImages.value.forEach((img) => formData.append('images', img.file))

  try {
    const res = await fetch(`${API_URL}/user-image`, {
      method: 'POST',
      headers: {
        'x-user-id': userId,
      },
      body: formData
    })

    const data = await res.json()

    if (res.ok && data.success) {
      uploadedImages.value.forEach((img) => URL.revokeObjectURL(img.url))
      uploadedImages.value = []
      router.push('/profile')
    } else {
      alert('Ошибка загрузки: ' + (data.message || 'Неизвестная ошибка'))
    }
  } catch (err) {
    console.error('Upload error:', err)
    alert('Произошла ошибка при загрузке.')
  }
}
</script>