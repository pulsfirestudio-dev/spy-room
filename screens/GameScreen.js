// GameScreen.js - coloured role card per player + expanding hold button
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from 'expo-linear-gradient';

const PLAYER_COLORS = [
  { bg: "#FFE066", text: "#1a1a1a" }, { bg: "#6EE6FA", text: "#1a1a1a" },
  { bg: "#B5F5A0", text: "#1a1a1a" }, { bg: "#FFB347", text: "#1a1a1a" },
  { bg: "#C3A6FF", text: "#1a1a1a" }, { bg: "#FF8FAB", text: "#1a1a1a" },
  { bg: "#A0E7E5", text: "#1a1a1a" }, { bg: "#FFC8A2", text: "#1a1a1a" },
  { bg: "#D4F1F4", text: "#1a1a1a" }, { bg: "#F3C6F1", text: "#1a1a1a" },
  { bg: "#FDFD96", text: "#1a1a1a" }, { bg: "#B4F8C8", text: "#1a1a1a" },
];

const shuffleColors = (count) => {
  // Shuffle the palette once
  const shuffled = [...PLAYER_COLORS].sort(() => Math.random() - 0.5);
  // Assign by cycling through — no repeats until all 8 are used
  return Array.from({ length: count }, (_, i) => shuffled[i % shuffled.length]);
};

const translations = {
  en: {
    revealPhase: "REVEAL PHASE", holdToSee: "Hold to reveal", yourRole: "YOUR ROLE",
    agent: "AGENT", spy: "SPY", word: "The word is:", cluePhase: "CLUE PHASE",
    giveClue: "Drop your clue", interrogation: "INTERROGATION", voting: "VOTING",
    whoIsSpy: "Who is the spy?", results: "RESULTS", agentsWin: "AGENTS WIN!",
    spiesWin: "SPIES WIN!", playAgain: "PLAY AGAIN", home: "HOME",
    passTo: "Pass to", startDiscussion: "Start Discussion", timeUp: "Time's Up!",
    fireQuestions: "Fire your questions!", hiddenRoles: "Hidden Roles:", voterVotes: "votes:",
  },
  lt: {
    revealPhase: "ATSKLEIDIMO FAZĖ", holdToSee: "Laikykite atskleidimui", yourRole: "JŪSŲ ROLĖ",
    agent: "AGENTAS", spy: "ŠNIPAS", word: "Žodis yra:", cluePhase: "UŽUOMINŲ FAZĖ",
    giveClue: "Meskite užuominą", interrogation: "APIKLAUSA", voting: "BALSUOJIMAS",
    whoIsSpy: "Kas yra šnipas?", results: "REZULTATAI", agentsWin: "AGENTAI LAIMĖJO!",
    spiesWin: "ŠNIPAI LAIMĖJO!", playAgain: "ŽAISTI DAR KARTĄ", home: "PRADŽIA",
    passTo: "Perduokite", startDiscussion: "Pradėti diskusiją", timeUp: "Laikas baigėsi!",
    fireQuestions: "Užduokite klausimus!", hiddenRoles: "Slaptos rolės:", voterVotes: "balsuoja:",
  },
  es: {
    revealPhase: "FASE DE REVELACIÓN", holdToSee: "Mantén para revelar", yourRole: "TU ROL",
    agent: "AGENTE", spy: "ESPÍA", word: "La palabra es:", cluePhase: "FASE DE PISTAS",
    giveClue: "Da tu pista", interrogation: "INTERROGATORIO", voting: "VOTACIÓN",
    whoIsSpy: "¿Quién es el espía?", results: "RESULTADOS", agentsWin: "¡GANAN LOS AGENTES!",
    spiesWin: "¡GANAN LOS ESPÍAS!", playAgain: "JUGAR DE NUEVO", home: "INICIO",
    passTo: "Pasar a", startDiscussion: "Iniciar discusión", timeUp: "¡Tiempo!",
    fireQuestions: "¡Haz tus preguntas!", hiddenRoles: "Roles ocultos:", voterVotes: "votos:",
  },
  fr: {
    revealPhase: "PHASE DE RÉVÉLATION", holdToSee: "Maintenir pour révéler", yourRole: "VOTRE RÔLE",
    agent: "AGENT", spy: "ESPION", word: "Le mot est :", cluePhase: "PHASE D'INDICES",
    giveClue: "Donnez votre indice", interrogation: "INTERROGATOIRE", voting: "VOTE",
    whoIsSpy: "Qui est l'espion ?", results: "RÉSULTATS", agentsWin: "LES AGENTS GAGNENT !",
    spiesWin: "LES ESPIONS GAGNENT !", playAgain: "REJOUER", home: "ACCUEIL",
    passTo: "Passer à", startDiscussion: "Démarrer la discussion", timeUp: "Temps écoulé !",
    fireQuestions: "Posez vos questions !", hiddenRoles: "Rôles cachés :", voterVotes: "votes :",
  },
  de: {
    revealPhase: "ENTHÜLLUNGSPHASE", holdToSee: "Halten zum Enthüllen", yourRole: "DEINE ROLLE",
    agent: "AGENT", spy: "SPION", word: "Das Wort ist:", cluePhase: "HINWEISPHASE",
    giveClue: "Gib deinen Hinweis", interrogation: "VERHÖR", voting: "ABSTIMMUNG",
    whoIsSpy: "Wer ist der Spion?", results: "ERGEBNISSE", agentsWin: "AGENTEN GEWINNEN!",
    spiesWin: "SPIONE GEWINNEN!", playAgain: "NOCHMAL SPIELEN", home: "STARTSEITE",
    passTo: "Weitergeben an", startDiscussion: "Diskussion starten", timeUp: "Zeit abgelaufen!",
    fireQuestions: "Stellt eure Fragen!", hiddenRoles: "Versteckte Rollen:", voterVotes: "Stimmen:",
  },
  pl: {
    revealPhase: "FAZA UJAWNIENIA", holdToSee: "Przytrzymaj aby ujawnić", yourRole: "TWOJA ROLA",
    agent: "AGENT", spy: "SZPIEG", word: "Słowo to:", cluePhase: "FAZA WSKAZÓWEK",
    giveClue: "Daj wskazówkę", interrogation: "PRZESŁUCHANIE", voting: "GŁOSOWANIE",
    whoIsSpy: "Kto jest szpiegiem?", results: "WYNIKI", agentsWin: "AGENCI WYGRYWAJĄ!",
    spiesWin: "SZPIEDZY WYGRYWAJĄ!", playAgain: "ZAGRAJ JESZCZE RAZ", home: "STRONA GŁÓWNA",
    passTo: "Przekaż do", startDiscussion: "Rozpocznij dyskusję", timeUp: "Czas minął!",
    fireQuestions: "Zadaj pytania!", hiddenRoles: "Ukryte role:", voterVotes: "głosy:",
  },
  pt: {
    revealPhase: "FASE DE REVELAÇÃO", holdToSee: "Segure para revelar", yourRole: "SEU PAPEL",
    agent: "AGENTE", spy: "ESPIÃO", word: "A palavra é:", cluePhase: "FASE DE PISTAS",
    giveClue: "Dê sua pista", interrogation: "INTERROGATÓRIO", voting: "VOTAÇÃO",
    whoIsSpy: "Quem é o espião?", results: "RESULTADOS", agentsWin: "AGENTES VENCEM!",
    spiesWin: "ESPIÕES VENCEM!", playAgain: "JOGAR NOVAMENTE", home: "INÍCIO",
    passTo: "Passar para", startDiscussion: "Iniciar discussão", timeUp: "Tempo esgotado!",
    fireQuestions: "Faça suas perguntas!", hiddenRoles: "Papéis ocultos:", voterVotes: "votos:",
  },
  it: {
    revealPhase: "FASE DI RIVELAZIONE", holdToSee: "Tieni premuto per rivelare", yourRole: "IL TUO RUOLO",
    agent: "AGENTE", spy: "SPIA", word: "La parola è:", cluePhase: "FASE DEGLI INDIZI",
    giveClue: "Dai il tuo indizio", interrogation: "INTERROGATORIO", voting: "VOTAZIONE",
    whoIsSpy: "Chi è la spia?", results: "RISULTATI", agentsWin: "GLI AGENTI VINCONO!",
    spiesWin: "LE SPIE VINCONO!", playAgain: "GIOCA ANCORA", home: "HOME",
    passTo: "Passa a", startDiscussion: "Inizia la discussione", timeUp: "Tempo scaduto!",
    fireQuestions: "Fai le tue domande!", hiddenRoles: "Ruoli nascosti:", voterVotes: "voti:",
  },
  nl: {
    revealPhase: "ONTHULLINGSFASE", holdToSee: "Houd ingedrukt om te onthullen", yourRole: "JOUW ROL",
    agent: "AGENT", spy: "SPION", word: "Het woord is:", cluePhase: "AANWIJZINGSFASE",
    giveClue: "Geef je aanwijzing", interrogation: "VERHOOR", voting: "STEMMING",
    whoIsSpy: "Wie is de spion?", results: "RESULTATEN", agentsWin: "AGENTEN WINNEN!",
    spiesWin: "SPIONNEN WINNEN!", playAgain: "OPNIEUW SPELEN", home: "HOME",
    passTo: "Doorgeven aan", startDiscussion: "Start discussie", timeUp: "Tijd om!",
    fireQuestions: "Stel je vragen!", hiddenRoles: "Verborgen rollen:", voterVotes: "stemmen:",
  },
  ro: {
    revealPhase: "FAZA DE DEZVĂLUIRE", holdToSee: "Ține apăsat pentru a dezvălui", yourRole: "ROLUL TĂU",
    agent: "AGENT", spy: "SPION", word: "Cuvântul este:", cluePhase: "FAZA INDICIILOR",
    giveClue: "Dă indiciul tău", interrogation: "INTEROGATORIU", voting: "VOT",
    whoIsSpy: "Cine este spionul?", results: "REZULTATE", agentsWin: "AGENȚII CÂȘTIGĂ!",
    spiesWin: "SPIONII CÂȘTIGĂ!", playAgain: "JOC NOU", home: "ACASĂ",
    passTo: "Treci la", startDiscussion: "Începe discuția", timeUp: "Timp expirat!",
    fireQuestions: "Pune întrebările tale!", hiddenRoles: "Roluri ascunse:", voterVotes: "voturi:",
  },
};

export default function GameScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const {
    players = [], secretWord, imposterIndices = [], clueAssist = false,
    category, language = "en", timeLimit = false, timePerPerson = 15, numImposters = 1, usedWords = [],
  } = route.params || {};
  const t = translations[language] || translations.en;
  const [playerColors] = useState(() => shuffleColors(players.length));
  const [phase, setPhase] = useState("reveal");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isHoldingReveal, setIsHoldingReveal] = useState(false);
  const [hasRevealedThisPlayer, setHasRevealedThisPlayer] = useState(false);
  const [isPassing, setIsPassing] = useState(false);
  const defaultTimedSeconds = useMemo(() => (timeLimit ? timePerPerson : 30), [timeLimit, timePerPerson]);
  const [timeLeft, setTimeLeft] = useState(defaultTimedSeconds);
  const [clues, setClues] = useState([]);
  const [pressedButton, setPressedButton] = useState(null);
  const [votes, setVotes] = useState({});
  const [voterIndex, setVoterIndex] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const holdExpandAnim = useRef(new Animated.Value(1)).current;
  const holdExpandRef = useRef(null);
  const passFlashAnim = useRef(new Animated.Value(0)).current;
  const passFlashRef = useRef(null);
  const isCurrentPlayerSpy = imposterIndices.includes(currentPlayerIndex);
  const currentColor = playerColors[currentPlayerIndex] ?? { bg: "#FFE066", text: "#1a1a1a" };
  const styles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

  useEffect(() => {
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    const glow = Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    pulse.start(); glow.start();
    return () => { pulse.stop(); glow.stop(); };
  }, [pulseAnim, glowAnim]);

  const startHoldExpand = () => {
    holdExpandRef.current = Animated.timing(holdExpandAnim, { toValue: 1.18, duration: 3000, easing: Easing.out(Easing.quad), useNativeDriver: true });
    holdExpandRef.current.start();
  };
  const stopHoldExpand = () => {
    if (holdExpandRef.current) holdExpandRef.current.stop();
    Animated.spring(holdExpandAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  };
  const resetTimer = () => setTimeLeft(defaultTimedSeconds);

  useEffect(() => {
    const isTimedPhase = phase === "clues" || phase === "interrogation";
    if (!isTimedPhase) return;
    if (timeLeft <= 0) { if (phase === "clues") submitClue(t.timeUp); else startVoting(); return; }
    const id = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft]);

  const handleRevealPressIn = () => { if (isPassing) return; setIsHoldingReveal(true); setHasRevealedThisPlayer(true); startHoldExpand(); };
  const handleRevealPressOut = () => { setIsHoldingReveal(false); stopHoldExpand(); };

  const handlePassNext = () => {
    if (!hasRevealedThisPlayer || isPassing || isHoldingReveal) return;
    setIsPassing(true); setIsHoldingReveal(false);
    setTimeout(() => {
      const isLastPlayer = currentPlayerIndex >= players.length - 1;
      if (!isLastPlayer) { setCurrentPlayerIndex((prev) => prev + 1); setHasRevealedThisPlayer(false); setIsPassing(false); return; }
      setHasRevealedThisPlayer(false); setIsPassing(false);
      navigation.replace("Discussion", {
        players, language, categoryId: category ?? null, categoryName: category ?? null,
        word: secretWord, imposterIndices, spyIndex: Array.isArray(imposterIndices) ? imposterIndices[0] : null,
        clueAssist, timeLimit, timePerPerson, numImposters, usedWords,
      });
    }, 150);
  };

  const submitClue = (clueText) => {
    setClues((prev) => [...prev, { player: players[currentPlayerIndex], clue: clueText }]);
    const isLastPlayer = currentPlayerIndex >= players.length - 1;
    if (!isLastPlayer) { setCurrentPlayerIndex((prev) => prev + 1); resetTimer(); return; }
    setCurrentPlayerIndex(0); setPhase("interrogation"); resetTimer();
  };
  const startVoting = () => { setPhase("voting"); setVotes({}); setVoterIndex(0); };
  const voteForPlayer = (suspectIndex) => {
    if (suspectIndex === voterIndex) return;
    setVotes((prev) => { const next = { ...prev }; next[suspectIndex] = (next[suspectIndex] || 0) + 1; return next; });
    if (voterIndex >= players.length - 1) setPhase("results"); else setVoterIndex((prev) => prev + 1);
  };
  const getWinner = () => {
    const voteValues = Object.values(votes);
    if (voteValues.length === 0) return "spies";
    const maxVotes = Math.max(...voteValues);
    const mostVotedKey = Object.keys(votes).find((k) => votes[k] === maxVotes);
    if (mostVotedKey == null) return "spies";
    return imposterIndices.includes(parseInt(mostVotedKey, 10)) ? "agents" : "spies";
  };
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.75] });

  useEffect(() => {
    if (hasRevealedThisPlayer && !isHoldingReveal) {
      passFlashRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(passFlashAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
          Animated.timing(passFlashAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
        ])
      );
      passFlashRef.current.start();
    } else {
      if (passFlashRef.current) passFlashRef.current.stop();
      passFlashAnim.setValue(0);
    }
  }, [hasRevealedThisPlayer, isHoldingReveal]);

  const passButtonBg = passFlashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, "#22cc66"],
  });
  const isLastPlayer = currentPlayerIndex >= players.length - 1;

  const renderRevealPhase = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t.revealPhase}</Text>
      <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>
      <View style={styles.cardSlot}>
        {isHoldingReveal && (
          <View style={[styles.roleCard, { backgroundColor: currentColor.bg }]} pointerEvents="none">
            <Text style={[styles.roleTitle, { color: currentColor.text }]}>{t.yourRole}</Text>
            <Text style={[styles.roleText, isCurrentPlayerSpy ? styles.spyText : styles.agentText]}>
              {isCurrentPlayerSpy ? t.spy : t.agent}
            </Text>
            {!isCurrentPlayerSpy && (
              <View style={[styles.wordBox, { borderColor: currentColor.text + "44" }]}>
                <Text style={[styles.wordLabel, { color: currentColor.text }]}>{t.word}</Text>
                <Text style={[styles.wordText, { color: currentColor.text }]}>{secretWord}</Text>
              </View>
            )}
            {isCurrentPlayerSpy && clueAssist && (
  <View style={[styles.hintBox, { borderColor: currentColor.text + "44" }]}>
    <Text style={[styles.hintLabel, { color: currentColor.text }]}>Hint: {route.params?.hintWord ?? "?"}</Text>
  </View>
)}
          </View>
        )}
      </View>
      <View style={styles.revealButtonWrapper}>
        <Animated.View style={{ transform: [{ scale: isHoldingReveal ? 1 : pulseAnim }] }}>
          <Animated.View style={{ transform: [{ scale: holdExpandAnim }] }}>
            <TouchableOpacity style={[styles.revealButton, isPassing && { opacity: 0.7 }]} onPressIn={handleRevealPressIn} onPressOut={handleRevealPressOut} activeOpacity={0.95} disabled={isPassing}>
              {isDarkMode && <Animated.View style={[styles.revealGlow, { opacity: glowOpacity }]} />}
              <Ionicons name="eye" size={44} color="#fff" />
              <Text style={styles.revealText}>{t.holdToSee}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.View style={[styles.passButtonWrapper, { backgroundColor: passButtonBg }, (!hasRevealedThisPlayer || isPassing) && styles.passButtonDisabled]}>
        <TouchableOpacity style={styles.passButton} onPress={handlePassNext} disabled={!hasRevealedThisPlayer || isPassing || isHoldingReveal} activeOpacity={0.9}>
          <Ionicons name={isLastPlayer ? "play" : "swap-horizontal"} size={22} color="#fff" />
          <Text style={styles.passButtonText}>{isLastPlayer ? t.startDiscussion : `${t.passTo} ${players[(currentPlayerIndex + 1) % players.length]}`}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  const renderCluesPhase = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t.cluePhase}</Text>
      <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>
      {timeLimit && (
        <View style={styles.timerContainerSmall}>
          <Text style={[styles.timerTextSmall, timeLeft <= 5 && styles.timerWarning]}>{timeLeft}s</Text>
          <View style={styles.timerBarSmall}><View style={[styles.timerFillSmall, { width: `${Math.max(0, (timeLeft / timePerPerson) * 100)}%` }, timeLeft <= 5 && styles.timerFillWarning]} /></View>
        </View>
      )}
      <View style={styles.cluesList}>
        {clues.map((c, i) => (
          <View key={i} style={styles.clueItem}>
            <Text style={styles.cluePlayer}>{c.player}</Text>
            <Text style={styles.clueText}>"{c.clue}"</Text>
          </View>
        ))}
      </View>
      <Text style={styles.clueLabel}>{t.giveClue}</Text>
      <View style={styles.clueButtons}>
        {["Good", "Bad", "Weird", "Funny", "Smart"].map((clue) => (
          <TouchableOpacity key={clue} style={[styles.clueButton, pressedButton === clue && styles.clueButtonPressed]} onPress={() => submitClue(clue)} onPressIn={() => setPressedButton(clue)} onPressOut={() => setPressedButton(null)} activeOpacity={0.9}>
            <Text style={styles.clueButtonText}>{clue}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderInterrogation = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t.interrogation}</Text>
      <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, timeLeft <= 10 && styles.timerWarning]}>{timeLeft}s</Text>
        <View style={styles.timerBar}><View style={[styles.timerFill, { width: `${Math.max(0, (timeLeft / defaultTimedSeconds) * 100)}%` }, timeLeft <= 10 && styles.timerFillWarning]} /></View>
      </View>
      <Text style={styles.interrogationText}>{t.fireQuestions}</Text>
    </View>
  );

  const renderVoting = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t.voting}</Text>
      <Text style={styles.votingText}>{t.whoIsSpy}</Text>
      <Text style={styles.voterName}>{players[voterIndex]} {t.voterVotes}</Text>
      <View style={styles.votingGrid}>
        {players.map((player, index) => {
          if (index === voterIndex) return null;
          return (
            <TouchableOpacity key={index} style={[styles.voteButton, pressedButton === `vote${index}` && styles.voteButtonPressed]} onPress={() => voteForPlayer(index)} onPressIn={() => setPressedButton(`vote${index}`)} onPressOut={() => setPressedButton(null)} activeOpacity={0.9}>
              <Text style={styles.voteButtonText}>{player}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderResults = () => {
    const winner = getWinner();
    return (
      <View style={styles.phaseContainer}>
        <Text style={styles.phaseTitle}>{t.results}</Text>
        <View style={[styles.winnerCard, winner === "agents" ? styles.agentWinCard : styles.spyWinCard]}>
          <Text style={[styles.winnerText, winner === "agents" ? styles.agentWinText : styles.spyWinText]}>{winner === "agents" ? t.agentsWin : t.spiesWin}</Text>
        </View>
        <View style={styles.revealResultCard}>
          <Text style={styles.revealTitle}>{t.word}</Text>
          <Text style={styles.revealWord}>{secretWord}</Text>
          <Text style={styles.spiesTitle}>{t.hiddenRoles}</Text>
          {imposterIndices.map((idx) => (<Text key={idx} style={styles.spyName}>🕵️ {players[idx]}</Text>))}
        </View>
        <View style={styles.resultButtons}>
          <TouchableOpacity style={styles.resultButton} onPress={() => navigation.replace("CreateRoom", { language })} activeOpacity={0.9}><Text style={styles.resultButtonText}>{t.playAgain}</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.resultButton, styles.homeButton]} onPress={() => navigation.navigate("Home", { language })} activeOpacity={0.9}><Text style={styles.resultButtonText}>{t.home}</Text></TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isDarkMode && <LinearGradient colors={['#3EC9C1', '#1a7ac7']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none" />}
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? colors.background : '#3EC9C1'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {phase === "reveal" && renderRevealPhase()}
        {phase === "clues" && renderCluesPhase()}
        {phase === "interrogation" && renderInterrogation()}
        {phase === "voting" && renderVoting()}
        {phase === "results" && renderResults()}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => {
  const border = isDarkMode ? "#ffffff" : "#000000";
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1, padding: 20 },
    phaseContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40, paddingBottom: 100 },
    phaseTitle: { fontSize: 18, fontFamily: 'Orbitron_700Bold', color: colors.text, letterSpacing: 4, marginBottom: 20 },
    playerName: { fontSize: 30, fontFamily: 'Orbitron_700Bold', color: colors.text, marginBottom: 25 },
    cardSlot: { width: "100%", height: 220, alignItems: "center", justifyContent: "center", marginBottom: 20 },
    roleCard: { padding: 28, borderRadius: 20, alignItems: "center", width: "90%", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
    roleTitle: { fontSize: 13, marginBottom: 10, letterSpacing: 3, fontFamily: 'Orbitron_700Bold' },
    roleText: { fontSize: 26, fontFamily: 'Orbitron_700Bold', marginBottom: 12, letterSpacing: 2 },
    agentText: { color: "#00aa55" },
    spyText: { color: "#cc0000" },
    wordBox: { backgroundColor: "rgba(255,255,255,0.4)", padding: 18, borderRadius: 14, alignItems: "center", borderWidth: 2 },
    wordLabel: { fontSize: 13, marginBottom: 5, letterSpacing: 2, fontFamily: 'Orbitron_700Bold' },
    wordText: { fontSize: 30, fontFamily: 'Orbitron_900Black', letterSpacing: 2 },
    hintBox: { padding: 14, borderRadius: 12, marginTop: 10, borderWidth: 2, backgroundColor: "rgba(255,255,255,0.3)" },
    hintLabel: { fontFamily: 'Orbitron_700Bold', fontSize: 15 },
    revealButtonWrapper: { zIndex: 2, marginBottom: 20 },
    revealButton: { backgroundColor: colors.primary, width: 180, height: 180, borderRadius: 90, justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden", borderWidth: 2, borderColor: border },
    revealGlow: { position: "absolute", width: "100%", height: "100%", backgroundColor: colors.primary },
    revealText: { color: "#fff", fontFamily: 'Orbitron_700Bold', marginTop: 10, fontSize: 15, letterSpacing: 1, textAlign: "center" },
    passButtonWrapper: { position: "absolute", bottom: 30, left: 20, right: 20, borderRadius: 14, borderWidth: 2, borderColor: border, overflow: "hidden" },
    passButton: { paddingVertical: 16, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 10 },
    passButtonDisabled: { opacity: 0.5 },
    passButtonText: { color: "#fff", fontFamily: 'Orbitron_700Bold', fontSize: 16, letterSpacing: 1, flex: 1, textAlign: "center" },
    timerContainer: { alignItems: "center", marginBottom: 30 },
    timerText: { fontSize: 80, fontFamily: 'Orbitron_900Black', color: colors.text, marginBottom: 20 },
    timerWarning: { color: "#ff1a1a" },
    timerBar: { width: 250, height: 6, backgroundColor: isDarkMode ? "#333" : "#cccccc", borderRadius: 3, overflow: "hidden" },
    timerFill: { height: "100%", backgroundColor: colors.primary },
    timerFillWarning: { backgroundColor: "#ff1a1a" },
    timerContainerSmall: { width: "100%", marginBottom: 20, alignItems: "center" },
    timerTextSmall: { fontSize: 28, fontFamily: 'Orbitron_700Bold', color: colors.text, marginBottom: 10 },
    timerBarSmall: { width: "80%", height: 6, backgroundColor: isDarkMode ? "#333" : "#cccccc", borderRadius: 3, overflow: "hidden" },
    timerFillSmall: { height: "100%", backgroundColor: colors.primary },
    cluesList: { width: "100%", marginBottom: 25 },
    clueItem: { backgroundColor: colors.surface, padding: 16, borderRadius: 14, marginBottom: 10, borderWidth: 2, borderColor: border },
    cluePlayer: { color: colors.text, fontFamily: 'Orbitron_700Bold', marginBottom: 5, fontSize: 15 },
    clueText: { color: colors.text, fontSize: 20, fontStyle: "italic" },
    clueLabel: { color: colors.text, marginBottom: 20, fontSize: 16, letterSpacing: 2 },
    clueButtons: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
    clueButton: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 25, borderWidth: 2, borderColor: border },
    clueButtonPressed: { transform: [{ scale: 0.95 }] },
    clueButtonText: { color: "#fff", fontFamily: 'Orbitron_700Bold', fontSize: 16 },
    interrogationText: { color: colors.text, fontSize: 20, fontStyle: "italic" },
    votingText: { fontSize: 20, color: colors.text, marginBottom: 15 },
    voterName: { fontSize: 16, color: colors.text, marginBottom: 25 },
    votingGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
    voteButton: { backgroundColor: colors.surface, paddingVertical: 16, paddingHorizontal: 28, borderRadius: 14, borderWidth: 2, borderColor: border, minWidth: 120, alignItems: "center" },
    voteButtonPressed: { transform: [{ scale: 0.97 }], borderColor: colors.primary },
    voteButtonText: { color: colors.text, fontFamily: 'Orbitron_700Bold', fontSize: 18 },
    winnerCard: { padding: 30, borderRadius: 20, marginBottom: 25, borderWidth: 2 },
    agentWinCard: { backgroundColor: "#00ff88" + "15", borderColor: "#00ff88" },
    spyWinCard: { backgroundColor: "#ff1a1a" + "15", borderColor: "#ff1a1a" },
    winnerText: { fontSize: 26, fontFamily: 'Orbitron_900Black', textAlign: "center", letterSpacing: 3 },
    agentWinText: { color: "#00ff88" },
    spyWinText: { color: "#ff1a1a" },
    revealResultCard: { backgroundColor: colors.surface, padding: 30, borderRadius: 20, alignItems: "center", marginBottom: 25, borderWidth: 2, borderColor: border, width: "100%" },
    revealTitle: { color: colors.text, fontSize: 15, marginBottom: 10, letterSpacing: 2 },
    revealWord: { color: colors.text, fontSize: 36, fontFamily: 'Orbitron_700Bold', marginBottom: 20 },
    spiesTitle: { color: colors.text, fontSize: 15, marginBottom: 10, letterSpacing: 2 },
    spyName: { color: "#ff1a1a", fontSize: 20, fontFamily: 'Orbitron_700Bold' },
    resultButtons: { flexDirection: "row", gap: 15 },
    resultButton: { backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 28, borderRadius: 14, borderWidth: 2, borderColor: border },
    homeButton: { backgroundColor: colors.surface, borderWidth: 2, borderColor: border },
    resultButtonText: { color: colors.text, fontFamily: 'Orbitron_700Bold', fontSize: 16, letterSpacing: 2 },
  });
};