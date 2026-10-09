/* eslint-disable no-console */
console.log(`
To allow a retake during development:
1. Open the application.
2. Log out if required.
3. Clear the app data from Android Settings, or run:
   adb shell pm clear com.medicalquizapp

For production, expose a server-controlled retake flag instead of clearing local data.
`);
