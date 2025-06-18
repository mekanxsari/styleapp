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

      <!-- Telegram environment check message -->
      <p v-if="!isTelegram" class="text" style="color: red;">
        ❌ Пожалуйста, откройте это приложение из Telegram.
      </p>
      <p v-else class="text" style="color: green;">
        ✅ Telegram WebApp обнаружен
      </p>

      <form class="form" @submit.prevent="loginWithTelegram">
        <input
          type="submit"
          class="button"
          value="Войти через Telegram"
          :disabled="!isTelegram"
        />
      </form>

      <p v-if="error" class="text" style="color: red;">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script>
import { API_URL } from '../api';

export default {
  data() {
    return {
      error: '',
      isTelegram: false
    };
  },
  mounted() {
    if (window.Telegram?.WebApp) {
      this.isTelegram = true;
      window.Telegram.WebApp.ready();
    }
  },
  methods: {
    async loginWithTelegram() {
      this.error = '';

      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

      if (!tgUser) {
        this.error = 'Вход только через Telegram.';
        return;
      }

      if (!tgUser.username) {
        this.error = 'Пожалуйста, установите свой Alias в настройках Telegram.';
        return;
      }

      const alias = tgUser.username;
      try {
        const response = await fetch(`${API_URL}/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alias })
        });
        const result = await response.json();
        if (result.success) {
          localStorage.setItem('session_token', result.token);
          this.$router.push('/');
        } else {
          this.error = result.reason || 'Ошибка авторизации';
        }
      } catch (err) {
        this.error = 'Ошибка сервера';
      }
    }
  }
};
</script>
