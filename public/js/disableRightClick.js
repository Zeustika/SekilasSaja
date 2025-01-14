// Nonaktifkan klik kanan di seluruh halaman
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    alert('Klik kanan telah dinonaktifkan!');
});
