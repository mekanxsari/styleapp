<template>
  <div class="main-container">
    <div class="profile-container">
      <ul class="profile-heading">
        <li class="username">Ivan Ivanov</li>
        <li class="spisok">
          <router-link to="/likes">Мои списки</router-link>
        </li>
      </ul>

      <div class="profile-img">
        <img
          src="https://img.freepik.com/free-photo/portrait-smiley-woman_23-2148827181.jpg?semt=ais_hybrid&w=740"
          class="profile-img-source"
          alt=""
        />
      </div>

      <ul class="menu-options">
        <li>
          <router-link to="/profile/personal">Персональные данные</router-link>
        </li>
        <li>
          <router-link to="/profile/sizes">Ваши размеры</router-link>
        </li>
        <li>
          <router-link to="/profile/additional">Дополнительные вопросы</router-link>
        </li>
        <li>
          <router-link to="/profile/upload">Отправка фотографий</router-link>
        </li>
        <li class="logout">
          <router-link to="/logout">Выйти</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>