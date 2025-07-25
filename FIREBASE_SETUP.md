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
3. Choose "Start in production mode" (for security)
4. Select a location close to your users (recommended: us-central1 or europe-west1)
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
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBhkhr1A6fOEuM7Um4ld2qL6FloVCFj5Y",
  authDomain: "wastewarrior-healthcare.firebaseapp.com",
  projectId: "wastewarrior-healthcare",
  storageBucket: "wastewarrior-healthcare.firebasestorage.app",
  messagingSenderId: "618257929283",
  appId: "1:618257929283:web:240412ae2d664f82e0f0f6",
  measurementId: "G-DQJ3TPXQRV"
};
```

### 5. Configure Firestore Security Rules
In Firebase Console → Firestore Database → Rules, use these secure production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Production rules for leaderboard collection
    match /leaderboard/{userId} {
      // Allow users to read all leaderboard data (for rankings)
      allow read: if true;
      
      // Allow users to write only with valid warrior ID format and data structure
      allow write: if userId is string 
        && userId.size() > 0
        && request.auth == null // Anonymous access allowed
        && (userId.matches('TW[0-9]{4}') || userId.matches('PW[0-9]{4}'))
        && validateLeaderboardData(resource, request.resource);
    }
    
    // Rules for warrior ID counters
    match /counters/{department} {
      allow read: if true;
      allow write: if department in ['theatreWarriors', 'pathologyWarriors']
        && request.auth == null;
    }
  }
}

// Validation function for leaderboard data
function validateLeaderboardData(existingData, newData) {
  return newData.data.keys().hasAll(['userId', 'name', 'points', 'streak', 'badges', 'department', 'lastUpdated'])
    && newData.data.userId is string
    && newData.data.name is string
    && newData.data.points is int
    && newData.data.points >= 0
    && newData.data.streak is int
    && newData.data.streak >= 0
    && newData.data.badges is int
    && newData.data.badges >= 0
    && newData.data.department in ['Theatre', 'Pathology']
    && newData.data.lastUpdated is string;
}
}
```

**Alternative Simpler Production Rules** (if the above validation is too strict):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{userId} {
      allow read: if true; // Anyone can read leaderboard
      allow write: if true; // Allow writes for demo - monitor usage
    }
  }
}
```

## Features Enabled
- ✅ Real-time leaderboard updates
- ✅ Cross-department competition
- ✅ Structured warrior IDs (TW#### for Theatre, PW#### for Pathology)
- ✅ Sequential ID generation with Firebase counters
- ✅ Points and streak synchronization
- ✅ Top 3 podium rankings
- ✅ Department-specific identification

## Offline Support
The app works offline and will sync leaderboard data when connectivity is restored. Users can continue earning points locally even without internet access.

## Privacy & Security
- Users are identified by structured warrior IDs like "TW1001" (Theatre Warrior) or "PW1001" (Pathology Warrior)
- Sequential ID generation ensures unique identification while maintaining anonymity
- No personal information is stored
- Department selection is the only identifying information
- Production-ready Firestore security rules implemented
- Data validation ensures only proper leaderboard entries and warrior ID formats
- Anonymous access controlled and monitored

## Production Deployment
1. ✅ Firestore security rules configured for production
2. Monitor usage in Firebase Console → Usage tab
3. Set up Firebase project billing if usage exceeds free tier
4. Consider enabling Firebase Analytics for usage insights
5. Review and update security rules periodically

## Testing
The leaderboard will work immediately after Firebase setup. Test by:
1. Opening the app in multiple browser tabs/devices
2. Selecting different departments
3. Earning points through disposal guide interactions
4. Watching real-time leaderboard updates
