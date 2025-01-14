const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Simpan informasi file dalam memori
const files = {};

// Endpoint untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint untuk upload file
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        const file = req.file;

        // Validasi file
        if (!file) {
            return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload.' });
        }

        // Validasi tipe file (hanya gambar atau video)
        if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
            fs.unlinkSync(file.path); // Hapus file yang tidak valid
            return res.status(400).json({ success: false, message: 'Hanya file gambar atau video yang diizinkan.' });
        }

        const fileId = Date.now().toString(); // Generate unique ID
        const fileUrl = `https://sekilas-saja.vercel.app/view/${fileId}`; // Ganti dengan domain Vercel

        // Simpan informasi file
        files[fileId] = {
            path: file.path,
            type: file.mimetype,
            viewed: false
        };

        res.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error('Error saat upload file:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengupload file.' });
    }
});

// Endpoint untuk melihat file
app.get('/view/:fileId', (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = files[fileId];

        // Validasi file
        if (!file) {
            return res.status(404).send('File tidak ditemukan.');
        }

        if (file.viewed) {
            return res.status(404).send('File sudah dilihat dan tidak dapat diakses lagi.');
        }

        // Tandai file sebagai sudah dilihat
        file.viewed = true;

        // Kirim HTML dengan file yang dimuat
        const mediaElement = file.type.startsWith('image/')
            ? `<img src="/files/${fileId}" alt="File" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); pointer-events: none; user-select: none; -webkit-user-drag: none;">`
            : `<video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); pointer-events: none; user-select: none; -webkit-user-drag: none;">
                <source src="/files/${fileId}" type="${file.type}">
               </video>`;

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>View File</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f8f9fa;
                    }
                </style>
            </head>
            <body>
                ${mediaElement}
                <script>
                    // Nonaktifkan klik kanan di seluruh halaman
                    document.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        alert('Klik kanan dinonaktifkan untuk mencegah download.');
                    });

                    // Nonaktifkan drag pada seluruh halaman
                    document.addEventListener('dragstart', (e) => {
                        e.preventDefault();
                    });

                    // Nonaktifkan klik kanan pada elemen media
                    const media = document.querySelector('img, video');
                    if (media) {
                        media.addEventListener('contextmenu', (e) => e.preventDefault());
                    }
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error saat melihat file:', error);
        res.status(500).send('Terjadi kesalahan saat memuat file.');
    }
});

// Endpoint untuk file statis berdasarkan ID
app.get('/files/:fileId', (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = files[fileId];

        // Validasi file
        if (!file) {
            return res.status(404).send('File tidak ditemukan.');
        }

        // Kirim file
        res.sendFile(path.resolve(file.path), {
            headers: {
                'Content-Type': file.type
            }
        });

        // Hapus file setelah dilihat
        fs.unlink(file.path, (err) => {
            if (err) console.error('Gagal menghapus file:', err);
            delete files[fileId]; // Hapus dari memori
        });
    } catch (error) {
        console.error('Error saat mengirim file:', error);
        res.status(500).send('Terjadi kesalahan saat memuat file.');
    }
});

// Jalankan server
module.exports = app;