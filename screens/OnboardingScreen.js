// screens/OnboardingScreen.js
import React, { useRef, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Dimensions, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const slides = {
  en: [
    {
      emoji: '🕵️',
      title: 'WELCOME TO\nSPY ROOM',
      text: 'One player is the Spy. Everyone else shares a secret word. Can you blend in... or sniff out the imposter?',
    },
    {
      emoji: '🎮',
      title: 'GATHER YOUR\nCREW',
      text: '3 to 12 players. Each round, one Spy is secretly chosen. Only they don\'t know the secret word.',
    },
    {
      emoji: '💬',
      title: 'CLUES &\nVOTING',
      text: 'Take turns giving clues about the word. Then vote on who you think is the Spy. Choose wisely — the Spy is listening.',
    },
    {
      emoji: '🏆',
      title: 'YOU\'RE\nREADY!',
      text: 'Agents win by catching the Spy. The Spy wins by fooling everyone. Good luck, Agent.',
    },
  ],
  lt: [
    {
      emoji: '🕵️',
      title: 'SVEIKI\nSPY ROOM',
      text: 'Vienas žaidėjas yra Šnipas. Visi kiti žino slaptą žodį. Ar sugebėsite apsimesti... arba pagauti šnipą?',
    },
    {
      emoji: '🎮',
      title: 'SURINKITE\nKOMANDĄ',
      text: '3–12 žaidėjų. Kiekvieną ratą slapta išrenkamas vienas Šnipas. Tik jis nežino slapto žodžio.',
    },
    {
      emoji: '💬',
      title: 'UŽUOMINOS\nIR BALSAVIMAS',
      text: 'Eikite ratu ir duokite užuominas apie žodį. Tada balsuokite, kas yra Šnipas. Rinkitės protingai.',
    },
    {
      emoji: '🏆',
      title: 'ESATE\nPASIRUOŠĘ!',
      text: 'Agentai laimi pagaudami Šnipą. Šnipas laimi apgavęs visus. Sėkmės, Agente.',
    },
  ],
};

export default function OnboardingScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const lang = route.params?.language || 'en';
  const data = slides[lang] || slides.en;

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const finish = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('Home');
  };

  const next = () => {
    if (activeIndex < data.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      finish();
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const isLast = activeIndex === data.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {!isDarkMode && (
        <LinearGradient
          colors={['#3EC9C1', '#1a7ac7']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}
      <StatusBar barStyle="light-content" backgroundColor={isDarkMode ? '#050505' : '#3EC9C1'} />

      {/* Skip button */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={finish} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: isDarkMode ? '#666' : '#1d3557' }]}>SKIP</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={[styles.slideTitle, { color: isDarkMode ? '#fff' : '#0A4A47' }]}>{item.title}</Text>
            <Text style={[styles.slideText, { color: isDarkMode ? '#ccc' : '#1d3557' }]}>{item.text}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {data.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity, backgroundColor: colors.primary }]}
            />
          );
        })}
      </View>

      {/* Next / Let's Play button */}
      <TouchableOpacity
        style={[styles.nextBtn, { backgroundColor: colors.primary, borderColor: isDarkMode ? '#fff' : '#000' }]}
        onPress={next}
        activeOpacity={0.85}
      >
        {isLast ? (
          <>
            <Ionicons name="game-controller-outline" size={22} color="#fff" />
            <Text style={styles.nextText}>{lang === 'lt' ? 'ŽAISTI!' : "LET'S PLAY!"}</Text>
          </>
        ) : (
          <>
            <Text style={styles.nextText}>{lang === 'lt' ? 'TOLIAU' : 'NEXT'}</Text>
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', alignItems: 'center' },
  skipBtn: { alignSelf: 'flex-end', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4 },
  skipText: { fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 24,
  },
  emoji: { fontSize: 90 },
  slideTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 38,
  },
  slideText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 27,
    fontWeight: '500',
  },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 28 },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 32,
    marginBottom: 24,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 2,
    width: width - 64,
  },
  nextText: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: 2 },
});
