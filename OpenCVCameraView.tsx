import React from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';

interface OpenCVCameraViewProps extends ViewProps {
  isActive?: boolean;
  effectEnabled?: boolean;
  onFPSUpdate?: (event: { nativeEvent: { fps: number } }) => void;
  cameraType?: 'front' | 'back';
}

const NativeOpenCVCameraView = requireNativeComponent<OpenCVCameraViewProps>('OpenCVCameraView');

export const OpenCVCameraView: React.FC<OpenCVCameraViewProps> = (props) => {
  return <NativeOpenCVCameraView {...props} />;
};
