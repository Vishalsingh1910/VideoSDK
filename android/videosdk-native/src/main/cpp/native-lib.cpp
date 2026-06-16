#include <jni.h>
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>

extern "C" JNIEXPORT void JNICALL
Java_com_videosdk_OpenCVCameraViewManager_processCanny(JNIEnv* env, jclass clazz, jlong matAddrRgba) {
    cv::Mat& mRgba = *(cv::Mat*)matAddrRgba;
    cv::Mat mGray;
    cv::Mat mCanny;

    // Convert to grayscale
    cv::cvtColor(mRgba, mGray, cv::COLOR_RGBA2GRAY);

    // Apply Gaussian blur to reduce noise
    cv::GaussianBlur(mGray, mGray, cv::Size(5, 5), 0);

    // Apply Canny Edge Detection
    cv::Canny(mGray, mCanny, 50, 150);

    // Convert 1-channel Canny output back to 4-channel RGBA so it displays correctly
    cv::cvtColor(mCanny, mRgba, cv::COLOR_GRAY2RGBA);
}
