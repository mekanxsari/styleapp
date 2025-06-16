import { createRouter, createWebHistory } from 'vue-router'
import CapsulasPage from './pages/CapsulasPage.vue'
import CapsulaPage from './pages/CapsulaPage.vue'
import OutfitPage from './pages/OutfitPage.vue'
import OutfitsPage from './pages/OutfitsPage.vue'
import ItemPage from './pages/ItemPage.vue'
import LikesPage from './pages/LikesPage.vue'
import LoginPage from './pages/LoginPage.vue'

const routes = [
  { path: '/', component: CapsulasPage },
  { path: '/capsula/:id', component: CapsulaPage },
  { path: '/outfit/:id', component: OutfitPage},
  { path: '/outfits', component: OutfitsPage },
  { path: '/item/:id', component: ItemPage },
  { path: '/likes', component: LikesPage },
  { path: '/login', component: LoginPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})