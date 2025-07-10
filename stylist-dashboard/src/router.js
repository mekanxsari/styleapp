import { API_URL } from './api';
import { createRouter, createWebHistory } from 'vue-router';

import ClothesPage from './pages/ClothesPage.vue';
import OutfitsPage from './pages/OutfitsPage.vue';
import CapsulesPage from './pages/CapsulesPage.vue';
import PasswordChangePage from './pages/PasswordChangePage.vue';
import LoginPage from './pages/LoginPage.vue';
import UsersPage from './pages/UsersPage.vue';

const routes = [
  { path: '/', component: ClothesPage },
  { path: '/outfits', component: OutfitsPage },
  { path: '/capsules', component: CapsulesPage },
  { path: '/change-password', component: PasswordChangePage },
  { path: '/login', component: LoginPage },
  { path: '/users', component: UsersPage }
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
    const response = await fetch(`${API_URL}/stylist-auth/check-session`, {
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
