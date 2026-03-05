// DiscussionScreen.js - No-scroll layout, random restart with new word + new spy
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

import SoundManager, { setSoundEnabled } from "../utils/SoundManager";
import { useSettings } from "../context/SettingsContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const isSmallScreen = SCREEN_HEIGHT < 700;

// ─── Word/category data (mirrors CreateRoomScreen) ───────────────────────────
const freeCategoriesEN = {
  'Random': [
    { word: 'Toothbrush', hint: 'bathroom' }, { word: 'Lion', hint: 'predator' },
    { word: 'Elon Musk', hint: 'tech' }, { word: 'Grand', hint: 'fine' },
    { word: 'Chair', hint: 'seating' }, { word: 'Taylor Swift', hint: 'pop' },
    { word: 'Dolphin', hint: 'smart' }, { word: 'Craic', hint: 'fun' },
    { word: 'Mirror', hint: 'reflection' }, { word: 'Cristiano Ronaldo', hint: 'football' },
    { word: 'Eagle', hint: 'wings' }, { word: 'Deadly', hint: 'great' },
    { word: 'Laptop', hint: 'computer' }, { word: 'Beyoncé', hint: 'singer' },
    { word: 'Shark', hint: 'ocean' }, { word: 'Gobshite', hint: 'idiot' },
    { word: 'Umbrella', hint: 'rain' }, { word: 'LeBron James', hint: 'basketball' },
    { word: 'Penguin', hint: 'cold' }, { word: 'Knackered', hint: 'tired' },
    { word: 'Fridge', hint: 'cold' }, { word: 'Leonardo DiCaprio', hint: 'Oscar' },
    { word: 'Wolf', hint: 'pack' }, { word: 'Scarlet', hint: 'embarrassed' },
    { word: 'Microwave', hint: 'heating' }, { word: 'Gordon Ramsay', hint: 'cooking' },
    { word: 'Octopus', hint: 'tentacles' }, { word: 'Gaff', hint: 'home' },
    { word: 'Headphones', hint: 'audio' }, { word: 'MrBeast', hint: 'YouTube' },
  ],
  'Everyday Objects': [
    { word: 'Toothbrush', hint: 'bathroom' }, { word: 'Chair', hint: 'seating' },
    { word: 'Table', hint: 'surface' }, { word: 'Couch', hint: 'livingroom' },
    { word: 'Pillow', hint: 'bedding' }, { word: 'Blanket', hint: 'warmth' },
    { word: 'Lamp', hint: 'lighting' }, { word: 'Mirror', hint: 'reflection' },
    { word: 'Clock', hint: 'time' }, { word: 'Door', hint: 'entrance' },
    { word: 'Window', hint: 'glass' }, { word: 'Carpet', hint: 'flooring' },
    { word: 'Shelf', hint: 'storage' }, { word: 'Drawer', hint: 'storage' },
    { word: 'Cabinet', hint: 'kitchen' }, { word: 'Television', hint: 'screen' },
    { word: 'Remote', hint: 'control' }, { word: 'Charger', hint: 'power' },
    { word: 'Laptop', hint: 'computer' }, { word: 'Headphones', hint: 'audio' },
    { word: 'Backpack', hint: 'carry' }, { word: 'Wallet', hint: 'money' },
    { word: 'Keys', hint: 'access' }, { word: 'Pen', hint: 'writing' },
    { word: 'Notebook', hint: 'paper' }, { word: 'Book', hint: 'reading' },
    { word: 'Mug', hint: 'drink' }, { word: 'Glass', hint: 'drink' },
    { word: 'Plate', hint: 'food' }, { word: 'Spoon', hint: 'utensil' },
    { word: 'Fork', hint: 'utensil' }, { word: 'Knife', hint: 'cutting' },
    { word: 'Pan', hint: 'cooking' }, { word: 'Pot', hint: 'boiling' },
    { word: 'Kettle', hint: 'water' }, { word: 'Toaster', hint: 'bread' },
    { word: 'Microwave', hint: 'heating' }, { word: 'Fridge', hint: 'cold' },
    { word: 'Freezer', hint: 'frozen' }, { word: 'Trash bin', hint: 'waste' },
    { word: 'Towel', hint: 'drying' }, { word: 'Soap', hint: 'cleaning' },
    { word: 'Shampoo', hint: 'hair' }, { word: 'Toothpaste', hint: 'hygiene' },
    { word: 'Hairbrush', hint: 'grooming' }, { word: 'Umbrella', hint: 'rain' },
    { word: 'Jacket', hint: 'outerwear' }, { word: 'Shoes', hint: 'footwear' },
    { word: 'Sunglasses', hint: 'sun' }, { word: 'Alarm clock', hint: 'waking' },
  ],
  'Famous People': [
    { word: 'Elon Musk', hint: 'tech' }, { word: 'Taylor Swift', hint: 'pop' },
    { word: 'Cristiano Ronaldo', hint: 'football' }, { word: 'Lionel Messi', hint: 'football' },
    { word: 'Dwayne Johnson', hint: 'wrestling' }, { word: 'Kim Kardashian', hint: 'reality' },
    { word: 'Gordon Ramsay', hint: 'cooking' }, { word: 'MrBeast', hint: 'YouTube' },
    { word: 'Oprah Winfrey', hint: 'talkshow' }, { word: 'Barack Obama', hint: 'president' },
    { word: 'Michael Jackson', hint: 'pop' }, { word: 'Beyoncé', hint: 'singer' },
    { word: 'Johnny Depp', hint: 'actor' }, { word: 'Keanu Reeves', hint: 'action' },
    { word: 'Tom Cruise', hint: 'action' }, { word: 'Adele', hint: 'vocals' },
    { word: 'Ed Sheeran', hint: 'guitar' }, { word: 'Drake', hint: 'rap' },
    { word: 'Rihanna', hint: 'fashion' }, { word: 'Billie Eilish', hint: 'altpop' },
    { word: 'LeBron James', hint: 'basketball' }, { word: 'Stephen Curry', hint: 'shooting' },
    { word: 'Serena Williams', hint: 'tennis' }, { word: 'Usain Bolt', hint: 'sprint' },
    { word: 'Conor McGregor', hint: 'MMA' }, { word: 'Tiger Woods', hint: 'golf' },
    { word: 'David Beckham', hint: 'football' }, { word: 'Kylian Mbappé', hint: 'speed' },
    { word: 'Novak Djokovic', hint: 'tennis' }, { word: 'Lewis Hamilton', hint: 'racing' },
    { word: 'Brad Pitt', hint: 'Hollywood' }, { word: 'Angelina Jolie', hint: 'actress' },
    { word: 'Leonardo DiCaprio', hint: 'Oscar' }, { word: 'Jennifer Aniston', hint: 'sitcom' },
    { word: 'Will Smith', hint: 'movies' }, { word: 'Morgan Freeman', hint: 'voice' },
    { word: 'Robert Downey Jr.', hint: 'Marvel' }, { word: 'Scarlett Johansson', hint: 'Marvel' },
    { word: 'Chris Hemsworth', hint: 'Thor' }, { word: 'Margot Robbie', hint: 'Barbie' },
    { word: 'Mark Zuckerberg', hint: 'Facebook' }, { word: 'Jeff Bezos', hint: 'Amazon' },
    { word: 'Bill Gates', hint: 'Microsoft' }, { word: 'Steve Jobs', hint: 'Apple' },
    { word: 'Greta Thunberg', hint: 'climate' }, { word: 'Donald Trump', hint: 'politics' },
    { word: 'Joe Biden', hint: 'president' }, { word: 'Prince William', hint: 'royal' },
    { word: 'King Charles', hint: 'monarch' }, { word: 'Pope Francis', hint: 'Vatican' },
  ],
  'Animals': [
    { word: 'Dog', hint: 'pet' }, { word: 'Cat', hint: 'pet' },
    { word: 'Lion', hint: 'predator' }, { word: 'Tiger', hint: 'stripes' },
    { word: 'Elephant', hint: 'huge' }, { word: 'Giraffe', hint: 'tall' },
    { word: 'Zebra', hint: 'stripes' }, { word: 'Kangaroo', hint: 'hopping' },
    { word: 'Panda', hint: 'bamboo' }, { word: 'Koala', hint: 'eucalyptus' },
    { word: 'Dolphin', hint: 'smart' }, { word: 'Whale', hint: 'giant' },
    { word: 'Shark', hint: 'ocean' }, { word: 'Octopus', hint: 'tentacles' },
    { word: 'Penguin', hint: 'cold' }, { word: 'Eagle', hint: 'wings' },
    { word: 'Owl', hint: 'night' }, { word: 'Parrot', hint: 'talk' },
    { word: 'Flamingo', hint: 'pink' }, { word: 'Swan', hint: 'graceful' },
    { word: 'Horse', hint: 'ride' }, { word: 'Cow', hint: 'milk' },
    { word: 'Pig', hint: 'mud' }, { word: 'Sheep', hint: 'wool' },
    { word: 'Goat', hint: 'horns' }, { word: 'Deer', hint: 'forest' },
    { word: 'Fox', hint: 'sly' }, { word: 'Wolf', hint: 'pack' },
    { word: 'Bear', hint: 'hibernate' }, { word: 'Rabbit', hint: 'hop' },
    { word: 'Squirrel', hint: 'nuts' }, { word: 'Raccoon', hint: 'mask' },
    { word: 'Sloth', hint: 'slow' }, { word: 'Monkey', hint: 'climb' },
    { word: 'Gorilla', hint: 'strong' }, { word: 'Camel', hint: 'desert' },
    { word: 'Llama', hint: 'wool' }, { word: 'Buffalo', hint: 'herd' },
    { word: 'Moose', hint: 'antlers' }, { word: 'Seal', hint: 'flippers' },
    { word: 'Walrus', hint: 'tusks' }, { word: 'Crocodile', hint: 'jaws' },
    { word: 'Alligator', hint: 'swamp' }, { word: 'Frog', hint: 'jump' },
    { word: 'Snake', hint: 'slither' }, { word: 'Turtle', hint: 'shell' },
    { word: 'Lizard', hint: 'scales' }, { word: 'Peacock', hint: 'feathers' },
    { word: 'Bat', hint: 'night' }, { word: 'Hedgehog', hint: 'spines' },
  ],
  'Irish Slang': [
    { word: 'Grand', hint: 'fine' }, { word: 'Craic', hint: 'fun' },
    { word: 'Gas', hint: 'funny' }, { word: 'Deadly', hint: 'great' },
    { word: 'Savage', hint: 'excellent' }, { word: 'Sound', hint: 'kind' },
    { word: "Fair play", hint: "respect" }, { word: "What's the story", hint: "greeting" },
    { word: 'Yoke', hint: 'object' }, { word: 'Eejit', hint: 'fool' },
    { word: 'Gobshite', hint: 'idiot' }, { word: 'Gowl', hint: 'insult' },
    { word: 'Dose', hint: 'annoying' }, { word: 'Feck', hint: 'swear' },
    { word: 'Jaysus', hint: 'surprise' }, { word: 'Shift', hint: 'kiss' },
    { word: 'Mot', hint: 'girlfriend' }, { word: 'Lad', hint: 'male' },
    { word: 'Yer man', hint: 'person' }, { word: 'Yer wan', hint: 'person' },
    { word: 'Banjaxed', hint: 'broken' }, { word: 'Knackered', hint: 'tired' },
    { word: 'Scuttered', hint: 'drunk' }, { word: 'Plastered', hint: 'drunk' },
    { word: 'Locked', hint: 'drunk' }, { word: 'Hammered', hint: 'drunk' },
    { word: 'Pissed', hint: 'drunk' }, { word: 'Buzzin', hint: 'excited' },
    { word: 'Giving out', hint: 'complaining' }, { word: 'On the lash', hint: 'drinking' },
    { word: 'Up to 90', hint: 'busy' }, { word: 'Taking the piss', hint: 'mocking' },
    { word: 'Acting the maggot', hint: 'foolish' }, { word: 'Head melted', hint: 'overwhelmed' },
    { word: 'Notions', hint: 'pretentious' }, { word: 'Bogger', hint: 'rural' },
    { word: 'Cute hoor', hint: 'sly' }, { word: 'Scarlet', hint: 'embarrassed' },
    { word: 'Away with the fairies', hint: 'distracted' }, { word: 'Story horse', hint: 'greeting' },
    { word: 'Cop on', hint: 'sense' }, { word: 'Dry shite', hint: 'boring' },
    { word: 'Chancer', hint: 'opportunist' }, { word: 'Manky', hint: 'dirty' },
    { word: 'Skint', hint: 'broke' }, { word: 'Gaff', hint: 'home' },
    { word: 'Messages', hint: 'groceries' }, { word: 'Shifted', hint: 'kissed' },
    { word: 'Leg it', hint: 'run' }, { word: 'Sound out', hint: 'confirm' },
  ],
};

const freeCategoriesLT = {
  'Atsitiktinė': [
    { word: 'Dantų šepetėlis', hint: 'vonios kambarys' }, { word: 'Liūtas', hint: 'plėšrūnas' },
    { word: 'Elon Musk', hint: 'technologijos' }, { word: 'Grand', hint: 'gerai' },
    { word: 'Kėdė', hint: 'sėdėjimas' }, { word: 'Taylor Swift', hint: 'pop' },
    { word: 'Delfinas', hint: 'protingas' }, { word: 'Craic', hint: 'linksmybės' },
    { word: 'Veidrodis', hint: 'atspindys' }, { word: 'Cristiano Ronaldo', hint: 'futbolas' },
    { word: 'Erelis', hint: 'sparnai' }, { word: 'Deadly', hint: 'puiku' },
    { word: 'Nešiojamas', hint: 'kompiuteris' }, { word: 'Beyoncé', hint: 'dainininkė' },
    { word: 'Ryklys', hint: 'vandenynas' }, { word: 'Gobshite', hint: 'idiotas' },
    { word: 'Skėtis', hint: 'lietus' }, { word: 'LeBron James', hint: 'krepšinis' },
    { word: 'Pingvinas', hint: 'šaltis' }, { word: 'Knackered', hint: 'pavargęs' },
    { word: 'Šaldytuvas', hint: 'šaltis' }, { word: 'Gordon Ramsay', hint: 'virimas' },
    { word: 'Vilkas', hint: 'gauja' }, { word: 'Scarlet', hint: 'gėda' },
  ],
  'Kasdieniai Daiktai': [
    { word: 'Dantų šepetėlis', hint: 'vonios kambarys' }, { word: 'Kėdė', hint: 'sėdėjimas' },
    { word: 'Stalas', hint: 'paviršius' }, { word: 'Sofa', hint: 'svetainė' },
    { word: 'Pagalvė', hint: 'lova' }, { word: 'Antklodė', hint: 'šiluma' },
    { word: 'Lempa', hint: 'apšvietimas' }, { word: 'Veidrodis', hint: 'atspindys' },
    { word: 'Laikrodis', hint: 'laikas' }, { word: 'Durys', hint: 'įėjimas' },
    { word: 'Langas', hint: 'stiklas' }, { word: 'Kilimas', hint: 'grindys' },
  ],
  'Garsūs Žmonės': [
    { word: 'Elon Musk', hint: 'technologijos' }, { word: 'Taylor Swift', hint: 'pop' },
    { word: 'Cristiano Ronaldo', hint: 'futbolas' }, { word: 'Lionel Messi', hint: 'futbolas' },
  ],
  'Gyvūnai': [
    { word: 'Šuo', hint: 'augintinis' }, { word: 'Katė', hint: 'augintinis' },
    { word: 'Liūtas', hint: 'plėšrūnas' }, { word: 'Tigras', hint: 'dryžiai' },
  ],
  'Airių Slangas': [
    { word: 'Grand', hint: 'gerai' }, { word: 'Craic', hint: 'linksmybės' },
    { word: 'Gas', hint: 'juokinga' }, { word: 'Deadly', hint: 'puiku' },
  ],
};

// ─── Pick a new random word + spies for the same category + players ──────────
const pickNewRound = (categoryId, players, numImposters = 1, language = "en", usedWords = []) => {
  const freeCategories = language === "lt" ? freeCategoriesLT : freeCategoriesEN;
  const categoryData = freeCategories[categoryId] ?? Object.values(freeCategories)[0];

  // Filter out already used words, fall back to full list if all exhausted
  const available = categoryData.filter((item) => {
    const w = typeof item === "object" ? item.word : item;
    return !usedWords.includes(w);
  });
  const pool = available.length > 0 ? available : categoryData;

  const randomItem = pool[Math.floor(Math.random() * pool.length)];
  const secretWord = typeof randomItem === "object" ? randomItem.word : randomItem;
  const hintWord = typeof randomItem === "object" ? randomItem.hint : "";

  const imposterIndices = [];
  while (imposterIndices.length < Math.min(numImposters, players.length - 1)) {
    const idx = Math.floor(Math.random() * players.length);
    if (!imposterIndices.includes(idx)) imposterIndices.push(idx);
  }

  return { secretWord, hintWord, imposterIndices };
};

// ─── Translations ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    title: "DISCUSSION",
    subtitle: "Talk it out. Figure out who's faking it.",
    startsConvo: "starts the conversation!",
    nowTalking: "NOW TALKING",
    next: "NEXT",
    timeUp: "TIME'S UP!",
    tapToContinue: "TAP TO CONTINUE",
    revealBtn: "REVEAL SPY & WORD",
    newGame: "New Game",
    restartGame: "Restart Game",
    players: "PLAYER ORDER",
    timerLabel: (s) => `${s}`,
  },
  lt: {
    title: "DISKUSIJA",
    subtitle: "Kalbėkite. Išsiaiškinkite, kas apsimetinėja.",
    startsConvo: "pradeda pokalbį!",
    nowTalking: "DABAR KALBA",
    next: "KITAS",
    timeUp: "LAIKAS BAIGĖSI!",
    tapToContinue: "PALIESKITE, KAD TĘSTI",
    revealBtn: "ATSKLEISTI ŠNIPĄ IR ŽODĮ",
    newGame: "Naujas žaidimas",
    restartGame: "Paleisti iš naujo",
    players: "ŽAIDĖJŲ EILĖ",
    timerLabel: (s) => `${s}`,
  },
};

const pickRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

export default function DiscussionScreen({ route, navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { soundEnabled, vibrationEnabled } = useSettings();

  const {
    players = [],
    language = "en",
    categoryId = null,
    categoryName = null,
    word = null,
    spyIndex = null,
    imposterIndices = [],
    clueAssist = false,
    timeLimit = false,
    timePerPerson = 15,
    numImposters = 1,
    usedWords = [],
  } = route.params || {};

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Preload sounds when screen mounts
  useEffect(() => {
    SoundManager.preloadAll();
    return () => SoundManager.unloadAll();
  }, []);

  // Keep SoundManager in sync with settings
  useEffect(() => { setSoundEnabled(soundEnabled); }, [soundEnabled]);

  const [startIndex] = useState(() => pickRandomIndex(players));
  const orderedPlayers = useMemo(() => {
    const result = [];
    for (let i = 0; i < players.length; i++) {
      result.push(players[(startIndex + i) % players.length]);
    }
    return result;
  }, [players, startIndex]);

  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const currentPlayer = orderedPlayers[currentTurnIndex] ?? orderedPlayers[0];

  const [timeLeft, setTimeLeft] = useState(timePerPerson);
  const [timerRunning, setTimerRunning] = useState(timeLimit);
  const [timesUp, setTimesUp] = useState(false);

  const flashAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const playerSlideAnim = useRef(new Animated.Value(0)).current;
  const flashLoopRef = useRef(null);

  const triggerTimesUp = useCallback(() => {
    setTimesUp(true);
    setTimerRunning(false);
    SoundManager.playTimesUp();
    flashLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
      ])
    );
    flashLoopRef.current.start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [flashAnim, scaleAnim]);

  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) { triggerTimesUp(); return; }
    // Beep on last 5 seconds
    if (timeLeft <= 5) SoundManager.playCountdownBeep();
    const id = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [timerRunning, timeLeft, triggerTimesUp]);

  const advancePlayer = () => {
    if (flashLoopRef.current) { flashLoopRef.current.stop(); flashLoopRef.current = null; }
    flashAnim.setValue(0);
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.timing(playerSlideAnim, { toValue: -20, duration: 100, useNativeDriver: true }),
      Animated.timing(playerSlideAnim, { toValue: 0, duration: 180, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();
    setCurrentTurnIndex((prev) => (prev + 1) % orderedPlayers.length);
    setTimeLeft(timePerPerson);
    setTimesUp(false);
    setTimerRunning(timeLimit);
  };

  const onReveal = () => {
    navigation.navigate("RevealResult", {
    players, language, categoryId, categoryName, word, spyIndex, imposterIndices,
  });
  };

  const onNewGame = () => {
    navigation.replace("CreateRoom", { language });
  };

  const onRestartGame = () => {
    const nextUsedWords = word ? [...usedWords, word] : usedWords;
    const { secretWord, hintWord, imposterIndices: newImposters } = pickNewRound(
      categoryId, players, numImposters, language, nextUsedWords
    );
    navigation.replace("Game", {
      players,
      language,
      secretWord,
      hintWord,
      imposterIndices: newImposters,
      clueAssist,
      category: categoryId,
      categoryId,
      categoryName,
      timeLimit,
      timePerPerson,
      numImposters,
      usedWords: nextUsedWords,
    });
  };

  const styles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);
  const border = isDarkMode ? "#ffffff" : "#000000";
  const timerColor = timeLeft <= 5 ? "#ff1a1a" : colors.primary;
  const timerPercent = Math.max(0, (timeLeft / timePerPerson) * 100);
  const flashBg = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,26,26,0)", "rgba(255,26,26,0.18)"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { backgroundColor: flashBg, zIndex: 10 }]} />

      <ScrollView style={styles.layout} contentContainerStyle={styles.layoutContent} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <TouchableOpacity style={[styles.closeBtn, { borderColor: border }]} onPress={onNewGame} activeOpacity={0.8}>
            <Ionicons name="close" size={20} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <View style={[styles.currentCard, { borderColor: border }]}>
          <Text style={styles.nowTalkingLabel}>{t.nowTalking}</Text>
          <Animated.Text style={[styles.currentPlayerName, { transform: [{ translateY: playerSlideAnim }] }]}>
            {currentPlayer}
          </Animated.Text>
          <Text style={styles.startsConvo}>
            {currentTurnIndex === 0 ? t.startsConvo : "→"}
          </Text>
        </View>

        {timeLimit && (
          <View style={styles.timerSection}>
            <Text style={[styles.timerNumber, { color: timerColor }]}>{t.timerLabel(timeLeft)}</Text>
            <View style={styles.timerBarBg}>
              <View style={[styles.timerBarFill, { width: `${timerPercent}%`, backgroundColor: timerColor }]} />
            </View>
            <Animated.View style={{ transform: [{ scale: scaleAnim }], width: "100%" }}>
              <TouchableOpacity
                style={[styles.nextBtn, { borderColor: border }, timesUp && styles.nextBtnAlert]}
                onPress={advancePlayer}
                activeOpacity={0.85}
              >
                <Ionicons name={timesUp ? "alert-circle" : "arrow-forward-circle"} size={22} color="#fff" />
                <Text style={styles.nextBtnText}>{timesUp ? `${t.timeUp}  ${t.tapToContinue}` : t.next}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.players}</Text>
          <View style={styles.playerList}>
            {orderedPlayers.map((name, idx) => {
              const isCurrent = idx === currentTurnIndex;
              return (
                <View key={`${name}-${idx}`} style={[styles.playerRow, isCurrent && styles.playerRowActive]}>
                  <View style={[styles.playerIndex, isCurrent && styles.playerIndexActive]}>
                    <Text style={[styles.playerIndexText, isCurrent && styles.playerIndexTextActive]}>{idx + 1}</Text>
                  </View>
                  <Text style={[styles.playerRowName, isCurrent && styles.playerRowNameActive]}>{name}</Text>
                  {isCurrent && (
                    <View style={styles.talkingPill}>
                      <Text style={styles.talkingPillText}>● TALKING</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.revealBtn} onPress={onReveal} activeOpacity={0.9}>
            <Ionicons name="eye" size={20} color={isDarkMode ? "#000" : "#fff"} />
            <Text style={styles.revealBtnText}>{t.revealBtn}</Text>
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <TouchableOpacity
              style={[styles.smallBtn, { borderColor: isDarkMode ? "#555" : "#bbb" }]}
              onPress={onRestartGame}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={15} color={isDarkMode ? "#aaa" : "#555"} />
              <Text style={styles.smallBtnText}>{t.restartGame}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallBtn, { borderColor: isDarkMode ? "#555" : "#bbb" }]}
              onPress={onNewGame}
              activeOpacity={0.8}
            >
              <Text style={styles.smallBtnText}>{t.newGame}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    layout: { flex: 1 },
    layoutContent: {
      paddingHorizontal: 18,
      paddingTop: isSmallScreen ? 28 : 38,
      paddingBottom: isSmallScreen ? 20 : 30,
    },
    header: {
      flexDirection: "row", justifyContent: "space-between", alignItems: "center",
      marginBottom: isSmallScreen ? 8 : 12,
    },
    // ↑ Bigger title
    title: {
      fontSize: isSmallScreen ? 20 : 24, fontWeight: "900", letterSpacing: 3,
      color: isDarkMode ? "#fff" : "#000",
    },
    closeBtn: {
      width: 38, height: 38, borderRadius: 11, backgroundColor: colors.surface,
      borderWidth: 2, justifyContent: "center", alignItems: "center",
    },
    // ↑ Bigger subtitle
    subtitle: {
      fontSize: isSmallScreen ? 13 : 15, color: isDarkMode ? "#aaa" : "#555",
      marginBottom: isSmallScreen ? 10 : 14,
    },
    currentCard: {
      backgroundColor: colors.surface, borderRadius: 16, borderWidth: 2,
      paddingVertical: isSmallScreen ? 10 : 14, paddingHorizontal: 20,
      alignItems: "center", marginBottom: isSmallScreen ? 8 : 12,
    },
    // ↑ Bigger "NOW TALKING" label
    nowTalkingLabel: {
      fontSize: 12, fontWeight: "800", letterSpacing: 3,
      color: isDarkMode ? "#aaa" : "#666", marginBottom: 4,
    },
    // ↑ Bigger current player name
    currentPlayerName: {
      fontSize: isSmallScreen ? 28 : 34, fontWeight: "900",
      color: isDarkMode ? "#fff" : "#000", letterSpacing: 1,
      marginBottom: 3, textAlign: "center",
    },
    // ↑ Bigger starts convo text
    startsConvo: { fontSize: 14, color: isDarkMode ? "#aaa" : "#555", fontWeight: "600" },
    timerSection: { alignItems: "center", marginBottom: isSmallScreen ? 8 : 12, gap: 7 },
    // ↑ Bigger timer number
    timerNumber: { fontSize: isSmallScreen ? 42 : 52, fontWeight: "900", letterSpacing: 1, textAlign: 'center', width: '100%' },
    timerBarBg: {
      width: "100%", height: 5, backgroundColor: isDarkMode ? "#333" : "#ddd",
      borderRadius: 3, overflow: "hidden",
    },
    timerBarFill: { height: "100%", borderRadius: 3 },
    nextBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
      backgroundColor: colors.primary, paddingVertical: 13, borderRadius: 12,
      borderWidth: 2, width: "100%",
    },
    nextBtnAlert: { backgroundColor: "#ff1a1a", borderColor: "#ff1a1a" },
    // ↑ Bigger next button text
    nextBtnText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 1 },
    section: { marginBottom: isSmallScreen ? 8 : 12 },
    // ↑ Bigger section label
    sectionLabel: {
      fontSize: 12, fontWeight: "800", letterSpacing: 3,
      color: isDarkMode ? "#aaa" : "#666", marginBottom: 7,
    },
    playerList: { gap: 5 },
    playerRow: {
      flexDirection: "row", alignItems: "center", gap: 10,
      backgroundColor: colors.surface, borderRadius: 11, borderWidth: 2,
      borderColor: isDarkMode ? "#333" : "#ccc",
      paddingVertical: isSmallScreen ? 8 : 10, paddingHorizontal: 12,
    },
    playerRowActive: { borderColor: isDarkMode ? "#fff" : "#000", backgroundColor: colors.primary + "15" },
    playerIndex: {
      width: 26, height: 26, borderRadius: 7,
      backgroundColor: isDarkMode ? "#333" : "#ddd",
      justifyContent: "center", alignItems: "center",
    },
    playerIndexActive: { backgroundColor: colors.primary },
    // ↑ Bigger player index number
    playerIndexText: { fontSize: 13, fontWeight: "800", color: isDarkMode ? "#aaa" : "#555" },
    playerIndexTextActive: { color: "#fff" },
    // ↑ Bigger player name in list
    playerRowName: { flex: 1, fontSize: 16, fontWeight: "700", color: isDarkMode ? "#ccc" : "#444" },
    playerRowNameActive: { color: isDarkMode ? "#fff" : "#000", fontWeight: "900" },
    talkingPill: { backgroundColor: colors.primary, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 20 },
    // ↑ Bigger talking pill text
    talkingPillText: { color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
    actions: { gap: 7 },
    revealBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
      backgroundColor: isDarkMode ? "#fff" : "#000",
      paddingVertical: isSmallScreen ? 14 : 16,
      borderRadius: 14, borderWidth: 2, borderColor: isDarkMode ? "#fff" : "#000",
    },
    // ↑ Bigger reveal button text
    revealBtnText: { color: isDarkMode ? "#000" : "#fff", fontSize: 15, fontWeight: "900", letterSpacing: 2 },
    bottomRow: { flexDirection: "row", gap: 8 },
    smallBtn: {
      flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
      gap: 5, paddingVertical: isSmallScreen ? 10 : 12, borderRadius: 11, borderWidth: 1.5,
    },
    // ↑ Bigger small button text
    smallBtnText: { color: isDarkMode ? "#aaa" : "#555", fontSize: 14, fontWeight: "700" },
  });