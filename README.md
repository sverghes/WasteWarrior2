# WasteWarrior Healthcare

<!-- Deploy to wastewarrior3.vercel.app: 2025-07-23 -->


https://user-images.githubusercontent.com/7581348/208559445-a449cef6-0ae1-4c08-b9a5-c591062c3a3e.mp4


Manage medical waste better with Artificial Intelligence 🏥

WasteWarrior Healthcare helps Theatre and Pathology departments classify and dispose of medical waste safely from a simple picture. Built with AI-powered waste identification and gamified learning for healthcare professionals.

👉 [Try it now - it's free with no sign in needed](https://wastewarrior3.vercel.app)

<!-- Final deployment with Leaderboard: 2025-07-23 -->

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alyssaxuu/ecosnap)

> You can support this project (and many others) through [GitHub Sponsors](https://github.com/sponsors/alyssaxuu)! ❤️

Made by [Alyssa X](https://twitter.com/alyssaxuu) & [Leo](https://www.linkedin.com/in/leonorfurtado/). Read more about how we built this [here](https://alyssax.substack.com/p/we-built-an-ai-recycling-app-in-a).

<a href="https://www.producthunt.com/posts/ecosnap?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-ecosnap" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=374164&theme=neutral" alt="WasteWarrior Healthcare - Manage&#0032;medical&#0032;waste&#0032;better&#0032;with&#0032;Artificial&#0032;Intelligence | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Table of contents

- [Features](#features)
- [Gamification](#gamification)
- [Installation](#installation)
- [The AI model](#the-ai-model)
	- [Dataset](#data)
	- [Training your own model](#training)
	- [Prediction](#prediction)
    - [The feedback loop](#feedback)
- [Credit](#credit)
- [Libraries used](#libraries-used)

## Features

📸 Snap or upload a picture of medical waste items<br>
📱 Install the PWA on your phone for easy access in Theatre/Pathology<br>
🔍 Search for specific medical items to know disposal protocols<br>
🏥 Learn proper medical waste classification using AI<br>
🗑️ Track your department's waste classification accuracy<br>
🎯 Complete daily challenges and earn achievement badges<br>
📊 Department leaderboards and progress tracking<br>
⚡ Real-time disposal guidance for Theatre and Pathology staff<br>
✨...and much more to come - all for free & no sign in needed!

## Gamification

🏆 **Collective Leaderboard**: Real-time competition across Theatre and Pathology departments<br>
📈 **Cross-Department Rankings**: See how your waste management skills compare hospital-wide<br>
🥇 **Healthcare Heroes**: Anonymous competition with randomly generated healthcare hero names<br>
🎯 **Daily Challenges**: Complete waste identification challenges for streak rewards<br>
⭐ **Streak System**: Build consecutive day streaks for bonus recognition<br>
📊 **Achievement Tracking**: Earn badges for learning milestones and consistent engagement<br>
🔄 **Real-time Updates**: Watch your ranking update instantly as you earn points<br>

### Collective Leaderboard Features
- **Unified Competition**: Both Theatre and Pathology departments compete on the same leaderboard
- **Top 3 Podium**: Special recognition with gold, silver, and bronze rankings
- **Department Icons**: 🏥 Theatre Department and 🔬 Pathology Department identifiers
- **Anonymous Privacy**: Compete safely with generated names like "Theatre Warrior 1234"
- **Live Updates**: Rankings update in real-time as users earn points across the hospital

### Point System
- **Disposal Guide Click**: 10 points per educational interaction
- **Daily Challenge**: Complete 3 guide clicks for +1 streak
- **Streak Bonus**: Build consecutive day streaks for leaderboard recognition
- **Badge Rewards**: Earn achievement badges for reaching learning milestones

## Installation
You can deploy to Vercel directly by [clicking here](https://vercel.com/new/clone?repository-url=https://github.com/alyssaxuu/ecosnap). 

**Important:** Make sure to update the environment variable for [NEXT_PUBLIC_MODEL_URL](https://github.com/alyssaxuu/ecosnap/blob/a9c7e7e1ec19f106db69abd6d66be558bd21445a/.env#L16) in the .env file, and set it to an absolute URL where you host the [model.json](https://github.com/alyssaxuu/ecosnap/tree/main/ml/models/efficient_net/10/predict) (make sure to include the other shard bin files alongside the JSON).


## The AI Model

### Data

The model is trained on medical waste classification examples from Theatre and Pathology departments, including:

- **Red Bag Waste**: Infectious/pathological waste, contaminated PPE
- **Yellow Bag Waste**: Clinical waste, pharmaceuticals, anatomical waste
- **Sharps Containers**: Needles, scalpels, broken glass, surgical instruments
- **Blue/White Bags**: Pharmaceutical waste, expired medications
- **Black Bags**: Non-hazardous waste, general refuse
- **Chemotherapy Waste**: Purple/yellow bags for cytotoxic materials
- **Pathology Specimens**: Tissue samples, body parts, laboratory waste

Training data can be found in `ml/medical_waste_categories` combining healthcare facility datasets and images from Theatre and Pathology departments across NHS trusts.

### Training

The final model was trained using [TensorFlow's EfficientNet](https://www.tensorflow.org/api_docs/python/tf/keras/applications/efficientnet_v2/EfficientNetV2B0) implementation, with model weights frozen for transfer learning to learn medical waste categories faster. The model was trained in `Python` on a GPU-powered machine for faster training. You can find the training script in `ml/train_medical.py` where different meta architectures and parameters were experimented with for optimal medical waste classification.

### Prediction

To predict the medical waste category, the model integrates with the front-end app for real-time results. We converted the model for compatibility with [TensorFlow.js](https://www.tensorflow.org/js) and used [Web Workers](https://github.com/alyssaxuu/ecosnap/blob/main/components/Worker.js) to prevent blocking the main thread during client-side prediction.

The app processes the image Tensor through the model, which returns probabilities for each medical waste category. The highest probability category is displayed with:

- **Disposal Protocol**: Step-by-step disposal instructions
- **Safety Requirements**: PPE and handling guidelines  
- **Regulatory Compliance**: NHS/healthcare facility requirements
- **Risk Assessment**: Contamination and safety warnings
- **Gamification Points**: Earned for correct identification

### Feedback

Medical waste classification accuracy is critical for patient and staff safety. When the model makes incorrect predictions, users can provide corrections, which benefits the system in several ways:

1. Healthcare professionals get accurate disposal information they need
2. We can monitor model performance in clinical environments
3. We collect new training data (with user consent) to improve the model
4. Users earn gamification points for providing feedback and teaching the system

The feedback loop includes:
- **Immediate correction rewards**: Bonus points for helping improve the model
- **Peer validation**: Other staff can confirm corrections for additional points
- **Learning analytics**: Track which waste types are most challenging for staff
- **Continuous improvement**: Model updates based on real-world Theatre/Pathology usage

While we implemented the front-end feedback system with gamification elements, the backend connection can be configured based on your healthcare facility's data governance requirements and privacy policies.

## Credit
- NHS Medical Waste Guidelines - for disposal protocols and safety requirements
- Healthcare Facilities Management - for waste classification standards
- Theatre and Pathology Departments - for real-world usage data and feedback
- Medical Training Institutions - for educational content and validation
- [Collletttivo](http://collletttivo.it/) - for the Mattone font
- [Stubborn](https://stubborn.fun/) - for medical-themed illustrations
- [Unsplash](https://unsplash.com/) - for healthcare imagery

## Libraries used
- [Tensorflow](https://www.tensorflow.org/) - for training the model and doing medical waste prediction
- [React Camera Pro](https://github.com/purple-technology/react-camera-pro) - for camera functionality in clinical settings
- [Chart.js](https://www.chartjs.org/) - for gamification analytics and progress tracking
- [Framer Motion](https://www.framer.com/motion/) - for achievement animations and UI feedback


Feel free to reach out to us at hi@alyssax.com, to [Alyssa](https://twitter.com/alyssaxuu) or [Leo](https://www.linkedin.com/in/leonorfurtado/) directly if you have any questions about implementing WasteWarrior Healthcare in your Theatre or Pathology department! 🏥�
