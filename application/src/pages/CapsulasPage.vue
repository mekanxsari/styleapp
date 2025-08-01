<template>
  <div class="main-container">
    <div class="title">Капсулы</div>
    <div class="inline-space"></div>
    <div class="capsulas-container">
      <ul class="capsulas-list">
        <li v-for="capsula in capsulas" :key="capsula.id">
          <router-link :to="`/capsula/${capsula.id}`">
            <img :src="capsula.image" class="image" />
            <div class="attributes">
              <div class="prod-title">{{ capsula.title }}</div>
              <span class="quantity">{{ capsula.count }} образы</span>
              <ul class="right">
                <li class="season-tag">{{ capsula.season }}</li>
                <li class="like">
                  <img
                    :src="capsula.liked ? '/images/heart-active.png' : '/images/heart.png'"
                    class="like-btn"
                    @click.stop.prevent="toggleLike(capsula)"
                  />
                </li>
              </ul>
            </div>
          </router-link>
        </li>
      </ul>
      <div v-if="loading" class="loading" style="text-align: center;">Загрузка...</div>
    </div>
  </div>
  <div class="space"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { API_URL, SITE_URL } from '../api'

const capsulas = ref([])
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const hasMore = ref(true)

async function loadCapsulas() {
  if (loading.value || !hasMore.value) return

  loading.value = true

  try {
    const res = await fetch(`${API_URL}/capsulas?page=${page.value}&limit=${pageSize}`, {
      headers: {
        'x-user-id': localStorage.getItem('user_id') || '1'
      }
    })
    const data = await res.json()

    if (data.length < pageSize) hasMore.value = false

    capsulas.value.push(...data.map(c => ({
      id: c.id,
      image: `${SITE_URL}/app-images/${c.image_url}`,
      title: c.title,
      count: c.quantity,
      season: c.season,
      liked: c.liked
    })))

    page.value++
  } catch (error) {
    console.error('Error loading capsulas:', error)
  } finally {
    loading.value = false
  }
}

function onScroll() {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight

  if (scrollTop + windowHeight >= docHeight - 100) {
    loadCapsulas()
  }
}

onMounted(() => {
  loadCapsulas()
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

async function toggleLike(capsula) {
  capsula.liked = !capsula.liked

  try {
    await fetch(`${API_URL}/like/${capsula.id}`, {
      method: capsula.liked ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': localStorage.getItem('user_id') || '1'
      },
      body: JSON.stringify({ type: 'capsulas' })
    })
  } catch (err) {
    console.error('Failed to update like:', err)
    capsula.liked = !capsula.liked
  }
}
</script>
