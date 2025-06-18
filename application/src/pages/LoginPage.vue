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
import { API_URL } from '../api';

export default {
  data() {
    return {
      error: '',
      tgUser: null,
    };
  },

  mounted() {
    // Attempt to load Telegram WebApp user data
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      this.tgUser = window.Telegram.WebApp.initDataUnsafe.user;
      window.Telegram.WebApp.ready(); // optional: marks app as ready
    } else {
      this.error = '❌ Пожалуйста, откройте это приложение из Telegram.';
    }
  },

  methods: {
    async loginWithTelegram() {
      this.error = '';

      if (!this.tgUser) {
        this.error = '❌ Пожалуйста, откройте это приложение из Telegram.';
        return;
      }

      if (!this.tgUser.username) {
        this.error = 'Пожалуйста, установите свой Alias в настройках Telegram.';
        return;
      }

      const alias = this.tgUser.username;

      try {
        const response = await fetch(`${API_URL}/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alias }),
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem('session_token', result.token);
          this.$router.push('/');
        } else {
          this.error = result.reason || 'Ошибка входа.';
        }
      } catch (err) {
        this.error = 'Server error';
      }
    },
  },
};
</script>
