<template>
  <div class="main-container" v-if="item">
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
        <div class="store-btn" @click.prevent="goToStore(item.storeLink)">В магазин</div>
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
          <a href="#" @click.prevent="switchTab('outfits')">Образы</a>
        </li>
        <li :class="{ active: currentTab === 'capsulas' }">
          <a href="#" @click.prevent="switchTab('capsulas')">Капсулы</a>
        </li>
      </ul>
    </div>

    <div v-show="currentTab === 'outfits'" class="outfits-container">
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

    <div class="inline-space"></div>

    <div v-show="currentTab === 'capsulas'" class="capsulas-container">
      <ul class="capsulas-list">
        <li v-for="capsula in capsulas" :key="capsula.id">
          <router-link :to="`/capsula/${capsula.id}`">
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
import { API_URL, SITE_URL } from '../api'

const route = useRoute()
const item = ref(null)
const outfits = ref([])
const capsulas = ref([])
const currentTab = ref('outfits')
const currentTabTitle = ref('Образы')
const currentTabQuantity = ref('0')

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
  updateLike(outfit.id, 'outfits', outfit.liked)
}

function toggleCapsulaLike(capsula) {
  capsula.liked = !capsula.liked
  updateLike(capsula.id, 'capsulas', capsula.liked)
}

function toggleItemLike(i) {
  i.liked = !i.liked
  updateLike(i.id, 'clothes', i.liked)
}

function goToStore(link) {
  const tg = window.Telegram?.WebApp
  if (tg?.openLink) {
    tg.openLink(link, { try_instant_view: true })
  } else {
    window.open(link, '_blank')
  }
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

onMounted(async () => {
  try {
    const id = route.params.id
    const res = await fetch(`${API_URL}/cloth/${id}`, {
      headers: {
        'x-user-id': localStorage.getItem('user_id') || '1'
      }
    })
    const data = await res.json()
    item.value = {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      store: data.store_name,
      storeLink: data.store_url,
      image: `${SITE_URL}/app-images/${data.image_url}`,
      liked: data.liked
    }

    outfits.value = data.outfits.map(o => ({
      id: o.id,
      title: o.title,
      image: `${SITE_URL}/app-images/${o.image_url}`,
      season: o.season,
      style: o.label,
      liked: o.liked
    }))

    capsulas.value = data.capsulas.map(c => ({
      id: c.id,
      title: c.title,
      image: `${SITE_URL}/app-images/${c.image_id}`,
      season: c.season,
      count: c.quantity,
      liked: c.liked
    }))

    switchTab('outfits')
  } catch (err) {
    console.error('Failed to load item:', err)
  }
})
</script>
