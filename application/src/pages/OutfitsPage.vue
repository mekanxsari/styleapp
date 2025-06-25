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
            <div
              v-for="type in ['Все типы', ...types]"
              :key="type"
              @click.stop="selectOption(0, type)"
            >
              {{ type }}
            </div>
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
            <div
              v-for="season in ['Все сезоны', ...seasons]"
              :key="season"
              @click.stop="selectOption(1, season)"
            >
              {{ season }}
            </div>
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

      <div v-if="loading" class="loading" style="text-align: center;">Загрузка...</div>
    </div>
    <div class="space"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { API_URL, SITE_URL } from '../api'

const openDropdown = ref(null)
const selectedType = ref('Все типы')
const selectedSeason = ref('Все сезоны')

const types = ref([])
const seasons = ref([])

const outfits = ref([])
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const hasMore = ref(true)

let fetchController = null

function toggleDropdown(index) {
  openDropdown.value = openDropdown.value === index ? null : index
}

function selectOption(index, value) {
  if (index === 0) selectedType.value = value
  if (index === 1) selectedSeason.value = value

  outfits.value = []
  page.value = 1
  hasMore.value = true

  if (fetchController) {
    fetchController.abort()
  }

  loadOutfits()
  openDropdown.value = null
}

function buildQueryParams() {
  const params = new URLSearchParams()
  if (selectedType.value !== 'Все типы') params.append('label', selectedType.value)
  if (selectedSeason.value !== 'Все сезоны') params.append('season', selectedSeason.value)
  params.append('page', page.value)
  params.append('limit', pageSize)
  return params.toString()
}

function extractFilters(data) {
  const labelSet = new Set()
  const seasonSet = new Set()
  for (const o of data) {
    if (o.label) labelSet.add(o.label)
    if (o.season) seasonSet.add(o.season)
  }
  if (page.value === 1) {
    types.value = Array.from(labelSet)
    seasons.value = Array.from(seasonSet)
  }
}

async function loadOutfits() {
  if (loading.value || !hasMore.value) return
  loading.value = true

  fetchController = new AbortController()

  try {
    const res = await fetch(`${API_URL}/outfits?${buildQueryParams()}`, {
      signal: fetchController.signal,
      headers: {
        'x-user-id': localStorage.getItem('user_id') || '1'
      }
    })

    const data = await res.json()

    if (data.length < pageSize) hasMore.value = false

    extractFilters(data)

    const newOutfits = data.map(o => ({
      id: o.id,
      title: o.title,
      image: `${SITE_URL}/app-images/${o.image_url}`,
      season: o.season,
      style: o.label,
      liked: o.liked
    }))

    if (page.value === 1) {
      outfits.value = newOutfits
    } else {
      const existingIds = new Set(outfits.value.map(o => o.id))
      const uniqueNew = newOutfits.filter(o => !existingIds.has(o.id))
      outfits.value.push(...uniqueNew)
    }

    page.value++
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Error loading outfits:', err)
    }
  } finally {
    loading.value = false
  }
}

function onScroll() {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight
  if (scrollTop + windowHeight >= docHeight - 100) {
    loadOutfits()
  }
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
  loadOutfits()
  window.addEventListener('scroll', onScroll)
  document.addEventListener('click', e => {
    if (!e.target.closest('.custom-dropdown')) openDropdown.value = null
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (fetchController) fetchController.abort()
})
</script>
