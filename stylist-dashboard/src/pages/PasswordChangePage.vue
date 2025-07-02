<template>
    <div class="content-wrapper" style="background: #fff;">
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card card-primary">
                        <form id="changePasswordForm">
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="newPassword">Новый пароль</label>
                                    <input type="password" class="form-control" id="newPassword"
                                        placeholder="Введите новый пароль" required>
                                </div>
                                <div class="form-group">
                                    <label for="confirmPassword">Повторите пароль</label>
                                    <input type="password" class="form-control" id="confirmPassword"
                                        placeholder="Повторите новый пароль" required>
                                </div>
                                <div id="passwordError" class="text-danger mb-3" style="display: none;">
                                    Пароли не совпадают.
                                </div>
                                <div id="passwordSuccess" class="alert alert-success" style="display: none;">
                                    Пароль успешно изменён!
                                </div>
                            </div>
                            <div class="card-footer">
                                <button type="submit" class="btn btn-primary btn-block">Сменить пароль</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  mounted() {
    $('#changePasswordForm').on('submit', function (e) {
      e.preventDefault();

      const newPassword = $('#newPassword').val();
      const confirmPassword = $('#confirmPassword').val();

      if (newPassword !== confirmPassword) {
        $('#passwordError').fadeIn();
        $('#passwordSuccess').hide();
        return;
      }

      $('#passwordError').hide();
      $('#passwordSuccess').fadeIn();

      setTimeout(() => {
        $('#passwordSuccess').fadeOut();
        $('#newPassword').val('');
        $('#confirmPassword').val('');
      }, 3000);
    });
  }
};
</script>