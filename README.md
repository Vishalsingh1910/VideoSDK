# VideoSDK React Native OpenCV Integration

This project is a React Native application that captures real-time video, applies native image processing algorithms (Canny Edge Detection and Grayscale) using C++ and OpenCV, and renders the processed video in the UI.

## Processing Pipeline

The video processing pipeline involves capturing camera frames natively in Android, passing them via Java Native Interface (JNI) to C++, processing the frames using OpenCV, and rendering them back. The app calculates real-time frames per second (FPS) and sends them to React Native to measure rendering smoothness.

### 1. Camera Capture (React Native / Java)
- The React Native code `App.tsx` handles checking for, and requesting, camera permissions.
- Once granted, the `OpenCVCameraView` component is mounted.
- On the Android side, `OpenCVCameraViewManager.java` manages the camera view using `JavaCamera2View` (provided by OpenCV).
- `JavaCamera2View` continuously captures frames from the camera using the native Android Camera2 API and triggers the `onCameraFrame` callback for every available frame.

### 2. Native Processing (C++ & OpenCV)
- Inside `onCameraFrame` in `OpenCVCameraViewManager.java`, the incoming frame is provided as a `Mat` (Matrix) object.
- If the effect is toggled "ON", the Java code invokes the native C++ method `processCanny`, passing the memory address of the raw RGBA `Mat`.
- In `native-lib.cpp`, the C++ code performs the following steps on the `Mat` pointer:
  1. **Grayscale Conversion**: Converts the frame from RGBA to Grayscale (`cv::COLOR_RGBA2GRAY`).
  2. **Gaussian Blur**: Applies a 5x5 Gaussian Blur to reduce noise and soften the image.
  3. **Canny Edge Detection**: Runs the Canny Edge detector algorithm to highlight structural outlines.
  4. **RGBA Conversion**: Converts the processed 1-channel Grayscale output back to 4-channel RGBA (`cv::COLOR_GRAY2RGBA`) so the Android `JavaCamera2View` can correctly render it to the screen.

### 3. Rendering and UI (React Native)
- After the C++ native method finishes modifying the `Mat` in place, Java receives the processed `Mat` and returns it to `JavaCamera2View` to be rendered onto the screen.
- Simultaneously, `OpenCVCameraViewManager.java` measures the time difference between frames and calculates the Frames Per Second (FPS).
- Once per second, the Android native view manager dispatches an `onFPSUpdate` event back to the React Native component.
- `App.tsx` catches this event and updates the `fps` state, reflecting the rendering speed directly in the green badge UI on the screen.

## Controls & Features
The React Native UI provides several control mechanisms and features:
- **Start / Stop**: Toggles the Android native `cameraView` visibility and streaming using the `isActive` prop.
- **Effect ON / Effect OFF**: Changes the `effectEnabled` prop. When OFF, the Java code skips the JNI `processCanny` method and returns the raw RGBA frames, resulting in normal color playback. When ON, it passes the frames to C++ for the OpenCV effect.
- **Swap Camera**: Swaps between the front and back lens via the `cameraType` prop, dynamically destroying and re-initializing the underlying native camera view.
- **Permission Handling & Settings Redirect**: Gracefully handles permissions. If the user permanently denies camera access, the UI adapts to display a direct redirect button utilizing `Linking.openSettings()` to open device application settings.
