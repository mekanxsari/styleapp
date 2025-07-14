<template>
  <div class="content-wrapper" style="background: #fff;">
    <div class="container-fluid py-2">
      <div class="card mb-4">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center flex-wrap">
            <form class="form-inline mb-2 mb-md-0" style="flex: 1 1 auto;">
              <div class="input-group mr-2 mb-2">
                <input v-model="searchText" type="text" class="form-control search" placeholder="Поиск..."
                  aria-label="Поиск" />
              </div>
              <div class="form-group mr-2 mb-2">
                <select v-model="searchField" class="form-control search-select">
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
            <button class="btn btn-success ml-md-3 mb-2" style="white-space: nowrap;" data-toggle="modal"
              data-target="#addModal">
              <i class="fas fa-plus"></i> Добавить одежда
            </button>
            <button class="btn btn-primary ml-md-3 mb-2" style="white-space: nowrap;" data-toggle="modal"
              data-target="#createOutfitModal" :disabled="selectedIds.length < 3">
              <i class="fas fa-plus-circle"></i> Создать образ
            </button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body p-0">
          <table class="table table-bordered table-striped mb-0">
            <thead>
              <tr>
                <th style="width: 20px;"></th>
                <th>ID</th>
                <th>Изображение</th>
                <th>Название</th>
                <th>Тип</th>
                <th>Артикул</th>
                <th>Ссылка на магазин</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id" :data-id="item.id">
                <td>
                  <input type="checkbox" class="select-checkbox" :data-id="item.id" v-model="selectedIds"
                    :value="item.id.toString()" />
                </td>
                <td>{{ item.id }}</td>
                <td>
                  <img :src="SITE_URL + '/app-images/' + item.image_url" :alt="item.title"
                    style="width: 150px; height: 150px;" />
                </td>
                <td>{{ item.title }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.artikul }}</td>
                <td>
                  <a :href="item.store_url" target="_blank">{{ item.store_name }}</a>
                </td>
                <td>
                  <button class="btn btn-sm btn-warning mr-1" data-toggle="modal" data-target="#editModal"
                    @click="openEditModal(item)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger btn-delete" @click="prepareDelete(item.id)">
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
                  <input type="text" class="form-control" name="title" required />
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
              <button type="button" class="btn btn-primary" @click="confirmAdd">Добавить</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT ITEM MODAL -->
    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <form id="editForm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Редактировать одежда</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Изображение</label>
                <div class="image-upload-container mb-3">
                  <img src="" id="editImagePreview" class="img-fluid" alt="Текущее изображение"
                    style="max-height: 300px; width: auto; display: block; margin: 0 auto;" />
                  <div class="upload-overlay">
                    <div class="text-center text-white">
                      <i class="fas fa-camera fa-2x mb-2"></i>
                      <p>Нажмите для изменения изображения</p>
                    </div>
                  </div>
                </div>
                <input type="file" id="editImageInput" accept="image/*" style="display: none;" />
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Название</label>
                  <input type="text" class="form-control" value="Платье летнее" name="title" required />
                </div>
                <div class="form-group col-md-6">
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
              </div>

              <div class="form-group">
                <label>Описание</label>
                <textarea class="form-control" rows="3" name="description"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Артикул</label>
                  <input type="text" class="form-control" value="" name="artikul" />
                </div>
                <div class="form-group col-md-6">
                  <label>Магазин</label>
                  <input type="text" class="form-control" value="" name="store_name" />
                </div>
              </div>

              <div class="form-group">
                <label>Ссылка на магазин</label>
                <input type="url" class="form-control" value="" name="store_url" pattern="https?://.+" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
              <button type="button" class="btn btn-primary" @click="confirmEdit">Сохранить изменения</button>
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
                  <input type="text" class="form-control" id="outfitTitle" placeholder="Введите название образа"
                    required />
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
                <div class="form-group col-md-12">
                <label>Назначить пользователям</label>
                <input type="text" v-model="userSearchQuery" @input="searchUsers" class="form-control" placeholder="Введите алиас пользователя" />
                <div class="mt-2">
                  <button v-for="user in searchResults" :key="user.id" 
                          @click="addAlias(user.alias)"
                          class="btn btn-sm btn-outline-primary mr-1 mb-1">
                    {{ user.alias }}
                  </button>
                </div>
                <div class="mt-2" style="display: flex;">
                  <span v-for="alias in selectedAliases" :key="alias" class="badge badge-info mr-1" style="display: inline-flex;align-items: center;padding:5px 5px;">
                    {{ alias }}
                    <button @click="removeAlias(alias)" class="close ml-2">&times;</button>
                  </span>
                </div>
              </div>
              </div>
              

              <hr />
              <h5 class="mb-3">Выбранные одежды</h5>
              <div class="row" id="selectedItemsPreview"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
              <button type="button" class="btn btn-primary" @click="confirmCreateOutfit">Создать образ</button>
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

<script>
import { API_URL, SITE_URL } from '../api'

export default {
  data() {
    return {
      items: [],
      selectedIds: [],
      SITE_URL,
      page: 1,
      isLoading: false,
      allLoaded: false,
      itemIdToDelete: null,
      itemIdToEdit: null,
      searchText: '',
      searchField: '',
      selectedAliases: [],
      userSearchQuery: '',
      searchResults: []
    };
  },
  methods: {
    isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (err) {
        return false;
      }
    },

    async fetchClothes(reset = false) {
      if (this.isLoading || this.allLoaded) return;

      if (reset) {
        this.items = [];
        this.page = 1;
        this.allLoaded = false;
      }

      this.isLoading = true;
      try {
        const params = new URLSearchParams({
          page: this.page.toString(),
        });

        if (this.searchText && this.searchField) {
          params.append('q', this.searchText);
          params.append('field', this.searchField);
        }

        const response = await fetch(`${API_URL}/stylist-clothes?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch clothes');
        const data = await response.json();

        if (data.length === 0) {
          this.allLoaded = true;
        } else {
          if (reset) {
            this.items = data;
          } else {
            this.items.push(...data);
          }
          this.page += 1;
        }
      } catch (error) {
        console.error('Error fetching clothes:', error);
      } finally {
        this.isLoading = false;
      }
    },

    handleScroll() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;
      if (scrollY + viewportHeight >= fullHeight - 300) {
        this.fetchClothes();
      }
    },

    prepareDelete(id) {
      this.itemIdToDelete = id;
      $('#deleteModal').modal('show');
    },

    async confirmDelete() {
      if (!this.itemIdToDelete) return;
      try {
        const response = await fetch(`${API_URL}/stylist-cloth/${this.itemIdToDelete}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete');
        $('#deleteModal').modal('hide');
        this.items = this.items.filter(item => item.id !== this.itemIdToDelete);
        this.itemIdToDelete = null;
        const alert = document.getElementById('deleteSuccess');
        alert.style.display = 'block';
        setTimeout(() => {
          alert.style.display = 'none';
        }, 2000);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },

    async openEditModal(item) {
      this.itemIdToEdit = item.id;
      try {
        const response = await fetch(`${API_URL}/stylist-cloth/${item.id}`);
        if (!response.ok) throw new Error('Failed to fetch item for editing');
        const data = await response.json();

        const form = document.getElementById('editForm');
        form.elements.title.value = data.title || '';
        form.elements.category.value = data.category || '';
        form.elements.description.value = data.description || '';
        form.elements.artikul.value = data.artikul || '';
        form.elements.store_name.value = data.store_name || '';
        form.elements.store_url.value = data.store_url || '';
        document.getElementById('editImagePreview').src = SITE_URL + '/app-images/' + data.image_url;

        $('#editModal').modal('show');
      } catch (error) {
        console.error('Error loading item for edit:', error);
      }
    },

    async confirmEdit() {
      const form = document.getElementById('editForm');
      const formData = new FormData();

      const id = this.itemIdToEdit;
      if (!id) return;

      const title = form.elements.title.value.trim();
      const description = form.elements.description.value.trim();
      const category = form.elements.category.value.trim();
      const artikul = form.elements.artikul.value.trim();
      const store_name = form.elements.store_name.value.trim();
      const store_url = form.elements.store_url.value.trim();

      if (!title || !description || !category || !artikul || !store_name || !store_url) {
        alert("Пожалуйста, заполните все поля.");
        return;
      }

      if (!this.isValidUrl(store_url)) {
        alert("Пожалуйста, введите корректный URL магазина (например: https://example.com)");
        return;
      }

      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('artikul', artikul);
      formData.append('store_name', store_name);
      formData.append('store_url', store_url);

      const imageFile = document.getElementById('editImageInput')?.files?.[0];

      if (imageFile) {
        formData.append('image', imageFile);
      }

      try {
        const response = await fetch(`${API_URL}/stylist-cloth/${id}`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Failed to save changes');
        }

        const updated = await response.json();
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) this.items.splice(index, 1, updated);

        $('#editModal').modal('hide');
        const alert = document.getElementById('editSuccess');
        alert.style.display = 'block';
        setTimeout(() => {
          alert.style.display = 'none';
        }, 2000);
      } catch (error) {
        console.error('Error saving item:', error);
        alert('Ошибка при сохранении!');
      }
    },

    async confirmAdd() {
      const form = document.getElementById('addForm');
      const formData = new FormData();

      const imageFile = document.getElementById('itemImage')?.files?.[0];
      if (!imageFile) {
        alert('Пожалуйста, выберите изображение!');
        return;
      }

      const title = form.elements.title.value.trim();
      const description = form.elements.description.value.trim();
      const category = form.elements.category.value.trim();
      const artikul = form.elements.artikul.value.trim();
      const store_name = form.elements.store_name.value.trim();
      const store_url = form.elements.store_url.value.trim();

      if (!title || !description || !category || !artikul || !store_name || !store_url) {
        alert("Пожалуйста, заполните все поля.");
        return;
      }

      if (!this.isValidUrl(store_url)) {
        alert("Пожалуйста, введите корректный URL магазина (например: https://example.com)");
        return;
      }

      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('artikul', artikul);
      formData.append('store_name', store_name);
      formData.append('store_url', store_url);
      formData.append('image', imageFile);

      try {
        const response = await fetch(`${API_URL}/stylist-cloth/`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Ошибка при добавлении одежды');
        }

        const newItem = await response.json();
        this.items.unshift(newItem);

        $('#addModal').modal('hide');
        form.reset();
        document.getElementById('itemPreview').style.display = 'none';

        const alert = document.getElementById('editSuccess');
        alert.textContent = 'Одежда успешно добавлена!';
        alert.style.display = 'block';
        setTimeout(() => {
          alert.style.display = 'none';
        }, 2000);
      } catch (error) {
        console.error('Ошибка при добавлении:', error);
        alert('Ошибка при добавлении!');
      }
    },

    updateSelectedItemsPreview() {
      const container = document.getElementById('selectedItemsPreview');
      container.innerHTML = '';

      const selected = this.items.filter(item => this.selectedIds.includes(item.id.toString()));

      selected.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.dataset.id = item.id;

        col.innerHTML = `
          <div class="card mb-3">
            <img src="${this.SITE_URL}/app-images/${item.image_url}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${item.title}">
            <div class="card-body d-flex justify-content-between align-items-center">
              <span class="item-title">${item.title}</span>
              <button type="button" class="btn btn-sm btn-danger remove-selected ml-auto" data-id="${item.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
        container.appendChild(col);
      });

      container.querySelectorAll('.remove-selected').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);

          const checkbox = document.querySelector(`input.select-checkbox[data-id="${id}"]`);
          if (checkbox) checkbox.checked = false;

          this.updateSelectedItemsPreview();
        });
      });
    },

    async searchUsers() {
      if (this.userSearchQuery.trim().length === 0) {
        this.searchResults = [];
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/stylist-users/search?alias=${this.userSearchQuery}`);
        this.searchResults = await response.json();
      } catch (error) {
        console.error('Error searching users:', error);
        this.searchResults = [];
      }
    },
    
    addAlias(alias) {
      if (!this.selectedAliases.includes(alias)) {
        this.selectedAliases.push(alias);
      }
    },
    
    removeAlias(alias) {
      this.selectedAliases = this.selectedAliases.filter(a => a !== alias);
    },

    async confirmCreateOutfit() {
      const form = document.getElementById('createOutfitForm');
      const formData = new FormData();

      const image = document.getElementById('outfitImage')?.files?.[0];
      const title = document.getElementById('outfitTitle').value.trim();
      const description = document.getElementById('outfitDescription').value.trim();
      const category = document.getElementById('outfitCategory').value;
      const season = document.getElementById('outfitSeason').value;

      if (!image || !title || !category || !season) {
        alert("Пожалуйста, заполните все поля и выберите изображение.");
        return;
      }

      if (this.selectedIds.length < 3) {
        alert("Необходимо выбрать минимум 3 одежды для создания образа.");
        return;
      }

      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('season', season);
      formData.append('image', image);

      this.selectedIds.forEach(id => formData.append('clothesIds[]', id));
      this.selectedAliases.forEach(alias => formData.append('userAliases[]', alias));

      try {
        const response = await fetch(`${API_URL}/stylist-outfit/`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Ошибка при создании образа');

        $('#createOutfitModal').modal('hide');
        this.selectedIds = [];
        this.selectedAliases = [];
        document.getElementById('createOutfitSuccess').style.display = 'block';
        setTimeout(() => {
          document.getElementById('createOutfitSuccess').style.display = 'none';
        }, 2000);
      } catch (error) {
        console.error('Create outfit error:', error);
        alert('Ошибка при создании образа');
      }
    },

    handleSearch() {
      this.fetchClothes(true);
    },

    clearSearch() {
      this.searchText = '';
      this.searchField = '';
      this.fetchClothes(true);
    },

    initImageUploads() {
      // Add modal image upload
      const addOverlay = document.querySelector('#addModal .upload-overlay');
      const addFileInput = document.getElementById('itemImage');

      if (addOverlay && addFileInput) {
        addOverlay.addEventListener('click', () => {
          addFileInput.click();
        });
      }

      if (addFileInput) {
        addFileInput.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const preview = document.getElementById('itemPreview');
              preview.src = e.target.result;
              preview.style.display = 'block';
              addOverlay.removeAttribute('style');
            };
            reader.readAsDataURL(file);
          }
        });
      }

      // Edit modal image upload
      const editOverlay = document.querySelector('#editModal .upload-overlay');
      const editFileInput = document.getElementById('editImageInput');

      if (editOverlay && editFileInput) {
        editOverlay.addEventListener('click', () => {
          editFileInput.click();
        });
      }

      if (editFileInput) {
        editFileInput.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              document.getElementById('editImagePreview').src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }

      // Create outfit modal image upload
      const createOverlay = document.querySelector('#createOutfitModal .upload-overlay');
      const createFileInput = document.getElementById('outfitImage');

      if (createOverlay && createFileInput) {
        createOverlay.addEventListener('click', () => {
          createFileInput.click();
        });
      }

      if (createFileInput) {
        createFileInput.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const preview = document.getElementById('outfitPreview');
              preview.src = e.target.result;
              preview.style.display = 'block';
              createOverlay.style.display = 'none';
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }
  },
  mounted() {
    this.fetchClothes();
    window.addEventListener('scroll', this.handleScroll);
    this.initImageUploads();

    $('#createOutfitModal').on('show.bs.modal', () => {
      this.updateSelectedItemsPreview();
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>