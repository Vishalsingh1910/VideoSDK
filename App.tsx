import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, PermissionsAndroid, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OpenCVCameraView } from './OpenCVCameraView';

export default function App() {
  const [status, setStatus] = useState<'loading' | 'requesting' | 'granted' | 'denied'>('loading');

  const [isActive, setIsActive] = useState(true);
  const [effectEnabled, setEffectEnabled] = useState(true);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [fps, setFps] = useState(0);


  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted) {
        setStatus('granted');
      } else {
        setStatus('requesting');
      }
    } else {
      setStatus('granted');
    }
  };

  const handleRequestPermission = async () => {
    setStatus('loading');
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('granted');
        } else {
          setStatus('denied');
        }
      } catch (err) {
        console.warn(err);
        setStatus('denied');
      }
    } else {
      setStatus('granted');
    }
  };

  if (status === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>Checking permissions...</Text>
      </View>
    );
  }

  if (status === 'requesting') {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.title}>Camera Access Required</Text>
        <Text style={styles.text}>
          We need access to your camera to provide the core functionality of this app.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRequestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (status === 'denied') {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.title}>Permission Denied</Text>
        <Text style={styles.errorText}>
          You have denied camera permissions. Please go to your settings to enable them to use the camera.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openSettings()}>
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (status === 'granted') {
    return (
      <View style={styles.container}>
        <OpenCVCameraView
          style={StyleSheet.absoluteFill}
          isActive={isActive}
          effectEnabled={effectEnabled}
          cameraType={cameraType}
          onFPSUpdate={(e) => setFps(e.nativeEvent.fps)}
        />
        <SafeAreaView style={styles.overlay}>
          <View style={styles.topBar}>
            <Text style={styles.fpsText}>FPS: {fps}</Text>
          </View>
          <View style={styles.bottomBar}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setCameraType(prev => prev === 'back' ? 'front' : 'back')}
              >
                <Text style={styles.controlButtonText}>Swap Camera</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.controlButton, isActive ? styles.activeButton : null]}
                onPress={() => setIsActive(true)}
              >
                <Text style={styles.controlButtonText}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, !isActive ? styles.activeButton : null]}
                onPress={() => setIsActive(false)}
              >
                <Text style={styles.controlButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.controlButton, effectEnabled ? styles.activeButton : null]}
                onPress={() => setEffectEnabled(true)}
              >
                <Text style={styles.controlButtonText}>Effect ON</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, !effectEnabled ? styles.activeButton : null]}
                onPress={() => setEffectEnabled(false)}
              >
                <Text style={styles.controlButtonText}>Effect OFF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF3B30',
    marginBottom: 30,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 10,
  },
  topBar: {
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  fpsText: {
    color: '#00FF00',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  bottomBar: {
    paddingBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 120,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    borderColor: '#007AFF',
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
