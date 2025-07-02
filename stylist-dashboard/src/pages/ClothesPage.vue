<template>
  <div class="content-wrapper" style="background: #fff;">
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
                  <option value="id">ID</option>
                  <option value="title">Название</option>
                  <option value="category">Тип</option>
                  <option value="artikul">Артикул</option>
                  <option value="store_name">Название магазина</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary mb-2">Поиск</button>
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
                <th>Описание</th>
                <th>Тип</th>
                <th>Артикул</th>
                <th>Название магазина</th>
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
                  <img :src="item.image" :alt="item.title" style="width: 150px; height: 150px;" />
                </td>
                <td>{{ item.title }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.artikul }}</td>
                <td>{{ item.store_name }}</td>
                <td>
                  <a :href="item.store_url" target="_blank">{{ item.store_url.replace(/^https?:\/\//, '') }}</a>
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
        <form id="addForm">
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
                  <div class="upload-overlay" style="opacity: 1;">
                    <div class="text-center">
                      <i class="fas fa-camera fa-2x mb-2"></i>
                      <p>Нажмите для загрузки изображения</p>
                    </div>
                  </div>
                </div>
                <input type="file" id="itemImage" accept="image/*" style="display: none;" />
              </div>
              <div class="form-row mb-2">
                <div class="form-group col-md-6 mb-2">
                  <label>Название</label>
                  <input type="text" class="form-control" name="title" required />
                </div>
                <div class="form-group col-md-6 mb-2">
                  <label>Тип одежды</label>
                  <select class="form-control" name="type" required>
                    <option value="">Выберите тип</option>
                    <option value="top">Верх</option>
                    <option value="bottom">Низ</option>
                    <option value="outerwear">Верхняя одежда</option>
                    <option value="shoes">Обувь</option>
                    <option value="accessories">Аксессуары</option>
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
                  <input type="url" class="form-control" name="store_url" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
              <button type="submit" class="btn btn-primary">Добавить</button>
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
                  <img src="https://mekanxsari.ru/app-images/1.jpg" id="editImagePreview" class="img-fluid"
                    alt="Текущее изображение" style="max-height: 300px; width: auto; display: block; margin: 0 auto;" />
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
                  <select class="form-control" name="type" required>
                    <option value="">Выберите тип</option>
                    <option value="top">Верх</option>
                    <option value="bottom">Низ</option>
                    <option value="outerwear">Верхняя одежда</option>
                    <option value="shoes">Обувь</option>
                    <option value="accessories">Аксессуары</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Описание</label>
                <textarea class="form-control" rows="3" name="description">Легкое платье для лета</textarea>
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Артикул</label>
                  <input type="text" class="form-control" value="ART-001" name="artikul" />
                </div>
                <div class="form-group col-md-6">
                  <label>Магазин</label>
                  <input type="text" class="form-control" value="Zara" name="store_name" />
                </div>
              </div>

              <div class="form-group">
                <label>Ссылка на магазин</label>
                <input type="url" class="form-control" value="https://zara.com/" name="store_url" />
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
                <input type="file" id="outfitImage" accept="image/*" style="display: none;" />
              </div>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="outfitTitle">Название образа</label>
                  <input type="text" class="form-control" id="outfitTitle" placeholder="Введите название образа"
                    required />
                </div>

                <div class="form-group col-md-6">
                  <label>Категория</label>
                  <select class="form-control" name="category" required>
                    <option value="">Выберите категорию</option>
                    <option value="romantic">Романтический</option>
                    <option value="sportive">Спортивный</option>
                    <option value="elegant">Элегантный</option>
                    <option value="beach">Пляж</option>
                    <option value="casual">Кэжуал</option>
                  </select>
                </div>

                <div class="form-group col-md-6">
                  <label>Сезон</label>
                  <select class="form-control" name="season" required>
                    <option value="">Выберите сезон</option>
                    <option value="winter">Зима</option>
                    <option value="spring">Весна</option>
                    <option value="summer">Лето</option>
                    <option value="autumn">Осень</option>
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

<script>
export default {
  data() {
    return {
      items: [
        {
          id: 1,
          image: 'https://mekanxsari.ru/app-images/1.jpg',
          title: 'Платье летнее',
          description: 'Легкое платье для лета',
          type: 'Одежды',
          artikul: 'ART-001',
          store_name: 'Zara',
          store_url: 'https://zara.com',
        },
        {
          id: 2,
          image: 'https://mekanxsari.ru/app-images/2.jpg',
          title: 'Платье летнее',
          description: 'Легкое платье для лета',
          type: 'Одежды',
          artikul: 'ART-001',
          store_name: 'Zara',
          store_url: 'https://zara.com',
        },
        {
          id: 3,
          image: 'https://mekanxsari.ru/app-images/3.jpg',
          title: 'Платье летнее',
          description: 'Легкое платье для лета',
          type: 'Одежды',
          artikul: 'ART-001',
          store_name: 'Zara',
          store_url: 'https://zara.com',
        },
      ],
      selectedIds: [],
    };
  },
  methods: {
    prepareDelete(id) {
      $('#deleteModal').modal('show');
    },
    openEditModal(item) {
      $('#editModal').modal('show');
    },
  },
  mounted() {
    document.addEventListener('DOMContentLoaded', () => {
      let rowIdToDelete = null;

      document.addEventListener('click', function (e) {
        if (e.target.closest('.btn-delete')) {
          const row = e.target.closest('tr');
          rowIdToDelete = row.getAttribute('data-id');
          $('#deleteModal').modal('show');
        }
      });

      document.getElementById('confirmDelete').onclick = function () {
        if (rowIdToDelete) {
          const row = document.querySelector('tr[data-id="' + rowIdToDelete + '"]');
          if (row) row.remove();
          rowIdToDelete = null;
          $('#deleteModal').modal('hide');
          const alert = document.getElementById('deleteSuccess');
          alert.style.display = 'block';
          setTimeout(() => {
            alert.style.display = 'none';
          }, 2000);
        }
      };

      document.getElementById('confirmEdit').onclick = function () {
        $('#editModal').modal('hide');
        const alert = document.getElementById('editSuccess');
        alert.style.display = 'block';
        setTimeout(() => {
          alert.style.display = 'none';
        }, 2000);
      };

      document.getElementById('confirmCreateOutfit').onclick = function () {
        $('#createOutfitModal').modal('hide');
        const alert = document.getElementById('createOutfitSuccess');
        alert.style.display = 'block';
        setTimeout(() => {
          alert.style.display = 'none';
        }, 2000);
      };

      const itemImageInput = document.getElementById('itemImage');
      const itemPreview = document.getElementById('itemPreview');
      const uploadArea = document.getElementById('itemImageUploadArea');

      uploadArea.addEventListener('click', () => {
        itemImageInput.click();
      });

      itemImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          itemPreview.src = e.target.result;
          itemPreview.style.display = 'block';
          uploadArea.querySelector('.upload-overlay').style.display = 'none';
        };
        reader.readAsDataURL(file);
      });

      const editImageInput = document.getElementById('editImageInput');
      const editImagePreview = document.getElementById('editImagePreview');
      const editOverlay = editImagePreview.nextElementSibling;

      [editImagePreview, editOverlay].forEach(el => {
        el.addEventListener('click', () => {
          editImageInput.click();
        });
      });

      editImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          editImagePreview.src = e.target.result;
          editImagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      });

      const outfitImageInput = document.getElementById('outfitImage');
      const outfitPreview = document.getElementById('outfitPreview');
      const outfitUploadArea = document.getElementById('outfitImageUploadArea');

      outfitUploadArea.addEventListener('click', () => {
        outfitImageInput.click();
      });

      outfitImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          outfitPreview.src = e.target.result;
          outfitPreview.style.display = 'block';
          outfitUploadArea.querySelector('.upload-overlay').style.display = 'none';
        };
        reader.readAsDataURL(file);
      });

      let selectedItems = new Map();

      const createOutfitBtn = document.querySelector('[data-target="#createOutfitModal"]');
      const selectedItemsPreview = document.getElementById('selectedItemsPreview');

      createOutfitBtn.disabled = true;

      document.addEventListener('change', function (e) {
        const checkbox = e.target.closest('.select-checkbox');
        if (!checkbox) return;

        const row = checkbox.closest('tr');
        const id = row.getAttribute('data-id');
        const title = row.querySelector('td:nth-child(4)').innerText;
        const imageSrc = row.querySelector('td:nth-child(3) img')?.getAttribute('src') || '';

        if (checkbox.checked) {
          selectedItems.set(id, { title, imageSrc });
        } else {
          selectedItems.delete(id);
        }

        createOutfitBtn.disabled = selectedItems.size < 3;
      });

      $('#createOutfitModal').on('show.bs.modal', () => {
        selectedItemsPreview.innerHTML = '';

        selectedItems.forEach(({ title, imageSrc }, id) => {
          const col = document.createElement('div');
          col.className = 'col-md-4';
          col.dataset.id = id;

          col.innerHTML = `
      <div class="card mb-3">
        <img src="${imageSrc}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${title}">
        <div class="card-body d-flex justify-content-between align-items-center">
          <span class="item-title">${title}</span>
          <button type="button" class="btn btn-sm btn-danger remove-selected ml-auto" data-id="${id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
          selectedItemsPreview.appendChild(col);
        });
      });

      selectedItemsPreview.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-selected');
        if (!removeBtn) return;

        const id = removeBtn.dataset.id;
        selectedItems.delete(id);

        const checkbox = document.querySelector(`.select-checkbox[data-id="${id}"]`);
        if (checkbox) checkbox.checked = false;

        const previewCard = selectedItemsPreview.querySelector(`div[data-id="${id}"]`);
        if (previewCard) previewCard.remove();

        createOutfitBtn.disabled = selectedItems.size < 3;
      });
    });
  },
};
</script>