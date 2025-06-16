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
    </div>
  </div>
  <div class="space"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const capsulas = ref([])

onMounted(() => {
  capsulas.value = [
    {
      id: 1,
      image: '/images/capsula1.png',
      title: 'Капсула первая',
      count: 6,
      season: 'Весна/Зима',
      liked: false
    },
    {
      id: 2,
      image: '/images/capsula1.png',
      title: 'Капсула вторая',
      count: 4,
      season: 'Лето',
      liked: false
    },
    {
      id: 3,
      image: '/images/capsula1.png',
      title: 'Капсула вторая',
      count: 4,
      season: 'Лето',
      liked: false
    },
    {
      id: 4,
      image: '/images/capsula1.png',
      title: 'Капсула вторая',
      count: 4,
      season: 'Лето',
      liked: false
    }
  ]
})

function toggleLike(capsula) {
  capsula.liked = !capsula.liked
}
</script>
