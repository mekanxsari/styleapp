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

const tg = window.Telegram?.WebApp

function setupBackButton(path) {
  if (!tg) return

  if (path === '/login' || path === '/') {
    tg.BackButton.hide()
    tg.BackButton.onClick(null)
  } else {
    tg.BackButton.show()
    tg.BackButton.onClick(() => {
      router.back()
    })
  }
}

onMounted(() => {
  if (tg && tg.initDataUnsafe) {
    setupBackButton(route.path)

    router.afterEach((to) => {
      setupBackButton(to.path)
    })
  }
})

onUnmounted(() => {
  if (tg?.BackButton) {
    tg.BackButton.hide()
    tg.BackButton.onClick(null)
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
      href: 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;1,700&family=Prata&display=swap',
    },
  ],
})
</script>