<template>
  <div class="main-container">
    <div class="inline-space"></div>
    <div class="likes-inline-item">
      <ul class="left">
        <li class="title" id="tab-title">
          {{ currentTabTitle }}
        </li>
        <li class="quantity" id="tab-quantity">
          {{ currentTabQuantity }}
        </li>
      </ul>
      <ul class="right">
        <li :class="{ active: currentTab === 'items' }">
          <a href="#" @click.prevent="switchTab('items')" id="items">
            Предметы
          </a>
        </li>
        <li :class="{ active: currentTab === 'outfits' }">
          <a href="#" @click.prevent="switchTab('outfits')" id="outfits">
            Образы
          </a>
        </li>
        <li :class="{ active: currentTab === 'capsulas' }">
          <a href="#" @click.prevent="switchTab('capsulas')" id="capsulas">
            Капсулы
          </a>
        </li>
      </ul>
    </div>

    <div v-show="currentTab === 'items'" class="item-container">
      <ul class="item-list">
        <li v-for="(item, index) in items" :key="index">
          <a href="item.html">
            <div class="image-container">
              <img :src="item.image" class="item-image">
              <img 
                :src="item.liked ? '/images/heart-active.png' : '/images/heart.png'" 
                class="like-btn heart-on-image"
                @click.prevent.stop="toggleItemLike(item)"
              >
            </div>
            <div class="attributes">
              <div class="title">
                {{ item.title }}
              </div>
              <span class="label">{{ item.category }}</span>
              <div class="store-inf">
                <div class="store">Доступно:&nbsp;<b class="store-name">{{ item.store }}</b></div>
                <div class="store-btn"
                  @click.prevent="goToStore(item.storeLink)">
                  В магазин
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <div v-show="currentTab === 'outfits'" class="outfits-container">
      <ul class="outfits-list">
        <li v-for="outfit in outfits" :key="outfit.id">
          <a href="outfit.html">
            <img :src="outfit.image" class="image">
            <div class="attributes">
              <div class="title">
                {{ outfit.title }}
              </div>
              <span class="season-label">{{ outfit.season }} | {{ outfit.style }}</span>
              <div class="like">
                <img 
                  :src="outfit.liked ? '/images/heart-active.png' : '/images/heart.png'" 
                  class="like-btn"
                  @click.prevent.stop="toggleOutfitLike(outfit)"
                >
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
          <a href="capsula.html">
            <img :src="capsula.image" class="image">
            <div class="attributes">
              <div class="prod-title">
                {{ capsula.title }}
              </div>
              <span class="quantity">{{ capsula.count }} образы</span>
              <ul class="right">
                <li class="season-tag">
                  {{ capsula.season }}
                </li>
                <li class="like">
                  <img 
                    :src="capsula.liked ? '/images/heart-active.png' : '/images/heart.png'" 
                    class="like-btn"
                    @click.prevent.stop="toggleCapsulaLike(capsula)"
                  >
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

const currentTab = ref('items')
const currentTabTitle = ref('Предметы')
const currentTabQuantity = ref('8')

const items = ref([
  { 
    title: 'Джемпер бежевый', 
    category: 'Верхняя одежда', 
    store: 'Lamoda', 
    storeLink: 'https://www.lamoda.ru/', 
    image: '/images/cloth1.png',
    liked: false
  },
  { 
    title: 'Джемпер бежевый', 
    category: 'Верхняя одежда', 
    store: 'Lamoda', 
    storeLink: 'https://www.lamoda.ru/', 
    image: '/images/cloth1.png',
    liked: false
  },
  { 
    title: 'Джемпер бежевый', 
    category: 'Верхняя одежда', 
    store: 'Lamoda', 
    storeLink: 'https://www.lamoda.ru/', 
    image: '/images/cloth1.png',
    liked: false
  },
  { 
    title: 'Джемпер бежевый', 
    category: 'Верхняя одежда', 
    store: 'Lamoda', 
    storeLink: 'https://www.lamoda.ru/', 
    image: '/images/cloth1.png',
    liked: false
  }
])

const outfits = ref([
  { id: 1, title: 'Образ 1', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false },
  { id: 2, title: 'Образ 1', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false },
  { id: 3, title: 'Образ 1', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false },
  { id: 4, title: 'Образ 1', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false },
  { id: 5, title: 'Образ 1', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false },
  { id: 6, title: 'Образ 1', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false },
  { id: 7, title: 'Образ 1', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false },
  { id: 8, title: 'Образ 1', image: '/images/outfit1.png', season: 'Весна', style: 'Кежуал', liked: false }
])

const capsulas = ref([
  { id: 1, title: 'Капсула первая', image: '/images/capsula1.png', count: 6, season: 'Весна/Зима', liked: false },
  { id: 2, title: 'Капсула первая', image: '/images/capsula1.png', count: 6, season: 'Весна/Зима', liked: false },
  { id: 3, title: 'Капсула первая', image: '/images/capsula1.png', count: 6, season: 'Весна/Зима', liked: false }
])

function switchTab(tab) {
  currentTab.value = tab
  if (tab === 'items') {
    currentTabTitle.value = 'Предметы'
    currentTabQuantity.value = items.value.length.toString()
  } else if (tab === 'outfits') {
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

function goToStore(url) {
  window.open(url, '_blank')
}
</script>