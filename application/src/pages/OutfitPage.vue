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
              @click.stop.prevent="toggleOutfitLike"
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
import { API_URL, SITE_URL } from '../api'

const route = useRoute()
const outfit = ref(null)

onMounted(() => {
  loadOutfit()
})

async function loadOutfit() {
  const id = route.params.id
  try {
    const res = await fetch(`${API_URL}/outfit/${id}`, {
      headers: {
        'x-user-id': localStorage.getItem('user_id') || '1'
      }
    })
    const data = await res.json()

    outfit.value = {
      id: data.id,
      title: data.title,
      season: data.season,
      style: data.label,
      description: data.description,
      image: `${SITE_URL}/app-images/${data.image_id}`,
      liked: data.liked,
      items: data.clothes.map(c => ({
        id: c.id,
        name: c.title,
        image: `${SITE_URL}/app-images/${c.image_url}`,
        liked: c.liked,
        category: c.category,
        store: c.store_name,
        link: c.store_url
      }))
    }
  } catch (err) {
    console.error('Error loading outfit:', err)
  }
}

function toggleOutfitLike() {
  if (!outfit.value) return
  outfit.value.liked = !outfit.value.liked
  updateLike(outfit.value.id, 'outfits', outfit.value.liked)
}

function toggleItemLike(item) {
  item.liked = !item.liked
  updateLike(item.id, 'clothes', item.liked)
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
</script>