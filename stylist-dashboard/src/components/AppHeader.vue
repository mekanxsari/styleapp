<template>
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <div class="container-fluid">
      <a href="#" class="navbar-brand font-weight-bold">
        <i class="fas fa-scissors"></i> Панель стилиста
      </a>
      <ul class="navbar-nav ml-auto align-items-center">
        <li class="nav-item mx-2">
          <router-link to="/" class="nav-link" active-class="active">Одежда</router-link>
        </li>
        <li class="nav-item mx-2">
          <router-link to="/outfits" class="nav-link" active-class="active">Образы</router-link>
        </li>
        <li class="nav-item mx-2">
          <router-link to="/capsules" class="nav-link" active-class="active">Капсулы</router-link>
        </li>
        <li class="nav-item dropdown ml-3">
          <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="profileDropdown" role="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-user-circle fa-2x"></i>
            <span class="ml-2 d-none d-md-inline">Профиль</span>
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="profileDropdown">
            <router-link to="/change-password" class="dropdown-item">
              <i class="fas fa-key mr-2"></i>Сменить пароль
            </router-link>

            <div class="dropdown-divider"></div>
            <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
              <i class="fas fa-sign-out-alt mr-2"></i>Выйти
            </a>

          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    function logout() {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_id');
      router.push('/login');
    }

    return { logout };
  }
};
</script>