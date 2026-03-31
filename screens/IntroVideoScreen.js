import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

const { width, height } = Dimensions.get('window');

// Preload home screen assets while video plays
Image.prefetch && Image.prefetch(
  Image.resolveAssetSource(require('../assets/logo.png')).uri
);

export default function IntroVideoScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hasNavigated = useRef(false);

  const videoPlayer = useVideoPlayer(
    require('../assets/studio-intro.mp4'),
    (playerInstance) => {
      playerInstance.loop = false;
      playerInstance.volume = 1.0;
      playerInstance.play();
    }
  );

  const navigateHome = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace('Home');
    });
  };

  useEffect(() => {
    if (!videoPlayer) return;

    const subscription = videoPlayer.addListener('playToEnd', navigateHome);

    // Fallback — if video takes too long, skip after 10 seconds
    const fallback = setTimeout(navigateHome, 10000);

    return () => {
      subscription.remove();
      clearTimeout(fallback);
    };
  }, [videoPlayer]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.videoContainer, { opacity: fadeAnim }]}>
        <VideoView
          player={videoPlayer}
          style={styles.video}
          contentFit="contain"
          nativeControls={false}
          allowsFullscreen={false}
          allowsExternalPlayback={false}
        />

        <TouchableOpacity style={styles.skipButton} onPress={navigateHome} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip ›</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width,
    height,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  skipButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
});