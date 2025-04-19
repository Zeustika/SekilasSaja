# Sekilas Saja - Simple & Fast File Sharing ✨

**Sekilas Saja** is a lightweight web application that allows you to quickly and easily share files (images or videos). Each uploaded file can **only be viewed once** — after it's opened, the file is permanently deleted from the server. This project uses **Node.js**, **Express.js**, and **Multer** to handle file uploads and provide a secure, one-time viewing experience.

---

## Key Features 🌟

- **Quick Uploads**: Instantly upload image or video files.
- **View Once Only**: Files can only be viewed once — then they're deleted automatically.
- **Download Protection**: Right-click and drag prevention to help secure shared files.
- **Responsive Design**: Works smoothly on both mobile and desktop.

---

## How It Works 🛠️

1. **Upload a File**:
   - Visit the home page.
   - Select the image or video you want to share.
   - Click the "Upload" button.

2. **Share the Link**:
   - After uploading, a unique link will be generated.
   - Share the link with the recipient.

3. **View the File**:
   - The recipient opens the link to view the file.
   - The file is deleted immediately after being viewed once.

---

## Run Locally 💻

If you want to run the project on your local machine, follow these steps:

### Prerequisites

- Node.js (v16 or higher)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Zeustika/sekilas-saja.git
   cd sekilas-saja
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```

4. **Open the App**:
   - Open your browser and go to `http://localhost:3000`.

---

## Tech Stack 🛠️

- **Backend**: Node.js + Express.js
- **File Handling**: Multer
- **Frontend**: HTML, CSS, JavaScript

---

## Contributing 🤝

Contributions are always welcome! To contribute:

1. Fork this repository.
2. Create a new branch:
   ```bash
   git checkout -b your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add a new feature'
   ```
4. Push to your branch:
   ```bash
   git push origin your-feature
   ```
5. Open a Pull Request to the main repo.

---

## License 🔖

This project is licensed under the [MIT License](LICENSE).

---

## Author 🔧

Made with ❤️ . Feel free to reach out via GitHub if you have any questions or suggestions.
