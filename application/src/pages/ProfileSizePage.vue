<template>
  <div class="main-container">
    <div class="profile-container">
      <ul class="profile-heading">
        <li class="title-page">Ваши размеры</li>
        <li class="spisok"><a href="#">Мои списки</a></li>
      </ul>

      <form class="user-form" @submit.prevent="onSubmit">
        <label class="user-label">
          Размер одежды верха — топы / блузы / футболки / рубашки / жакеты / куртки
        </label>
        <div class="radio" v-for="(size, index) in sizes" :key="'top' + index">
          <input type="radio" :id="'top' + index" name="topSize" :value="size" v-model="selectedTopSize"
            :required="index === 0" />
          <label :for="'top' + index">{{ size }}</label>
        </div>

        <label class="user-label">
          Размер одежды низа — брюки / джинсы / юбки
        </label>
        <div class="radio" v-for="(size, index) in sizes" :key="'bottom' + index">
          <input type="radio" :id="'bottom' + index" name="bottomSize" :value="size" v-model="selectedBottomSize"
            :required="index === 0" />
          <label :for="'bottom' + index">{{ size }}</label>
        </div>

        <label class="user-label">Размер обуви</label>
        <input v-model="shoeSize" type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">
          Напишите о Ваших особенностях. Какую высоту каблука предпочитаете? Широкая или узкая у Вас нога, есть ли
          особые требования при выборе обуви?
        </label>
        <textarea v-model="shoeDescription" class="user-input-long" placeholder="Введите здесь..."></textarea>

        <label class="user-label">Рост</label>
        <input v-model="height" type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Обхват груди</label>
        <input v-model="chest" type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Окружность плеч</label>
        <input v-model="shoulder" type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Обхват талии</label>
        <input v-model="waist" type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Обхват бедер</label>
        <input v-model="hip" type="text" class="user-input" placeholder="Введите здесь..." required />

        <button type="submit" class="user-submit">Подтвердить</button>
      </form>
    </div>
  </div>
  <div class="inline-space"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { API_URL } from '../api'
import { useRouter } from 'vue-router'

const userId = localStorage.getItem('user_id')
const sizes = ['XS (42)', 'S (44)', 'M (46)', 'L (48)', 'XL (50)', 'XXL (52)']

const selectedTopSize = ref('')
const selectedBottomSize = ref('')
const shoeSize = ref('')
const shoeDescription = ref('')
const height = ref('')
const chest = ref('')
const shoulder = ref('')
const waist = ref('')
const hip = ref('')

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/user-sizes`, {
      headers: {
        'x-user-id': userId
      }
    })
    const data = await res.json()

    if (data.success) {
      const u = data.user
      selectedTopSize.value = u.top_size || ''
      selectedBottomSize.value = u.bottom_size || ''
      shoeSize.value = u.shoe_size || ''
      shoeDescription.value = u.shoe_description || ''
      height.value = u.height || ''
      chest.value = u.chest_circumference || ''
      shoulder.value = u.shoulder_circumference || ''
      waist.value = u.waist_circumference || ''
      hip.value = u.hip_circumference || ''
    }
  } catch (err) {
    console.error('Failed to fetch user sizes:', err)
  }
})

async function onSubmit() {
  try {
    const res = await fetch(`${API_URL}/user-sizes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify({
        top_size: selectedTopSize.value,
        bottom_size: selectedBottomSize.value,
        shoe_size: shoeSize.value,
        shoe_description: shoeDescription.value,
        height: height.value,
        chest_circumference: chest.value,
        shoulder_circumference: shoulder.value,
        waist_circumference: waist.value,
        hip_circumference: hip.value
      })
    })

    const data = await res.json()
    if (data.success) {
      router.push('/profile')
    } else {
      alert('Ошибка при сохранении: ' + data.message)
    }
  } catch (err) {
    console.error('Failed to update sizes:', err)
    alert('Произошла ошибка при отправке данных.')
  }
}

</script>