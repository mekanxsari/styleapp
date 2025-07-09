<template>
    <div class="main-container">
        <div class="profile-container">
            <ul class="profile-heading">
                <li class="title-page">Дополнительные вопросы</li>
                <li class="spisok"><a href="#">Мои списки</a></li>
            </ul>

            <form class="user-form" @submit.prevent="onSubmit">
                <label class="user-label">Цвет глаз</label>
                <input v-model="eyeColor" type="text" class="user-input" placeholder="Введите здесь..." />

                <label class="user-label">Цвет волос</label>
                <input v-model="hairColor" type="text" class="user-input" placeholder="Введите здесь..." />

                <label class="user-label">Ваша цель обращения к стилисту</label>
                <input v-model="aim" type="text" class="user-input" placeholder="Введите здесь..." />

                <label class="user-label">Был ли опыт работы со стилистом?</label>
                <input v-model="experience" type="text" class="user-input" placeholder="Введите здесь..." />

                <label class="user-label">Какие вещи из Вашего гардероба Вы носите чаще всего?</label>
                <input v-model="wardrobe" type="text" class="user-input" placeholder="Введите здесь..." />

                <label class="user-label">Какими прилагательными Вы можете охарактеризовать себя?</label>
                <input v-model="labels" type="text" class="user-input" placeholder="Введите здесь..." />

                <label class="user-label">
                    Какое впечатление Вы бы хотели производить на окружающих?
                </label>
                <div class="checkbox" v-for="(impressionType, index) in impressionTypes" :key="'type' + index">
                    <input type="checkbox" :id="'type' + index" :value="impressionType"
                        v-model="selectedImpressionTypes" />
                    <label :for="'type' + index">{{ impressionType }}</label>
                </div>

                <label class="user-label">Одежду каких марок обычно приобретаете?</label>
                <input v-model="brand" type="text" class="user-input" placeholder="Введите здесь..." />

                <label class="user-label">Какие цвета Вам нравятся? Какие цвета, по Вашему мнению, Вам идут?</label>
                <input v-model="colors" type="text" class="user-input" placeholder="Введите здесь..." />

                <label class="user-label">Что хотите откорректировать, «спрятать» или наоборот, чем гордитесь в своей
                    фигуре?</label>
                <input v-model="body" type="text" class="user-input" placeholder="Введите здесь..." />

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
                <input v-model="budget" type="text" class="user-input" placeholder="Введите здесь..." required />

                <button type="submit" class="user-submit">Подтвердить</button>
            </form>
        </div>
    </div>
    <div class="inline-space"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '../api'

const router = useRouter()
const userId = localStorage.getItem('user_id')

// Checkbox options
const impressionTypes = [
  'Актуальное, современное',
  'Женственное',
  'Чувственное, сексуальное',
  'Доверие и уют',
  'Благородно и дорого',
  'Респектабельное и элегантное',
  'Трендовое',
  'Креативное'
]

const outfitTypes = [
  'Работа',
  'Учеба',
  'В декрете по уходу за ребенком',
  'Отдых в кругу семьи и друзей',
  'Спорт',
  'Торжественные мероприятия',
  'Свидание'
]

// Form values
const eyeColor = ref('')
const hairColor = ref('')
const aim = ref('')
const experience = ref('')
const wardrobe = ref('')
const labels = ref('')
const brand = ref('')
const colors = ref('')
const body = ref('')
const budget = ref('')

const selectedImpressionTypes = ref([])
const selectedOutfitTypes = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/user-additional`, {
      headers: {
        'x-user-id': userId
      }
    })

    const data = await res.json()
    if (data.success) {
      const u = data.user
      eyeColor.value = u.eye_color || ''
      hairColor.value = u.hair_color || ''
      aim.value = u.aim_description || ''
      experience.value = u.experience_description || ''
      wardrobe.value = u.wardrobe_description || ''
      labels.value = u.labels_description || ''
      brand.value = u.brand_description || ''
      colors.value = u.colors_description || ''
      body.value = u.body_description || ''
      budget.value = u.budget_description || ''
      selectedImpressionTypes.value = u.impression_description || []
      selectedOutfitTypes.value = u.outfit_description || []
    }
  } catch (err) {
    console.error('Ошибка при загрузке данных:', err)
  }
})

async function onSubmit() {
  try {
    const res = await fetch(`${API_URL}/user-additional`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify({
        eye_color: eyeColor.value,
        hair_color: hairColor.value,
        aim_description: aim.value,
        experience_description: experience.value,
        wardrobe_description: wardrobe.value,
        labels_description: labels.value,
        impression_description: selectedImpressionTypes.value,
        brand_description: brand.value,
        colors_description: colors.value,
        body_description: body.value,
        outfit_description: selectedOutfitTypes.value,
        budget_description: budget.value
      })
    })

    const data = await res.json()
    if (data.success) {
      router.push('/profile')
    } else {
      alert('Ошибка при сохранении: ' + data.message)
    }
  } catch (err) {
    console.error('Ошибка при отправке данных:', err)
    alert('Произошла ошибка при отправке данных.')
  }
}
</script>