let rowIdToDelete = null;

document.addEventListener('click', function(e) {
  if (e.target.closest('.btn-delete')) {
    const row = e.target.closest('tr');
    rowIdToDelete = row.getAttribute('data-id');
    $('#deleteModal').modal('show');
  }
});

document.getElementById('confirmDelete').onclick = function() {
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