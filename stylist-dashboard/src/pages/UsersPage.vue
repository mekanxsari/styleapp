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
              data-target="#createOutfitModal">
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
              <button type="button" class="btn btn-danger" id="confirmDelete">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD ITEM MODAL -->
    <div class="modal fade align-items-center" id="addModal" tabindex="-1" role="dialog" aria-labelledby="addModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered align-items-center" role="document">
        <form id="addForm" enctype="multipart/form-data">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addModalLabel">Добавить одежда</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Изображение</label>
                <div class="image-upload-container" id="itemImageUploadArea">
                  <img id="itemPreview" src="" alt="Изображение" style="display: none;" />
                  <div class="upload-overlay" id="add-img-overlay" style="opacity: 1;">
                    <div class="text-center">
                      <i class="fas fa-camera fa-2x mb-2"></i>
                      <p>Нажмите для загрузки изображения</p>
                    </div>
                  </div>
                </div>
                <input type="file" id="itemImage" name="image" accept="image/*" style="display: none;" />
              </div>
              <div class="form-row mb-2">
                <div class="form-group col-md-6 mb-2">
                  <label>Название</label>
                  <input type="text" class="form-control" />
                </div>
                <div class="form-group col-md-6 mb-2">
                  <label>Тип одежды</label>
                  <select class="form-control" name="category" required>
                    <option value="">Выберите тип</option>
                    <option value="Верх">Верх</option>
                    <option value="Низ">Низ</option>
                    <option value="Верхняя одежда">Верхняя одежда</option>
                    <option value="Обувь">Обувь</option>
                    <option value="Аксессуар">Аксессуар</option>
                  </select>
                </div>
                <div class="form-group col-md-12 mb-2">
                  <label>Описание</label>
                  <textarea class="form-control" name="description"></textarea>
                </div>
                <div class="form-group col-md-6 mb-2">
                  <label>Артикул</label>
                  <input type="text" class="form-control" name="artikul" />
                </div>
                <div class="form-group col-md-6 mb-3">
                  <label>Название магазина</label>
                  <input type="text" class="form-control" name="store_name" />
                </div>
                <div class="form-group col-md-12 mb-3">
                  <label>Ссылка на магазин</label>
                  <input type="url" class="form-control" name="store_url" pattern="https?://.+" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
              <button type="button" class="btn btn-primary" id="confirmAdd">Добавить</button>
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
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Код</label>
                  <input type="text" class="form-control" value="" />
                </div>

                <div class="form-group col-md-6">
                  <label>ФИО</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Дата рождения</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Город проживания</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Номер телефона</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Email</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Профессия</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Семейное положение</label><br>
                  <input class="form-check-input ml-2" type="radio" name="profession" value="option1" id="radio1" checked disabled>
                  <label class="form-check-label ml-4" for="radio1">Замужем</label>
                  <input class="form-check-input ml-2" type="radio" name="profession" value="option2" id="radio2" disabled>
                  <label class="form-check-label ml-4" for="radio2">Не замужем</label>
                </div>

              </div>

              <h5 class="w-100 mt-3 mb-2 border-bottom pb-2">Размеры</h5>
              <div class="form-row mt-3">
                <div class="form-group col-md-6">
                  <label>Размер одежды верха</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Размер одежды низа</label>
                    <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Размер обуви</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Особенности при выборе обуви</label>
                  <textarea class="form-control" rows="3" placeholder="" disabled ></textarea>
                </div>

                <div class="form-group col-md-6">
                  <label>Рост</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Обхват груди</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Окружность плеч</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Обхват талии</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Обхват бедер</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>
              </div>

              <h5 class="w-100 mt-3 mb-2 border-bottom pb-2">Дополнительные вопросы</h5>
              <div class="form-row mt-3">
                <div class="form-group col-md-6">
                  <label>Цвет глаз</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Цвет волос</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Цель обращения к стилисту</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Опыт работы со стилистом</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Наиболее носимые элементы гардероба</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Характеристика себя клиентом</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Желаемое впечатление от образа</label>
                  <textarea class="form-control" rows="3" placeholder="" disabled ></textarea>
                </div>

                <div class="form-group col-md-6">
                  <label>Предпочитаемые бренды одежды</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Любимые и подходящие цвета</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Коррекция и акценты фигуры</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>

                <div class="form-group col-md-6">
                  <label>Образ жизни и привычки</label>
                  <textarea class="form-control" rows="3" placeholder="" disabled ></textarea>
                </div>

                <div class="form-group col-md-6">
                  <label>Бюджет на шоппинг</label>
                  <input type="text" class="form-control" value="" disabled />
                </div>
              </div>

              <h5 class="w-100 mt-3 mb-2 border-bottom pb-2">Фотографии</h5>
              <div class="form-row mt-3">
                <div v-for="(img, index) in images" :key="index" class="col-md-3 mb-3">
                  <img :src="img" alt="Фото" class="img-thumbnail preview-image" @click="openFullscreen(img)" />
                </div>
              </div>

              <div v-if="fullscreenImage" class="fullscreen-overlay" @click="closeFullscreen">
                <img :src="fullscreenImage" alt="Полноэкранное фото" class="fullscreen-image" />
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
              <button type="button" class="btn btn-primary" id="confirmEdit">Сохранить изменения</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- CREATE OUTFIT MODAL -->
    <div class="modal fade" id="createOutfitModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createOutfitModalLabel">Создать новый образ</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="createOutfitForm">
            <div class="modal-body">
              <div class="form-group">
                <label>Изображение</label>
                <div class="image-upload-container" id="outfitImageUploadArea">
                  <img id="outfitPreview" src="" alt="Изображение образа"
                    style="display: none; height: 200px; width: auto;" />
                  <div class="upload-overlay" style="opacity: 1;">
                    <div class="text-center">
                      <i class="fas fa-camera fa-2x mb-2"></i>
                      <p>Нажмите для загрузки изображения</p>
                    </div>
                  </div>
                </div>
                <input type="file" id="outfitImage" accept="image/*" name="image" style="display: none;" />
              </div>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="outfitTitle">Название образа</label>
                  <input type="text" class="form-control" id="outfitTitle" placeholder="Введите название образа" />
                </div>

                <div class="form-group col-md-6">
                  <label>Категория</label>
                  <select class="form-control" name="category" id="outfitCategory" required>
                    <option value="">Выберите категорию</option>
                    <option value="Романтический">Романтический</option>
                    <option value="Повседневный">Повседневный</option>
                    <option value="Кэжуал">Кэжуал</option>
                    <option value="Спортивный">Спортивный</option>
                    <option value="Элегантный">Элегантный</option>
                    <option value="Пляж">Пляж</option>
                    <option value="Коктейльный">Коктейльный</option>
                    <option value="Минималистичный">Минималистичный</option>
                  </select>

                </div>

                <div class="form-group col-md-6">
                  <label>Сезон</label>
                  <select class="form-control" name="season" id="outfitSeason" required>
                    <option value="">Выберите сезон</option>
                    <option value="Зима">Зима</option>
                    <option value="Весна">Весна</option>
                    <option value="Лето">Лето</option>
                    <option value="Осень">Осень</option>
                  </select>
                </div>

                <div class="form-group col-md-12">
                  <label for="outfitDescription">Описание</label>
                  <textarea class="form-control" id="outfitDescription" rows="3"
                    placeholder="Введите описание образа"></textarea>
                </div>
              </div>

              <hr />
              <h5 class="mb-3">Выбранные одежды</h5>
              <div class="row" id="selectedItemsPreview"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
              <button type="button" class="btn btn-primary" id="confirmCreateOutfit">Создать образ</button>
            </div>
          </form>
        </div>
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

  <div id="createOutfitSuccess" class="alert alert-success alert-dismissible fade show" role="alert"
    style="display: none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
    Образ успешно создан!
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { API_URL } from '../api'

const users = ref([])
const errorMessage = ref('')

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

const images = ref([
  'https://randomwordgenerator.com/img/picture-generator/52e4d2464356af14f1dc8460962e33791c3ad6e04e5074417d2e72d6934cc5_640.jpg',
  'https://randomwordgenerator.com/img/picture-generator/54e7d64a4b53a914f1dc8460962e33791c3ad6e04e50744172297cdd9444cc_640.jpg',
  'https://randomwordgenerator.com/img/picture-generator/5ee2d3424a57b10ff3d8992cc12c30771037dbf85254794e722679d7934d_640.jpg',
  'https://randomwordgenerator.com/img/picture-generator/55e2d6474950af14f1dc8460962e33791c3ad6e04e507441722872d69049cc_640.jpg',
])

const fullscreenImage = ref(null)

function openFullscreen(img) {
  fullscreenImage.value = img
}

function closeFullscreen() {
  fullscreenImage.value = null
}

onMounted(() => {
  fetchUsers()
})
</script>