// Fungsi untuk menampilkan preview file
function showPreview(file) {
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const previewVideo = document.getElementById('previewVideo');

    // Reset preview
    previewImage.src = '';
    previewVideo.src = '';
    previewImage.style.display = 'none';
    previewVideo.style.display = 'none';

    if (file.type.startsWith('image/')) {
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = 'block';
    } else if (file.type.startsWith('video/')) {
        previewVideo.src = URL.createObjectURL(file);
        previewVideo.style.display = 'block';
    }

    previewContainer.style.display = 'block';
}

// Fungsi untuk menyalin teks ke clipboard
function copyToClipboard(element) {
    const textToCopy = element.textContent;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert('Link berhasil disalin: ' + textToCopy);
        })
        .catch((err) => {
            console.error('Gagal menyalin teks: ', err);
            alert('Gagal menyalin link. Silakan coba lagi.');
        });
}

// Event listener untuk input file
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        showPreview(file);
    }
});

// Fungsi untuk mengupload file
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Pilih file terlebih dahulu!');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        // Periksa jenis respons
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.success) {
                // Tampilkan link di HTML
                const linkContainer = document.getElementById('linkContainer');
                const fileLink = document.getElementById('fileLink');
                fileLink.textContent = data.url; // Set teks link
                linkContainer.style.display = 'block'; // Tampilkan elemen link

                // Tampilkan alert
                alert('File berhasil diupload! Bagikan link ini: ' + data.url);
            } else {
                alert('Gagal mengupload file: ' + data.message);
            }
        } else {
            const text = await response.text();
            console.error('Respons bukan JSON:', text);
            alert('Terjadi kesalahan saat mengupload file. Silakan coba lagi.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengupload file.');
    }
}

// Nonaktifkan klik kanan
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    alert('Klik kanan dinonaktifkan untuk melindungi konten.');
});

// Fungsi untuk menampilkan file yang diupload
async function viewFile(fileId) {
    try {
        const response = await fetch(`/view/${fileId}`);
        if (response.ok) {
            const blob = await response.blob();
            const mediaUrl = URL.createObjectURL(blob);

            const viewImage = document.getElementById('viewImage');
            const viewVideo = document.getElementById('viewVideo');

            if (blob.type.startsWith('image/')) {
                viewImage.src = mediaUrl;
                viewImage.style.display = 'block';
                viewVideo.style.display = 'none';
            } else if (blob.type.startsWith('video/')) {
                viewVideo.src = mediaUrl;
                viewVideo.style.display = 'block';
                viewImage.style.display = 'none';
            }

            document.getElementById('viewContainer').style.display = 'block';
        } else {
            const data = await response.json();
            alert(data.message || 'File tidak ditemukan atau sudah dilihat.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat memuat file.');
    }
}

// Cek apakah ada fileId di URL
const urlParams = new URLSearchParams(window.location.search);
const fileId = urlParams.get('id');
if (fileId) {
    viewFile(fileId);
}