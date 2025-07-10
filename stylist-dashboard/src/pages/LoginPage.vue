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
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { API_URL } from '../api';

const username = ref('');
const password = ref('');
const showError = ref(false);
const router = useRouter();

async function handleLogin() {
  try {
    const response = await fetch(`${API_URL}/stylist-auth/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem('session_token', data.token);
      localStorage.setItem('user_id', data.id);
      router.push('/');
    } else {
      showError.value = true;
      setTimeout(() => { showError.value = false; }, 3000);
    }
  } catch (error) {
    console.error('Login error:', error);
    showError.value = true;
    setTimeout(() => { showError.value = false; }, 3000);
  }
}
</script>