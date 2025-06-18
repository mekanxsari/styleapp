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
      error: ''
    };
  },
  methods: {
    async loginWithTelegram() {
      function parseInitData(initData) {
        const params = new URLSearchParams(initData);
        const userStr = params.get('user');
        if (!userStr) return null;
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }

      const rawInitData = window.Telegram?.WebApp?.initData;
      const userObj = parseInitData(rawInitData);
      const alias = userObj?.username;

      if (alias) {
        this.error = alias;
        return;
      }

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
          this.error = result.reason;
        }
      } catch (err) {
        this.error = 'Server error';
      }
    }
  }
};
</script>