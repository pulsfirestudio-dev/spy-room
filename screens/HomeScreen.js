// HomeScreen.js
import AppButton from "../components/AppButton";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Image, Animated, Easing, Dimensions,
  StatusBar, Linking, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');
const SCAN_GAP = 8; // px per scanline pair
const NUM_SCANLINES = Math.ceil(height / SCAN_GAP) + 2;

const translations = {
  en: {
    title: 'SPY ROOM',
    tagline: 'Lies. Clues. Chaos.',
    newGame: 'NEW GAME',
    howToPlay: 'HOW TO PLAY',
    rateAndShare: 'RATE & SHARE',
    multiplayer: 'MULTIPLAYER',
    language: 'LANGUAGE',
  },
  lt: {
    title: 'SPY ROOM',
    tagline: 'Melas. Užuominos. Chaosas.',
    newGame: 'NAUJAS ŽAIDIMAS',
    howToPlay: 'KAIP ŽAISTI',
    rateAndShare: 'ĮVERTINK IR DALINKIS',
    multiplayer: 'DAUGIAŽAIDIS',
    language: 'KALBA',
  },
};

// ─── Particle ──────────────────────────────────────────────────────────────────
const PARTICLE_SIZES = [1.5, 2, 2.5, 3, 1];
const Particle = ({ delay, colors, screenWidth, screenHeight, index }) => {
  const x = useRef(Math.random() * screenWidth).current;
  const size = useRef(PARTICLE_SIZES[index % PARTICLE_SIZES.length]).current;
  const posY = useRef(new Animated.Value(screenHeight + 50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = 7000 + Math.random() * 6000;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(posY, { toValue: -60, duration, easing: Easing.linear, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 800, delay: duration - 1800, useNativeDriver: true }),
          ]),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const color = index % 3 === 0 ? colors.primary : index % 3 === 1 ? (colors.accent || '#00ffff') : '#ffffff';
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ translateY: posY }],
        opacity,
      }}
    />
  );
};


// ─── Animated Button ───────────────────────────────────────────────────────────
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
          <Animated.View style={[bStyles.buttonGlow, { opacity: glowAnim, shadowColor: colors.primary }]} />
        )}
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const bStyles = StyleSheet.create({
  buttonGlow: {
    position: 'absolute', width: '100%', height: '100%',
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20,
  },
});

// ─── Static scanlines (rendered once) ─────────────────────────────────────────
const scanlineViews = Array.from({ length: NUM_SCANLINES }, (_, i) => (
  <View key={i} style={{ height: 1, marginBottom: SCAN_GAP - 1, backgroundColor: '#000' }} />
));

// ─── HomeScreen ────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation, route }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const lang = route.params?.language || 'en';
  const t = translations[lang];

  // Idle animations
  const glowAnim = useRef(new Animated.Value(0)).current;
  const flickerAnim = useRef(new Animated.Value(1)).current;

  // Entrance animations
  const logoSlideY = useRef(new Animated.Value(-90)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleEnterScale = useRef(new Animated.Value(0.7)).current;
  const buttonsY = useRef(new Animated.Value(50)).current;
  const buttonsFade = useRef(new Animated.Value(0)).current;

  // Glitch
  const glitchX = useRef(new Animated.Value(0)).current;
  const glitchOverlay = useRef(new Animated.Value(0)).current;

  // Logo glow
  const logoGlow = useRef(new Animated.Value(0)).current;

  // Scanlines
  const scanlineY = useRef(new Animated.Value(0)).current;

  // Typewriter
  const [taglineDisplay, setTaglineDisplay] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const typewriterDone = useRef(false);

  const startIdleAnimations = useCallback(() => {
    // Glow bg pulse
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();

    // Neon flicker
    const flicker = () => {
      Animated.sequence([
        Animated.timing(flickerAnim, { toValue: 0.75, duration: 40, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 1, duration: 40, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 0.9, duration: 30, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
        Animated.delay(2500 + Math.random() * 3500),
      ]).start(flicker);
    };
    flicker();

    // Glitch effect
    const triggerGlitch = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.sequence([
            Animated.timing(glitchX, { toValue: 6, duration: 50, useNativeDriver: true }),
            Animated.timing(glitchX, { toValue: -5, duration: 50, useNativeDriver: true }),
            Animated.timing(glitchX, { toValue: 3, duration: 40, useNativeDriver: true }),
            Animated.timing(glitchX, { toValue: -2, duration: 40, useNativeDriver: true }),
            Animated.timing(glitchX, { toValue: 1, duration: 30, useNativeDriver: true }),
            Animated.timing(glitchX, { toValue: 0, duration: 50, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(glitchOverlay, { toValue: 1, duration: 60, useNativeDriver: true }),
            Animated.timing(glitchOverlay, { toValue: 0, duration: 200, useNativeDriver: true }),
          ]),
        ]),
        Animated.delay(3500 + Math.random() * 5000),
      ]).start(triggerGlitch);
    };
    triggerGlitch();

    // Scanlines scroll
    Animated.loop(
      Animated.timing(scanlineY, {
        toValue: SCAN_GAP, duration: 120,
        easing: Easing.linear, useNativeDriver: true,
      })
    ).start();

    // Logo red glow breathe
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(logoGlow, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // Cursor blink (after typewriter)
    const blinkInterval = setInterval(() => {
      if (typewriterDone.current) setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    // Cinematic entrance sequence
    Animated.sequence([
      // 1. Logo drops in from top
      Animated.parallel([
        Animated.timing(logoSlideY, { toValue: 0, duration: 650, easing: Easing.out(Easing.back(1.3)), useNativeDriver: true }),
        Animated.timing(logoFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      // 2. Title scales + fades in
      Animated.parallel([
        Animated.timing(titleFade, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(titleEnterScale, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
      ]),
      // 3. Buttons slide up
      Animated.parallel([
        Animated.timing(buttonsY, { toValue: 0, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(buttonsFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start(() => {
      const cleanup = startIdleAnimations();
      return cleanup;
    });

    // Typewriter tagline — starts after logo entrance
    const tagline = t.tagline;
    let i = 0;
    const typeStart = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setTaglineDisplay(tagline.slice(0, i));
        if (i >= tagline.length) {
          clearInterval(iv);
          typewriterDone.current = true;
        }
      }, 55);
      return () => clearInterval(iv);
    }, 500);

    return () => clearTimeout(typeStart);
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

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.88] });
  const glitchRedX = glitchX.interpolate({ inputRange: [-10, 10], outputRange: [-14, 6] });
  const glitchCyanX = glitchX.interpolate({ inputRange: [-10, 10], outputRange: [6, -14] });

  const styles = getStyles(colors, isDarkMode, lang);
  const particles = Array.from({ length: 22 }, (_, i) => (
    <Particle key={i} index={i} delay={i * 380} colors={colors} screenWidth={width} screenHeight={height} />
  ));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Particles */}
      <View style={styles.particlesContainer} pointerEvents="none">{particles}</View>

      {/* Scanline overlay */}
      {isDarkMode && (
        <Animated.View
          pointerEvents="none"
          style={[styles.scanlineContainer, { transform: [{ translateY: scanlineY }] }]}
        >
          {scanlineViews}
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={toggleTheme} activeOpacity={0.7}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={22} color={isDarkMode ? '#fff' : colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn} onPress={() => navigation.navigate('Settings', { language: lang })} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={22} color={isDarkMode ? '#fff' : colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Logo + Title area (entrance animated) */}
        <Animated.View style={[styles.logoContainer, { opacity: logoFade, transform: [{ translateY: logoSlideY }] }]}>

          {/* Logo with glow */}
          <View style={styles.logoWrapper}>
            <Animated.View style={[styles.logoGlowBehind, {
              opacity: logoGlow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.75] }),
              transform: [{ scale: logoGlow.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.05] }) }],
            }]} />
            <Image source={require('../assets/Logo2.png')} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Title — entrance scale wrapper */}
          <Animated.View style={{ transform: [{ scale: titleEnterScale }] }}>
              <Animated.View style={[styles.titleWrapper, { opacity: titleFade }]}>
                {/* Glow background */}
                <Animated.View style={[styles.titleGlowBg, { opacity: glowOpacity }]} />
                {/* Red glitch ghost */}
                <Animated.Text style={[styles.title, styles.titleGlitchRed, {
                  opacity: Animated.multiply(glitchOverlay, new Animated.Value(0.65)),
                  transform: [{ translateX: glitchRedX }],
                }]}>
                  {t.title}
                </Animated.Text>
                {/* Cyan glitch ghost */}
                <Animated.Text style={[styles.title, styles.titleGlitchCyan, {
                  opacity: Animated.multiply(glitchOverlay, new Animated.Value(0.5)),
                  transform: [{ translateX: glitchCyanX }],
                }]}>
                  {t.title}
                </Animated.Text>
                {/* Main title */}
                <Animated.Text style={[styles.title, {
                  opacity: flickerAnim,
                  transform: [{ translateX: glitchX }],
                }]}>
                  {t.title}
                </Animated.Text>
              </Animated.View>
          </Animated.View>

          {/* Typewriter tagline */}
          <Text style={styles.tagline}>
            {taglineDisplay}
            <Text style={[styles.cursor, { opacity: cursorVisible ? 1 : 0 }]}>|</Text>
          </Text>

        </Animated.View>

        {/* Buttons (entrance animated) */}
        <Animated.View style={[styles.buttonContainer, { opacity: buttonsFade, transform: [{ translateY: buttonsY }] }]}>

          <AnimatedButton
            style={styles.mainButton}
            onPress={() => navigation.navigate('CreateRoom', { language: lang })}
            colors={colors}
            isDarkMode={isDarkMode}
          >
            <Text style={styles.buttonText}>{t.newGame}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 12 }} />
          </AnimatedButton>

          <AnimatedButton
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('HowToPlay', { language: lang })}
            colors={colors}
            isDarkMode={isDarkMode}
            secondary
          >
            <View style={styles.btnSlot}><Ionicons name="help-circle-outline" size={20} color={isDarkMode ? '#fff' : '#000'} /></View>
            <Text style={styles.secondaryButtonText}>{t.howToPlay}</Text>
            <View style={styles.btnSlot} />
          </AnimatedButton>

          <AnimatedButton
            style={styles.multiplayerBtn}
            onPress={() => navigation.navigate('MultiplayerMenu', { language: lang })}
            colors={colors}
            isDarkMode={isDarkMode}
            secondary
          >
            <View style={styles.btnSlot}><Ionicons name="people-outline" size={20} color={isDarkMode ? '#fff' : '#000'} /></View>
            <Text style={styles.secondaryButtonText}>{t.multiplayer}</Text>
            <View style={styles.btnSlot}><Ionicons name="wifi" size={17} color={isDarkMode ? '#fff' : '#000'} /></View>
          </AnimatedButton>

          <AnimatedButton
            style={styles.secondaryButton}
            onPress={handleRateAndShare}
            colors={colors}
            isDarkMode={isDarkMode}
            secondary
          >
            <View style={styles.btnSlot}><Ionicons name="star-outline" size={20} color={isDarkMode ? '#fff' : '#000'} /></View>
            <Text style={styles.secondaryButtonText}>{t.rateAndShare}</Text>
            <View style={styles.btnSlot}><Ionicons name="share-social-outline" size={20} color={isDarkMode ? '#fff' : '#000'} /></View>
          </AnimatedButton>

        </Animated.View>

        <Text style={styles.version}>v2.1.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode, lang) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDarkMode ? colors.background : '#87CEEB' },
  particlesContainer: { position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' },
  scanlineContainer: {
    position: 'absolute', top: -SCAN_GAP, left: 0, right: 0,
    height: height + SCAN_GAP * 2,
    opacity: 0.055,
    pointerEvents: 'none',
  },
  scrollContent: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center',
    padding: 20, paddingTop: 100, paddingBottom: 40,
  },
  topBar: {
    position: 'absolute', top: 50, left: 20, right: 20,
    flexDirection: 'row', justifyContent: 'space-between', zIndex: 10,
  },
  topBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: isDarkMode ? colors.primary : '#000',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.primary,
  },
  logoContainer: { alignItems: 'center', marginBottom: 16, marginTop: 30 },
  logoWrapper: {
    width: 200, height: 200,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: isDarkMode ? '#333' : '#222',
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: isDarkMode ? 0 : 0.35,
    shadowRadius: 20,
    elevation: isDarkMode ? 0 : 8,
  },
  logo: { width: 200, height: 200 },
  logoGlowBehind: {
    position: 'absolute',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#ff1a1a',
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  titleWrapper: {
    position: 'relative', alignItems: 'center', justifyContent: 'center',
    width: 360, paddingVertical: 16,
  },
  titleGlowBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.primary, borderRadius: 16,
  },
  title: {
    fontSize: 48, fontWeight: '900', color: '#fff', letterSpacing: 6,
    textShadowColor: isDarkMode ? colors.primary : 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: isDarkMode ? 22 : 0,
    zIndex: 1,
  },
  titleGlitchRed: {
    position: 'absolute', color: '#ff3333',
    textShadowColor: 'transparent', zIndex: 0,
  },
  titleGlitchCyan: {
    position: 'absolute', color: '#00ffff',
    textShadowColor: 'transparent', zIndex: 0,
  },
  tagline: {
    fontSize: lang === 'lt' ? 13 : 17,
    color: isDarkMode ? '#00ffff' : '#5b21b6',
    marginTop: 14, marginBottom: 44,
    fontWeight: '700',
    letterSpacing: lang === 'lt' ? 2 : 4,
    textTransform: 'uppercase',
    textShadowColor: isDarkMode ? '#00ffff' : 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: isDarkMode ? 10 : 0,
    minHeight: 28,
  },
  cursor: {
    color: isDarkMode ? '#00ffff' : '#5b21b6',
    fontWeight: '300',
  },
  buttonContainer: { width: '100%', maxWidth: 320, gap: 12 },
  mainButton: {
    backgroundColor: colors.primary,
    paddingVertical: 20, paddingHorizontal: 30,
    borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.5 : 0.2,
    shadowRadius: 18, elevation: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 3 },
  multiplayerBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 15, paddingHorizontal: 25,
    borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
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
    textAlign: 'center', flex: 1,
  },
  btnSlot: { width: 32, alignItems: 'center', justifyContent: 'center' },
  version: {
    marginTop: 24,
    color: isDarkMode ? '#ffffff44' : '#00000044',
    fontSize: 12, letterSpacing: 2,
  },
});
