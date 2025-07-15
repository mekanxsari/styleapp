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
                            <button class="btn btn-success ml-md-3 mb-2" style="white-space: nowrap;"
                                id="createCapsuleBtn" disabled>
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
                                    <img :src="siteUrl + '/app-images/' + outfit.image_url" class="outfit-img"
                                        :alt="outfit.title" />
                                    <input type="checkbox" class="select-checkbox" :data-outfit-id="outfit.id" />
                                </div>
                                <div class="outfit-title flex">
                                    {{ outfit.title }}
                                    <div class="float-right" style="margin-top: 10px;">
                                        <button class="btn btn-sm btn-warning mr-1" data-toggle="modal"
                                            data-target="#editOutfitModal" :data-outfit-id="outfit.id">
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
        </div>

        <div class="modal fade" id="confirmDeleteClothingModal" tabindex="-1" role="dialog" aria-hidden="true">
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
                            <button type="button" class="btn btn-danger" id="confirmClothingDeleteBtn">Удалить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="confirmDeleteOutfitModal" tabindex="-1" role="dialog" aria-hidden="true">
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
                            <button type="button" class="btn btn-danger" id="confirmOutfitDeleteBtn">Удалить</button>
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
                        <form id="editOutfitForm" @submit.prevent="submitEditForm">
                            <div class="form-group">
                                <label>Изображение образа</label>
                                <div class="image-upload-container" id="outfitImageUploadArea" @click="triggerFileInput"
                                    style="cursor: pointer; position: relative;">
                                    <img :src="outfitPreviewSrc" id="outfitPreview" class="img-fluid"
                                        alt="Превью образа" v-if="outfitPreviewSrc" />
                                    <div class="upload-overlay" v-show="outfitPreviewSrc">
                                        <div class="text-center">
                                            <i class="fas fa-camera fa-2x mb-2"></i>
                                            <p>Нажмите для изменения изображения</p>
                                        </div>
                                    </div>
                                    <input type="file" id="outfitImageUpload" accept="image/*" style="display: none;"
                                        @change="onFileChange" />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label>Название образа</label>
                                    <input type="text" class="form-control" name="outfitTitle" required>
                                </div>
                                <div class="form-group col-md-6">
                                    <label>Категория</label>
                                    <select class="form-control" name="category" required>
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
                                    <select class="form-control" name="season" required>
                                        <option value="">Выберите сезон</option>
                                        <option value="Зима">Зима</option>
                                        <option value="Весна">Весна</option>
                                        <option value="Лето">Лето</option>
                                        <option value="Осень">Осень</option>
                                    </select>
                                </div>

                                <div class="form-group col-md-6">
                                    <label>Описание</label>
                                    <textarea class="form-control" rows="3" name="outfitDescription"></textarea>
                                </div>
                                <div class="form-group col-md-12">
                                    <label>Назначить пользователям</label>
                                    <input type="text" v-model="editUserSearchQuery" @input="editSearchUsers"
                                        class="form-control" placeholder="Введите алиас пользователя" />
                                    <div class="mt-2">
                                        <button v-for="user in editSearchResults" :key="user.id"
                                            @click="editAddAlias(user.alias)"
                                            class="btn btn-sm btn-outline-primary mr-1 mb-1">
                                            {{ user.alias }}
                                        </button>
                                    </div>
                                    <div class="mt-2" style="display: flex;">
                                        <span v-for="alias in editSelectedAliases" :key="alias"
                                            class="badge badge-info mr-1"
                                            style="display: inline-flex;align-items: center;padding:5px 5px;">
                                            {{ alias }}
                                            <button @click="editRemoveAlias(alias)" class="close ml-2">&times;</button>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr>

                            <h5 class="mb-3">Элементы образа</h5>
                            <div class="container d-flex justify-content-center">
                                <div class="row" id="clothingItemsContainer" style="max-width: 680px; width: 100%;">
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

        <div class="modal fade" id="createCapsuleModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createCapsuleModalLabel">Создать новую капсулу</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form id="createCapsuleForm" @submit.prevent="submitCapsuleForm">
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

                            <div class="form-group">
                                <label for="capsuleTitle">Название капсулы</label>
                                <input type="text" class="form-control" id="capsuleTitle" placeholder="Введите название"
                                    required>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label>Сезон 1</label>
                                    <select class="form-control" name="season1" id="outfitSeason1" required>
                                        <option value="">Выберите сезон</option>
                                        <option value="Зима">Зима</option>
                                        <option value="Весна">Весна</option>
                                        <option value="Лето">Лето</option>
                                        <option value="Осень">Осень</option>
                                    </select>
                                </div>

                                <div class="form-group col-md-6">
                                    <label>Сезон 2</label>
                                    <select class="form-control" name="season2" id="outfitSeason2" required>
                                        <option value="">Выберите сезон</option>
                                        <option value="Зима">Зима</option>
                                        <option value="Весна">Весна</option>
                                        <option value="Лето">Лето</option>
                                        <option value="Осень">Осень</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="capsuleDescription">Описание</label>
                                <textarea class="form-control" id="capsuleDescription" rows="3"
                                    placeholder="Введите описание капсулы"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Назначить пользователям</label>
                                <input
                                    type="text"
                                    v-model="createUserSearchQuery"
                                    @input="createSearchUsers"
                                    class="form-control"
                                    placeholder="Введите алиас пользователя" />
                                <div class="mt-2">
                                    <button
                                        v-for="user in createSearchResults"
                                        :key="user.id"
                                        @click.prevent="createAddUser(user)"
                                        class="btn btn-sm btn-outline-primary mr-1 mb-1"
                                    >
                                        {{ user.alias }}
                                    </button>
                                </div>
                                <div class="mt-2" style="display: flex; flex-wrap: wrap;">
                                    <span
                                        v-for="(id, index) in createSelectedUserIds"
                                        :key="id"
                                        class="badge badge-info mr-1 mb-1"
                                        style="display: inline-flex; align-items: center; padding: 5px;"
                                    >
                                        {{ createSelectedUserAliases[index] }}
                                        <button @click.prevent="createRemoveUser(id)" class="close ml-1">&times;</button>
                                    </span>
                                </div>
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
import { API_URL, SITE_URL } from '../api';

export default {
    data() {
        return {
            outfits: [],
            isLoading: false,
            error: null,
            siteUrl: SITE_URL,
            currentEditOutfitId: null,
            outfitPreviewSrc: '',
            outfitImageFile: null,
            clothingToDeleteId: null,
            editSelectedAliases: [],
            editUserSearchQuery: '',
            editSearchResults: [],
            createUserSearchQuery: '',
            createSearchResults: [],
            createSelectedUserIds: [],
            createSelectedUserAliases: [],
        };
    },
    methods: {
        async fetchOutfits() {
            this.isLoading = true;
            this.error = null;
            try {
                const res = await fetch(`${API_URL}/stylist-outfits`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                this.outfits = await res.json();
            } catch (err) {
                this.error = `Ошибка при загрузке данных: ${err.message}`;
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchOutfitById(id) {
            try {
                const res = await fetch(`${API_URL}/stylist-outfit/${id}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const outfit = await res.json();

                const form = document.getElementById('editOutfitForm');
                form.outfitTitle.value = outfit.title || '';
                form.category.value = outfit.label || '';
                form.season.value = outfit.season || '';
                form.outfitDescription.value = outfit.description || '';

                this.outfitPreviewSrc = `${this.siteUrl}/app-images/${outfit.image_url}`;
                this.outfitImageFile = null;

                this.editSelectedAliases = [];
                if (!outfit.is_public) {
                    const userRes = await fetch(`${API_URL}/stylist-outfit/${id}/users`);
                    if (userRes.ok) {
                        const users = await userRes.json();
                        this.editSelectedAliases = users.map(u => u.alias);
                    }
                }

                const container = document.getElementById('clothingItemsContainer');
                container.innerHTML = '';
                (outfit.clothes || []).forEach(cloth => {
                    const card = document.createElement('div');
                    card.className = 'card mb-3 ml-2 mr-2';
                    card.style.width = '13rem';
                    card.innerHTML = `
                        <img src="${this.siteUrl}/app-images/${cloth.image_url}" class="card-img-top" style="height: 200px; object-fit: fit;" alt="${cloth.title}">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <span class="item-title">${cloth.title}</span>
                            <button type="button" class="btn btn-sm btn-danger remove-selected ml-auto btn-item-delete" data-id="${cloth.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(card);
                });
            } catch (error) {
                console.error('Error loading outfit:', error);
                alert('Ошибка при загрузке данных образа');
            }
        },

        async submitEditForm(event) {
            event.preventDefault();
            const form = document.getElementById('editOutfitForm');
            const formData = new FormData();
            formData.append('title', form.outfitTitle.value);
            formData.append('category', form.category.value);
            formData.append('season', form.season.value);
            formData.append('description', form.outfitDescription.value);
            if (this.outfitImageFile) formData.append('image', this.outfitImageFile);
            this.editSelectedAliases.forEach(alias => formData.append('userAliases[]', alias));

            try {
                const res = await fetch(`${API_URL}/stylist-outfit/${this.currentEditOutfitId}`, {
                    method: 'PUT',
                    body: formData,
                });
                if (!res.ok) {
                    const err = await res.text();
                    throw new Error(`Ошибка при обновлении образа: ${res.status} - ${err}`);
                }
                $('#editOutfitModal').modal('hide');
                this.showSuccess('saveChangesSuccess');
                this.fetchOutfits();
            } catch (err) {
                console.error(err);
                alert('Ошибка при сохранении изменений');
            }
        },

        editSearchUsers() {
            if (!this.editUserSearchQuery.trim()) {
                this.editSearchResults = [];
                return;
            }
            fetch(`${API_URL}/stylist-users/search?alias=${this.editUserSearchQuery}`)
                .then(res => res.json())
                .then(data => (this.editSearchResults = data))
                .catch(err => {
                    console.error('Error searching users:', err);
                    this.editSearchResults = [];
                });
        },

        editAddAlias(alias) {
            if (!this.editSelectedAliases.includes(alias)) {
                this.editSelectedAliases.push(alias);
            }
        },

        editRemoveAlias(alias) {
            this.editSelectedAliases = this.editSelectedAliases.filter(a => a !== alias);
        },

        showSuccess(alertId) {
            const el = document.getElementById(alertId);
            if (el) {
                el.style.display = 'block';
                setTimeout(() => (el.style.display = 'none'), 3000);
            }
        },

        getSelectedOutfits() {
            return Array.from(document.querySelectorAll('.select-checkbox:checked')).map(cb => cb.closest('[data-id]'));
        },

        toggleCapsuleBtn() {
            const selected = this.getSelectedOutfits();
            document.getElementById('createCapsuleBtn').disabled = selected.length < 3;
        },

        prepareCapsulePreview() {
            const selected = this.getSelectedOutfits();
            const previewContainer = document.getElementById('selectedOutfitsPreview');
            previewContainer.innerHTML = '';
            selected.forEach((card, idx) => {
                const clone = card.cloneNode(true);
                clone.classList.replace('col-md-3', 'col-md-4');
                clone.classList.add('mb-3');
                clone.dataset.previewId = `preview-${idx}`;
                clone.querySelector('.btn-warning')?.remove();
                clone.querySelector('.select-checkbox')?.remove();
                const delBtn = clone.querySelector('.btn-delete');
                if (delBtn) {
                    delBtn.classList.replace('btn-delete', 'btn-capsule-preview-delete');
                    delBtn.dataset.previewId = `preview-${idx}`;
                }
                previewContainer.appendChild(clone);
            });
        },

        createSearchUsers() {
            if (!this.createUserSearchQuery.trim()) {
                this.createSearchResults = [];
                return;
            }
            fetch(`${API_URL}/stylist-users/search?alias=${this.createUserSearchQuery}`)
                .then(res => res.json())
                .then(data => (this.createSearchResults = data))
                .catch(err => {
                    console.error('Error searching users:', err);
                    this.createSearchResults = [];
                });
        },

        createAddUser(user) {
            if (!this.createSelectedUserIds.includes(user.id)) {
                this.createSelectedUserIds.push(user.id);
                this.createSelectedUserAliases.push(user.alias);
            }
        },

        createRemoveUser(userId) {
            this.createSelectedUserIds = this.createSelectedUserIds.filter(id => id !== userId);
            this.createSelectedUserAliases = this.createSelectedUserAliases.filter(
                alias => this.createSearchResults.find(u => u.id === userId)?.alias !== alias
            );
        },

        triggerFileInput() {
            document.getElementById('outfitImageUpload').click();
        },

        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.outfitImageFile = file;
                this.outfitPreviewSrc = URL.createObjectURL(file);
            }
        },

        submitCapsuleForm(event) {
            event.preventDefault();
            document.getElementById('submitCapsule').click();
        },

        setupConfirmButtons() {
            document.getElementById('confirmClothingDeleteBtn').addEventListener('click', async () => {
                if (!this.clothingToDeleteId) return;
                try {
                    const res = await fetch(`${API_URL}/stylist-cloth/${this.clothingToDeleteId}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error(await res.text());
                    document.querySelector(`.btn-item-delete[data-id="${this.clothingToDeleteId}"]`)?.closest('.card')?.remove();
                    this.clothingToDeleteId = null;
                    $('#confirmDeleteClothingModal').modal('hide');
                    $('#editOutfitModal').modal('show');
                } catch (err) {
                    console.error("Error deleting clothing:", err);
                    alert("Не удалось удалить элемент одежды.");
                }
            });

            document.getElementById('confirmOutfitDeleteBtn').addEventListener('click', async () => {
                if (!this.currentEditOutfitId) return;
                try {
                    const res = await fetch(`${API_URL}/stylist-outfit/${this.currentEditOutfitId}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error(await res.text());
                    $('#confirmDeleteOutfitModal').modal('hide');
                    this.showSuccess('deleteSuccess');
                    this.fetchOutfits();
                } catch (err) {
                    console.error('Ошибка при удалении образа:', err);
                    alert('Не удалось удалить образ.');
                }
            });

            document.getElementById('submitCapsule').addEventListener('click', async () => {
                const selected = this.getSelectedOutfits();
                if (selected.length < 3) {
                    alert('Выберите минимум 3 образа для создания капсулы.');
                    return;
                }

                const formData = new FormData();
                formData.append('title', document.getElementById('capsuleTitle').value);
                formData.append('season1', document.getElementById('outfitSeason1').value);
                formData.append('season2', document.getElementById('outfitSeason2').value || '');
                formData.append('description', document.getElementById('capsuleDescription').value || '');

                selected.forEach(card => formData.append('outfit_ids[]', card.dataset.id));
                this.createSelectedUserIds.forEach(uid => formData.append('user_ids[]', uid));

                const imageFile = document.getElementById('capsuleImage').files[0];
                if (imageFile) formData.append('image', imageFile);

                try {
                    const res = await fetch(`${API_URL}/stylist-capsule`, { method: 'POST', body: formData });
                    if (!res.ok) throw new Error(await res.text());
                    $('#createCapsuleModal').modal('hide');
                    this.showSuccess('createCapsuleSuccess');
                    this.fetchOutfits();
                    this.createSelectedUserIds = [];
                    this.createSelectedUserAliases = [];
                } catch (err) {
                    console.error('Ошибка при создании капсулы:', err);
                    alert('Не удалось создать капсулу.');
                }
            });
        },
    },
    mounted() {
        this.fetchOutfits();
        this.setupConfirmButtons();

        document.body.addEventListener('click', async (e) => {
            const editBtn = e.target.closest('button[data-target="#editOutfitModal"]');
            if (editBtn) {
                e.preventDefault();
                this.currentEditOutfitId = editBtn.dataset.outfitId;
                await this.fetchOutfitById(this.currentEditOutfitId);
                $('#editOutfitModal').modal('show');
            }

            const clothingDelBtn = e.target.closest('.btn-item-delete');
            if (clothingDelBtn) {
                this.clothingToDeleteId = clothingDelBtn.dataset.id;
                $('#editOutfitModal').modal('hide');
                $('#confirmDeleteClothingModal').modal('show');
            }

            const delOutfitBtn = e.target.closest('.btn-delete');
            if (delOutfitBtn) {
                this.currentEditOutfitId = delOutfitBtn.dataset.outfitId;
                $('#confirmDeleteOutfitModal').modal('show');
            }

            const previewDelBtn = e.target.closest('.btn-capsule-preview-delete');
            if (previewDelBtn) {
                const previewId = previewDelBtn.dataset.previewId;
                const previewCard = document.querySelector(`[data-preview-id="${previewId}"]`);
                if (previewCard) {
                    previewCard.remove();
                    const outfitId = previewCard.dataset.id;
                    const originalCb = document.querySelector(`.select-checkbox[data-outfit-id="${outfitId}"]`);
                    if (originalCb) originalCb.checked = false;
                    this.toggleCapsuleBtn();
                }
            }
        });

        document.body.addEventListener('change', (e) => {
            if (e.target.matches('.select-checkbox')) {
                this.toggleCapsuleBtn();
            }
        });

        document.getElementById('createCapsuleBtn').addEventListener('click', () => {
            this.prepareCapsulePreview();
            $('#createCapsuleModal').modal('show');
        });

        const capsuleImageInput = document.getElementById('capsuleImage');
        document.getElementById('capsuleImageUploadArea').addEventListener('click', () => {
            capsuleImageInput.click();
        });
        capsuleImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const capsulePreview = document.getElementById('capsulePreview');
                capsulePreview.src = URL.createObjectURL(file);
                capsulePreview.style.display = 'block';
                document.querySelector('#capsuleImageUploadArea .upload-overlay').remove();
            }
        });
    }
};
</script>