<template>
  <div class="login-box">
    <div class="login-logo">
      <b>Панель Стилиста</b>
    </div>
    <div class="card">
      <div class="card-body login-card-body">
        <div v-if="showError" class="alert alert-danger">
          Неверный логин или пароль
        </div>

        <form @submit.prevent="handleLogin">
          <div class="input-group mb-3">
            <input v-model="username" type="text" class="form-control" placeholder="Логин" required />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-user"></span>
              </div>
            </div>
          </div>

          <div class="input-group mb-3">
            <input v-model="password" type="password" class="form-control" placeholder="Пароль" required />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <button type="submit" class="btn btn-primary btn-block">Войти</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: 'admin',
      password: '123',
      showError: false
    };
  },
  methods: {
    handleLogin() {
      const correctUsername = 'admin';
      const correctPassword = '1234';

      if (this.username.trim() === correctUsername && this.password.trim() === correctPassword) {
        window.location.href = 'index.html';
      } else {
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
      }
    }
  }
};
</script>