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
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'WELCOME TO\nSPY ROOM',
      text: 'One player is the Spy. Everyone else shares a secret word. Can you blend in... or sniff out the imposter?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'GATHER YOUR\nCREW',
      text: '3 to 12 players. Each round, one Spy is secretly chosen. Only they don\'t know the secret word.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'CLUES &\nVOTING',
      text: 'Take turns giving clues about the word. Then vote on who you think is the Spy. Choose wisely — the Spy is listening.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'YOU\'RE\nREADY!',
      text: 'Agents win by catching the Spy. The Spy wins by fooling everyone. Good luck, Agent.',
    },
  ],
  lt: [
    {
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'SVEIKI\nSPY ROOM',
      text: 'Vienas žaidėjas yra Šnipas. Visi kiti žino slaptą žodį. Ar sugebėsite apsimesti... arba pagauti šnipą?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'SURINKITE\nKOMANDĄ',
      text: '3–12 žaidėjų. Kiekvieną ratą slapta išrenkamas vienas Šnipas. Tik jis nežino slapto žodžio.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'UŽUOMINOS\nIR BALSAVIMAS',
      text: 'Eikite ratu ir duokite užuominas apie žodį. Tada balsuokite, kas yra Šnipas. Rinkitės protingai.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'ESATE\nPASIRUOŠĘ!',
      text: 'Agentai laimi pagaudami Šnipą. Šnipas laimi apgavęs visus. Sėkmės, Agente.',
    },
  ],
  es: [
    {
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'BIENVENIDO A\nSPY ROOM',
      text: 'Un jugador es el Espía. Todos los demás comparten una palabra secreta. ¿Puedes pasar desapercibido... o descubrir al impostor?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'REÚNE\nTU EQUIPO',
      text: 'De 3 a 12 jugadores. Cada ronda, un Espía es elegido en secreto. Solo ellos no conocen la palabra secreta.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'PISTAS\nY VOTACIÓN',
      text: 'Por turnos, da pistas sobre la palabra. Luego vota a quien creas que es el Espía. Elige bien — el Espía está escuchando.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: '¡ESTÁS\nLISTO!',
      text: 'Los Agentes ganan atrapando al Espía. El Espía gana engañando a todos. Buena suerte, Agente.',
    },
  ],
  fr: [
    {
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'BIENVENUE\nDANS SPY ROOM',
      text: 'Un joueur est l\'Espion. Tous les autres partagent un mot secret. Peux-tu te fondre dans la masse... ou débusquer l\'imposteur?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'RÉUNIS\nTON ÉQUIPE',
      text: 'De 3 à 12 joueurs. Chaque round, un Espion est secrètement choisi. Seul lui ne connaît pas le mot secret.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'INDICES\nET VOTE',
      text: 'À tour de rôle, donnez des indices sur le mot. Puis votez pour celui que vous pensez être l\'Espion. Choisissez bien — l\'Espion écoute.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'VOUS ÊTES\nPRÊTS!',
      text: 'Les Agents gagnent en attrapant l\'Espion. L\'Espion gagne en trompant tout le monde. Bonne chance, Agent.',
    },
  ],
  de: [
    {
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'WILLKOMMEN\nBEI SPY ROOM',
      text: 'Ein Spieler ist der Spion. Alle anderen teilen ein geheimes Wort. Kannst du dich einfügen... oder den Eindringling aufspüren?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'VERSAMMLE\nDEIN TEAM',
      text: '3 bis 12 Spieler. Jede Runde wird heimlich ein Spion gewählt. Nur er kennt das geheime Wort nicht.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'HINWEISE\nUND ABSTIMMUNG',
      text: 'Gebt reihum Hinweise zum Wort. Stimmt dann ab, wer ihr Meinung nach der Spion ist. Wählt weise — der Spion hört zu.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'IHR SEID\nBEREIT!',
      text: 'Agenten gewinnen, indem sie den Spion fangen. Der Spion gewinnt, indem er alle täuscht. Viel Glück, Agent.',
    },
  ],
  pl: [
    {
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'WITAJ W\nSPY ROOM',
      text: 'Jeden gracz jest Szpiegiem. Wszyscy inni znają tajne słowo. Czy potrafisz się wtopić... albo zdemaskować intruza?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'ZBIERZ\nSWOJĄ EKIPĘ',
      text: 'Od 3 do 12 graczy. W każdej rundzie w tajemnicy wybierany jest Szpieg. Tylko on nie zna tajnego słowa.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'WSKAZÓWKI\nI GŁOSOWANIE',
      text: 'Na zmianę dawajcie wskazówki dotyczące słowa. Następnie głosujcie, kto Waszym zdaniem jest Szpiegiem. Wybierajcie mądrze.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'JESTEŚCIE\nGOTOWI!',
      text: 'Agenci wygrywają łapiąc Szpiega. Szpieg wygrywa oszukując wszystkich. Powodzenia, Agencie.',
    },
  ],
  pt: [
    {
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'BEM-VINDO AO\nSPY ROOM',
      text: 'Um jogador é o Espião. Todos os outros compartilham uma palavra secreta. Você consegue se misturar... ou farejar o impostor?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'REÚNA\nSEU GRUPO',
      text: 'De 3 a 12 jogadores. Cada rodada, um Espião é escolhido secretamente. Somente ele não conhece a palavra secreta.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'PISTAS\nE VOTAÇÃO',
      text: 'Revezem dando pistas sobre a palavra. Depois votem em quem acham que é o Espião. Escolha com sabedoria — o Espião está ouvindo.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'VOCÊ ESTÁ\nPRONTO!',
      text: 'Os Agentes vencem pegando o Espião. O Espião vence enganando todos. Boa sorte, Agente.',
    },
  ],
  it: [
    {
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'BENVENUTO\nIN SPY ROOM',
      text: 'Un giocatore è la Spia. Tutti gli altri condividono una parola segreta. Riesci a mimetizzarti... o a scovare l\'impostore?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'RIUNISCI\nLA TUA SQUADRA',
      text: 'Da 3 a 12 giocatori. Ogni round, una Spia viene scelta segretamente. Solo lei non conosce la parola segreta.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'INDIZI\nE VOTAZIONE',
      text: 'A turno date indizi sulla parola. Poi votate chi pensate sia la Spia. Scegliete con saggezza — la Spia sta ascoltando.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'SIETE\nPRONTI!',
      text: 'Gli Agenti vincono catturando la Spia. La Spia vince ingannando tutti. Buona fortuna, Agente.',
    },
  ],
  nl: [
    {
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'WELKOM BIJ\nSPY ROOM',
      text: 'Eén speler is de Spion. Iedereen else deelt een geheim woord. Kun jij opgaan in de groep... of de indringer ontmaskeren?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'VERZAMEL\nJE TEAM',
      text: '3 tot 12 spelers. Elke ronde wordt in het geheim een Spion gekozen. Alleen hij kent het geheime woord niet.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'AANWIJZINGEN\nEN STEMMING',
      text: 'Geef om de beurt aanwijzingen over het woord. Stem dan op wie jij denkt dat de Spion is. Kies verstandig — de Spion luistert.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'JULLIE\nZIJN KLAAR!',
      text: 'Agenten winnen door de Spion te vangen. De Spion wint door iedereen te bedriegen. Succes, Agent.',
    },
  ],
  ro: [
    {
      icon: 'eye',
      iconBg: ['#c0392b', '#e74c3c'],
      title: 'BINE AI VENIT\nLA SPY ROOM',
      text: 'Un jucător este Spionul. Toți ceilalți împărtășesc un cuvânt secret. Poți să te integrezi... sau să descoperi impostorul?',
    },
    {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'ADUNĂ-ȚI\nECHIPA',
      text: 'De la 3 la 12 jucători. În fiecare rundă, un Spion este ales în secret. Numai el nu cunoaște cuvântul secret.',
    },
    {
      icon: 'chatbubbles',
      iconBg: ['#6a1b9a', '#9c27b0'],
      title: 'INDICII\nȘI VOT',
      text: 'Pe rând, dați indicii despre cuvânt. Apoi votați cine credeți că este Spionul. Alegeți cu înțelepciune — Spionul ascultă.',
    },
    {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'SUNTEȚI\nGATA!',
      text: 'Agenții câștigă prinzând Spionul. Spionul câștigă păcălind pe toată lumea. Mult succes, Agent.',
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
            <LinearGradient
              colors={item.iconBg}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <Ionicons name={item.icon} size={64} color="#fff" />
            </LinearGradient>
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
            <Text style={styles.nextText}>{{ lt: 'ŽAISTI!', es: '¡JUGAR!', fr: 'JOUER!', de: 'LOS GEHT\'S!', pl: 'GRAMY!', pt: 'JOGAR!', it: 'GIOCARE!', nl: 'SPELEN!', ro: 'JOC!' }[lang] || "LET'S PLAY!"}</Text>
          </>
        ) : (
          <>
            <Text style={styles.nextText}>{{ lt: 'TOLIAU', es: 'SIGUIENTE', fr: 'SUIVANT', de: 'WEITER', pl: 'DALEJ', pt: 'PRÓXIMO', it: 'AVANTI', nl: 'VOLGENDE', ro: 'URMĂTOR' }[lang] || 'NEXT'}</Text>
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
    gap: 32,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
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
