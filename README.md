# 📸 VideoSDK: React Native + OpenCV

> *Hi, I'm **Vishal Singh**! Welcome to my open-source showcase. I love pushing the boundaries of mobile development, and here I'm demonstrating how to build a high-performance, real-time image processing pipeline bridging React Native, C++, and OpenCV.*

This project captures real-time video natively on **Android & iOS**, processes it using **OpenCV (C++ Canny Edge Detection)**, and renders it smoothly at high FPS back into React Native.

🔗 **[Download Android APK](https://drive.google.com/file/d/1t8vIS4GmqA2g37en4y-s2YaynitFFv09/view?usp=sharing)**  
🎥 **[Watch Video Demo](https://drive.google.com/file/d/1Tt5yw6n0VWv8mRSQfObfte-QTT1Kmxf2/view?usp=sharing)**

## ✨ Features
- 🚀 **Real-time Native Processing:** C++ powered OpenCV integration (via JNI for Android, Objective-C++ for iOS).
- ⚡️ **Live FPS Tracking:** Native performance measurement rendered directly in the UI.
- 🎨 **Live Vision Effects:** Toggle Canny Edge Detection and Grayscale processing on the fly.
- 🔄 **Camera Controls:** Seamless front/back camera swapping and smart permission handling.

## 🛠️ Setup & OpenCV SDK Installation
To build and run this project, you'll need the OpenCV SDK for your respective platforms.

### 🤖 For Android:
1. Download the [OpenCV Android SDK](https://opencv.org/releases/) (e.g., version 4.x).
2. Extract the archive and add the OpenCV module to your `android/opencv-sdk/` directory.

### 🍎 For iOS:
1. run npm install then run pod install in the ios folder

## 🧠 How It Works (The Pipeline)
Keep it simple! The app works in 3 core steps:
1. **Capture:** `JavaCamera2View` (Android) and `CvVideoCamera` (iOS) capture camera frames natively.
2. **Process:** Frames are passed to C++ where Grayscale, Gaussian Blur, and **Canny Edge Detection** are applied in real-time.
3. **Render:** The modified frames are returned as RGBA/BGRA and rendered onto the screen, while FPS metrics are dispatched back to the React Native UI (`App.tsx`).
