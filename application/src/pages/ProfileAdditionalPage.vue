<template>
    <div class="main-container">
        <div class="profile-container">
            <ul class="profile-heading">
                <li class="title-page">Дополнительные вопросы</li>
                <li class="spisok"><a href="#">Мои списки</a></li>
            </ul>

            <form class="user-form" @submit.prevent="onSubmit">
                <label class="user-label">Цвет глаз</label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <label class="user-label">Цвет волос</label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <label class="user-label">Ваша цель обращения к стилисту</label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <label class="user-label">Был ли опыт работы со стилистом?</label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <label class="user-label">Какие вещи из Вашего гардероба Вы носите чаще всего?</label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <label class="user-label">Какими прилагательными Вы можете охарактеризовать себя?</label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <label class="user-label">
                    Какое впечатление Вы бы хотели производить на окружающих?
                </label>
                <div class="checkbox" v-for="(impressionType, index) in impressionTypes" :key="'type' + index">
                    <input type="checkbox" :id="'type' + index" :value="impressionType"
                        v-model="selectedImpressionTypes" />
                    <label :for="'type' + index">{{ impressionType }}</label>
                </div>

                <label class="user-label">Одежду каких марок обычно приобретаете?</label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <label class="user-label">Какие цвета Вам нравятся? Какие цвета, по Вашему мнению, Вам идут?</label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <label class="user-label">Что хотите откорректировать, «спрятать» или наоборот, чем гордитесь в своей
                    фигуре?</label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <label class="user-label">
                    Образ жизни (куда чаще всего ходите, где проводите свободное время, насколько активна Ваша деятельность).
                </label>
                <div class="checkbox" v-for="(outfitType, index) in outfitTypes" :key="'type' + index">
                    <input type="checkbox" :id="'type' + index" :value="outfitType"
                        v-model="selectedOutfitTypes" />
                    <label :for="'type' + index">{{ outfitType }}</label>
                </div>

                <label class="user-label">
                    Сколько Вы приблизительно готовы потратить на одежду и аксессуары на шоппинге со мной?
                </label>
                <input type="text" class="user-input" placeholder="Введите здесь..." required />

                <button type="submit" class="user-submit">Подтвердить</button>
            </form>
        </div>
    </div>
    <div class="inline-space"></div>
</template>
<script setup>
import { ref } from 'vue'

const impressionTypes = ['Актуальное, современное', 'Женственное', 'Чувственное, сексуальное', 'Доверие и уют', 'Благородно и дорого', 'Респектабельное и элегантное', 'Трендовое', 'Креативное']
const selectedImpressionTypes = ref([])

const outfitTypes = ['Работа', 'Учеба', 'В декрете по уходу за ребенком', 'Отдых в кругу семьи и друзей', 'Спорт', 'Торжественные мероприятия', 'Свидание']
const selectedOutfitTypes = ref([])
</script>