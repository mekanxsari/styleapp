<template>
  <div class="main-container" v-if="capsula">
    <div class="capsula-container">
      <div class="title-container">
        <ul class="left">
          <li class="title">{{ capsula.title }}</li>
          <li class="season-tag">{{ capsula.season }}</li>
          <li class="like">
            <img
              :src="capsula.liked ? '/images/heart-active.png' : '/images/heart.png'"
              class="like-btn-capsula"
              @click="toggleCapsulaLike"
            />
          </li>
        </ul>
      </div>

      <img :src="capsula.image" class="image-container" />
      <div class="description">{{ capsula.description }}</div>
    </div>

    <div class="outfits-container">
      <div class="head">
        <ul class="left">
          <li class="title">Образы</li>
          <li class="quantity">{{ capsula.outfits.length }}</li>
        </ul>
      </div>

      <ul class="outfits-list">
        <li v-for="outfit in capsula.outfits" :key="outfit.id">
          <router-link :to="`/outfit/${outfit.id}`">
            <img :src="outfit.image" class="image" />
            <div class="attributes">
              <div class="title">{{ outfit.title }}</div>
              <span class="season-label">{{ outfit.season }}</span>
              <div class="like">
                <img
                  :src="outfit.liked ? '/images/heart-active.png' : '/images/heart.png'"
                  class="like-btn"
                  @click.stop.prevent="toggleOutfitLike(outfit)"
                />
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="space"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const capsula = ref(null)

const allCapsulas = [
  {
    id: 1,
    image: '/images/capsula1.png',
    title: 'Капсула первая',
    season: 'Весна/Зима',
    liked: false,
    description: 'Описание капсулы первой...',
    outfits: [
      {
        id: 1,
        image: '/images/outfit1.png',
        title: 'Образ 1',
        season: 'Весна | Кежуал',
        liked: false
      },
      {
        id: 2,
        image: '/images/outfit1.png',
        title: 'Образ 2',
        season: 'Весна | Кежуал',
        liked: false
      }
    ]
  },
  {
    id: 2,
    image: '/images/capsula1.png',
    title: 'Капсула вторая',
    season: 'Лето',
    liked: false,
    description: 'Описание капсулы второй...',
    outfits: []
  }
]

function toggleCapsulaLike() {
  if (capsula.value) {
    capsula.value.liked = !capsula.value.liked
  }
}

function toggleOutfitLike(outfit) {
  outfit.liked = !outfit.liked
}


onMounted(() => {
  const id = parseInt(route.params.id)
  capsula.value = allCapsulas.find(c => c.id === id)
})
</script>
