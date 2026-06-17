#import <React/RCTViewManager.h>
#import "OpenCVCameraView.h"

@interface OpenCVCameraViewManager : RCTViewManager
@end

@implementation OpenCVCameraViewManager

RCT_EXPORT_MODULE(OpenCVCameraView)

- (UIView *)view {
    return [[OpenCVCameraView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(isActive, BOOL)
RCT_EXPORT_VIEW_PROPERTY(effectEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(cameraType, NSString)
RCT_EXPORT_VIEW_PROPERTY(onFPSUpdate, RCTDirectEventBlock)

@end
