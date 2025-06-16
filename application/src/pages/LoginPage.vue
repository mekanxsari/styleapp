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
      <form class="form" @submit.prevent="handleTelegramLogin">
        <input type="submit" class="button" value="Войти через Telegram" />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleTelegramLogin() {
      console.log("Redirecting to Telegram login...");
    },
  },
};
</script>
