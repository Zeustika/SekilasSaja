//require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dozrirldm',
    api_key: process.env.CLOUDINARY_API_KEY || '917855413686439',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'ybhY6cRtcvnsmz6P0AgoWnpkrKA'
});

// Konfigurasi Multer dengan Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Folder di Cloudinary
        resource_type: 'auto', // Otomatis deteksi tipe file (gambar/video)
    },
});

const upload = multer({ storage: storage });

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

let files = {};

// Base URL statis
const PORT = process.env.PORT || 3000;
const baseUrl = 'https://sekilassaja.vercel.app';

// Endpoint untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint untuk upload file
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const fileId = Date.now().toString(); // Generate unique ID
        const fileUrl = req.file.path; // URL file di Cloudinary

        // Simpan informasi file
        files[fileId] = {
            url: fileUrl,
            type: req.file.mimetype,
            viewed: false
        };

        // Generate URL lengkap
        const viewUrl = `${baseUrl}/view/${fileId}`;

        res.json({ success: true, url: viewUrl });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ success: false, message: 'Gagal mengupload file.' });
    }
});

// Endpoint untuk melihat file
app.get('/view/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    const file = files[fileId];

    if (!file || file.viewed) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>File Not Found</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f8f9fa;
                        text-align: center;
                    }
                    .message {
                        font-size: 1.5rem;
                        margin-bottom: 20px;
                    }
                    .btn {
                        padding: 10px 20px;
                        font-size: 1rem;
                        color: #fff;
                        background-color: #007bff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        text-decoration: none;
                    }
                    .btn:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="message">File tidak ditemukan atau sudah dilihat :).</div>
                <a href="/" class="btn">Back to Home</a>
            </body>
            </html>
        `);
    }

    // Tandai file sebagai sudah dilihat
    file.viewed = true;

    // Tampilkan file berdasarkan tipe (gambar/video)
    const mediaElement = file.type.startsWith('image/')
        ? `<img src="${file.url}" alt="File" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); pointer-events: none; user-select: none; -webkit-user-drag: none;">`
        : `<video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); pointer-events: none; user-select: none; -webkit-user-drag: none;">
            <source src="${file.url}" type="${file.type}">
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
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f8f9fa;
                }
                .back-btn {
                    margin-top: 20px;
                    padding: 10px 20px;
                    font-size: 1rem;
                    color: #fff;
                    background-color: #007bff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    text-decoration: none;
                }
                .back-btn:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            ${mediaElement}
            <a href="/" class="back-btn">Back to Home</a>
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
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di ${baseUrl}`);
});
