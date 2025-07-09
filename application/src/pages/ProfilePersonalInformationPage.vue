<template>
  <div class="main-container">
    <div class="profile-container">
      <ul class="profile-heading">
        <li class="title-page">Персональные данные</li>
        <li class="spisok"><a href="#">Мои списки</a></li>
      </ul>
      <form class="user-form" @submit.prevent="onSubmit">
        <label class="user-label">ФИО</label>
        <input type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Дата рождения</label>
        <input type="text" class="user-input" placeholder="день.месяц.год" required />

        <label class="user-label">Город проживания</label>
        <input type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Телефон</label>
        <input
          type="tel"
          ref="phoneInput"
          class="user-input"
          placeholder="+7 (___) ___-__-__"
          maxlength="18"
          required
        />

        <label class="user-label">Электронная почта</label>
        <input
          type="email"
          v-model="email"
          :class="['user-input', { invalid: submitAttempted && !isEmailValid }]"
          placeholder="Введите здесь..."
          required
        />

        <label class="user-label">Профессия</label>
        <input type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Семейное положение</label>
        <div class="radio">
          <input type="radio" name="group1" value="option1" id="opt1" required />
          <label for="opt1">Замужем</label>
        </div>
        <div class="radio">
          <input type="radio" name="group1" value="option2" id="opt2" />
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

const phoneInput = ref(null)
let mask = null

onMounted(() => {
  mask = IMask(phoneInput.value, {
    mask: '+{7} (000) 000-00-00',
    lazy: true,
  })
})

onBeforeUnmount(() => {
  if (mask) mask.destroy()
})

const email = ref('')
const isEmailValid = ref(true)
const submitAttempted = ref(false)

function validateEmail(val) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(val)
}

function onSubmit() {
  submitAttempted.value = true
  isEmailValid.value = validateEmail(email.value)

  if (isEmailValid.value) {
    alert('Форма успешно отправлена!')
  } 
}
</script>