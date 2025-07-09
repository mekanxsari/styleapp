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
          <input
            type="radio"
            :id="'top' + index"
            name="topSize"
            :value="size"
            v-model="selectedTopSize"
            :required="index === 0"
          />
          <label :for="'top' + index">{{ size }}</label>
        </div>

        <label class="user-label">
          Размер одежды низа — брюки / джинсы / юбки
        </label>
        <div class="radio" v-for="(size, index) in sizes" :key="'bottom' + index">
          <input
            type="radio"
            :id="'bottom' + index"
            name="bottomSize"
            :value="size"
            v-model="selectedBottomSize"
            :required="index === 0"
          />
          <label :for="'bottom' + index">{{ size }}</label>
        </div>

        <label class="user-label">Размер обуви</label>
        <input type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">
            Напишите о Ваших особенностях. Какую высоту каблука предпочитаете? Широкая или узкая у Вас нога, есть ли особые требования при выборе обуви?
        </label>
        <textarea class="user-input-long" placeholder="Введите здесь..."></textarea>

        <label class="user-label">Рост</label>
        <input type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Обхват груди</label>
        <input type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Окружность плеч</label>
        <input type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Обхват талии</label>
        <input type="text" class="user-input" placeholder="Введите здесь..." required />

        <label class="user-label">Обхват бедер</label>
        <input type="text" class="user-input" placeholder="Введите здесь..." required />

        <button type="submit" class="user-submit">Подтвердить</button>
      </form>
    </div>
  </div>
  <div class="inline-space"></div>
</template>
<script setup>
import { ref } from 'vue'

const sizes = ['XS (42)', 'S (44)', 'M (46)', 'L (48)', 'XL (50)', 'XXL (52)']

const selectedTopSize = ref('')
const selectedBottomSize = ref('')
</script>