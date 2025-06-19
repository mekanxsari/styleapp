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
import { API_URL, SITE_URL } from '../api';

const capsulas = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/capsulas`, {
      headers: {
        'x-user-id': localStorage.getItem('user_id') || '1'
      }
    })

    const data = await res.json()

    capsulas.value = data.map(c => ({
      id: c.id,
      image: `${SITE_URL}/app-images/${c.image_url}`,
      title: c.title,
      count: c.quantity,
      season: c.season_1 + (c.season_2 ? '/' + c.season_2 : ''),
      liked: c.liked
    }))
  } catch (error) {
    console.error(error)
  }
})

async function toggleLike(capsula) {
  const userId = localStorage.getItem('user_id') || '1';
  const type = 'capsulas'; // double-check this matches your DB constraint (e.g. 'capculas')

  console.log(`[toggleLike] Toggling like for ID=${capsula.id}, current liked=${capsula.liked}, user=${userId}`);

  // Optimistic UI update
  capsula.liked = !capsula.liked;

  const method = capsula.liked ? 'POST' : 'DELETE';
  const endpoint = `${API_URL}/like/${capsula.id}`;
  const payload = { type };

  console.log(`[toggleLike] Sending ${method} to ${endpoint}`);
  console.log(`[toggleLike] Headers:`, {
    'Content-Type': 'application/json',
    'x-user-id': userId
  });
  console.log(`[toggleLike] Body:`, payload);

  try {
    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    console.log(`[toggleLike] Response status: ${res.status}`);
    console.log(`[toggleLike] Response body:`, result);

    if (!res.ok) {
      throw new Error(result.message || 'API returned error');
    }
  } catch (err) {
    console.error('[toggleLike] Failed to update like:', err);
    // Revert UI
    capsula.liked = !capsula.liked;
  }
}

</script>
