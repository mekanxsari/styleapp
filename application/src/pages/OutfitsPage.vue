<template>
  <div class="main-container">
    <div class="outfits-container">
      <div class="head">
        <ul class="left">
          <li class="title">Образы</li>
        </ul>
      </div>

      <div class="dropdown-container">
        <div
          class="custom-dropdown"
          @click="toggleDropdown(0)"
          :class="{ open: openDropdown === 0 }"
        >
          <span class="selected">{{ selectedType }}</span>
          <span class="arrow"><img src="/images/arrow.svg" /></span>
          <div class="dropdown-options">
            <div v-for="type in types" :key="type" @click.stop="selectOption(0, type)">{{ type }}</div>
          </div>
        </div>

        <div
          class="custom-dropdown"
          @click="toggleDropdown(1)"
          :class="{ open: openDropdown === 1 }"
        >
          <span class="selected">{{ selectedSeason }}</span>
          <span class="arrow"><img src="/images/arrow.svg" /></span>
          <div class="dropdown-options">
            <div v-for="season in seasons" :key="season" @click.stop="selectOption(1, season)">{{ season }}</div>
          </div>
        </div>
      </div>

      <ul class="outfits-list">
        <li v-for="outfit in outfits" :key="outfit.id">
          <router-link :to="`/outfit/${outfit.id}`">
            <img :src="outfit.image" class="image" />
            <div class="attributes">
              <div class="title">{{ outfit.title }}</div>
              <span class="season-label">{{ outfit.season }} | {{ outfit.style }}</span>
              <div class="like">
                <img
                  :src="outfit.liked ? '/images/heart-active.png' : '/images/heart.png'"
                  class="like-btn"
                  @click.prevent.stop="toggleOutfitLike(outfit)"
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

const openDropdown = ref(null)
const selectedType = ref('All types')
const selectedSeason = ref('All seasons')

const types = ['All types', 'For home', 'Casual']
const seasons = ['All seasons', 'Winter', 'Summer']

const outfits = ref([
  {
    id: 1,
    title: 'Образ 1',
    image: '/images/outfit1.png',
    season: 'Весна',
    style: 'Кежуал',
    liked: false
  },
  {
    id: 2,
    title: 'Образ 2',
    image: '/images/outfit1.png',
    season: 'Весна',
    style: 'Кежуал',
    liked: false
  },
  {
    id: 3,
    title: 'Образ 3',
    image: '/images/outfit1.png',
    season: 'Весна',
    style: 'Кежуал',
    liked: false
  },
  {
    id: 4,
    title: 'Образ 4',
    image: '/images/outfit1.png',
    season: 'Весна',
    style: 'Кежуал',
    liked: false
  },
  {
    id: 5,
    title: 'Образ 5',
    image: '/images/outfit1.png',
    season: 'Весна',
    style: 'Кежуал',
    liked: false
  },
  {
    id: 6,
    title: 'Образ 6',
    image: '/images/outfit1.png',
    season: 'Весна',
    style: 'Кежуал',
    liked: false
  },
])

function toggleDropdown(index) {
  openDropdown.value = openDropdown.value === index ? null : index
}

function selectOption(index, value) {
  if (index === 0) selectedType.value = value
  if (index === 1) selectedSeason.value = value
  openDropdown.value = null
  // filter logic
}

function toggleOutfitLike(outfit) {
  outfit.liked = !outfit.liked
}

onMounted(() => {
  document.addEventListener('click', e => {
    if (!e.target.closest('.custom-dropdown')) {
      openDropdown.value = null
    }
  })
})
</script>