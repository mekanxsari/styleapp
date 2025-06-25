<template>
  <div class="auth-container">
    <div class="login-container">
      <div class="space"></div>
      <div class="logo">
        <img src="/public/images/logo.png" width="117px" height="104px" />
      </div>

      <span class="text">
        Пожалуйста, нажмите кнопку, чтобы получить доступ к приложению
      </span>

      <div class="inline-space"></div>

      <form class="form" @submit.prevent="loginWithTelegram">
        <input
          type="submit"
          class="button"
          :value="loading ? 'Загрузка...' : 'Войти через Telegram'"
          :disabled="loading"
        />
      </form>

      <p v-if="error" class="text">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '../api'

const router = useRouter()
const error = ref('')
const loading = ref(false)

async function loginWithTelegram() {
  const alias = window.Telegram?.WebApp?.initDataUnsafe?.user?.username

  if (!alias) {
    error.value = 'Telegram username not available.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias })
    })

    const result = await response.json()

    if (result.success) {
      localStorage.setItem('session_token', result.token)
      localStorage.setItem('user_id', result.id)
      await router.push('/')
    } else {
      error.value = result.reason || 'Authentication failed'
    }
  } catch (err) {
    error.value = 'Server error'
    console.error('Login failed:', err)
  } finally {
    loading.value = false
  }
}
</script>
