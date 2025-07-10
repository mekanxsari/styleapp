<template>
  <AppHeader v-if="route.path !== '/login'" />
  <div class="wrapper">
  <router-view />
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute();

function updateBodyClasses() {
  if (route.path === '/login') {
    document.body.classList.add('login-page');
  } else {
    document.body.classList.remove('login-page');
  }
}

onMounted(() => {
  updateBodyClasses();
});

watch(() => route.path, () => {
  updateBodyClasses();
});


useHead({
  title: 'Stylist Dashboard',
  meta: [
    { charset: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css'
    },
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    },
    {
      rel: 'stylesheet',
      href: 'src/assets/app.css'
    }
  ]
})
</script>