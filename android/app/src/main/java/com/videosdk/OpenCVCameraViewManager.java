package com.videosdk;

import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.opencv.android.CameraBridgeViewBase;
import org.opencv.android.JavaCamera2View;
import org.opencv.android.OpenCVLoader;
import org.opencv.core.Mat;

public class OpenCVCameraViewManager extends SimpleViewManager<FrameLayout> {
    public static final String REACT_CLASS = "OpenCVCameraView";
    private JavaCamera2View cameraView;
    private boolean effectEnabled = true;
    private long lastFpsCalcTime = 0;
    private int frameCount = 0;

    // Load native library
    static {
        try {
            if (OpenCVLoader.initDebug()) {
                System.loadLibrary("videosdk");
            }
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    public static native void processCanny(long matAddrRgba);

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public java.util.Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return com.facebook.react.common.MapBuilder.<String, Object>builder()
                .put("onFPSUpdate", com.facebook.react.common.MapBuilder.of("registrationName", "onFPSUpdate"))
                .build();
    }

    @NonNull
    @Override
    protected FrameLayout createViewInstance(@NonNull ThemedReactContext reactContext) {
        FrameLayout container = new FrameLayout(reactContext);
        
        cameraView = new JavaCamera2View(reactContext, CameraBridgeViewBase.CAMERA_ID_BACK);
        cameraView.setCvCameraViewListener(new CameraBridgeViewBase.CvCameraViewListener2() {
            @Override
            public void onCameraViewStarted(int width, int height) {
            }

            @Override
            public void onCameraViewStopped() {
            }

            @Override
            public Mat onCameraFrame(CameraBridgeViewBase.CvCameraViewFrame inputFrame) {
                Mat rgba = inputFrame.rgba();
                if (effectEnabled) {
                    processCanny(rgba.getNativeObjAddr());
                }

                // FPS Calculation
                frameCount++;
                long currentTime = System.currentTimeMillis();
                if (currentTime - lastFpsCalcTime >= 1000) {
                    int fps = frameCount;
                    frameCount = 0;
                    lastFpsCalcTime = currentTime;
                    
                    // Emit FPS event
                    com.facebook.react.bridge.WritableMap event = com.facebook.react.bridge.Arguments.createMap();
                    event.putInt("fps", fps);
                    reactContext.getJSModule(com.facebook.react.uimanager.events.RCTEventEmitter.class).receiveEvent(
                            container.getId(),
                            "onFPSUpdate",
                            event
                    );
                }

                return rgba;
            }
        });

        // Assume permissions were granted from JS side
        cameraView.setCameraPermissionGranted();
        cameraView.enableView();
        
        container.addView(cameraView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        return container;
    }

    @ReactProp(name = "isActive")
    public void setIsActive(FrameLayout view, boolean isActive) {
        if (cameraView != null) {
            if (isActive) {
                cameraView.enableView();
            } else {
                cameraView.disableView();
            }
        }
    }

    @ReactProp(name = "effectEnabled")
    public void setEffectEnabled(FrameLayout view, boolean enabled) {
        this.effectEnabled = enabled;
    }

    @ReactProp(name = "cameraType")
    public void setCameraType(FrameLayout view, String type) {
        if (cameraView != null) {
            int newIndex = "front".equals(type) ? 
                CameraBridgeViewBase.CAMERA_ID_FRONT : CameraBridgeViewBase.CAMERA_ID_BACK;
            
            cameraView.disableView();
            cameraView.setCameraIndex(newIndex);
            cameraView.enableView();
        }
    }
}
