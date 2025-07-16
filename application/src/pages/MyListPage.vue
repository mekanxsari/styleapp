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
import { ref, onMounted } from 'vue'
import { API_URL, SITE_URL } from '../api'

const currentTab = ref('outfits')
const currentTabTitle = ref('Образы')
const currentTabQuantity = ref('0')

const outfits = ref([])
const capsulas = ref([])
const loading = ref(false)

function switchTab(tab) {
  currentTab.value = tab
  updateTabTitleAndQuantity()

  if ((tab === 'outfits' && outfits.value.length === 0) ||
      (tab === 'capsulas' && capsulas.value.length === 0)) {
    fetchMyList()
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

async function fetchMyList() {
  if (loading.value) return
  loading.value = true

  try {
    const res = await fetch(`${API_URL}/user-my-list`, {
      headers: {
        'x-user-id': localStorage.getItem('user_id')
      }
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch my list: status ${res.status}`)
    }

    const data = await res.json()

    outfits.value = data.outfits.map(o => ({
      id: o.id,
      image: `${SITE_URL}/app-images/${o.image_url}`,
      title: o.title,
      season: o.season,
      style: o.label,
      liked: o.liked
    }))

    capsulas.value = data.capsulas.map(c => ({
      id: c.id,
      image: `${SITE_URL}/app-images/${c.image_url}`,
      title: c.title,
      season: c.season_1 || c.season_2 || '',
      count: c.quantity,
      liked: c.liked
    }))

    updateTabTitleAndQuantity()
  } catch (err) {
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMyList()
})
</script>