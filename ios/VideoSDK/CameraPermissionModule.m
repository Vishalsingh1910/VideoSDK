#import <React/RCTBridgeModule.h>
#import <AVFoundation/AVFoundation.h>

@interface CameraPermissionModule : NSObject <RCTBridgeModule>
@end

@implementation CameraPermissionModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(checkPermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if (status == AVAuthorizationStatusAuthorized) {
        resolve(@"granted");
    } else if (status == AVAuthorizationStatusDenied || status == AVAuthorizationStatusRestricted) {
        resolve(@"denied");
    } else {
        resolve(@"not_determined");
    }
}

RCT_EXPORT_METHOD(requestPermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
        resolve(granted ? @"granted" : @"denied");
    }];
}

@end
