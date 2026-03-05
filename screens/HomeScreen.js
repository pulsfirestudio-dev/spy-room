// HomeScreen.js
import AppButton from "../components/AppButton";
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Linking,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Preload logo image
Image.prefetch(Image.resolveAssetSource(require('../assets/logo.png')).uri);

const { width, height } = Dimensions.get('window');

const translations = {
  en: {
    title: 'SPY ROOM',
    tagline: 'Lies. Clues. Chaos.',
    newGame: 'NEW GAME',
    howToPlay: 'HOW TO PLAY',
    rateAndShare: 'RATE & SHARE',
    multiplayer: 'MULTIPLAYER',
    comingSoon: 'Coming Soon',
    language: 'LANGUAGE',
    leaveReview: 'LEAVE A REVIEW',
    supportShare: 'SUPPORT & SHARE',
  },
  lt: {
    title: 'SPY ROOM',
    tagline: 'Melas. Užuominos. Chaosas.',
    newGame: 'NAUJAS ŽAIDIMAS',
    howToPlay: 'KAIP ŽAISTI',
    rateAndShare: 'ĮVERTINK IR DALINKIS',
    multiplayer: 'DAUGIAŽAIDIS',
    comingSoon: 'Jau Greitai',
    language: 'KALBA',
    leaveReview: 'PALIKTI ATSILIEPIMĄ',
    supportShare: 'PALAIKYK IR DALINKIS',
  }
};

const Particle = ({ delay, colors, screenWidth, screenHeight }) => {
  const position = useRef(new Animated.ValueXY({
    x: Math.random() * screenWidth,
    y: screenHeight + 50
  })).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(position.y, {
            toValue: -50,
            duration: 8000 + Math.random() * 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 1000, delay: 6000, useNativeDriver: true }),
          ]),
        ]),
      ])
    );
    animation.start();

  return () => animation.stop();
  }, []);

  const particleColor = Math.random() > 0.5 ? colors.primary : colors.accent;
  return (
    <Animated.View
      style={[
        particleStyles.particle,
        { transform: position.getTranslateTransform(), opacity, backgroundColor: particleColor },
      ]}
    />
  );
};

const particleStyles = StyleSheet.create({
  particle: { position: 'absolute', width: 2, height: 2, borderRadius: 1 },
});

const AnimatedButton = ({ children, style, onPress, colors, isDarkMode, secondary }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, friction: 5 }).start();
    if (!secondary) Animated.timing(glowAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
    if (!secondary) Animated.timing(glowAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[style, { borderWidth: 2, borderColor: isDarkMode ? '#ffffff' : '#000000' }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {!secondary && isDarkMode && (
          <Animated.View style={[buttonStyles.buttonGlow, { opacity: glowAnim, shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20 }]} />
        )}
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const buttonStyles = StyleSheet.create({
  buttonGlow: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'transparent' },
});

export default function HomeScreen({ navigation, route }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const lang = route.params?.language || 'en';
  const t = translations[lang];

  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const flickerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    const flicker = () => {
      Animated.sequence([
        Animated.timing(flickerAnim, { toValue: 0.8, duration: 50, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
        Animated.delay(3000 + Math.random() * 2000),
      ]).start(flicker);
    };
    flicker();
  }, []);

  const handleRateAndShare = async () => {
    try {
      await Share.share({
        message: 'Check out Spy Room - the ultimate party game! 🕵️ Download it here: https://apps.apple.com/app/idYOUR_APP_ID',
        url: 'https://apps.apple.com/app/idYOUR_APP_ID',
      });
    } catch (e) {
      Linking.openURL('https://apps.apple.com/app/idYOUR_APP_ID');
    }
  };

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.85] });
  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.93, 1.07] });
  const styles = getStyles(colors, isDarkMode, glowOpacity, lang);

  const particles = Array.from({ length: 15 }, (_, i) => (
    <Particle key={i} delay={i * 500} colors={colors} screenWidth={width} screenHeight={height} />
  ));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={styles.particlesContainer}>{particles}</View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        <View style={styles.topBar}>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme} activeOpacity={0.7}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={22} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageButton} onPress={() => navigation.navigate('Settings', { language: lang })} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={22} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

          <Animated.View style={[styles.titleWrapper, { transform: [{ scale: pulseScale }] }]}>
            <Animated.View style={[styles.titleGlowBg, { opacity: glowOpacity }]} />
            <Animated.Text style={[styles.title, { opacity: flickerAnim }]}>{t.title}</Animated.Text>
          </Animated.View>

          <Text style={styles.tagline}>{t.tagline}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <AnimatedButton style={styles.mainButton} onPress={() => { navigation.navigate('CreateRoom', { language: lang }); }} colors={colors} isDarkMode={isDarkMode}>
            <View style={styles.btnSlot} />
            <Text style={styles.buttonText}>{t.newGame}</Text>
            <View style={styles.btnSlot}><Ionicons name="arrow-forward" size={20} color="#fff" /></View>
          </AnimatedButton>

          <AnimatedButton style={styles.secondaryButton} onPress={() => { navigation.navigate('HowToPlay', { language: lang }); }} colors={colors} isDarkMode={isDarkMode} secondary>
            <View style={styles.btnSlot}><Ionicons name="help-circle-outline" size={20} color={isDarkMode ? '#fff' : '#000'} /></View>
            <Text style={styles.secondaryButtonText}>{t.howToPlay}</Text>
            <View style={styles.btnSlot} />
          </AnimatedButton>

          <TouchableOpacity style={styles.multiplayerBtn} activeOpacity={0.7} disabled>
            <View style={styles.btnSlot}><Ionicons name="people-outline" size={20} color={isDarkMode ? '#888' : '#999'} /></View>
            <View style={styles.multiplayerTextGroup}>
              <Text style={styles.multiplayerTitle}>{t.multiplayer}</Text>
              <Text style={styles.multiplayerSub}>{t.comingSoon}</Text>
            </View>
            <View style={styles.btnSlot} />
          </TouchableOpacity>

          <AnimatedButton style={styles.secondaryButton} onPress={handleRateAndShare} colors={colors} isDarkMode={isDarkMode} secondary>
            <View style={styles.btnSlot}><Text style={styles.slotEmoji}>⭐</Text></View>
            <Text style={styles.secondaryButtonText}>{t.rateAndShare}</Text>
            <View style={styles.btnSlot}><Ionicons name="share-social-outline" size={20} color={isDarkMode ? '#fff' : '#000'} /></View>
          </AnimatedButton>



        </View>

        <Text style={styles.version}>v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode, glowOpacity, lang) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  particlesContainer: { position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
    paddingBottom: 40,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  themeToggle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : '#000',
  },
  languageButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : '#000',
  },
  flagText: { fontSize: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 20, marginTop: 40 },
  logo: { width: 210, height: 210, marginBottom: 15, backgroundColor: 'transparent' },

  titleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 320,
    paddingVertical: 14,
  },
  titleGlowBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: isDarkMode ? '#fff' : '#fff',
    letterSpacing: 6,
    textShadowColor: isDarkMode ? colors.primary : 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: isDarkMode ? 20 : 0,
    zIndex: 1,
  },
  tagline: {
    fontSize: lang === 'lt' ? 14 : 18,
    color: isDarkMode ? '#00ffff' : '#5b21b6',
    marginTop: 15,
    marginBottom: 50,
    fontWeight: '700',
    letterSpacing: lang === 'lt' ? 2 : 4,
    textTransform: 'uppercase',
    textShadowColor: isDarkMode ? '#00ffff' : 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: isDarkMode ? 10 : 0,
  },
  buttonContainer: { width: '100%', maxWidth: 320, gap: 12 },
  mainButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15, paddingHorizontal: 25,
    borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.4 : 0.2,
    shadowRadius: 15, elevation: 8,
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1, flex: 1, textAlign: 'center' },
  buttonIcon: { marginLeft: 12 },
  multiplayerBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 15, paddingHorizontal: 25,
    borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : '#000',
    opacity: 0.5,
  },
  multiplayerTextGroup: { flex: 1, alignItems: 'center' },
  multiplayerTitle: {
    color: isDarkMode ? '#fff' : '#000',
    fontSize: 14, fontWeight: '700', letterSpacing: 1,
  },
  multiplayerSub: {
    color: isDarkMode ? '#aaa' : '#777',
    fontSize: 11, fontWeight: '500', letterSpacing: 1,
    marginTop: 2,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    paddingVertical: 15, paddingHorizontal: 25,
    borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  secondaryButtonText: {
    color: isDarkMode ? '#fff' : '#000',
    fontSize: 14, fontWeight: '700', letterSpacing: 1,
    textAlign: 'center',
    flex: 1,
  },
  btnSlot: { width: 32, alignItems: 'center', justifyContent: 'center' },
  slotEmoji: { fontSize: 18 },
  version: {
    marginTop: 24,
    color: isDarkMode ? '#ffffff55' : '#00000055',
    fontSize: 12, letterSpacing: 2,
  },
});