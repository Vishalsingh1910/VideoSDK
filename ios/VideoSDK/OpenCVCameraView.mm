#ifdef __cplusplus
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"
#import <opencv2/opencv.hpp>
#import <opencv2/videoio/cap_ios.h>
#pragma clang diagnostic pop
#endif

#import "OpenCVCameraView.h"
#import <React/RCTLog.h>

@interface OpenCVCameraView () <CvVideoCameraDelegate>

@property (nonatomic, strong) CvVideoCamera *videoCamera;
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, assign) int frameCount;
@property (nonatomic, assign) NSTimeInterval lastFPSTime;

@end

@implementation OpenCVCameraView

- (instancetype)init {
    self = [super init];
    if (self) {
        _imageView = [[UIImageView alloc] init];
        _imageView.contentMode = UIViewContentModeScaleAspectFill;
        [self addSubview:_imageView];
        
        _videoCamera = [[CvVideoCamera alloc] initWithParentView:_imageView];
        _videoCamera.defaultAVCaptureDevicePosition = AVCaptureDevicePositionFront;
        _videoCamera.defaultAVCaptureSessionPreset = AVCaptureSessionPreset640x480;
        _videoCamera.defaultAVCaptureVideoOrientation = AVCaptureVideoOrientationPortrait;
        _videoCamera.defaultFPS = 30;
        _videoCamera.delegate = self;
        
        _frameCount = 0;
        _lastFPSTime = [[NSDate date] timeIntervalSince1970];
        _isActive = NO;
        _effectEnabled = NO;
        _cameraType = @"front";
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    _imageView.frame = self.bounds;
}

- (void)setIsActive:(BOOL)isActive {
    if (_isActive != isActive) {
        _isActive = isActive;
        if (_isActive) {
            [_videoCamera start];
        } else {
            [_videoCamera stop];
        }
    }
}

- (void)setCameraType:(NSString *)cameraType {
    if (![_cameraType isEqualToString:cameraType]) {
        BOOL wasRunning = _isActive;
        if (wasRunning) {
            [_videoCamera stop];
        }
        
        _cameraType = cameraType;
        if ([cameraType isEqualToString:@"back"]) {
            _videoCamera.defaultAVCaptureDevicePosition = AVCaptureDevicePositionBack;
        } else {
            _videoCamera.defaultAVCaptureDevicePosition = AVCaptureDevicePositionFront;
        }
        
        if (wasRunning) {
            [_videoCamera start];
        }
    }
}

- (void)setEffectEnabled:(BOOL)effectEnabled {
    _effectEnabled = effectEnabled;
}

#pragma mark - CvVideoCameraDelegate

#ifdef __cplusplus
- (void)processImage:(cv::Mat&)image {
    // FPS Calculation
    _frameCount++;
    NSTimeInterval currentTime = [[NSDate date] timeIntervalSince1970];
    if (currentTime - _lastFPSTime >= 1.0) {
        int fps = _frameCount;
        _frameCount = 0;
        _lastFPSTime = currentTime;
        
        if (self.onFPSUpdate) {
            self.onFPSUpdate(@{@"fps": @(fps)});
        }
    }
    
    // Apply Canny Edge Detection
    if (self.effectEnabled) {
        cv::Mat gray;
        cv::cvtColor(image, gray, cv::COLOR_BGRA2GRAY);
        cv::blur(gray, gray, cv::Size(3, 3));
        cv::Canny(gray, gray, 50, 150);
        cv::cvtColor(gray, image, cv::COLOR_GRAY2BGRA);
    }
}
#endif

@end
