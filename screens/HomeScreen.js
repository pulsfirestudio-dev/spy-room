// HomeScreen.js
import AppButton from "../components/AppButton";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Image, Animated, Easing, Dimensions,
  StatusBar, Linking, Share, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

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
  es: {
    title: 'SPY ROOM',
    tagline: 'Mentiras. Pistas. Caos.',
    newGame: 'NUEVO JUEGO',
    howToPlay: 'CÓMO JUGAR',
    rateAndShare: 'VALORAR Y COMPARTIR',
    multiplayer: 'MULTIJUGADOR',
    language: 'IDIOMA',
  },
  fr: {
    title: 'SPY ROOM',
    tagline: 'Mensonges. Indices. Chaos.',
    newGame: 'NOUVELLE PARTIE',
    howToPlay: 'COMMENT JOUER',
    rateAndShare: 'NOTER ET PARTAGER',
    multiplayer: 'MULTIJOUEUR',
    language: 'LANGUE',
  },
  de: {
    title: 'SPY ROOM',
    tagline: 'Lügen. Hinweise. Chaos.',
    newGame: 'NEUES SPIEL',
    howToPlay: 'WIE MAN SPIELT',
    rateAndShare: 'BEWERTEN & TEILEN',
    multiplayer: 'MEHRSPIELER',
    language: 'SPRACHE',
  },
  pl: {
    title: 'SPY ROOM',
    tagline: 'Kłamstwa. Wskazówki. Chaos.',
    newGame: 'NOWA GRA',
    howToPlay: 'JAK GRAĆ',
    rateAndShare: 'OCEŃ I UDOSTĘPNIJ',
    multiplayer: 'MULTIPLAYER',
    language: 'JĘZYK',
  },
  pt: {
    title: 'SPY ROOM',
    tagline: 'Mentiras. Pistas. Caos.',
    newGame: 'NOVO JOGO',
    howToPlay: 'COMO JOGAR',
    rateAndShare: 'AVALIAR E COMPARTILHAR',
    multiplayer: 'MULTIJOGADOR',
    language: 'IDIOMA',
  },
  it: {
    title: 'SPY ROOM',
    tagline: 'Bugie. Indizi. Caos.',
    newGame: 'NUOVA PARTITA',
    howToPlay: 'COME GIOCARE',
    rateAndShare: 'VALUTA E CONDIVIDI',
    multiplayer: 'MULTIPLAYER',
    language: 'LINGUA',
  },
  nl: {
    title: 'SPY ROOM',
    tagline: 'Leugens. Aanwijzingen. Chaos.',
    newGame: 'NIEUW SPEL',
    howToPlay: 'HOE TE SPELEN',
    rateAndShare: 'BEOORDELEN & DELEN',
    multiplayer: 'MEERSPELER',
    language: 'TAAL',
  },
  ro: {
    title: 'SPY ROOM',
    tagline: 'Minciuni. Indicii. Haos.',
    newGame: 'JOC NOU',
    howToPlay: 'CUM SE JOACĂ',
    rateAndShare: 'EVALUEAZĂ ȘI DISTRIBUIE',
    multiplayer: 'MULTIPLAYER',
    language: 'LIMBĂ',
  },
};

// ─── Particle ──────────────────────────────────────────────────────────────────
const PARTICLE_SIZES = [1.5, 2, 2.5, 3, 1];
const Particle = ({ delay, colors, screenWidth, screenHeight, index, isDarkMode }) => {
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

  const color = isDarkMode
    ? (index % 3 === 0 ? colors.primary : index % 3 === 1 ? (colors.accent || '#00ffff') : '#ffffff')
    : (index % 3 === 0 ? 'rgba(255,255,255,0.9)' : index % 3 === 1 ? 'rgba(200,240,255,0.75)' : 'rgba(255,255,255,0.55)');
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
        style={[style, { borderWidth: 2, borderColor: isDarkMode ? '#ffffff' : colors.text }]}
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

  // Title box pulse
  const titleBoxScale = useRef(new Animated.Value(1)).current;
  const titleBoxGlow = useRef(new Animated.Value(0)).current;

  // Scanlines
  const scanlineY = useRef(new Animated.Value(0)).current;

  // Typewriter
  const [taglineDisplay, setTaglineDisplay] = useState('');
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

    // Title box scale + glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(titleBoxScale, { toValue: 1.025, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(titleBoxGlow, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(titleBoxScale, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(titleBoxGlow, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ])
    ).start();

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
        Animated.timing(titleFade, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.spring(titleEnterScale, { toValue: 1, friction: 14, tension: 20, useNativeDriver: true }),
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
    <Particle key={i} index={i} delay={i * 380} colors={colors} isDarkMode={isDarkMode} screenWidth={width} screenHeight={height} />
  ));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? colors.background : '#3EC9C1'} />

      {/* Gradient background (light mode only) */}
      {!isDarkMode && (
        <LinearGradient
          colors={['#3EC9C1', '#1a7ac7']}
          style={styles.gradientBg}
          pointerEvents="none"
        />
      )}

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

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} scrollEnabled={false}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={toggleTheme} activeOpacity={0.7}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={22} color={isDarkMode ? '#fff' : colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn} onPress={() => navigation.navigate('Settings', { language: lang })} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={22} color={isDarkMode ? '#fff' : colors.text} />
          </TouchableOpacity>
        </View>

        {/* Logo + Title area (entrance animated) */}
        <Animated.View style={[styles.logoContainer, { opacity: logoFade, transform: [{ translateY: logoSlideY }] }]}>

          {/* Logo */}
          <Image source={require('../assets/logo3.png')} style={styles.logo} resizeMode="contain" />

          {/* Title — entrance scale wrapper */}
          <Animated.View style={{ transform: [{ scale: titleEnterScale }] }}>
              <Animated.View style={[styles.titleWrapper, {
                opacity: titleFade,
                transform: [{ scale: titleBoxScale }],
                shadowOpacity: titleBoxGlow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.75] }),
                shadowColor: isDarkMode ? colors.primary : '#1a7ac7',
                shadowRadius: 24, shadowOffset: { width: 0, height: 0 },
              }]}>
                {/* Glow background */}
                <Animated.View style={[styles.titleGlowBg, {
                  opacity: titleBoxGlow.interpolate({ inputRange: [0, 1], outputRange: [isDarkMode ? 0.4 : 0.3, isDarkMode ? 0.85 : 0.7] }),
                }]} />
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
          <Text style={styles.tagline}>{taglineDisplay}</Text>

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
            <View style={styles.btnSlot}><Ionicons name="help-circle-outline" size={20} color={isDarkMode ? '#fff' : '#000'} /></View>
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
  container: { flex: 1, backgroundColor: colors.background },
  gradientBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  particlesContainer: { position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' },
  scanlineContainer: {
    position: 'absolute', top: -SCAN_GAP, left: 0, right: 0,
    height: height + SCAN_GAP * 2,
    opacity: 0.055,
    pointerEvents: 'none',
  },
  scrollContent: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center',
    padding: 20, paddingTop: 60, paddingBottom: 20,
  },
  topBar: {
    position: 'absolute', top: 8, left: 20, right: 20,
    flexDirection: 'row', justifyContent: 'space-between', zIndex: 10,
  },
  topBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: isDarkMode ? colors.primary : colors.surface,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.text,
  },
  logoContainer: { alignItems: 'center', marginBottom: 8, marginTop: 0 },
  logo: { width: 360, height: 360, marginBottom: 4, opacity: 0.72 },
  titleWrapper: {
    position: 'relative', alignItems: 'center', justifyContent: 'center',
    width: 360, paddingVertical: 16, marginTop: -40,
  },
  titleGlowBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: isDarkMode ? colors.primary : '#1a7ac7', borderRadius: 16,
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
    marginTop: 10, marginBottom: 16,
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
  buttonContainer: { width: '100%', maxWidth: 320, gap: 8 },
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
    backgroundColor: isDarkMode ? colors.surface : 'rgba(255,255,255,0.45)',
    paddingVertical: 15, paddingHorizontal: 25,
    borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: isDarkMode ? colors.surface : 'rgba(255,255,255,0.45)',
    paddingVertical: 15, paddingHorizontal: 25,
    borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  secondaryButtonText: {
    color: isDarkMode ? '#fff' : '#0A4A47',
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
