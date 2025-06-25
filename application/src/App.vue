<template>
  <router-view />
  <AppFooter v-if="!hideFooter" />
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
const router = useRouter()

const hideFooter = computed(() =>
  ['/login'].includes(route.path)
)

onMounted(() => {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.onEvent('ready', () => {
      Telegram.WebApp.BackButton.show()
      Telegram.WebApp.BackButton.onClick(() => {
        router.back()
      })
    })
  }
})

onUnmounted(() => {
  if (window.Telegram?.WebApp?.BackButton) {
    Telegram.WebApp.BackButton.hide()
    Telegram.WebApp.BackButton.onClick(null)
  }
})

useHead({
  title: 'StyleApp',
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    },
  ],
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Prata&display=swap',
    },
  ],
  script: [
    {
      src: 'https://telegram.org/js/telegram-web-app.js',
    },
  ],
})
</script>