<template>
  <div class="main-container">
    <div class="outfit-container">
      <div class="title-container">
        <ul class="left">
          <li class="title">{{ item.title }}</li>
          <li class="like">
            <img
                  :src="item.liked ? '/images/heart-active.png' : '/images/heart.png'"
                  class="like-btn-capsula"
                  @click.prevent.stop="toggleItemLike(item)"
                />
          </li>
        </ul>
      </div>
      <div class="inline-space"></div>

      <div class="information">
        <ul class="labels">
          <li>{{ item.category }}</li>
        </ul>
        <div class="description">{{ item.description }}</div>
        <span class="store">Доступно:&nbsp;<b>{{ item.store }}</b></span>
        <a :href="item.storeLink" class="store-btn">В магазин</a>
      </div>
      <img :src="item.image" class="img" />
    </div>

    <div class="inline-space"></div>

    <div class="head-inline-item">
      <ul class="left">
        <li class="title">{{ currentTabTitle }}</li>
        <li class="quantity">{{ currentTabQuantity }}</li>
      </ul>
      <ul class="right">
        <li :class="{ active: currentTab === 'outfits' }">
          <a href="#" @click.prevent="switchTab('outfits')" id="outfits">Образы</a>
        </li>
        <li :class="{ active: currentTab === 'capsulas' }">
          <a href="#" @click.prevent="switchTab('capsulas')" id="capsulas">Капсулы</a>
        </li>
      </ul>
    </div>

    <div v-show="currentTab === 'outfits'" class="outfits-container">
      <ul class="outfits-list">
        <li v-for="outfit in outfits" :key="outfit.id">
          <a :href="`/outfit/${outfit.id}`">
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
          </a>
        </li>
      </ul>
    </div>

    <div class="inline-space"></div>
    <div v-show="currentTab === 'capsulas'" class="capsulas-container">
      <ul class="capsulas-list">
        <li v-for="capsula in capsulas" :key="capsula.id">
          <a :href="`/capsula/${capsula.id}`">
            <img :src="capsula.image" class="image" />
            <div class="attributes">
              <div class="prod-title">{{ capsula.title }}</div>
              <span class="quantity">{{ capsula.count }} образ</span>
              <ul class="right">
                <li class="season-tag">{{ capsula.season }}</li>
                <li class="like">
                  <img
                    :src="capsula.liked ? '/images/heart-active.png' : '/images/heart.png'"
                    class="like-btn"
                    @click.prevent.stop="toggleCapsulaLike(capsula)"
                  />
                </li>
              </ul>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <div class="space"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref('outfits')
const currentTabTitle = ref('Образы')
const currentTabQuantity = ref('8')

const item = ref({
  title: 'Джемпер бежевый',
  category: 'Верхняя одежда',
  description: 'Channeling the glamour and sophistication of bygone eras into a modern fashion narrative.',
  store: 'Lamoda',
  storeLink: 'https://www.lamoda.ru/',
  image: '/images/cloth1.png'
})

const outfits = ref([
  { id: 1, title: 'Образ 1', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false },
  { id: 2, title: 'Образ 2', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false },
])

const capsulas = ref([
  { id: 1, title: 'Капсула первая', image: '/images/capsula1.png', count: 6, season: 'Весна/Зима', liked: false },
  { id: 2, title: 'Капсула вторая', image: '/images/capsula1.png', count: 6, season: 'Весна/Зима', liked: false },
  { id: 3, title: 'Капсула третья', image: '/images/capsula1.png', count: 6, season: 'Весна/Зима', liked: false }
])

function switchTab(tab) {
  currentTab.value = tab
  if (tab === 'outfits') {
    currentTabTitle.value = 'Образы'
    currentTabQuantity.value = outfits.value.length.toString()
  } else if (tab === 'capsulas') {
    currentTabTitle.value = 'Капсулы'
    currentTabQuantity.value = capsulas.value.length.toString()
  }
}

function toggleOutfitLike(outfit) {
  outfit.liked = !outfit.liked
}

function toggleCapsulaLike(capsula) {
  capsula.liked = !capsula.liked
}

function toggleItemLike(item) {
  item.liked = !item.liked
}
</script>