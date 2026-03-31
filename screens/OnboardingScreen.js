// screens/OnboardingScreen.js
import { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { usePremium } from '../context/PremiumContext';

const { width } = Dimensions.get('window');

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
];

const slangData = {
  en: {
    catName: 'Irish Slang',
    headline: 'New Category Available!',
    sub: 'Unlock Irish Slang with Premium and test your lingo!',
    examples: ['Grand', 'Craic', 'Deadly'],
    premium: 'Go Premium',
  },
  lt: {
    catName: 'Lietuviškas Slangas',
    headline: 'Nauja Kategorija!',
    sub: 'Atrakink Lietuvišką Slangą su Premium ir išbandyk!',
    examples: ['Bičas', 'Šaunu', 'Kaifas'],
    premium: 'Gauti Premium',
  },
  es: {
    catName: 'Argot Español',
    headline: '¡Nueva Categoría!',
    sub: '¡Desbloquea el Argot Español con Premium!',
    examples: ['Guay', 'Tío', 'Mola'],
    premium: 'Ir a Premium',
  },
  fr: {
    catName: 'Argot Français',
    headline: 'Nouvelle Catégorie !',
    sub: "Débloque l'Argot Français avec Premium !",
    examples: ['Kiffer', 'Ouf', 'Chelou'],
    premium: 'Passer Premium',
  },
  de: {
    catName: 'Deutscher Slang',
    headline: 'Neue Kategorie!',
    sub: 'Schalte den Deutschen Slang mit Premium frei!',
    examples: ['Geil', 'Alter', 'Krass'],
    premium: 'Jetzt Premium',
  },
  pl: {
    catName: 'Polski Slang',
    headline: 'Nowa Kategoria!',
    sub: 'Odblokuj Polski Slang z Premium!',
    examples: ['Spoko', 'Ziomek', 'Ogień'],
    premium: 'Zdobądź Premium',
  },
  pt: {
    catName: 'Gíria Brasileira',
    headline: 'Nova Categoria!',
    sub: 'Desbloqueie a Gíria Brasileira com Premium!',
    examples: ['Cara', 'Mano', 'Legal'],
    premium: 'Ir para Premium',
  },
  it: {
    catName: 'Slang Italiano',
    headline: 'Nuova Categoria!',
    sub: 'Sblocca lo Slang Italiano con Premium!',
    examples: ['Figo', 'Ganzo', 'Sballo'],
    premium: 'Vai a Premium',
  },
  nl: {
    catName: 'Nederlandse Slang',
    headline: 'Nieuwe Categorie!',
    sub: 'Ontgrendel de Nederlandse Slang met Premium!',
    examples: ['Vet', 'Lekker', 'Sick'],
    premium: 'Ga naar Premium',
  },
  ro: {
    catName: 'Argou Românesc',
    headline: 'Categorie Nouă!',
    sub: 'Deblochează Argoul Românesc cu Premium!',
    examples: ['Mișto', 'Tare', 'Marfă'],
    premium: 'Mergi la Premium',
  },
};

const gameSlides = {
  en: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'GATHER YOUR\nTEAM',
      text: '3 to 12 players. Each round, one Spy is secretly chosen. Only they don\'t know the secret word — everyone else does.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'HOW TO\nPLAY',
      text: 'Take turns giving clues about the word. Vote on who you think is the Spy. Agents win by catching the Spy. The Spy wins by fooling everyone. Good luck, Agent.',
    },
    welcome: 'WELCOME TO\nSPY ROOM',
    welcomeSub: 'One player is the Spy. Everyone else shares a secret word. Can you blend in... or sniff out the imposter?',
    pickLang: 'PICK YOUR LANGUAGE',
    next: 'NEXT',
    play_btn: "LET'S PLAY!",
    skip: 'SKIP',
  },
  lt: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'SURINKITE\nKOMANDĄ',
      text: '3–12 žaidėjų. Kiekvieną ratą slapta išrenkamas vienas Šnipas. Tik jis nežino slapto žodžio — visi kiti žino.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'KAIP\nŽAISTI',
      text: 'Eikite ratu ir duokite užuominas apie žodį. Balsuokite, kas yra Šnipas. Agentai laimi pagaudami Šnipą. Šnipas laimi apgavęs visus. Sėkmės, Agente.',
    },
    welcome: 'SVEIKI\nSPY ROOM',
    welcomeSub: 'Vienas žaidėjas yra Šnipas. Visi kiti žino slaptą žodį. Ar sugebėsite apsimesti... arba pagauti šnipą?',
    pickLang: 'PASIRINKITE KALBĄ',
    next: 'TOLIAU',
    play_btn: 'ŽAISTI!',
    skip: 'PRALEISTI',
  },
  es: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'REÚNE\nTU EQUIPO',
      text: 'De 3 a 12 jugadores. Cada ronda, un Espía es elegido en secreto. Solo ellos no conocen la palabra secreta — todos los demás sí.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'CÓMO\nJUGAR',
      text: 'Por turnos, da pistas sobre la palabra. Vota a quien creas que es el Espía. Los Agentes ganan atrapando al Espía. El Espía gana engañando a todos. Buena suerte, Agente.',
    },
    welcome: 'BIENVENIDO A\nSPY ROOM',
    welcomeSub: 'Un jugador es el Espía. Todos los demás comparten una palabra secreta. ¿Puedes pasar desapercibido... o descubrir al impostor?',
    pickLang: 'ELIGE TU IDIOMA',
    next: 'SIGUIENTE',
    play_btn: '¡JUGAR!',
    skip: 'OMITIR',
  },
  fr: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'RÉUNIS\nTON ÉQUIPE',
      text: 'De 3 à 12 joueurs. Chaque round, un Espion est secrètement choisi. Seul lui ne connaît pas le mot secret — tous les autres oui.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'COMMENT\nJOUER',
      text: 'À tour de rôle, donnez des indices sur le mot. Votez pour celui que vous pensez être l\'Espion. Les Agents gagnent en attrapant l\'Espion. L\'Espion gagne en trompant tout le monde. Bonne chance, Agent.',
    },
    welcome: 'BIENVENUE\nDANS SPY ROOM',
    welcomeSub: 'Un joueur est l\'Espion. Tous les autres partagent un mot secret. Peux-tu te fondre dans la masse... ou débusquer l\'imposteur?',
    pickLang: 'CHOISIR LA LANGUE',
    next: 'SUIVANT',
    play_btn: 'JOUER!',
    skip: 'PASSER',
  },
  de: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'VERSAMMLE\nDEIN TEAM',
      text: '3 bis 12 Spieler. Jede Runde wird heimlich ein Spion gewählt. Nur er kennt das geheime Wort nicht — alle anderen schon.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'WIE MAN\nSPIELT',
      text: 'Gebt reihum Hinweise zum Wort. Stimmt ab, wer der Spion ist. Agenten gewinnen, indem sie den Spion fangen. Der Spion gewinnt, indem er alle täuscht. Viel Glück, Agent.',
    },
    welcome: 'WILLKOMMEN\nBEI SPY ROOM',
    welcomeSub: 'Ein Spieler ist der Spion. Alle anderen teilen ein geheimes Wort. Kannst du dich einfügen... oder den Eindringling aufspüren?',
    pickLang: 'SPRACHE WÄHLEN',
    next: 'WEITER',
    play_btn: 'LOS GEHT\'S!',
    skip: 'ÜBERSPRINGEN',
  },
  pl: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'ZBIERZ\nSWOJĄ EKIPĘ',
      text: 'Od 3 do 12 graczy. W każdej rundzie w tajemnicy wybierany jest Szpieg. Tylko on nie zna tajnego słowa — wszyscy inni znają.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'JAK\nGRAĆ',
      text: 'Na zmianę dawajcie wskazówki dotyczące słowa. Głosujcie, kto jest Szpiegiem. Agenci wygrywają łapiąc Szpiega. Szpieg wygrywa oszukując wszystkich. Powodzenia, Agencie.',
    },
    welcome: 'WITAJ W\nSPY ROOM',
    welcomeSub: 'Jeden gracz jest Szpiegiem. Wszyscy inni znają tajne słowo. Czy potrafisz się wtopić... albo zdemaskować intruza?',
    pickLang: 'WYBIERZ JĘZYK',
    next: 'DALEJ',
    play_btn: 'GRAMY!',
    skip: 'POMIŃ',
  },
  pt: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'REÚNA\nSEU GRUPO',
      text: 'De 3 a 12 jogadores. Cada rodada, um Espião é escolhido secretamente. Somente ele não conhece a palavra secreta — todos os outros conhecem.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'COMO\nJOGAR',
      text: 'Revezem dando pistas sobre a palavra. Votem em quem acham que é o Espião. Os Agentes vencem pegando o Espião. O Espião vence enganando todos. Boa sorte, Agente.',
    },
    welcome: 'BEM-VINDO AO\nSPY ROOM',
    welcomeSub: 'Um jogador é o Espião. Todos os outros compartilham uma palavra secreta. Você consegue se misturar... ou farejar o impostor?',
    pickLang: 'ESCOLHA O IDIOMA',
    next: 'PRÓXIMO',
    play_btn: 'JOGAR!',
    skip: 'PULAR',
  },
  it: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'RIUNISCI\nLA TUA SQUADRA',
      text: 'Da 3 a 12 giocatori. Ogni round, una Spia viene scelta segretamente. Solo lei non conosce la parola segreta — tutti gli altri sì.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'COME\nGIOCARE',
      text: 'A turno date indizi sulla parola. Votate chi pensate sia la Spia. Gli Agenti vincono catturando la Spia. La Spia vince ingannando tutti. Buona fortuna, Agente.',
    },
    welcome: 'BENVENUTO\nIN SPY ROOM',
    welcomeSub: 'Un giocatore è la Spia. Tutti gli altri condividono una parola segreta. Riesci a mimetizzarti... o a scovare l\'impostore?',
    pickLang: 'SCEGLI LA LINGUA',
    next: 'AVANTI',
    play_btn: 'GIOCARE!',
    skip: 'SALTA',
  },
  nl: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'VERZAMEL\nJE TEAM',
      text: '3 tot 12 spelers. Elke ronde wordt in het geheim een Spion gekozen. Alleen hij kent het geheime woord niet — alle anderen wel.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'HOE TE\nSPELEN',
      text: 'Geef om de beurt aanwijzingen over het woord. Stem op wie jij denkt dat de Spion is. Agenten winnen door de Spion te vangen. De Spion wint door iedereen te bedriegen. Succes, Agent.',
    },
    welcome: 'WELKOM BIJ\nSPY ROOM',
    welcomeSub: 'Eén speler is de Spion. Iedereen else deelt een geheim woord. Kun jij opgaan in de groep... of de indringer ontmaskeren?',
    pickLang: 'KIES JE TAAL',
    next: 'VOLGENDE',
    play_btn: 'SPELEN!',
    skip: 'OVERSLAAN',
  },
  ro: {
    intro: {
      icon: 'people',
      iconBg: ['#1a6b8a', '#2196a8'],
      title: 'ADUNĂ-ȚI\nECHIPA',
      text: 'De la 3 la 12 jucători. În fiecare rundă, un Spion este ales în secret. Numai el nu cunoaște cuvântul secret — toți ceilalți îl cunosc.',
    },
    play: {
      icon: 'game-controller',
      iconBg: ['#e65100', '#f57c00'],
      title: 'CUM SĂ\nJOCI',
      text: 'Pe rând, dați indicii despre cuvânt. Votați cine credeți că este Spionul. Agenții câștigă prinzând Spionul. Spionul câștigă păcălind pe toată lumea. Mult succes, Agent.',
    },
    welcome: 'BINE AI VENIT\nLA SPY ROOM',
    welcomeSub: 'Un jucător este Spionul. Toți ceilalți împărtășesc un cuvânt secret. Poți să te integrezi... sau să descoperi impostorul?',
    pickLang: 'ALEGE LIMBA',
    next: 'URMĂTOR',
    play_btn: 'JOC!',
    skip: 'SARI',
  },
};

const SLIDE_TYPES = ['welcome', 'slang', 'intro', 'play'];

export default function OnboardingScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { purchasePremium } = usePremium();

  const [selectedLang, setSelectedLang] = useState('en');
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const t = gameSlides[selectedLang] || gameSlides.en;
  const slang = slangData[selectedLang] || slangData.en;

  const isLast = activeIndex === SLIDE_TYPES.length - 1;

  const finish = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('Home', { language: selectedLang });
  };

  const next = () => {
    if (activeIndex < SLIDE_TYPES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      finish();
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
  }).current;

  const renderWelcomeSlide = () => (
    <View style={[styles.slide, { width }]}>
      <LinearGradient
        colors={['#c0392b', '#e74c3c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconCircle}
      >
        <Ionicons name="eye" size={44} color="#fff" />
      </LinearGradient>

      <Text style={[styles.slideTitle, { color: isDarkMode ? '#fff' : '#0A4A47' }]}>{t.welcome}</Text>
      <Text style={[styles.slideText, { color: isDarkMode ? '#ccc' : '#1d3557' }]}>{t.welcomeSub}</Text>

      <Text style={[styles.pickLangLabel, { color: isDarkMode ? '#aaa' : '#1d3557' }]}>{t.pickLang}</Text>

      <View style={styles.langGrid}>
        {languages.map((lang) => {
          const isSelected = selectedLang === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langBtn,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : isDarkMode ? '#1e1e1e' : '#fff',
                  borderColor: isSelected ? colors.primary : isDarkMode ? '#444' : '#ccc',
                },
              ]}
              onPress={() => setSelectedLang(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text
                style={[
                  styles.langName,
                  { color: isSelected ? '#fff' : isDarkMode ? '#ddd' : '#1d3557' },
                ]}
                numberOfLines={1}
              >
                {lang.name}
              </Text>
              {isSelected && <Ionicons name="checkmark-circle" size={16} color="#fff" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderSlangSlide = () => (
    <View style={[styles.slide, { width }]}>
      <LinearGradient
        colors={isDarkMode ? ['#ff3333', '#cc1111'] : ['#1d3557', '#1a7ac7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconCircle}
      >
        <Ionicons name="sparkles" size={44} color="#fff" />
      </LinearGradient>

      <Text style={[styles.slideTitle, { color: isDarkMode ? '#fff' : '#0A4A47', fontSize: 22 }]}>
        {slang.headline}
      </Text>
      <Text style={[styles.slangCatName, { color: isDarkMode ? '#ff6666' : '#e63946' }]}>
        {slang.catName}
      </Text>
      <Text style={[styles.slideText, { color: isDarkMode ? '#ccc' : '#1d3557' }]}>{slang.sub}</Text>

      <View style={[styles.examplesBox, {
        backgroundColor: isDarkMode ? '#1e1e1e' : '#f0f4f8',
        borderColor: isDarkMode ? '#444' : '#ddd',
      }]}>
        <Text style={[styles.previewLabel, { color: isDarkMode ? '#ff6666' : '#e63946' }]}>PREVIEW</Text>
        {slang.examples.map((word, i) => (
          <Text key={i} style={[styles.exampleWord, { color: isDarkMode ? '#fff' : '#1d3557' }]}>
            {word}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.premiumBtnWrap}
        onPress={purchasePremium}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={isDarkMode ? ['#ff3333', '#cc1111'] : ['#1d3557', '#1a7ac7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.premiumBtnGradient}
        >
          <Ionicons name="star" size={16} color="#fff" />
          <Text style={styles.premiumBtnText}>{slang.premium}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderGameSlide = (slideData) => (
    <View style={[styles.slide, { width }]}>
      <LinearGradient
        colors={slideData.iconBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconCircle}
      >
        <Ionicons name={slideData.icon} size={44} color="#fff" />
      </LinearGradient>
      <Text style={[styles.slideTitle, { color: isDarkMode ? '#fff' : '#0A4A47' }]}>{slideData.title}</Text>
      <Text style={[styles.slideText, { color: isDarkMode ? '#ccc' : '#1d3557' }]}>{slideData.text}</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    if (item === 'welcome') return renderWelcomeSlide();
    if (item === 'slang') return renderSlangSlide();
    if (item === 'intro') return renderGameSlide(t.intro);
    if (item === 'play') return renderGameSlide(t.play);
    return null;
  };

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

      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={finish} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: isDarkMode ? '#666' : '#1d3557' }]}>{t.skip}</Text>
        </TouchableOpacity>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDE_TYPES}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={renderItem}
        extraData={selectedLang}
      />

      <View style={styles.dots}>
        {SLIDE_TYPES.map((_, i) => {
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

      <TouchableOpacity
        style={[styles.nextBtn, { backgroundColor: colors.primary, borderColor: isDarkMode ? '#fff' : '#000' }]}
        onPress={next}
        activeOpacity={0.85}
      >
        {isLast ? (
          <>
            <Ionicons name="game-controller-outline" size={22} color="#fff" />
            <Text style={styles.nextText}>{t.play_btn}</Text>
          </>
        ) : (
          <>
            <Text style={styles.nextText}>{t.next}</Text>
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
  skipText: { fontSize: 13, fontFamily: 'SpecialElite_400Regular', letterSpacing: 1 },

  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 10,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  slideTitle: {
    fontSize: 22,
    fontFamily: 'SpecialElite_400Regular',
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 30,
  },
  slideText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 21,
    fontFamily: 'SpecialElite_400Regular',
  },

  // Welcome slide
  pickLangLabel: {
    fontSize: 11,
    fontFamily: 'SpecialElite_400Regular',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: -4,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    width: (width - 56 - 8) / 2,
  },
  langFlag: { fontSize: 20 },
  langName: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'SpecialElite_400Regular',
  },

  // Slang slide
  slangCatName: {
    fontSize: 13,
    fontFamily: 'SpecialElite_400Regular',
    letterSpacing: 1,
    marginTop: -8,
  },
  examplesBox: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  previewLabel: {
    fontSize: 10,
    fontFamily: 'SpecialElite_400Regular',
    letterSpacing: 2,
    marginBottom: 2,
  },
  exampleWord: {
    fontSize: 15,
    fontFamily: 'SpecialElite_400Regular',
    textAlign: 'center',
  },
  premiumBtnWrap: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  premiumBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  premiumBtnText: {
    fontSize: 13,
    fontFamily: 'SpecialElite_400Regular',
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Dots + nav
  dots: { flexDirection: 'row', gap: 6, marginBottom: 24 },
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
  nextText: { fontSize: 16, fontFamily: 'SpecialElite_400Regular', color: '#fff', letterSpacing: 2 },
});
