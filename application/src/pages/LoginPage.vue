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
          value="Войти через Telegram"
        />
      </form>

      <p v-if="error" class="text">
        {{ error }}
      </p>
    </div>
  </div>
</template>
<script>
import { API_URL } from '../api'

export default {
  data() {
    return {
      error: ''
    }
  },
  methods: {
    async loginWithTelegram() {
      const alias = window.Telegram?.WebApp?.initDataUnsafe?.user?.username

      if (!alias) {
        this.error = 'Telegram username not available.'
        return
      }

      try {
        const response = await fetch(`${API_URL}/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alias })
        })

        const result = await response.json()

        if (result.success) {
          localStorage.setItem('session_token', result.token)
          console.log(result.token);
          localStorage.setItem('user_id', result.id)
          console.log(resul.id);
          this.$router.push('/')
        } else {
          this.error = result.reason || 'Authentication failed'
        }
      } catch (err) {
        this.error = 'Server error'
        console.error('Login failed:', err)
      }
    }
  }
}
</script>
