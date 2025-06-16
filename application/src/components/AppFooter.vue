<template>
  <div class="footer">
    <ul class="list-btn">
      <li :class="{ active: $route.path === '/' || $route.path.startsWith('/capsula/') }">
        <router-link to="/">
          <img src="../../public/images/capsulas-icon.png" class="icon">
          Капсулы
        </router-link>
      </li>
      <li :class="{ active: $route.path === '/likes' }">
        <router-link to="/likes">
          <img src="../../public/images/like.png" class="icon">
          Лайки
        </router-link>
      </li>
      <li :class="{ active: $route.path === '/outfits' || $route.path.startsWith('/outfit/') || $route.path.startsWith('/item/') }">
        <router-link to="/outfits">
          <img src="../../public/images/outfits-icon.png" class="icon">
          Образы
        </router-link>
      </li>
    </ul>
  </div>
</template>
