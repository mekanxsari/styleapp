<template>
  <div class="main-container">
    <div class="inline-space"></div>
    <div class="likes-inline-item">
      <ul class="left">
        <li class="title" id="tab-title">{{ currentTabTitle }}</li>
        <li class="quantity" id="tab-quantity">{{ currentTabQuantity }}</li>
      </ul>
      <ul class="right">
        <li :class="{ active: currentTab === 'items' }">
          <a href="#" @click.prevent="switchTab('items')">Предметы</a>
        </li>
        <li :class="{ active: currentTab === 'outfits' }">
          <a href="#" @click.prevent="switchTab('outfits')">Образы</a>
        </li>
        <li :class="{ active: currentTab === 'capsulas' }">
          <a href="#" @click.prevent="switchTab('capsulas')">Капсулы</a>
        </li>
      </ul>
    </div>

    <div v-show="currentTab === 'items'" class="item-container">
      <ul class="item-list">
        <li v-for="item in items" :key="item.id">
          <router-link :to="`/item/${item.id}`">
            <div class="image-container">
              <img :src="item.image" class="item-image">
              <img :src="item.liked ? '/images/heart-active.png' : '/images/heart.png'" class="like-btn heart-on-image" @click.prevent.stop="toggleItemLike(item)">
            </div>
            <div class="attributes">
              <div class="title">{{ item.title }}</div>
              <span class="label">{{ item.category }}</span>
              <div class="store-inf">
                <div class="store">Доступно:&nbsp;<b class="store-name">{{ item.store }}</b></div>
                <div class="store-btn" @click.prevent="goToStore(item.storeLink)">В магазин</div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <div v-show="currentTab === 'outfits'" class="outfits-container">
      <ul class="outfits-list">
        <li v-for="outfit in outfits" :key="outfit.id">
          <router-link :to="`/outfit/${outfit.id}`">
            <img :src="outfit.image" class="image">
            <div class="attributes">
              <div class="title">{{ outfit.title }}</div>
              <span class="season-label">{{ outfit.season }} | {{ outfit.style }}</span>
              <div class="like">
                <img :src="outfit.liked ? '/images/heart-active.png' : '/images/heart.png'" class="like-btn" @click.prevent.stop="toggleOutfitLike(outfit)">
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="inline-space"></div>
    <div v-show="currentTab === 'capsulas'" class="capsulas-container">
      <ul class="capsulas-list">
        <li v-for="capsula in capsulas" :key="capsula.id">
          <router-link :to="`/capsula/${capsula.id}`">
            <img :src="capsula.image" class="image">
            <div class="attributes">
              <div class="prod-title">{{ capsula.title }}</div>
              <span class="quantity">{{ capsula.count }} образы</span>
              <ul class="right">
                <li class="season-tag">{{ capsula.season }}</li>
                <li class="like">
                  <img :src="capsula.liked ? '/images/heart-active.png' : '/images/heart.png'" class="like-btn" @click.prevent.stop="toggleCapsulaLike(capsula)">
                </li>
              </ul>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="space"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { API_URL, SITE_URL } from '../api'

const currentTab = ref('items')
const currentTabTitle = ref('Предметы')
const currentTabQuantity = ref('0')

const items = ref([])
const outfits = ref([])
const capsulas = ref([])

const itemPage = ref(1)
const outfitPage = ref(1)
const capsulaPage = ref(1)
const pageSize = 6
const loading = ref(false)
const hasMore = ref({ items: true, outfits: true, capsulas: true })

function switchTab(tab) {
  currentTab.value = tab
  updateTabTitleAndQuantity()
  if ((tab === 'outfits' && outfits.value.length === 0) ||
      (tab === 'capsulas' && capsulas.value.length === 0)) {
    fetchLikes(getCurrentPage())
  }
}

function updateTabTitleAndQuantity() {
  if (currentTab.value === 'items') {
    currentTabTitle.value = 'Предметы'
    currentTabQuantity.value = items.value.length.toString()
  } else if (currentTab.value === 'outfits') {
    currentTabTitle.value = 'Образы'
    currentTabQuantity.value = outfits.value.length.toString()
  } else if (currentTab.value === 'capsulas') {
    currentTabTitle.value = 'Капсулы'
    currentTabQuantity.value = capsulas.value.length.toString()
  }
}

function toggleItemLike(item) {
  item.liked = !item.liked
  updateLike(item.id, 'clothes', item.liked)
}
function toggleOutfitLike(outfit) {
  outfit.liked = !outfit.liked
  updateLike(outfit.id, 'outfits', outfit.liked)
}
function toggleCapsulaLike(capsula) {
  capsula.liked = !capsula.liked
  updateLike(capsula.id, 'capsulas', capsula.liked)
}

function goToStore(url) {
  window.open(url, '_blank')
}

async function updateLike(id, type, liked) {
  try {
    await fetch(`${API_URL}/like/${id}`, {
      method: liked ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': localStorage.getItem('user_id') || '1'
      },
      body: JSON.stringify({ type })
    })
  } catch (err) {
    console.error('Failed to update like:', err)
  }
}

async function fetchLikes(page = 1) {
  if (loading.value || !hasMore.value[currentTab.value]) return
  loading.value = true

  try {
    const res = await fetch(`${API_URL}/likes?page=${page}&limit=${pageSize}`, {
      headers: { 'x-user-id': localStorage.getItem('user_id') || '1' }
    })
    const data = await res.json()

    if (currentTab.value === 'items') {
      const next = data.clothes.slice((itemPage.value - 1) * pageSize, itemPage.value * pageSize)
      items.value.push(...next.map(i => ({
        id: i.id,
        title: i.title,
        category: i.category,
        store: i.store_name,
        storeLink: i.store_url,
        image: `${SITE_URL}/app-images/${i.image_url}`,
        liked: i.liked
      })))
      hasMore.value.items = next.length === pageSize
      itemPage.value++
    } else if (currentTab.value === 'outfits') {
      const next = data.outfits.slice((outfitPage.value - 1) * pageSize, outfitPage.value * pageSize)
      outfits.value.push(...next.map(o => ({
        id: o.id,
        title: o.title,
        image: `${SITE_URL}/app-images/${o.image_url}`,
        season: o.season,
        style: o.label,
        liked: o.liked
      })))
      hasMore.value.outfits = next.length === pageSize
      outfitPage.value++
    } else if (currentTab.value === 'capsulas') {
      const next = data.capsulas.slice((capsulaPage.value - 1) * pageSize, capsulaPage.value * pageSize)
      capsulas.value.push(...next.map(c => ({
        id: c.id,
        title: c.title,
        image: `${SITE_URL}/app-images/${c.image_url}`,
        season: c.season_1 + (c.season_2 ? '/' + c.season_2 : ''),
        count: c.quantity,
        liked: c.liked
      })))
      hasMore.value.capsulas = next.length === pageSize
      capsulaPage.value++
    }

    updateTabTitleAndQuantity()
  } catch (err) {
    console.error('Failed to fetch likes:', err)
  } finally {
    loading.value = false
  }
}

function handleScroll() {
  const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
  if (bottom) fetchLikes(getCurrentPage())
}

function getCurrentPage() {
  if (currentTab.value === 'items') return itemPage.value
  if (currentTab.value === 'outfits') return outfitPage.value
  if (currentTab.value === 'capsulas') return capsulaPage.value
  return 1
}

onMounted(() => {
  fetchLikes()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
