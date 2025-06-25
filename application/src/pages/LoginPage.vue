<template>
  <div class="auth-container">
    <div class="login-container">
      <div class="space"></div>

      <div class="logo">
        <img src="/images/logo.png" width="117px" height="104px" />
      </div>

      <span class="text">
        Пожалуйста, нажмите кнопку, чтобы получить доступ к приложению
      </span>

      <div class="inline-space"></div>

      <form class="form" @submit.prevent="loginWithTelegram">
        <button type="submit" class="button" :disabled="loading">
          <template v-if="loading">
            <svg
              class="spinner"
              width="24"
              height="24"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke-width="5"
              />
            </svg>
          </template>
          <template v-else>
            Войти через Telegram
          </template>
        </button>
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

<style scoped>
.spinner {
  animation: spin 1s linear infinite;
}

.path {
  stroke: white;
  stroke-linecap: round;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>