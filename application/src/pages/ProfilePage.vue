<template>
  <div class="main-container">
    <div class="profile-container">
      <ul class="profile-heading">
        <li class="username">{{ userDisplayName }}</li>
        <li class="spisok">
          <router-link to="/profile/my-list">Мои списки</router-link>
        </li>
      </ul>

      <div class="profile-img">
        <img :src="profileImageUrl" class="profile-img-source" alt="User Photo" />
      </div>

      <ul class="menu-options">
        <li>
          <router-link to="/likes">Лайки</router-link>
        </li>
        <li>
          <router-link to="/profile/personal">Персональные данные</router-link>
        </li>
        <li>
          <router-link to="/profile/sizes">Ваши размеры</router-link>
        </li>
        <li>
          <router-link to="/profile/additional">Дополнительные вопросы</router-link>
        </li>
        <li>
          <router-link to="/profile/upload">Отправка фотографий</router-link>
        </li>
        <li class="logout">
          <a href="#" @click.prevent="logout">Выйти</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL, SITE_URL } from '../api'

const profileImageUrl = ref('')
const router = useRouter()
const userDisplayName = ref('')

onMounted(() => {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user

  if (tgUser && tgUser.photo_url) {
    profileImageUrl.value = tgUser.photo_url
  } else {
    profileImageUrl.value = 'https://via.placeholder.com/150'
  }
})

function logout() {
  localStorage.removeItem('session_token')
  localStorage.removeItem('user_id')
  router.push('/login')
}

async function fetchUser() {
  const userId = localStorage.getItem('user_id')
  if (!userId) return

  try {
    const res = await fetch(`${API_URL}/user-profile`, {
      headers: {
        'x-user-id': userId
      }
    })
    const data = await res.json()

    if (data.success) {
      const { full_name, alias } = data.user
      userDisplayName.value = full_name?.trim() ? full_name : `@${alias}`
    } else {
      console.error(data.message)
    }
  } catch (err) {
    console.error('Error fetching user:', err)
  }
}

onMounted(fetchUser)
</script>

