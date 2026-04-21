# TaskSync

A modern task management application with Firebase Authentication and Cloud Storage. You can create tasks, mark them as complete, edit, and delete them. Both cloud sync and local storage features are available.

---

## ✨ Features

- **🔐 Firebase Authentication** — Easy login with Google Account
- **📝 Task Management** — Create, complete, edit, and delete tasks
- **🔍 Filtering** — View all tasks, local tasks only, or cloud tasks only
- **☁️ Cloud Sync** — Auto sync and manual sync options
- **💾 Local Storage** — Save tasks locally
- **📅 Date Grouping** — Group tasks by date

---

## 📂 Folder Structure

```
TaskSync/
├── src/
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── main.jsx         # Entry point
│   ├── index.css        # Global styles
│   ├── firebase.js      # Firebase configuration
│   ├── components/
│   │   ├── Header.jsx   # Header component
│   │   └── DateTime.jsx # Date time component
│   ├── hooks/
│   │   └── useTaskManager.js # Task manager hook
│   └── assets/
│       ├── task.png
│       ├── demo-profile-img.png
│       └── react.svg
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## 🛠️ Technology Stack

- **⚛️ React** — v19.2.0
- **🎨 Tailwind CSS** — v4.1.18
- **🔥 Firebase** — v12.9.0
  - Firebase Authentication
  - Firebase Firestore
- **⚡ Vite** — v7.3.1

---

## 🚀 Getting Started

1. Clone the project:
```bash
git clone <repository-url>
cd TaskSync
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open in browser: `http://localhost:5173`

---

## 📋 .env.local Configuration

Set the following variables in `.env.local` file for Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📄 License

MIT License

---

## ✉️ Version

**v1.0.0**