<template>
  <div class="content-wrapper" style="background: #fff;">
    <div class="container-fluid py-2">
      <div class="card mb-4">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center flex-wrap">
            <form class="form-inline mb-2 mb-md-0" style="flex: 1 1 auto;">
              <div class="input-group mr-2 mb-2">
                <input type="text" class="form-control search" placeholder="Поиск..." aria-label="Поиск" />
              </div>
              <div class="form-group mr-2 mb-2">
                <select class="form-control search-select">
                  <option value="">Все</option>
                  <option value="id">ID</option>
                  <option value="title">Название</option>
                  <option value="category">Тип</option>
                  <option value="artikul">Артикул</option>
                  <option value="store_name">Название магазина</option>
                </select>
              </div>
              <button @click.prevent="handleSearch" type="submit" class="btn btn-primary mb-2">Поиск</button>
              <button type="button" class="btn btn-secondary mb-2 ml-2" @click="clearSearch">Сбросить</button>

            </form>
            <button class="btn btn-primary ml-md-3 mb-2" style="white-space: nowrap;" data-toggle="modal"
              data-target="#addModal">
              <i class="fas fa-plus-circle"></i> Добавить пользователь
            </button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body p-0">
          <table class="table table-bordered table-striped mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Телеграм алиас</th>
                <th>ФИО</th>
                <th>Город проживания</th>
                <th>Клиент?</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" :data-id="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.alias }}</td>
                <td>{{ user.full_name }}</td>
                <td>{{ user.current_city }}</td>
                <td>{{ user.passcode && user.passcode.trim() !== '' ? 'Да' : 'Нет' }}</td>
                <td>
                  <button class="btn btn-sm btn-warning mr-1" data-toggle="modal" data-target="#showModal"
                    @click="openshowModal(user)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-danger btn-delete" @click="prepareDelete(user.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- DELETE ITEM MODAL -->
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered delete-confirm-modal" role="document">
        <div class="modal-content">
          <div class="modal-header border-0">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <i class="fas fa-exclamation-circle"></i>
            <h4>Вы уверены, что хотите удалить?</h4>
            <p>Это действие нельзя отменить. Все данные будут удалены безвозвратно.</p>
            <div class="delete-confirm-buttons mt-4">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
              <button type="button" class="btn btn-danger" @click="confirmDelete">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD USER MODAL -->
    <div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="addModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <form id="addForm" @submit.prevent>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addModalLabel">Добавить пользователь</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body">
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label>Телеграм алиас (без @)</label>
                  <input type="text" class="form-control" name="telegram-alias" v-model="newUser.alias" />
                </div>
                <div class="form-group col-md-12">
                  <label>Код</label>
                  <input type="text" class="form-control" name="passcode" v-model="newUser.passcode" />
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
              <button type="button" class="btn btn-primary" id="confirmAdd" @click="submitNewUser"
                :disabled="isAddDisabled">
                Добавить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>


    <!-- SHOW USER INFORMATION MODAL -->
    <div class="modal fade" id="showModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <form id="editForm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Информация о пользователе</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h5 class="w-100 mt-3 mb-2 border-bottom pb-2">Персональные данные</h5>
              <div class="form-row mt-3">

                <div class="form-group col-md-6">
                  <label>Телеграм алиас</label>
                  <input type="text" class="form-control" :value="selectedUser?.alias || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Код</label>
                  <div v-if="selectedUser">
                    <input type="text" class="form-control" v-model="selectedUser.passcode" />
                  </div>
                </div>

                <div class="form-group col-md-6">
                  <label>ФИО</label>
                  <input type="text" class="form-control" :value="selectedUser?.full_name || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Дата рождения</label>
                  <input type="text" class="form-control" :value="selectedUser?.birth_date || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Город проживания</label>
                  <input type="text" class="form-control" :value="selectedUser?.current_city || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Номер телефона</label>
                  <input type="text" class="form-control" :value="selectedUser?.phone_number || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Email</label>
                  <input type="text" class="form-control" :value="selectedUser?.email || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Профессия</label>
                  <input type="text" class="form-control" :value="selectedUser?.profession || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Семейное положение</label><br />
                  <input class="form-check-input ml-2" type="radio" name="marital_status" id="radio1" value="true"
                    :checked="selectedUser?.marital_status === true" disabled />
                  <label class="form-check-label ml-4" for="radio1">Замужем</label>
                  <input class="form-check-input ml-2" type="radio" name="marital_status" id="radio2" value="false"
                    :checked="selectedUser?.marital_status === false" disabled />
                  <label class="form-check-label ml-4" for="radio2">Не замужем</label>
                </div>
              </div>

              <h5 class="w-100 mt-3 mb-2 border-bottom pb-2">Размеры</h5>
              <div class="form-row mt-3">
                <div class="form-group col-md-6">
                  <label>Размер одежды верха</label>
                  <input type="text" class="form-control" :value="selectedUser?.top_size || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Размер одежды низа</label>
                  <input type="text" class="form-control" :value="selectedUser?.bottom_size || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Размер обуви</label>
                  <input type="text" class="form-control" :value="selectedUser?.shoe_size || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Особенности при выборе обуви</label>
                  <textarea class="form-control" rows="3" disabled>{{ selectedUser?.shoe_description || '' }}</textarea>
                </div>

                <div class="form-group col-md-6">
                  <label>Рост</label>
                  <input type="text" class="form-control" :value="selectedUser?.height || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Обхват груди</label>
                  <input type="text" class="form-control" :value="selectedUser?.chest_circumference || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Окружность плеч</label>
                  <input type="text" class="form-control" :value="selectedUser?.shoulder_circumference || ''"
                    disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Обхват талии</label>
                  <input type="text" class="form-control" :value="selectedUser?.waist_circumference || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Обхват бедер</label>
                  <input type="text" class="form-control" :value="selectedUser?.hip_circumference || ''" disabled />
                </div>
              </div>

              <h5 class="w-100 mt-3 mb-2 border-bottom pb-2">Дополнительные вопросы</h5>
              <div class="form-row mt-3">
                <div class="form-group col-md-6">
                  <label>Цвет глаз</label>
                  <input type="text" class="form-control" :value="selectedUser?.eye_color || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Цвет волос</label>
                  <input type="text" class="form-control" :value="selectedUser?.hair_color || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Цель обращения к стилисту</label>
                  <input type="text" class="form-control" :value="selectedUser?.aim_description || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Опыт работы со стилистом</label>
                  <input type="text" class="form-control" :value="selectedUser?.experience_description || ''"
                    disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Наиболее носимые элементы гардероба</label>
                  <input type="text" class="form-control" :value="selectedUser?.wardrobe_description || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Характеристика себя клиентом</label>
                  <input type="text" class="form-control" :value="selectedUser?.labels_description || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Желаемое впечатление от образа</label>
                  <textarea class="form-control" rows="3"
                    disabled>{{ Array.isArray(selectedUser?.impression_description) ? selectedUser.impression_description.join(', ') : (selectedUser?.impression_description || '') }}</textarea>
                </div>

                <div class="form-group col-md-6">
                  <label>Предпочитаемые бренды одежды</label>
                  <input type="text" class="form-control" :value="selectedUser?.brand_description || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Любимые и подходящие цвета</label>
                  <input type="text" class="form-control" :value="selectedUser?.colors_description || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Коррекция и акценты фигуры</label>
                  <input type="text" class="form-control" :value="selectedUser?.body_description || ''" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Образ жизни и привычки</label>
                  <textarea class="form-control" rows="3"
                    disabled>{{ selectedUser?.outfit_description && Array.isArray(selectedUser.outfit_description) ? selectedUser.outfit_description.join(', ') : (selectedUser?.outfit_description || '') }}</textarea>
                </div>

                <div class="form-group col-md-6">
                  <label>Бюджет на шоппинг</label>
                  <input type="text" class="form-control" :value="selectedUser?.budget_description || ''" disabled />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Отмена
              </button>
              <button type="button" class="btn btn-primary" :disabled="!isPasscodeChanged"
                @click="editPasscode(selectedUser)">
                Сохранить изменения
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- SUCCESS ALERT -->
  <div id="deleteSuccess" class="alert alert-success alert-dismissible fade show" role="alert"
    style="display: none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
    Элемент успешно удалён!
    <button type="button" class="close" data-dismiss="alert" aria-label="Закрыть">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>

  <div id="editSuccess" class="alert alert-success alert-dismissible fade show" role="alert"
    style="display: none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
    Элемент успешно редактирован!
    <button type="button" class="close" data-dismiss="alert" aria-label="Закрыть">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>

  <div id="createUserSuccess" class="alert alert-success alert-dismissible fade show" role="alert"
    style="display: none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
    пользователь успешно создан!
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { API_URL } from '../api'

const users = ref([])
const selectedUser = ref(null)
const originalPasscode = ref('')
const isPasscodeChanged = ref(false)
const errorMessage = ref('')
const newUser = ref({ alias: '', passcode: '' })
const deleteUserId = ref(null)

const isAddDisabled = computed(() => {
  return newUser.value.alias.trim() === '' || newUser.value.passcode.trim() === ''
})

async function fetchUsers() {
  try {
    const response = await fetch(`${API_URL}/stylist-users`)
    if (!response.ok) throw new Error('Ошибка при загрузке пользователей.')
    const data = await response.json()
    users.value = data
  } catch (err) {
    console.error('Fetch error:', err)
    errorMessage.value = 'Не удалось загрузить пользователей.'
  }
}

async function submitNewUser() {
  try {
    const response = await fetch(`${API_URL}/stylist-users/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alias: newUser.value.alias.trim(),
        passcode: newUser.value.passcode.trim()
      })
    })

    if (!response.ok) throw new Error('Ошибка при добавлении пользователя')

    $('#addModal').modal('hide')
    $('#createUserSuccess').fadeIn().delay(2000).fadeOut()
    await fetchUsers()
    newUser.value = { alias: '', passcode: '' }
  } catch (err) {
    console.error('Ошибка при добавлении:', err)
    errorMessage.value = 'Ошибка при создании пользователя'
  }
}

async function openshowModal(user) {
  try {
    const response = await fetch(`${API_URL}/stylist-users/single/view/${user.id}`)
    if (!response.ok) throw new Error('Error fetching user details')
    const data = await response.json()
    selectedUser.value = { ...data }
    originalPasscode.value = data.passcode || ''
    isPasscodeChanged.value = false
    $('#showModal').modal('show')
  } catch (err) {
    console.error('Error opening modal:', err)
    errorMessage.value = 'Failed to load user details'
  }
}

watch(
  () => selectedUser.value?.passcode,
  (newVal) => {
    isPasscodeChanged.value = newVal !== originalPasscode.value
  }
)

async function editPasscode(user) {
  if (!isPasscodeChanged.value || !user?.id) return

  try {
    const response = await fetch(`${API_URL}/stylist-users/single/update-passcode/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: user.passcode })
    })

    if (!response.ok) throw new Error('Failed to update passcode')
    $('#showModal').modal('hide')
    $('#editSuccess').fadeIn().delay(2000).fadeOut()
    isPasscodeChanged.value = false
    originalPasscode.value = user.passcode
  } catch (err) {
    console.error('Passcode update error:', err)
    errorMessage.value = 'Ошибка при сохранении кода'
  }
}

function prepareDelete(id) {
  deleteUserId.value = id
  $('#deleteModal').modal('show')
}

async function confirmDelete() {
  if (!deleteUserId.value) return

  try {
    const response = await fetch(`${API_URL}/stylist-users/delete/${deleteUserId.value}`, {
      method: 'DELETE'
    })

    if (!response.ok) throw new Error('Ошибка при удалении пользователя')

    $('#deleteModal').modal('hide')
    $('#deleteSuccess').fadeIn().delay(2000).fadeOut()

    await fetchUsers()
    deleteUserId.value = null
  } catch (err) {
    console.error('Ошибка при удалении:', err)
    errorMessage.value = 'Не удалось удалить пользователя'
  }
}

onMounted(() => {
  fetchUsers()

  $('#addModal').on('show.bs.modal', () => {
    newUser.value = { alias: '', passcode: '' }
  })
})
</script>