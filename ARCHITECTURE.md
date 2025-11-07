# WasteWarrior Healthcare - System Architecture

## 🏗️ High-Level Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        PWA[Progressive Web App]
        UI[React UI Components]
        Camera[Camera Interface]
        LocalStorage[Browser LocalStorage]
    end
    
    subgraph "Processing Layer"
        WebWorker[Web Worker]
        TensorFlow[TensorFlow.js Engine]
        AIModel[EfficientNet Model*]
    end
    
    subgraph "Backend Services"
        Firebase[Firebase Firestore]
        Counters[Badge/ID Counters]
        Leaderboard[Real-time Leaderboard]
    end
    
    subgraph "Deployment"
        Vercel[Vercel Hosting]
        CDN[Global CDN]
        GitHub[GitHub Repository]
    end
    
    PWA --> WebWorker
    WebWorker --> TensorFlow
    TensorFlow --> AIModel
    UI --> LocalStorage
    UI --> Firebase
    Firebase --> Counters
    Firebase --> Leaderboard
    GitHub --> Vercel
    Vercel --> CDN
    CDN --> PWA
    
    classDef missing fill:#ffcccc,stroke:#ff0000,stroke-width:2px
    class AIModel missing
```

*Note: AI Model currently missing - requires training and deployment*

## 🎯 Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        Dashboard[Dashboard.js]
        Splash[Splash.js]
        DepartmentSelector[DepartmentSelector.js]
        Viewer[Viewer.js]
        Overlay[Overlay.js]
        Leaderboard[Leaderboard.js]
        Settings[Settings.js]
        HowTo[HowTo.js]
    end
    
    subgraph "Utility Layer"
        BadgeUtils[badges.js]
        BadgeCounters[badgeCounters.js]
        WarriorID[warriorId.js]
        Firebase[firebaseConfig.js]
    end
    
    subgraph "AI Components"
        ML[ML.js]
        Worker[Worker.js]
        TF[TensorFlow.js]
    end
    
    Dashboard --> BadgeUtils
    Dashboard --> BadgeCounters
    Dashboard --> WarriorID
    DepartmentSelector --> WarriorID
    Viewer --> ML
    ML --> Worker
    Worker --> TF
    BadgeCounters --> Firebase
    WarriorID --> Firebase
    Leaderboard --> Firebase
```

## 📊 Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant PWA
    participant LocalStorage
    participant Firebase
    participant Worker
    participant AI as AI Model*
    
    Note over AI: *Currently Missing
    
    User->>PWA: Launch App
    PWA->>LocalStorage: Check existing session
    LocalStorage-->>PWA: Return user data
    
    alt New User
        PWA->>Firebase: Generate WarriorID
        Firebase-->>PWA: Return TW####/PW####
        PWA->>LocalStorage: Store user data
    end
    
    User->>PWA: Capture image
    PWA->>Worker: Process image
    Worker->>AI: Classify waste
    AI-->>Worker: Return prediction*
    Worker-->>PWA: Classification result*
    
    User->>PWA: Educational interaction
    PWA->>LocalStorage: Update points/streak
    PWA->>Firebase: Sync leaderboard
    Firebase-->>PWA: Updated rankings
```

## 🗄️ Data Architecture

```mermaid
erDiagram
    USER {
        string warriorId PK "TW####/PW####"
        string department "Theatre/Pathology"
        int points "Total points earned"
        int streak "Consecutive days"
        object badgeIds "Muffin/Coffee badge IDs"
        date lastActive "Last interaction"
        int region "Department selection"
        boolean onboarding "Completion status"
    }
    
    BADGE_COUNTERS {
        string type PK "muffin/coffee"
        int count "Sequential counter"
        date createdAt "Counter creation"
        string badgeType "Badge category"
    }
    
    WARRIOR_COUNTERS {
        string department PK "theatre/pathology"
        int count "Sequential counter"
        date createdAt "Counter creation"
    }
    
    LEADERBOARD {
        string userId PK "Firebase user ID"
        string warriorId "Display ID"
        string department "Theatre/Pathology"
        int points "Current points"
        int streak "Current streak"
        object badgeIds "Badge collections"
        date lastActive "Last sync"
    }
    
    USER ||--o{ LEADERBOARD : syncs
    BADGE_COUNTERS ||--o{ USER : generates
    WARRIOR_COUNTERS ||--o{ USER : generates
```

## 🔧 Technology Stack

```mermaid
graph TB
    subgraph "Frontend Technologies"
        NextJS[Next.js 15.1.4]
        React[React 18.3.1]
        CSS[CSS Modules]
        PWA[PWA with Service Worker]
    end
    
    subgraph "AI/ML Stack"
        TensorFlowJS[TensorFlow.js 4.2.0]
        EfficientNet[EfficientNet Model*]
        WebWorkers[Web Workers API]
    end
    
    subgraph "Backend Services"
        FirebaseDB[Firebase Firestore]
        FirebaseAuth[Firebase SDK]
        CloudFunctions[Serverless Functions]
    end
    
    subgraph "Development Tools"
        ESLint[ESLint]
        Webpack[Webpack]
        Git[Git Version Control]
    end
    
    subgraph "Deployment Platform"
        VercelHost[Vercel Hosting]
        VercelCDN[Global CDN]
        VercelBuild[CI/CD Pipeline]
    end
    
    NextJS --> React
    NextJS --> CSS
    NextJS --> PWA
    React --> TensorFlowJS
    TensorFlowJS --> EfficientNet
    TensorFlowJS --> WebWorkers
    NextJS --> FirebaseDB
    FirebaseDB --> FirebaseAuth
    Git --> VercelHost
    VercelHost --> VercelCDN
    VercelHost --> VercelBuild
    
    classDef missing fill:#ffcccc,stroke:#ff0000,stroke-width:2px
    class EfficientNet missing
```

## 🛂 Security & Privacy Architecture

```mermaid
graph TB
    subgraph "Privacy Layer"
        Anonymous[Anonymous Operation]
        LocalFirst[Local-First Data]
        NoPersonalData[No Personal Info]
    end
    
    subgraph "Data Protection"
        LocalStorage[Browser LocalStorage]
        Firebase[Firebase Security Rules]
        HTTPS[HTTPS Encryption]
    end
    
    subgraph "Access Control"
        DepartmentIsolation[Department Isolation]
        SecureCounters[Secure ID Generation]
        OfflineCapable[Offline Operation]
    end
    
    Anonymous --> LocalFirst
    LocalFirst --> NoPersonalData
    LocalStorage --> Firebase
    Firebase --> HTTPS
    DepartmentIsolation --> SecureCounters
    SecureCounters --> OfflineCapable
```

## 🔄 State Management Flow

```mermaid
stateDiagram-v2
    [*] --> AppStart
    AppStart --> CheckSession
    
    CheckSession --> NewUser : No session
    CheckSession --> ExistingUser : Session found
    
    NewUser --> DepartmentSelection
    DepartmentSelection --> GenerateWarriorID
    GenerateWarriorID --> Onboarding
    Onboarding --> Dashboard
    
    ExistingUser --> RestoreSession
    RestoreSession --> Dashboard
    
    Dashboard --> CameraCapture : Scan waste
    Dashboard --> EducationalContent : Learn disposal
    Dashboard --> ViewLeaderboard : Check rankings
    
    CameraCapture --> AIProcessing : Process image*
    AIProcessing --> WasteIdentification : Classify*
    WasteIdentification --> Dashboard : Show results*
    
    EducationalContent --> UpdatePoints : +10 points
    UpdatePoints --> CheckStreak : Daily challenge
    CheckStreak --> AwardBadge : Streak milestone
    AwardBadge --> SyncFirebase : Update leaderboard
    SyncFirebase --> Dashboard
    
    ViewLeaderboard --> Dashboard
    
    note right of AIProcessing : *Currently not functional - missing AI model
```

## 📱 Progressive Web App Architecture

```mermaid
graph TB
    subgraph "PWA Features"
        Manifest[Web App Manifest]
        ServiceWorker[Service Worker]
        OfflineCache[Offline Caching]
        InstallPrompt[Installation Support]
    end
    
    subgraph "Offline Capabilities"
        LocalData[Local Data Storage]
        OfflineUI[Offline UI]
        BackgroundSync[Background Sync]
    end
    
    subgraph "Native-Like Features"
        FullScreen[Fullscreen Mode]
        HomeScreen[Home Screen Icon]
        PushNotifications[Push Notifications*]
    end
    
    Manifest --> ServiceWorker
    ServiceWorker --> OfflineCache
    OfflineCache --> InstallPrompt
    LocalData --> OfflineUI
    OfflineUI --> BackgroundSync
    FullScreen --> HomeScreen
    HomeScreen --> PushNotifications
    
    classDef future fill:#ccffcc,stroke:#00ff00,stroke-width:2px
    class PushNotifications future
```

## 🚀 Deployment Architecture

```mermaid
graph LR
    subgraph "Development"
        LocalDev[Local Development]
        GitCommit[Git Commit]
        GitHub[GitHub Repository]
    end
    
    subgraph "CI/CD Pipeline"
        VercelBuild[Vercel Build]
        NextBuild[Next.js Build]
        PWAGeneration[PWA Generation]
        AssetOptimization[Asset Optimization]
    end
    
    subgraph "Production"
        VercelEdge[Vercel Edge Network]
        GlobalCDN[Global CDN]
        HTTPS[HTTPS Endpoints]
    end
    
    subgraph "External Services"
        FirebaseCloud[Firebase Cloud]
        ModelHosting[AI Model Hosting*]
    end
    
    LocalDev --> GitCommit
    GitCommit --> GitHub
    GitHub --> VercelBuild
    VercelBuild --> NextBuild
    NextBuild --> PWAGeneration
    PWAGeneration --> AssetOptimization
    AssetOptimization --> VercelEdge
    VercelEdge --> GlobalCDN
    GlobalCDN --> HTTPS
    FirebaseCloud --> HTTPS
    ModelHosting --> HTTPS
    
    classDef missing fill:#ffcccc,stroke:#ff0000,stroke-width:2px
    class ModelHosting missing
```

## 📈 Scalability Architecture

```mermaid
graph TB
    subgraph "Horizontal Scaling"
        MultipleUsers[Multiple Users]
        LoadBalancing[Automatic Load Balancing]
        EdgeCaching[Global Edge Caching]
    end
    
    subgraph "Database Scaling"
        FirestoreAuto[Firestore Auto-scaling]
        GlobalDistribution[Global Distribution]
        RealTimeSync[Real-time Synchronization]
    end
    
    subgraph "Client Scaling"
        ClientSideAI[Client-side AI Processing]
        OfflineFirst[Offline-first Architecture]
        LocalCaching[Local Data Caching]
    end
    
    MultipleUsers --> LoadBalancing
    LoadBalancing --> EdgeCaching
    FirestoreAuto --> GlobalDistribution
    GlobalDistribution --> RealTimeSync
    ClientSideAI --> OfflineFirst
    OfflineFirst --> LocalCaching
```

## 🎯 Current Architecture Status

### ✅ **Implemented & Production-Ready**
- **Frontend Architecture**: Complete Next.js/React PWA
- **Data Layer**: Firebase Firestore with offline-first design
- **User Management**: WarriorID system with department isolation
- **Gamification**: Badge system with secure counters
- **Deployment**: Vercel CI/CD with global CDN
- **Security**: Anonymous operation with local-first privacy

### ❌ **Missing Components**
- **AI Model**: EfficientNet model not trained/deployed
- **Model Hosting**: No CDN endpoint for model.json
- **Environment Config**: Missing NEXT_PUBLIC_MODEL_URL
- **Training Pipeline**: No ML training infrastructure

### 🔄 **To Complete Architecture**
1. **Train medical waste classification model**
2. **Deploy model to CDN (e.g., AWS S3/CloudFront)**
3. **Configure environment variables**
4. **Test end-to-end AI pipeline**
5. **Validate healthcare compliance**

## 📋 Architecture Summary

**Current State**: **Sophisticated gamification platform** with complete user management, real-time leaderboards, and offline-first PWA capabilities.

**Missing**: **Core AI functionality** that provides the medical waste classification value proposition.

**Recommendation**: The architecture is **excellent and production-ready** for the gamification aspects, but requires **AI model development** to fulfill the healthcare waste management mission.

---

*This architecture supports hospital-wide deployment with the ability to scale to multiple healthcare facilities once the AI model is integrated.*