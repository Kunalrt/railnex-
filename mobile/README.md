# RailNex Mobile Application 🚆📱

RailNex is available as both a **Native Android / iOS Application** and a **Progressive Web App (PWA)** for instant installation on any smartphone.

---

## 🚀 Option 1: Instant 1-Click Install via Public URL (PWA)
You don't need Android Studio or app stores to test it right now!

1. Open **[https://roland-syracuse-faqs-liz.trycloudflare.com](https://roland-syracuse-faqs-liz.trycloudflare.com)** on your smartphone.
2. Tap the **"Install RailNex Mobile App"** top banner.
3. The app is installed natively on your phone with a home screen icon, standalone fullscreen view, and offline ticket caching!

---

## 🤖 Option 2: Build Native Android APK (`android/`)
The native Android project is already configured in the `android/` directory using Capacitor.

### To open in Android Studio and export `.apk`:
```bash
# In the root project directory:
npm run mobile:sync
npm run mobile:android
```
Once Android Studio opens:
1. Click **Build** ➔ **Build Bundle(s) / APK(s)** ➔ **Build APK(s)**.
2. Transfer the generated `.apk` file to your Android phone and install!

---

## 📲 Option 3: Run with Expo / React Native (`mobile/`)
If you want to edit and test the React Native source code in `mobile/`:

```bash
cd mobile
npm install
npx expo start
```
* Scan the QR code displayed in the terminal with the **Expo Go** app on your Android or iPhone.
* The app will load live on your phone with hot-reloading!

---

## ✨ Mobile App Capabilities
* **Zero-Agent Speed**: Instant Tatkal form submission with biological entropy validation.
* **All 34 Jharkhand Stations**: Direct support for Ranchi (`RNC`), Hatia (`HTE`), Tatanagar (`TATA`), Dhanbad (`DHN`), Bokaro (`BKSC`), Jasidih (`JSME`), etc.
* **Offline ERS Boarding Pass**: Confirmed ticket slips remain viewable without internet connection.
* **Real Dynamic UPI QR Code**: Scan & Pay with Google Pay, PhonePe, or Paytm with instant Railway PRS confirmation.
