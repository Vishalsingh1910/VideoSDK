#import <React/RCTView.h>
#import <React/RCTComponent.h>

@interface OpenCVCameraView : RCTView

@property (nonatomic, assign) BOOL isActive;
@property (nonatomic, assign) BOOL effectEnabled;
@property (nonatomic, copy) NSString *cameraType;
@property (nonatomic, copy) RCTDirectEventBlock onFPSUpdate;

@end
