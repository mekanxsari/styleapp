<template>
  <div class="content-wrapper" style="background: #fff;">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card card-primary">
            <form @submit.prevent="handleChangePassword">
              <div class="card-body">
                <div class="form-group">
                  <label for="currentPassword">Текущий пароль</label>
                  <input
                    v-model="currentPassword"
                    type="password"
                    class="form-control"
                    id="currentPassword"
                    placeholder="Введите текущий пароль"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="newPassword">Новый пароль</label>
                  <input
                    v-model="newPassword"
                    type="password"
                    class="form-control"
                    id="newPassword"
                    placeholder="Введите новый пароль"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="confirmPassword">Повторите пароль</label>
                  <input
                    v-model="confirmPassword"
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    placeholder="Повторите новый пароль"
                    required
                  />
                </div>

                <div v-if="errorMessage" class="text-danger mb-3">{{ errorMessage }}</div>
                <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
              </div>
              <div class="card-footer">
                <button type="submit" class="btn btn-primary btn-block">Сменить пароль</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { API_URL } from '../api';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

async function handleChangePassword() {
  errorMessage.value = '';
  successMessage.value = '';

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают.';
    return;
  }

  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  if (!user_id || !token) {
    errorMessage.value = 'Пользователь не авторизован.';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/stylist-auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        token,
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      successMessage.value = 'Пароль успешно изменён!';
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
    } else {
      errorMessage.value = data.reason || 'Ошибка при смене пароля.';
    }
  } catch (err) {
    console.error('Change password error:', err);
    errorMessage.value = 'Ошибка сервера.';
  }
}
</script>
