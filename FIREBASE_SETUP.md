# Firebase Setup Instructions for WasteWarrior Healthcare Leaderboard

## Overview
The collective leaderboard system uses Firebase Firestore to store and sync user data across all devices in real-time. This enables healthcare professionals from Theatre and Pathology departments to compete on a unified leaderboard.

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Name your project: `wastewarrior-healthcare`
4. Enable Google Analytics (optional)
5. Complete project creation

### 2. Enable Firestore Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### 3. Get Firebase Configuration
1. In your Firebase project, click the gear icon (⚙️) → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web app icon (`</>`) to add a web app
4. Register app name: `WasteWarrior Healthcare`
5. Copy your Firebase configuration object

### 4. Update Firebase Config
Replace the placeholder values in `/firebase/firebaseConfig.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 5. Configure Firestore Security Rules
In Firebase Console → Firestore Database → Rules, use these rules for the leaderboard:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to leaderboard collection
    match /leaderboard/{userId} {
      allow read, write: if true; // Open for demo - restrict in production
    }
  }
}
```

## Features Enabled
- ✅ Real-time leaderboard updates
- ✅ Cross-department competition
- ✅ Anonymous user tracking
- ✅ Points and streak synchronization
- ✅ Top 3 podium rankings
- ✅ Department-specific identification

## Offline Support
The app works offline and will sync leaderboard data when connectivity is restored. Users can continue earning points locally even without internet access.

## Privacy & Security
- Users are identified by anonymous IDs like "Theatre Warrior 1234"
- No personal information is stored
- Department selection is the only identifying information
- Consider implementing more restrictive Firestore rules for production use

## Production Deployment
1. Update Firestore security rules for production
2. Set up Firebase project billing if needed
3. Monitor usage in Firebase Console
4. Consider implementing user authentication for enhanced security

## Testing
The leaderboard will work immediately after Firebase setup. Test by:
1. Opening the app in multiple browser tabs/devices
2. Selecting different departments
3. Earning points through disposal guide interactions
4. Watching real-time leaderboard updates
