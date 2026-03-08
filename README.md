# SakhiSetu

**Your Maternal & Menstrual Health Companion**

SakhiSetu is a comprehensive health and wellness app that supports women through pregnancy, postpartum, newborn care, and menstrual health. Track your cycle, understand symptoms, access curated educational content, and find community resources—all in one place.

---

## About the App

SakhiSetu (“Friend’s Bridge” in Hindi) is built to be a trusted companion for women’s health. It offers:

- **Dual health flows**: Choose **Maternal Health** (pregnancy, postpartum, newborn) or **Menstrual Health** (cycle tracking, period insights, wellness) after sign-in.
- **Evidence-based content**: Articles, videos, and guides on maternal and menstrual health.
- **Personalized tracking**: Pregnancy week-by-week, due date, weight, and period/cycle tracking.
- **Multilingual support**: English and Hindi (हिंदी) with in-app language selection.
- **Community resources**: Find health centers, local counselors, and emergency support.
- **AI chat assistant**: Ask questions about menstrual and maternal health (powered by OpenAI, with a reminder to consult healthcare providers for medical decisions).

The app is built with **Expo** and **React Native**, runs on **Android**, **iOS**, and **Web**, and uses **Firebase** for auth and data.

---

## Users

SakhiSetu is for:

- **Expecting and new mothers** – Pregnancy tracking, prenatal and postpartum care, newborn care, breastfeeding, and maternal wellness.
- **Anyone who menstruates** – Period and cycle tracking, myths vs facts, hygiene, wellbeing, and diet.
- **Users who prefer local language** – Full experience in English and Hindi.
- **People looking for local support** – Quick access to health centers, counselors, and nearby hospitals.

All users get a single account (email/password or Google Sign-In), then choose either the Maternal or Menstrual flow. They can switch flows anytime from the app menu.

---

## Features

### Authentication & Profile

- **Sign up / Log in** with email and password or Google Sign-In.
- **Email verification** required before using the app.
- **Password reset** via email.
- **Profile**: Name, age, sex; stored in Firestore and editable from the app.
- **Logout** and **Switch health flow** (Maternal ↔ Menstrual) from the drawer.

### Maternal Health Flow

- **Home**
  - Pregnancy dashboard: due date, current week, trimester, baby size, development, and common symptoms.
  - Weight and blood pressure logging with history.
  - Appointments list and quick actions.
  - Relaxation / breathing session timer (e.g. 15 min).
- **Pregnancy Tracker**
  - Week-by-week pregnancy view and due date tracking.
- **Learn**
  - **Pregnancy Basics** – Week-by-week overview, baby development, your body, tips (videos/text).
  - **Prenatal Care** – Trimester-wise care, vitamins, checkups, managing symptoms (images & text).
  - **Nutrition & Diet** – Eating well during pregnancy (videos).
  - **Postpartum Care** – Recovery and self-care after birth (images & text).
  - **Newborn Care** – Essential newborn care (videos).
  - **Breastfeeding Guide** – Practical breastfeeding guidance (images & text).
  - **Maternal Wellness** – Mental and emotional wellbeing (videos).
  - **Exercise & Fitness** – Safe movement during pregnancy (images & text).
- **Community**
  - List of community resources (health centers, local counselors) from Firestore.
  - Filter by category; call phone numbers; open “hospitals near me” in Maps.
- **Insights**
  - Period/cycle calendar view and history (on-time/delayed), cycle insights (e.g. average cycle length).
- **Floating chat** – AI assistant for maternal (and menstrual) health questions.

### Menstrual Health Flow

- **Home**
  - Menstrual health dashboard and shortcuts to tracker, insights, and learn.
- **Period Tracker**
  - Log and view period dates and cycle length.
- **Cycle Insights**
  - Cycle analytics and history.
- **Learn**
  - **Your Journey to Periods** – Basics of menstrual health (videos).
  - **Myths & Facts** – Common beliefs vs medical facts (images & text).
  - **Staying Clean** – Hygiene, products, disposal, preventing infections (images & text).
  - **Well-being & Confidence** – Mood and confidence during periods (images & text).
  - **Health Diet & Care** – Nutrition and self-care for menstrual health (videos).
- **Floating chat** – Same AI assistant for menstrual health questions.

### Shared Features

- **Language selector** – English / हिंदी (Hindi); preference persisted.
- **Privacy Policy** and **Terms of Service** – Accessible from landing and auth.
- **Responsive layout** – Usable on phone, tablet, and web.
- **Dark/Light** – Follows system appearance where supported.

---

## Tech Stack

| Area            | Technology |
|----------------|------------|
| Framework      | Expo ~53, React Native 0.79, React 19 |
| Routing        | Expo Router (file-based) |
| Navigation     | React Navigation (stack, bottom tabs, drawer) |
| Auth           | Firebase Auth (email/password, Google Sign-In) |
| Database       | Firebase Firestore (users, community resources, app config) |
| AI Chat        | OpenAI API (e.g. gpt-3.5-turbo); API key stored in Firestore |
| UI             | React Native Paper, custom components, Ionicons |
| Media          | expo-av, react-native-youtube-iframe, expo-image |
| Maps           | react-native-maps, expo-location |
| Build/Deploy   | EAS Build (Android/iOS), Vercel (web export) |

---

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm or yarn
- Expo CLI: `npm install -g expo-cli` (optional; npx is enough)
- For native builds: Android Studio (Android) and/or Xcode (iOS)
- Firebase project with Auth and Firestore enabled; `google-services.json` (Android) in project root

### Install and run

```bash
# Clone the repo (if applicable)
# cd SakhiSetu

# Install dependencies
npm install

# Start development server
npx expo start
```

Then:

- **Web**: Open the URL shown in the terminal (e.g. `http://localhost:8081`).
- **Android**: Press `a` or run `npx expo run:android` (requires Android Studio / device).
- **iOS**: Press `i` or run `npx expo run:ios` (requires Xcode on macOS).

### Firebase setup

1. Create a Firebase project and enable **Authentication** (Email/Password and Google) and **Firestore**.
2. Add an Android app and download `google-services.json` into the project root.
3. (Optional) For AI chat: in Firestore, create `appConfigKratika/openai` and add field `apiKey` with your OpenAI API key. Restrict read access in Firestore rules (see `CHAT_SETUP.md` if present).
4. Ensure **Google Sign-In** is configured (Web client ID, and for Android: SHA-1 in Firebase and Google Cloud Console).

### EAS Build (Android / iOS)

```bash
# Android
npm run eas:build:android
# or
eas build --platform android

# iOS
npm run eas:build:ios
```

Use `eas.json` for build profiles (development, preview, production). NDK version for Android is set in `android/build.gradle` (e.g. 26.1.10909125) for compatibility with react-native-reanimated.

---

## Project Structure (high level)

- **`app/`** – Screens and layout (Expo Router): `MainLayout.jsx`, `LandingPage.jsx`, auth, `HealthSelectionScreen`, `MaternalHealthTabs.jsx`, `MenstrualHealthTabs.jsx`, Learn screens, Tracker, Insights, etc.
- **`app/(screens)/`** – Shared screens: `index.jsx` (Login/Register), `HomeScreen`, `LearnScreen`, `CommunityScreen`, `InsightsScreens`, `ChatScreen`.
- **`components/`** – Reusable UI (e.g. `WebLink`, `FloatingChatButton`).
- **`config/`** – `firebase.js`, `openai.js`.
- **`contexts/`** – `TranslationContext.jsx` and `translations/en.js`, `translations/hi.js`.
- **`constants/`** – Colors, theme.
- **`android/`** – Android native project and Gradle config.

---

## Scripts

| Command               | Description                |
|-----------------------|----------------------------|
| `npm start`           | Start Expo dev server      |
| `npm run android`     | Run on Android            |
| `npm run ios`         | Run on iOS                |
| `npm run web`         | Run web build             |
| `npm run lint`        | Run ESLint                |
| `npm run vercel-build`| Export for Vercel (web)    |
| `npm run eas:build:android` | EAS build Android  |
| `npm run eas:build:ios`      | EAS build iOS       |

---

## License and Disclaimer

This project is private. The health information in the app is for general awareness only and **does not replace professional medical advice**. Users are encouraged to consult qualified healthcare providers for diagnosis and treatment.

---

## Summary

SakhiSetu is a women’s health app that offers **maternal** (pregnancy, postpartum, newborn) and **menstrual** (cycle tracking, learn, insights) flows in **English and Hindi**, with **Firebase** auth/data, **AI chat**, **community resources**, and **educational content**. It runs on **Android**, **iOS**, and **Web** via Expo and React Native.
