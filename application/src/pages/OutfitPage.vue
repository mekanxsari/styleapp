<template>
  <div class="main-container" v-if="outfit">
    <div class="outfit-container">
      <div class="title-container">
        <ul class="left">
          <li class="title">{{ outfit.title }}</li>
          <li class="like">
            <img
              :src="outfit.liked ? '/images/heart-active.png' : '/images/heart.png'"
              class="like-btn-capsula"
              @click.stop.prevent="toggleOutfitLike(outfit)"
            />
          </li>
        </ul>
      </div>

      <div class="inline-space"></div>

      <div class="information">
        <ul class="labels">
          <li>{{ outfit.season }}</li>
          <li>{{ outfit.style }}</li>
        </ul>
        <div class="description">{{ outfit.description }}</div>
      </div>

      <img :src="outfit.image" class="img" />
    </div>

    <div class="inline-space"></div>

    <div class="item-container">
      <div class="head">
        <ul class="left">
          <li class="title">Предметы</li>
          <li class="quantity">{{ outfit.items.length }}</li>
        </ul>
      </div>

      <ul class="item-list">
        <li v-for="item in outfit.items" :key="item.id">
          <router-link :to="`/item/${item.id}`">
            <div class="image-container">
              <img :src="item.image" class="item-image" />
              <img
                :src="item.liked ? '/images/heart-active.png' : '/images/heart.png'"
                class="like-btn heart-on-image"
                @click.stop.prevent="toggleItemLike(item)"
              />
            </div>
            <div class="attributes">
              <div class="title">{{ item.name }}</div>
              <span class="label">{{ item.category }}</span>
              <div class="store-inf">
                <div class="store">Доступно:&nbsp;<b class="store-name">{{ item.store }}</b></div>
                <div class="store-btn" @click.stop.prevent="goToStore(item.link)">В магазин</div>
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
const outfit = ref(null)

const allOutfits = [
  {
    id: 1,
    title: 'Образ 1',
    season: 'Весна',
    style: 'Кежуал',
    description:
      'Channeling the glamour and sophistication of bygone eras into a modern fashion narrative. Channeling the glamour and sophistication of bygone eras into a modern fashion narrative.',
    image: '/images/outfit1.png',
    liked: false,
    items: [
      {
        id: 1,
        name: 'Джемпер бежевый',
        image: '/images/cloth1.png',
        liked: false,
        category: 'Верхняя одежда',
        store: 'Lamoda',
        link: 'https://www.lamoda.ru/'
      },
      {
        id: 2,
        name: 'Брюки черные',
        image: '/images/cloth1.png',
        liked: false,
        category: 'Низ',
        store: 'Lamoda',
        link: 'https://www.lamoda.ru/'
      },
      {
        id: 3,
        name: 'Кроссовки белые',
        image: '/images/cloth1.png',
        liked: false,
        category: 'Обувь',
        store: 'Lamoda',
        link: 'https://www.lamoda.ru/'
      },
      {
        id: 4,
        name: 'Шарф красный',
        image: '/images/cloth1.png',
        liked: false,
        category: 'Аксессуары',
        store: 'Lamoda',
        link: 'https://www.lamoda.ru/'
      }
    ]
  }
]

onMounted(() => {
  const id = parseInt(route.params.id)
  outfit.value = allOutfits.find(o => o.id === id)
})

function toggleOutfitLike(o) {
  o.liked = !o.liked
}

function toggleItemLike(i) {
  i.liked = !i.liked
}

function goToStore(url) {
  window.location.href = url
}
</script>