# Medical Quiz App — React Native CLI

A complete Android-focused quiz application built with React Native CLI, JavaScript, React Navigation, React Hooks, and AsyncStorage.

## Included features

- Splash screen with session-aware routing
- Validated local demo login without storing a password
- Remember Me controls whether the session is restored on the next launch
- Dashboard with candidate and examination details
- Guidelines acceptance and confirmation
- All questions on one scrollable screen
- Persistent answers and timestamp-based 60-minute timer
- Background recovery and automatic submission
- Active-quiz back-button protection
- Result calculation, pass/fail status, time taken, and answer review
- Retake lock after submission
- Reusable components and responsive max-width layouts

## Demo credentials

- Email: `rahul.sharma@gmail.com`
- Password: `Quiz@123`

The password is only compared in memory. It is never saved to AsyncStorage. AsyncStorage is used only for the session flag, profile, quiz recovery data, and result.

## Quick start

```bash
npm install
npm run android
```

The first `npm run android` automatically copies the official React Native 0.86 Android template from `node_modules` and configures the package as `com.medicalquizapp`.

You can also generate the Android folder manually:

```bash
npm run setup:android
```

## Windows Android prerequisites

1. Install Node.js 22.11 or newer.
2. Install Android Studio.
3. In Android Studio SDK Manager, install:
   - Android SDK Platform 36
   - Android SDK Build-Tools 36.0.0
   - Android SDK Platform-Tools
   - Android Emulator
   - NDK 27.1.12297006
4. Install JDK 17 and set `JAVA_HOME`.
5. Set `ANDROID_HOME`, normally:
   `C:\Users\YOUR_NAME\AppData\Local\Android\Sdk`
6. Add these to the Windows PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`
   - `%ANDROID_HOME%\cmdline-tools\latest\bin`
7. Create and start an Android Virtual Device, or connect a physical Android device with USB debugging enabled.
8. Confirm that the device is visible:

```bash
adb devices
```

If `adb` is not recognized, fix the PATH and restart PowerShell.

## Replace the sample logo

Replace this file while keeping the same filename:

`src/assets/images/society-logo.png`

Recommended format: transparent PNG, square canvas, at least 512 × 512 pixels.

To also change the Android launcher icon, replace the generated files under:

`android/app/src/main/res/mipmap-*`

Generate the `android` folder first with `npm run setup:android`.

## AsyncStorage keys

- `USER_SESSION`
- `USER_PROFILE`
- `QUIZ_START_TIME`
- `QUIZ_ANSWERS`
- `QUIZ_SUBMITTED`
- `QUIZ_RESULT`

## Connect to a live API later

1. Create `src/services/apiService.js` using `fetch` or Axios.
2. Replace the local credential comparison in `LoginScreen.js` with a secure HTTPS login endpoint.
3. Store only the returned session/access token and non-sensitive profile fields. For production tokens, prefer platform-secure storage rather than AsyncStorage.
4. Replace `src/data/questions.js` with an API call before the quiz begins.
5. Submit answers and the server-issued attempt ID to the backend.
6. Let the server calculate the authoritative result and retake eligibility.
7. Keep the local timestamp and answers as recovery data, but validate time and submission status with the server.

## Allow a development retake

Clear the app data:

```bash
adb shell pm clear com.medicalquizapp
```

For production, retake permission should come from the backend.

## Folder structure

```text
src/
├── assets/images/
├── components/
├── constants/
├── data/
├── navigation/
├── screens/
├── services/
└── utils/
```
