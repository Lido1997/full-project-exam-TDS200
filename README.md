# Full Project – Exam TDS200

This project was developed as part of the exam in the course **TDS200** at Kristiania University College.

It is a mobile application where users can upload, discover, like, and comment on artwork.

---

## 📁 Project Structure
```
ArtVista/
├── app/ # Screens and navigation (Expo Router)
├── assets/ # Images, icons, and fonts
├── components/ # Reusable UI components
├── constants/ # Theme and color definitions
├── contexts/ # React Context (e.g., AuthContext)
├── helpers/ # Utility/helper functions
├── FirebaseConfig.js # Firebase setup and initialization
├── app.json # Expo app configuration
├── tsconfig.json # TypeScript configuration (support for JS/TS)
```

---

## 🚀 Technologies Used

### Frontend (React Native + Expo)
- React Native (with Expo)
- Expo Router
- JavaScript / JSX
- Nativewind 
- AsyncStorage 

### Backend Services (Firebase)
- Firebase Authentication
- Firestore (database)
- Firebase Storage (for images)
- Environment variables with `.env` 

---

## 🛠️ How to Run Locally

### 🔹 Prerequisites
- Node.js (v18 or later)
- Expo CLI:
```
bash
npm install -g expo-cli
```

### 🔹 Installation
1. Clone the repository:
```
bash
git clone https://github.com/Lido1997/ArtVista.git
cd ArtVista
```

2. Install dependencies:
```
bash
npm install
```

3. Create a `.env` file in the root with the following:

EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key

EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain

EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket

EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id

EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

4. Start the development server:
```
bash
npx expo start
```
