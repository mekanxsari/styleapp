<template>
  <div class="main-container">
    <div class="profile-container">
      <ul class="profile-heading">
        <li class="title-page">Персональные данные</li>
        <li class="spisok"><a href="#">Мои списки</a></li>
      </ul>
      <form class="user-form" @submit.prevent="onSubmit">
        <label class="user-label">ФИО</label>
        <input v-model="formValues.full_name" type="text" name="full_name" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Дата рождения</label>
        <input v-model="formValues.birth_date" type="text" name="birth_date" class="user-input" placeholder="день.месяц.год" required />

        <label class="user-label">Город проживания</label>
        <input v-model="formValues.current_city" type="text" name="current_city" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Телефон</label>
        <input v-model="formValues.phone_number" type="tel" ref="phoneInput" class="user-input" placeholder="+7 (___) ___-__-__" maxlength="18"
          name="phone_number" required />

        <label class="user-label">Электронная почта</label>
        <input type="email" name="email" v-model="formValues.email"
          :class="['user-input', { invalid: submitAttempted && !isEmailValid }]" placeholder="Введите здесь..." />

        <label class="user-label">Профессия</label>
        <input v-model="formValues.profession" type="text" name="profession" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Семейное положение</label>
        <div class="radio">
          <input v-model="formValues.marital_status" type="radio" name="martial_status" value="true" id="opt1" />
          <label for="opt1">Замужем</label>
        </div>
        <div class="radio">
          <input v-model="formValues.marital_status" type="radio" name="martial_status" value="false" id="opt2" />
          <label for="opt2">Не замужем</label>
        </div>

        <button type="submit" class="user-submit">Подтвердить</button>
      </form>
    </div>
  </div>
  <div class="inline-space"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import IMask from 'imask'
import { API_URL, SITE_URL } from '../api'

const phoneInput = ref(null)
let mask = null

const formValues = ref({
  full_name: '',
  birth_date: '',
  current_city: '',
  phone_number: '',
  email: '',
  profession: '',
  marital_status: ''
})

const isEmailValid = ref(true)
const submitAttempted = ref(false)

onMounted(() => {
  mask = IMask(phoneInput.value, {
    mask: '+{7} (000) 000-00-00',
    lazy: true,
  })

  const userId = localStorage.getItem('user_id')
  if (userId) {
    fetchUserData(userId)
  }
})

onBeforeUnmount(() => {
  if (mask) mask.destroy()
})

function validateEmail(val) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(val)
}

async function fetchUserData(userId) {
  try {
    const response = await fetch(`${API_URL}/user-personal`, {
      headers: {
        'x-user-id': userId
      }
    })
    const result = await response.json()
    if (result.success) {
      Object.assign(formValues.value, result.user)

      formValues.value.marital_status = String(result.user.marital_status)
    } else {
      console.error('User not found or error:', result.message)
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

function onSubmit() {
  submitAttempted.value = true

  if (formValues.value.email && formValues.value.email.trim() !== '') {
    isEmailValid.value = validateEmail(formValues.value.email)
  } else {
    isEmailValid.value = true
  }

  if (isEmailValid.value) {
    alert('Форма успешно отправлена!')
    // Here you can send formValues.value to API for update/save
  }
}
</script>