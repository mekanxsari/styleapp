<template>
  <div class="auth-container">
    <div class="login-container">
      <div class="space"></div>

      <div class="logo">
        <img src="/images/logo.png" width="117px" height="104px" />
      </div>

      <span class="text" v-if="!requirePasscode">
        Пожалуйста, нажмите кнопку, чтобы получить доступ к приложению
      </span>

      <div class="inline-space"></div>

      <form class="form" v-if="!requirePasscode" @submit.prevent="loginWithTelegram">
        <button type="submit" class="button" :disabled="loading">
          <template v-if="loading">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="white" stroke-width="4" stroke-linecap="round"
                stroke-dasharray="113" stroke-dashoffset="80">
                <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s"
                  repeatCount="indefinite" />
              </circle>
            </svg>
          </template>
          <template v-else>
            Войти через Telegram
          </template>
        </button>
      </form>

      <form v-if="requirePasscode" class="form" @submit.prevent="submitPasscode">
        <input type="password" v-model="passcode" placeholder="Введите код доступа" class="input" />
        <button class="button" :disabled="loading">
          <template v-if="loading">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="white" stroke-width="4" stroke-linecap="round"
                stroke-dasharray="113" stroke-dashoffset="80">
                <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s"
                  repeatCount="indefinite" />
              </circle>
            </svg>
          </template>
          <template v-else>
            Подтвердить
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

const requirePasscode = ref(false)
const passcode = ref('')
const tempSession = ref(null)
const tempUserId = ref(null)

async function loginWithTelegram() {
  const alias = window.Telegram?.WebApp?.initDataUnsafe?.user?.username

  if (!alias) {
    error.value = 'Установите свой alias Telegram в настройках.'
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
      if (result.hasPasscode) {
        requirePasscode.value = true
        tempSession.value = result.token
        tempUserId.value = result.id
      } else {
        localStorage.setItem('session_token', result.token)
        localStorage.setItem('user_id', result.id)
        await router.push('/')
      }
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

async function submitPasscode() {
  if (!passcode.value) {
    error.value = 'Введите код'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetch(`${API_URL}/auth/verify-passcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tempSession.value,
        id: tempUserId.value,
        passcode: passcode.value
      })
    })

    const result = await res.json()
    if (result.success) {
      localStorage.setItem('session_token', tempSession.value)
      localStorage.setItem('user_id', tempUserId.value)
      await router.push('/')
    } else {
      error.value = result.reason || 'Неверный код'
    }
  } catch (err) {
    error.value = 'Ошибка сервера'
  } finally {
    loading.value = false
  }
}
</script>