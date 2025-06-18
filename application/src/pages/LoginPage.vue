<template>
  <div class="auth-container">
    <div class="login-container">
      <div class="logo">
        <img src="/public/images/logo.png" width="117px" height="104px" />
      </div>

      <span class="text">
        Пожалуйста, нажмите кнопку, чтобы получить доступ к приложению
      </span>

      <div class="inline-space"></div>

      <form class="form" @submit.prevent="handleTelegramLogin">
        <input
          type="submit"
          class="button"
          value="Войти через Telegram"
          v-if="!showPasscode"
        />

        <div v-if="showPasscode" style="text-align: center">
          <input
            type="password"
            id="password"
            v-model="passcode"
            class="input"
            placeholder="Пароль"
          />
          <input
            type="submit"
            class="button"
            value="Подтвердить пароль"
          />
        </div>
      </form>

      <p v-if="errorMessage" style="margin-top: 10px">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      passcode: "",
      showPasscode: false,
      user: null,
      errorMessage: "",
    };
  },
  methods: {
    async handleTelegramLogin() {
      this.errorMessage = "";

      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

      if (!tgUser) {
        this.errorMessage = "Пожалуйста, откройте приложение через Telegram.";
        return;
      }

      this.user = tgUser;

      const username = tgUser.username || tgUser.id;

      if (this.showPasscode) {
        const res = await fetch("https://cc7c-185-172-129-155.ngrok-free.app/api/login-special", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            passcode: this.passcode,
          }),
        });

        const data = await res.json();
        if (data.success) {
          window.location.href = "/";
        } else {
          this.errorMessage = "Неверный пароль.";
        }
        return;
      }

      const res = await fetch("https://cc7c-185-172-129-155.ngrok-free.app/api/check-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!data.exists) {
        this.errorMessage = "Пользователь не найден.";
      } else if (data.special) {
        this.showPasscode = true;
      } else {
        const loginRes = await fetch("https://cc7c-185-172-129-155.ngrok-free.app/api/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        const loginData = await loginRes.json();
        if (loginData.success) {
          window.location.href = "/app";
        } else {
          this.errorMessage = "Ошибка входа.";
        }
      }
    },
  },
};
</script>
