import { API_URL } from './api';
import { createRouter, createWebHistory } from 'vue-router';

import CapsulasPage from './pages/CapsulasPage.vue';
import CapsulaPage from './pages/CapsulaPage.vue';
import OutfitPage from './pages/OutfitPage.vue';
import OutfitsPage from './pages/OutfitsPage.vue';
import ItemPage from './pages/ItemPage.vue';
import LikesPage from './pages/LikesPage.vue';
import LoginPage from './pages/LoginPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import PersonalInformationPage from './pages/ProfilePersonalInformationPage.vue';
import ProfileSizePage from './pages/ProfileSizePage.vue';
import ProfileAdditionalPage from './pages/ProfileAdditionalPage.vue';
import ProfileImageUploadPage from './pages/ProfileImageUploadPage.vue';
import MyListPage from './pages/MyListPage.vue';

const routes = [
  { path: '/', component: CapsulasPage },
  { path: '/capsula/:id', component: CapsulaPage },
  { path: '/outfit/:id', component: OutfitPage },
  { path: '/outfits', component: OutfitsPage },
  { path: '/item/:id', component: ItemPage },
  { path: '/likes', component: LikesPage },
  { path: '/login', component: LoginPage },
  { path: '/profile', component: ProfilePage },
  { path: '/profile/personal', component: PersonalInformationPage },
  { path: '/profile/sizes', component: ProfileSizePage },
  { path: '/profile/additional', component: ProfileAdditionalPage },
  { path: '/profile/upload', component: ProfileImageUploadPage },
  { path: '/profile/my-list', component: MyListPage }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    return next();
  }

  const token = localStorage.getItem('session_token');
  const user_id = localStorage.getItem('user_id');

  if (!token || !user_id) {
    return next('/login');
  }

  try {
    const response = await fetch(`${API_URL}/check-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, user_id })
    });

    const result = await response.json();

    if (result.valid) {
      return next();
    } else {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_id');
      return next('/login');
    }
  } catch (err) {
    console.error('Session check failed:', err);
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_id');
    return next('/login');
  }
});
