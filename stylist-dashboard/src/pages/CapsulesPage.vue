<template>
  <div class="content-wrapper">
    <!-- Success Alerts -->
    <div id="deleteSuccessAlert" class="alert alert-success alert-dismissible fade show" role="alert"
      style="display:none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
      Капсула успешно удалена!
    </div>

    <div id="deleteOutfitSuccessAlert" class="alert alert-success alert-dismissible fade show" role="alert"
      style="display:none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
      Образ успешно удален!
    </div>

    <div id="saveSuccessAlert" class="alert alert-success alert-dismissible fade show" role="alert"
      style="display:none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
      Изменения успешно сохранены!
    </div>

    <div class="container-fluid py-2">
      <div class="card mb-4">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center flex-wrap">
            <form class="form-inline mb-2 mb-md-0" style="flex: 1 1 auto;">
              <div class="input-group mr-2 mb-2">
                <input type="text" class="form-control search" placeholder="Поиск..." aria-label="Поиск">
              </div>
              <div class="form-group mr-2 mb-2">
                <select class="form-control search-select">
                  <option value="" selected>Все</option>
                  <option value="title">Название</option>
                  <option value="category">Сезон</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary mb-2">Поиск</button>
            </form>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div class="row" id="capsules-container">
            <div class="col-md-4" v-for="capsule in capsules" :key="capsule.id">
              <div class="card outfit-card">
                <div class="outfit-img-container">
                  <img :src="capsule.image" class="outfit-img" :alt="capsule.title">
                </div>
                <div class="outfit-title">
                  {{ capsule.title }}
                  <div class="float-right" style="margin-top: 7px;">
                    <button class="btn btn-sm btn-warning" style="margin-right: 5px;" @click="openEditModal(capsule)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" @click="confirmDelete(capsule.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                  <div style="font-weight: normal;font-size: 14px;">{{ capsule.seasons.join(' | ') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Edit Modal -->
  <div class="modal fade" id="editCapsuleModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Редактирование капсулы</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveChanges">
            <div class="form-group">
              <label>Изображение</label>
              <div class="image-upload-container" @click="$refs.capsuleImageInput.click()">
                <img :src="selectedCapsule.image" class="img-fluid" style="height: 200px; width: 100%;">
                <div class="upload-overlay">
                  <div class="text-center">
                    <i class="fas fa-camera fa-2x mb-2"></i>
                    <p>Нажмите для загрузки нового изображения</p>
                  </div>
                </div>
              </div>
              <input type="file" ref="capsuleImageInput" @change="handleImageUpload" accept="image/*" style="display: none;">
            </div>

            <div class="form-group">
              <label>Название капсулы</label>
              <input type="text" class="form-control" v-model="selectedCapsule.title" required>
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
                <label>Сезон 1</label>
                <select class="form-control" v-model="selectedCapsule.seasons[0]" required>
                  <option value="">Выберите сезон</option>
                  <option value="winter">Зима</option>
                  <option value="spring">Весна</option>
                  <option value="summer">Лето</option>
                  <option value="autumn">Осень</option>
                </select>
              </div>

              <div class="form-group col-md-6">
                <label>Сезон 2</label>
                <select class="form-control" v-model="selectedCapsule.seasons[1]" required>
                  <option value="">Выберите сезон</option>
                  <option value="winter">Зима</option>
                  <option value="spring">Весна</option>
                  <option value="summer">Лето</option>
                  <option value="autumn">Осень</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Описание</label>
              <textarea class="form-control" v-model="selectedCapsule.description" rows="3"></textarea>
            </div>

            <hr>
            <h5 class="mb-3">Образы в капсуле</h5>
            <div class="container d-flex justify-content-center">
              <div class="row" style="max-width: 720px; width: 100%;">
                <div class="col-md-6" v-for="outfit in selectedCapsule.outfits" :key="outfit.id">
                  <div class="card outfit-card outfit-list-card" style="margin-left: 9px;margin-right: 9px;">
                    <div class="outfit-img-container">
                      <img :src="outfit.image" class="outfit-img" alt="Образ">
                    </div>
                    <div class="outfit-title">
                      {{ outfit.title }}
                      <div class="float-right" style="margin-top: 7px;">
                        <button type="button" class="btn btn-sm btn-danger" @click="confirmOutfitDelete(outfit.id)" title="Удалить">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                      <div style="font-weight: normal; font-size: 14px;">{{ outfit.seasons.join(' | ') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
              <button type="submit" class="btn btn-primary">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog">
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
            <button type="button" class="btn btn-danger" @click="deleteItem">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      capsules: [
        {
          id: 1,
          title: "На отдых",
          image: "https://mekanxsari.ru/app-images/51.jpg",
          seasons: ["Summer", "Winter"],
          description: "Капсула для отдыха",
          outfits: [
            {
              id: 1,
              title: "Пляжный образ",
              image: "https://mekanxsari.ru/app-images/48.jpg",
              seasons: ["Summer"],
              description: "Легкий пляжный образ"
            },
            {
              id: 2,
              title: "Вечерний образ",
              image: "https://mekanxsari.ru/app-images/49.jpg",
              seasons: ["Summer", "Winter"],
              description: "Элегантный вечерний наряд"
            }
          ]
        },
        {
          id: 2,
          title: "Office siren",
          image: "https://mekanxsari.ru/app-images/57.jpg",
          seasons: ["Summer", "Winter"],
          description: "Офисный стиль",
          outfits: [
            {
              id: 3,
              title: "Деловой костюм",
              image: "https://mekanxsari.ru/app-images/50.jpg",
              seasons: ["Summer", "Winter"],
              description: "Классический деловой образ"
            },
            {
              id: 4,
              title: "Повседневный офис",
              image: "https://mekanxsari.ru/app-images/51.jpg",
              seasons: ["Summer"],
              description: "Неформальный офисный стиль"
            }
          ]
        },
        {
          id: 3,
          title: "На зиму",
          image: "https://mekanxsari.ru/app-images/63.jpg",
          seasons: ["Winter"],
          description: "Зимняя капсула",
          outfits: [
            {
              id: 5,
              title: "Теплый комплект",
              image: "https://mekanxsari.ru/app-images/52.jpg",
              seasons: ["Winter"],
              description: "Теплая зимняя одежда"
            }
          ]
        },
        {
          id: 4,
          title: "Спортивный",
          image: "https://mekanxsari.ru/app-images/69.jpg",
          seasons: ["Summer", "Spring"],
          description: "Спортивная одежда",
          outfits: [
            {
              id: 6,
              title: "Тренировочный комплект",
              image: "https://mekanxsari.ru/app-images/53.jpg",
              seasons: ["Summer", "Spring"],
              description: "Для занятий спортом"
            },
            {
              id: 7,
              title: "Прогулочный комплект",
              image: "https://mekanxsari.ru/app-images/54.jpg",
              seasons: ["Spring"],
              description: "Для активного отдыха"
            }
          ]
        }
      ],
      selectedCapsule: {
        id: null,
        title: '',
        image: '',
        seasons: ['', ''],
        description: '',
        outfits: []
      },
      currentDeleteType: null, // 'capsule' or 'outfit'
      currentDeleteId: null
    }
  },
  methods: {
    openEditModal(capsule) {
      this.selectedCapsule = JSON.parse(JSON.stringify(capsule));
      $('#editCapsuleModal').modal('show');
    },
    confirmDelete(id) {
      this.currentDeleteType = 'capsule';
      this.currentDeleteId = id;
      $('#deleteModal').modal('show');
    },
    confirmOutfitDelete(id) {
      this.currentDeleteType = 'outfit';
      this.currentDeleteId = id;
      $('#deleteModal').modal('show');
    },
    deleteItem() {
      if (this.currentDeleteType === 'capsule') {
        this.capsules = this.capsules.filter(c => c.id !== this.currentDeleteId);
        $('#deleteModal').modal('hide');
        $('#deleteSuccessAlert').fadeIn();
        setTimeout(() => {
          $('#deleteSuccessAlert').fadeOut();
        }, 3000);
      } else if (this.currentDeleteType === 'outfit') {
        this.selectedCapsule.outfits = this.selectedCapsule.outfits.filter(o => o.id !== this.currentDeleteId);
        $('#deleteModal').modal('hide');
        $('#deleteOutfitSuccessAlert').fadeIn();
        setTimeout(() => {
          $('#deleteOutfitSuccessAlert').fadeOut();
        }, 3000);
      }
    },
    saveChanges() {
      const index = this.capsules.findIndex(c => c.id === this.selectedCapsule.id);
      if (index >= 0) {
        this.capsules.splice(index, 1, {...this.selectedCapsule});
      }
      $('#editCapsuleModal').modal('hide');
      $('#saveSuccessAlert').fadeIn();
      setTimeout(() => {
        $('#saveSuccessAlert').fadeOut();
      }, 3000);
    },
    handleImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        this.selectedCapsule.image = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
</script>