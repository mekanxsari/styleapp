<template>
  <div class="content-wrapper">
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
                  <option value="" selected disabled>Все</option>
                  <option value="title">Название</option>
                  <option value="category">Категория</option>
                  <option value="season">Сезон</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary mb-2">Поиск</button>
            </form>
            <div class="d-flex">
              <button class="btn btn-success ml-md-3 mb-2" style="white-space: nowrap;" id="createCapsuleBtn" disabled>
                <i class="fas fa-layer-group"></i> Создать капсулу
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-3" v-for="outfit in outfits" :key="outfit.id" :data-id="outfit.id">
              <div class="card outfit-card">
                <div class="outfit-img-container">
                  <img :src="siteUrl + '/app-images/' + outfit.image_url" class="outfit-img" :alt="outfit.title" />
                  <input type="checkbox" class="select-checkbox" :data-outfit-id="outfit.id" />
                </div>
                <div class="outfit-title flex">
                  {{ outfit.title }}
                  <div class="float-right" style="margin-top: 10px;">
                    <button class="btn btn-sm btn-warning mr-1" data-toggle="modal" data-target="#editOutfitModal"
                    :data-outfit-id="outfit.id" >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" :data-outfit-id="outfit.id">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                  <div style="font-weight: normal; font-size: 14px;">
                    {{ outfit.season }} | {{ outfit.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div> <!-- Closing container-fluid div -->

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

    <div id="deleteSuccess" class="alert alert-success alert-dismissible fade show" role="alert"
      style="display:none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
      Элемент успешно удалён!
      <button type="button" class="close" data-dismiss="alert" aria-label="Закрыть">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div id="saveChangesSuccess" class="alert alert-success alert-dismissible fade show" role="alert"
      style="display:none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
      Изменения успешно сохранены!
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div id="createCapsuleSuccess" class="alert alert-success alert-dismissible fade show" role="alert"
      style="display:none; position: fixed; top: 20px; right: 20px; z-index: 9999;">
      Капсула успешно создана!
    </div>

    <!-- EDIT OUTFIT MODAL -->
    <div class="modal fade" id="editOutfitModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Редактировать образ</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form id="editOutfitForm">
                        <div class="form-group">
                            <label>Изображение образа</label>
                            <div class="image-upload-container" id="outfitImageUploadArea">
                                <img src="https://mekanxsari.ru/app-images/50.jpg" id="outfitPreview" class="img-fluid"
                                    alt="Превью образа">
                                <div class="upload-overlay">
                                    <div class="text-center">
                                        <i class="fas fa-camera fa-2x mb-2"></i>
                                        <p>Нажмите для изменения изображения</p>
                                    </div>
                                </div>
                            </div>
                            <input type="file" id="outfitImageUpload" accept="image/*" style="display: none;">
                        </div>

                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label>Название образа</label>
                                <input type="text" class="form-control" value="Вечерний образ" name="outfitTitle"
                                    required>
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

                            <div class="form-group col-md-6">
                                <label>Описание</label>
                                <textarea class="form-control" rows="3"
                                    name="outfitDescription">Элегантный вечерний образ для особых случаев</textarea>
                            </div>
                        </div>

                        <hr>

                        <h5 class="mb-3">Элементы образа</h5>
                        <div class="container d-flex justify-content-center">
                            <div class="row" id="clothingItemsContainer" style="max-width: 680px; width: 100%;">
                                <div class="card mb-3 ml-2 mr-2" style="width: 13rem;">
                                    <img src="https://mekanxsari.ru/app-images/1.jpg" class="card-img-top"
                                        style="height: 200px; object-fit:fit;" alt="Title">
                                    <div class="card-body d-flex justify-content-between align-items-center">
                                        <span class="item-title">Title</span>
                                        <button type="button"
                                            class="btn btn-sm btn-danger remove-selected ml-auto btn-item-delete"
                                            data-id="1">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="card mb-3 ml-2 mr-2" style="width: 13rem;">
                                    <img src="https://mekanxsari.ru/app-images/1.jpg" class="card-img-top"
                                        style="height: 200px; object-fit:fit;" alt="Title">
                                    <div class="card-body d-flex justify-content-between align-items-center">
                                        <span class="item-title">Title</span>
                                        <button type="button"
                                            class="btn btn-sm btn-danger remove-selected ml-auto btn-item-delete"
                                            data-id="2">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="card mb-3 ml-2 mr-2" style="width: 13rem;">
                                    <img src="https://mekanxsari.ru/app-images/1.jpg" class="card-img-top"
                                        style="height: 200px; object-fit:fit;" alt="Title">
                                    <div class="card-body d-flex justify-content-between align-items-center">
                                        <span class="item-title">Title</span>
                                        <button type="button"
                                            class="btn btn-sm btn-danger remove-selected ml-auto btn-item-delete"
                                            data-id="3">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="card mb-3 ml-2 mr-2" style="width: 13rem;">
                                    <img src="https://mekanxsari.ru/app-images/1.jpg" class="card-img-top"
                                        style="height: 200px; object-fit:fit;" alt="Title">
                                    <div class="card-body d-flex justify-content-between align-items-center">
                                        <span class="item-title">Title</span>
                                        <button type="button"
                                            class="btn btn-sm btn-danger remove-selected ml-auto btn-item-delete"
                                            data-id="4">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="card mb-3 ml-2 mr-2" style="width: 13rem;">
                                    <img src="https://mekanxsari.ru/app-images/1.jpg" class="card-img-top"
                                        style="height: 200px; object-fit:fit;" alt="Title">
                                    <div class="card-body d-flex justify-content-between align-items-center">
                                        <span class="item-title">Title</span>
                                        <button type="button"
                                            class="btn btn-sm btn-danger remove-selected ml-auto btn-item-delete"
                                            data-id="4">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                            <button type="submit" class="btn btn-primary" id="editOutfit">Сохранить изменения</button>
                        </div>

                    </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for creating capsule -->
    <div class="modal fade" id="createCapsuleModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createCapsuleModalLabel">Создать новую капсулу</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="createCapsuleForm">
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Изображение</label>
                            <div class="image-upload-container" id="capsuleImageUploadArea">
                                <img id="capsulePreview" src="" alt="Изображение капсулы"
                                    style="display: none;width: 100%;height: 200px;">
                                <div class="upload-overlay" style="opacity: 1;">
                                    <div class="text-center">
                                        <i class="fas fa-camera fa-2x mb-2"></i>
                                        <p>Нажмите для загрузки изображения</p>
                                    </div>
                                </div>
                            </div>
                            <input type="file" id="capsuleImage" accept="image/*" style="display: none;">
                        </div>

                        <!-- Основные поля формы -->
                        <div class="form-group">
                            <label for="capsuleTitle">Название капсулы</label>
                            <input type="text" class="form-control" id="capsuleTitle" placeholder="Введите название"
                                required>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label>Сезон 1</label>
                                <select class="form-control" name="season" required>
                                    <option value="">Выберите сезон</option>
                                    <option value="winter">Зима</option>
                                    <option value="spring">Весна</option>
                                    <option value="summer">Лето</option>
                                    <option value="autumn">Осень</option>
                                </select>
                            </div>

                            <div class="form-group col-md-6">
                                <label>Сезон 2</label>
                                <select class="form-control" name="season" required>
                                    <option value="">Выберите сезон</option>
                                    <option value="winter">Зима</option>
                                    <option value="spring">Весна</option>
                                    <option value="summer">Лето</option>
                                    <option value="autumn">Осень</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="capsuleDescription">Описание</label>
                            <textarea class="form-control" id="capsuleDescription" rows="3"
                                placeholder="Введите описание капсулы"></textarea>
                        </div>


                        <hr>

                        <h5>Выбранные образы</h5>
                        <div class="row" id="selectedOutfitsPreview">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                        <button type="submit" class="btn btn-primary" id="submitCapsule">Создать капсулу</button>
                    </div>
                </form>
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
      outfits: [],
      isLoading: false,
      error: null,
      siteUrl: SITE_URL
    };
  },
  mounted() {
    this.fetchOutfits();
  },
  methods: {
    async fetchOutfits() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/stylist-outfits`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.outfits = data;
      } catch (err) {
        this.error = 'Ошибка при загрузке данных: ' + err.message;
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
    let rowIdToDelete = null;
    let itemIdToDelete = null;
    let previewOutfitIdToDelete = null;

    document.body.addEventListener('click', (e) => {
        const outfitDeleteButton = e.target.closest('.btn-delete');
        const itemDeleteButton = e.target.closest('.btn-item-delete');
        const clothDeleteButton = e.target.closest('.btn-cloth-delete');
        const previewDeleteButton = e.target.closest('.btn-capsule-preview-delete');

        if (outfitDeleteButton) {
            e.preventDefault();
            const card = outfitDeleteButton.closest('.col-md-3');
            rowIdToDelete = card?.getAttribute('data-id') || null;
            itemIdToDelete = null;
            previewOutfitIdToDelete = null;
            $('#deleteModal').modal('show');
        }

        if (itemDeleteButton) {
            e.preventDefault();
            itemIdToDelete = itemDeleteButton.getAttribute('data-id');
            rowIdToDelete = null;
            previewOutfitIdToDelete = null;
            $('#editOutfitModal').modal('hide');
            $('#deleteModal').modal('show');
        }

        if (clothDeleteButton) {
            e.preventDefault();
            const card = clothDeleteButton.closest('.col-md-3');
            rowIdToDelete = card?.getAttribute('data-id') || null;
            itemIdToDelete = null;
            previewOutfitIdToDelete = null;
            $('#deleteModal').modal('show');
        }

        if (previewDeleteButton) {
            e.preventDefault();
            previewOutfitIdToDelete = previewDeleteButton.getAttribute('data-preview-id');
            rowIdToDelete = null;
            itemIdToDelete = null;
            const previewCardToRemove = document.querySelector(`[data-preview-id="${previewOutfitIdToDelete}"]`);
            if (previewCardToRemove) previewCardToRemove.remove();
            previewOutfitIdToDelete = null;
        }
    });

    const confirmBtn = document.getElementById('confirmDelete');
    confirmBtn?.addEventListener('click', () => {
        if (rowIdToDelete) {
            const cardToRemove = document.querySelector(`.col-md-3[data-id="${rowIdToDelete}"]`);
            if (cardToRemove) cardToRemove.remove();
            rowIdToDelete = null;
            $('#deleteModal').modal('hide');
        }

        if (itemIdToDelete) {
            const cardToRemove = document.querySelector(`.btn-item-delete[data-id="${itemIdToDelete}"]`)?.closest('.card');
            if (cardToRemove) cardToRemove.remove();
            itemIdToDelete = null;
            $('#deleteModal').modal('hide');
            $('#editOutfitModal').modal('show');
        }

        const alert = document.getElementById('deleteSuccess');
        if (alert) {
            alert.style.display = 'block';
            setTimeout(() => {
                alert.style.display = 'none';
            }, 2000);
        }
    });

    const outfitImageInput = document.getElementById('outfitImageUpload');
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

    const createCapsuleBtn = document.getElementById('createCapsuleBtn');
    const selectedOutfitsPreview = document.getElementById('selectedOutfitsPreview');

    const getSelectedOutfits = () => {
        return Array.from(document.querySelectorAll('.select-checkbox:checked')).map(cb => {
            return cb.closest('.col-md-3');
        });
    };

    const updateCreateButtonState = () => {
        const selected = getSelectedOutfits();
        createCapsuleBtn.disabled = selected.length < 3;
    };

    document.querySelectorAll('.select-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateCreateButtonState);
    });

    createCapsuleBtn.addEventListener('click', () => {
        selectedOutfitsPreview.innerHTML = '';
        const selected = getSelectedOutfits();

        selected.forEach((card, index) => {
            const clone = card.cloneNode(true);
            clone.classList.remove('col-md-3');
            clone.classList.add('col-md-4', 'mb-3');

            clone.querySelector('.btn-warning')?.remove();
            clone.querySelector('.select-checkbox')?.remove();

            const deleteBtn = clone.querySelector('.btn-delete');
            const btnContainer = clone.querySelector('.float-right');
            if (deleteBtn && btnContainer) {
                deleteBtn.classList.replace('btn-delete', 'btn-capsule-preview-delete');
                deleteBtn.setAttribute('data-preview-id', `preview-${index}`);
            }

            clone.setAttribute('data-preview-id', `preview-${index}`);
            selectedOutfitsPreview.appendChild(clone);
        });

        $('#createCapsuleModal').modal('show');
    });

    const outfitEditForm = document.getElementById('editOutfitForm');
    outfitEditForm.addEventListener('submit', (e) => {
        $('#editOutfitModal').modal('hide');
        e.preventDefault();
        const alert = document.getElementById('saveChangesSuccess');
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 2000);
    });


    const capsuleImageInput = document.getElementById('capsuleImage');
    const capsulePreview = document.getElementById('capsulePreview');
    const capsuleUploadArea = document.getElementById('capsuleImageUploadArea');

    capsuleUploadArea.addEventListener('click', () => {
        capsuleImageInput.click();
    });

    capsuleImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            capsulePreview.src = e.target.result;
            capsulePreview.style.display = 'block';
            capsuleUploadArea.querySelector('.upload-overlay').style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    const capsuleForm = document.getElementById('createCapsuleForm');
    capsuleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        $('#createCapsuleModal').modal('hide');
        const alert = document.getElementById('createCapsuleSuccess');
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 2000);
    });

});
</script>