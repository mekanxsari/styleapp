<template>
  <div class="main-container">
    <div class="inline-space"></div>
    <div class="likes-inline-item">
      <ul class="left">
        <li class="title" id="tab-title">{{ currentTabTitle }}</li>
        <li class="quantity" id="tab-quantity">{{ currentTabQuantity }}</li>
      </ul>
      <ul class="right">
        <li :class="{ active: currentTab === 'outfits' }">
          <a href="#" @click.prevent="switchTab('outfits')" style="width: 170px;">Образы</a>
        </li>
        <li :class="{ active: currentTab === 'capsulas' }">
          <a href="#" @click.prevent="switchTab('capsulas')" style="width: 170px;">Капсулы</a>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { API_URL, SITE_URL } from '../api'

const currentTab = ref('outfits')
const currentTabTitle = ref('Образы')
const currentTabQuantity = ref('0')

const outfits = ref([])
const capsulas = ref([])

const outfitPage = ref(1)
const capsulaPage = ref(1)
const pageSize = 6
const loading = ref(false)

function switchTab(tab) {
  currentTab.value = tab
  updateTabTitleAndQuantity()
  if ((tab === 'outfits' && outfits.value.length === 0) ||
      (tab === 'capsulas' && capsulas.value.length === 0)) {
    fetchLikes(getCurrentPage())
  }
}

function updateTabTitleAndQuantity() {
  if (currentTab.value === 'outfits') {
    currentTabTitle.value = 'Образы'
    currentTabQuantity.value = outfits.value.length.toString()
  } else if (currentTab.value === 'capsulas') {
    currentTabTitle.value = 'Капсулы'
    currentTabQuantity.value = capsulas.value.length.toString()
  }
}

function toggleOutfitLike(outfit) {
  outfit.liked = !outfit.liked
  updateLike(outfit.id, 'outfits', outfit.liked)
}

function toggleCapsulaLike(capsula) {
  capsula.liked = !capsula.liked
  updateLike(capsula.id, 'capsulas', capsula.liked)
}

function goToStore(link) {
  const tg = window.Telegram?.WebApp
  if (tg?.openLink) {
    tg.openLink(link, { try_instant_view: true })
  } else {
    window.open(link, '_blank')
  }
}

function handleScroll() {
  const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
  if (bottom) fetchLikes(getCurrentPage())
}

function getCurrentPage() {
  if (currentTab.value === 'outfits') return outfitPage.value
  if (currentTab.value === 'capsulas') return capsulaPage.value
  return 1
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

