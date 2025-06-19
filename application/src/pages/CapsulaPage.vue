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
          <li class="quantity">{{ outfits.length }}</li>
        </ul>
      </div>

      <ul class="outfits-list">
        <li v-for="outfit in outfits" :key="outfit.id">
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
      <div v-if="loadingOutfits" class="loading" style="text-align: center;">Загрузка...</div>
    </div>

    <div class="space"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { API_URL, SITE_URL } from '../api'

const route = useRoute()
const capsula = ref(null)

const outfits = ref([])
const outfitPage = ref(1)
const pageSize = 6
const loadingOutfits = ref(false)
const hasMoreOutfits = ref(true)

async function loadCapsula() {
  const id = route.params.id
  try {
    const res = await fetch(`${API_URL}/capsula/${id}`, {
      headers: {
        'x-user-id': localStorage.getItem('user_id') || '1'
      }
    })
    const data = await res.json()
    capsula.value = {
      id: data.id,
      title: data.title,
      season: data.season_1 + (data.season_2 ? '/' + data.season_2 : ''),
      image: `${SITE_URL}/app-images/${data.image_url}`,
      description: data.description,
      liked: data.liked
    }
    
    outfits.value = data.outfits.slice(0, pageSize).map(mapOutfit)
    outfitPage.value = 2
    hasMoreOutfits.value = data.outfits.length > pageSize
  } catch (err) {
    console.error('Error loading capsula:', err)
  }
}

function mapOutfit(o) {
  return {
    id: o.id,
    title: o.title,
    image: `${SITE_URL}/app-images/${o.image_id}`,
    season: o.season + (o.label ? ' | ' + o.label : ''),
    liked: o.liked
  }
}

async function loadMoreOutfits() {
  if (loadingOutfits.value || !hasMoreOutfits.value) return
  loadingOutfits.value = true

  try {
    const id = route.params.id
    const res = await fetch(`${API_URL}/capsula/${id}`, {
      headers: {
        'x-user-id': localStorage.getItem('user_id') || '1'
      }
    })
    const data = await res.json()

    const next = data.outfits.slice((outfitPage.value - 1) * pageSize, outfitPage.value * pageSize)
    outfits.value.push(...next.map(mapOutfit))
    if (next.length < pageSize) hasMoreOutfits.value = false
    outfitPage.value++
  } catch (err) {
    console.error('Error loading outfits:', err)
  } finally {
    loadingOutfits.value = false
  }
}

function handleScroll() {
  const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
  if (bottom) {
    loadMoreOutfits()
  }
}

function toggleCapsulaLike() {
  capsula.value.liked = !capsula.value.liked
  updateLike(capsula.value.id, 'capsulas', capsula.value.liked)
}

function toggleOutfitLike(outfit) {
  outfit.liked = !outfit.liked
  updateLike(outfit.id, 'outfits', outfit.liked)
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

onMounted(() => {
  loadCapsula()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
