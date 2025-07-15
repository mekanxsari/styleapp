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

    <div id="errorAlert" class="alert alert-danger alert-dismissible fade show" role="alert"
      style="display:none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
      Произошла ошибка. Пожалуйста, попробуйте позже.
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
              <input type="file" ref="capsuleImageInput" @change="handleImageUpload" accept="image/*"
                style="display: none;">
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
                  <option value="Зима">Зима</option>
                  <option value="Весна">Весна</option>
                  <option value="Лето">Лето</option>
                  <option value="Осень">Осень</option>
                </select>
              </div>

              <div class="form-group col-md-6">
                <label>Сезон 2</label>
                <select class="form-control" v-model="selectedCapsule.seasons[1]">
                  <option value="">Выберите сезон</option>
                  <option value="Зима">Зима</option>
                  <option value="Весна">Весна</option>
                  <option value="Лето">Лето</option>
                  <option value="Осень">Осень</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Описание</label>
              <textarea class="form-control" v-model="selectedCapsule.description" rows="3"></textarea>
            </div>

            <div class="form-group">
              <label>Назначить пользователям</label>
              <input type="text" class="form-control" v-model="editUserSearchQuery" @input="editSearchUsers"
                placeholder="Введите алиас пользователя" />
              <div class="mt-2">
                <button v-for="user in editSearchResults" :key="user.id"
                  class="btn btn-sm btn-outline-primary mr-1 mb-1" @click.prevent="editAddUser(user)">{{ user.alias
                  }}</button>
              </div>
              <div class="mt-2" style="display:flex; flex-wrap:wrap;">
                <span v-for="(id, idx) in editSelectedUserIds" :key="id" class="badge badge-info mr-1 mb-1"
                  style="display:inline-flex;align-items:center;padding:5px;">
                  {{ editSelectedUserAliases[idx] }}
                  <button class="close ml-1" @click.prevent="editRemoveUser(id)">&times;</button>
                </span>
              </div>
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
                        <button type="button" class="btn btn-sm btn-danger" @click="confirmOutfitDelete(outfit.id)"
                          title="Удалить">
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
import { API_URL, SITE_URL } from '../api'

export default {
  data() {
    return {
      editUserSearchQuery: '',
      editSearchResults: [],
      editSelectedUserIds: [],
      editSelectedUserAliases: [],
      SITE_URL,
      capsules: [],
      selectedCapsule: {
        id: null,
        title: '',
        image: '',
        seasons: ['', ''],
        description: '',
        outfits: []
      },
      uploadedImageFile: null,
      currentDeleteType: null,
      currentDeleteId: null
    }
  },
  mounted() {
    this.fetchCapsules();
  },
  methods: {
    async fetchCapsules() {
      try {
        const response = await fetch(`${API_URL}/stylist-capsulas`);
        const data = await response.json();
        this.capsules = data.map(c => ({
          id: c.id,
          title: c.title,
          image: `${SITE_URL}/app-images/${c.image_url}?t=${Date.now()}`,
          seasons: [c.season_1, c.season_2].filter(Boolean),
          description: c.description
        }));
      } catch (error) {
        console.error('Ошибка при загрузке капсул:', error);
      }
    },
    async openEditModal(capsule) {
      try {
        const response = await fetch(`${API_URL}/stylist-capsule/${capsule.id}`);
        const data = await response.json();
        const usersRes = await fetch(`${API_URL}/stylist-capsule/${capsule.id}/users`)
        if (usersRes.ok) {
          const users = await usersRes.json()
          this.editSelectedUserIds = users.map(u => u.id)
          this.editSelectedUserAliases = users.map(u => u.alias)
        } else {
          this.editSelectedUserIds = []
          this.editSelectedUserAliases = []
        }

        this.selectedCapsule = {
          id: data.id,
          title: data.title,
          image: `${SITE_URL}/app-images/${data.image_url}?t=${Date.now()}`,
          seasons: [data.season_1 || '', data.season_2 || ''],
          description: data.description || '',
          outfits: (data.outfits || []).map(o => ({
            id: o.id,
            title: o.title,
            image: `${SITE_URL}/app-images/${o.image_url}?t=${Date.now()}`,
            seasons: [o.season],
            label: o.label
          }))
        };

        this.uploadedImageFile = null;
        if (this.$refs.capsuleImageInput) this.$refs.capsuleImageInput.value = null;

        $('#editCapsuleModal').modal('show');
      } catch (error) {
        console.error('Ошибка при загрузке капсулы:', error);
      }
    },
    handleImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      this.uploadedImageFile = file;

      const reader = new FileReader();
      reader.onload = (event) => {
        this.selectedCapsule.image = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    async saveChanges() {
      if (!this.selectedCapsule.title || !this.selectedCapsule.seasons[0] || this.selectedCapsule.outfits.length === 0) {
        $('#errorAlert').fadeIn().text('Заполните все обязательные поля');
        setTimeout(() => { $('#errorAlert').fadeOut(); }, 3000);
        return;
      }

      const formData = new FormData();
      formData.append('title', this.selectedCapsule.title);
      formData.append('description', this.selectedCapsule.description || '');
      formData.append('season1', this.selectedCapsule.seasons[0]);
      formData.append('season2', this.selectedCapsule.seasons[1] || '');
      this.editSelectedUserIds.forEach(uid => {
        formData.append('user_ids[]', uid)
      })


      this.selectedCapsule.outfits.forEach(o => {
        formData.append('outfit_ids[]', o.id);
      });

      if (this.uploadedImageFile) {
        formData.append('image', this.uploadedImageFile);
      }

      try {
        await fetch(`${API_URL}/stylist-capsule/${this.selectedCapsule.id}`, {
          method: 'PUT',
          body: formData
        });

        await this.fetchCapsules();
        $('#editCapsuleModal').modal('hide');
        $('#saveSuccessAlert').fadeIn();
        setTimeout(() => { $('#saveSuccessAlert').fadeOut(); }, 3000);
      } catch (err) {
        console.error('Ошибка при сохранении изменений:', err);
        $('#errorAlert').fadeIn();
        setTimeout(() => { $('#errorAlert').fadeOut(); }, 3000);
      }
    },
    confirmDelete(id) {
      this.currentDeleteType = 'capsule';
      this.currentDeleteId = id;
      $('#deleteModal').modal('show');
    },
    confirmOutfitDelete(outfitId) {
      this.currentDeleteType = 'outfit';
      this.currentDeleteId = outfitId;
      $('#deleteModal').modal('show');
    },
    async deleteItem() {
      try {
        if (this.currentDeleteType === 'capsule') {
          await fetch(`${API_URL}/stylist-capsule/${this.currentDeleteId}`, { method: 'DELETE' });
          this.capsules = this.capsules.filter(c => c.id !== this.currentDeleteId);
          $('#deleteSuccessAlert').fadeIn();
        } else if (this.currentDeleteType === 'outfit') {
          await fetch(`${API_URL}/stylist-outfit/${this.currentDeleteId}`, { method: 'DELETE' });
          this.selectedCapsule.outfits = this.selectedCapsule.outfits.filter(o => o.id !== this.currentDeleteId);
          $('#deleteOutfitSuccessAlert').fadeIn();
        }
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        $('#errorAlert').fadeIn();
      }

      setTimeout(() => {
        $('#deleteSuccessAlert, #deleteOutfitSuccessAlert, #errorAlert').fadeOut();
      }, 3000);

      $('#deleteModal').modal('hide');
      this.currentDeleteId = null;
      this.currentDeleteType = null;
    },
    async editSearchUsers() {
      if (!this.editUserSearchQuery.trim()) {
        this.editSearchResults = []
        return
      }
      try {
        const res = await fetch(`${API_URL}/stylist-users/search?alias=${encodeURIComponent(this.editUserSearchQuery)}`)
        this.editSearchResults = await res.json()
      } catch {
        this.editSearchResults = []
      }
    },

    editAddUser(user) {
      if (!this.editSelectedUserIds.includes(user.id)) {
        this.editSelectedUserIds.push(user.id)
        this.editSelectedUserAliases.push(user.alias)
      }
    },

    editRemoveUser(userId) {
      const idx = this.editSelectedUserIds.indexOf(userId)
      if (idx !== -1) {
        this.editSelectedUserIds.splice(idx, 1)
        this.editSelectedUserAliases.splice(idx, 1)
      }
    },
  }
}
</script>