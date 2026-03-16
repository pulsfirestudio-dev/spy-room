// screens/MultiplayerGameScreen.js — Each player's view during multiplayer game
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, TextInput, Linking, Alert, ActivityIndicator,
  StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import {
  listenToRoom, markReady, advancePhase,
  submitClue, submitVote, leaveRoom,
} from '../utils/RoomManager';

const T = {
  en: {
    yourRole: 'YOUR ROLE',
    spy: 'SPY',
    agent: 'AGENT',
    spyDesc: "You're the spy! Listen to the clues and try to blend in without knowing the word.",
    agentDesc: 'You know the secret word. Give clues — but don\'t make it too obvious!',
    theWord: 'THE WORD',
    hint: 'HINT',
    seenIt: "I'VE SEEN MY ROLE",
    readyStatus: (n, total) => `${n} / ${total} players ready`,
    advanceClues: 'EVERYONE IS READY — START CLUES',
    clues: 'CLUE PHASE',
    cluesDesc: 'Give one word as your clue. Spies — blend in!',
    yourClue: 'YOUR CLUE',
    cluePlaceholder: 'One word...',
    submitClue: 'SUBMIT CLUE',
    cluesSent: (n, total) => `${n} / ${total} clues submitted`,
    allClues: 'ALL CLUES',
    advanceDiscuss: 'ADVANCE TO DISCUSSION',
    discussion: 'DISCUSSION',
    discussionDesc: 'Discuss the clues. Who is the spy?',
    videoCall: 'JOIN VIDEO CALL',
    advanceVote: 'START VOTING',
    voting: 'VOTING',
    votingDesc: 'Tap the player you think is the spy.',
    votesSent: (n, total) => `${n} / ${total} votes cast`,
    alreadyVoted: 'You already voted!',
    advanceReveal: 'REVEAL RESULTS',
    reveal: 'RESULTS',
    spyCaught: 'SPY CAUGHT!',
    spyEscaped: 'SPY ESCAPED!',
    theWordWas: 'THE WORD WAS',
    votes: 'VOTES',
    home: 'HOME',
    leave: 'LEAVE',
    hostOnly: 'Host only',
  },
  lt: {
    yourRole: 'JŪSŲ VAIDMUO',
    spy: 'ŠNIPAS',
    agent: 'AGENTAS',
    spyDesc: 'Jūs esate šnipas! Klausykite užuominų ir bandykite neišsiskirti.',
    agentDesc: 'Jūs žinote slaptą žodį. Duokite užuominas — bet ne per akivaizdžiai!',
    theWord: 'ŽODIS',
    hint: 'UŽUOMINA',
    seenIt: 'MAČIAU SAVO VAIDMENĮ',
    readyStatus: (n, total) => `${n} / ${total} žaidėjų pasiruošę`,
    advanceClues: 'VISI PASIRUOŠĘ — PRADĖTI',
    clues: 'UŽUOMINŲ FAZĖ',
    cluesDesc: 'Pateikite vieną žodį kaip užuominą.',
    yourClue: 'JŪSŲ UŽUOMINA',
    cluePlaceholder: 'Vienas žodis...',
    submitClue: 'PATEIKTI',
    cluesSent: (n, total) => `${n} / ${total} užuominų pateikta`,
    allClues: 'VISOS UŽUOMINOS',
    advanceDiscuss: 'PEREITI PRIE DISKUSIJOS',
    discussion: 'DISKUSIJA',
    discussionDesc: 'Aptarkite užuominas. Kas šnipas?',
    videoCall: 'PRISIJUNGTI PRIE VAIZDO',
    advanceVote: 'PRADĖTI BALSAVIMĄ',
    voting: 'BALSAVIMAS',
    votingDesc: 'Paspauskite žaidėją, kurį manote esant šnipu.',
    votesSent: (n, total) => `${n} / ${total} balsų atiduota`,
    alreadyVoted: 'Jau balsavote!',
    advanceReveal: 'ATSKLEISTI REZULTATUS',
    reveal: 'REZULTATAI',
    spyCaught: 'ŠNIPAS SUGAUTAS!',
    spyEscaped: 'ŠNIPAS PABĖGO!',
    theWordWas: 'ŽODIS BUVO',
    votes: 'BALSAI',
    home: 'PRADŽIA',
    leave: 'IŠEITI',
    hostOnly: 'Tik šeimininkas',
  },
};

export default function MultiplayerGameScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const { roomCode, playerId, playerName, language } = route.params || {};
  const t = T[language] || T.en;

  const [roomData, setRoomData] = useState(null);
  const [myClue, setMyClue] = useState('');
  const [myVote, setMyVote] = useState(null);
  const styles = getStyles(colors, isDarkMode);

  useEffect(() => {
    if (!roomCode) return;
    const unsub = listenToRoom(roomCode, setRoomData);
    return () => unsub();
  }, [roomCode]);

  const handleLeave = async () => {
    await leaveRoom(roomCode, playerId);
    navigation.navigate('Home');
  };

  // ─── Loading ───────────────────────────────────────────────────────
  if (!roomData || !roomData.gameData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} size="large" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  const { gameData, players } = roomData;
  const isSpy = gameData.imposterIds?.includes(playerId);
  const isHost = players?.[playerId]?.isHost;
  const playerOrder = gameData.playerOrder || Object.keys(players || {});
  const totalPlayers = playerOrder.length;

  const openVideoCall = () => {
    Linking.openURL(`https://meet.jit.si/SpyRoom-${roomCode}`).catch(() =>
      Alert.alert('Could not open video call')
    );
  };

  // ─── Shared header component ───────────────────────────────────────
  const Header = ({ label }) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleLeave} style={styles.closeBtn}>
        <Ionicons name="close" size={20} color={isDarkMode ? '#fff' : colors.text} />
      </TouchableOpacity>
      <Text style={styles.phaseLabel}>{label}</Text>
      <View style={{ width: 44 }} />
    </View>
  );

  // ─── Host advance button ───────────────────────────────────────────
  const HostBtn = ({ label, onPress }) => isHost ? (
    <TouchableOpacity style={styles.hostBtn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.hostBtnText}>{label}</Text>
      <Text style={styles.hostOnly}>{t.hostOnly}</Text>
    </TouchableOpacity>
  ) : null;

  // ─── ROLES PHASE ──────────────────────────────────────────────────
  if (gameData.phase === 'roles') {
    const readyPlayers = gameData.readyPlayers || [];
    const iAmReady = readyPlayers.includes(playerId);
    const allReady = readyPlayers.length >= totalPlayers;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <ScrollView contentContainerStyle={styles.content}>
          <Header label={t.yourRole} />

          <View style={[styles.roleCard, { borderColor: isSpy ? '#ff1a1a' : colors.primary }]}>
            <Text style={[styles.roleName, { color: isSpy ? '#ff1a1a' : colors.primary }]}>
              {isSpy ? t.spy : t.agent}
            </Text>
            <Text style={styles.roleDesc}>{isSpy ? t.spyDesc : t.agentDesc}</Text>
          </View>

          <View style={styles.wordCard}>
            <Text style={styles.wordLabel}>{t.theWord}</Text>
            {isSpy ? (
              <Text style={[styles.wordText, { color: '#ff1a1a', letterSpacing: 10 }]}>???</Text>
            ) : (
              <>
                <Text style={styles.wordText}>{gameData.secretWord}</Text>
                {gameData.clueAssist && gameData.hintWord ? (
                  <Text style={styles.hintText}>{t.hint}: {gameData.hintWord}</Text>
                ) : null}
              </>
            )}
          </View>

          <Text style={styles.progressText}>{t.readyStatus(readyPlayers.length, totalPlayers)}</Text>

          {!iAmReady && (
            <TouchableOpacity style={styles.primaryBtn} onPress={() => markReady(roomCode, playerId)} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle" size={20} color={isDarkMode ? '#000' : '#fff'} />
              <Text style={styles.primaryBtnText}>{t.seenIt}</Text>
            </TouchableOpacity>
          )}

          {iAmReady && !allReady && (
            <View style={styles.waitingBadge}>
              <Ionicons name="time-outline" size={18} color={isDarkMode ? '#aaa' : colors.text} />
              <Text style={styles.waitingBadgeText}>{t.readyStatus(readyPlayers.length, totalPlayers)}</Text>
            </View>
          )}

          {allReady && isHost && (
            <HostBtn label={t.advanceClues} onPress={() => advancePhase(roomCode, 'clues')} />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── CLUES PHASE ──────────────────────────────────────────────────
  if (gameData.phase === 'clues') {
    const clues = gameData.clues || {};
    const clueCount = Object.keys(clues).length;
    const mySubmittedClue = clues[playerId];

    const handleSubmit = async () => {
      if (!myClue.trim()) return;
      await submitClue(roomCode, playerId, myClue.trim());
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Header label={t.clues} />
            <Text style={styles.phaseDesc}>{t.cluesDesc}</Text>
            <Text style={styles.progressText}>{t.cluesSent(clueCount, totalPlayers)}</Text>

            {/* My clue input */}
            {!mySubmittedClue ? (
              <View style={{ marginBottom: 20, gap: 10 }}>
                <Text style={styles.inputLabel}>{t.yourClue}</Text>
                <TextInput
                  style={styles.clueInput}
                  placeholder={t.cluePlaceholder}
                  placeholderTextColor={isDarkMode ? '#555' : '#aaa'}
                  value={myClue}
                  onChangeText={setMyClue}
                  maxLength={20}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={[styles.primaryBtn, !myClue.trim() && { opacity: 0.4 }]}
                  onPress={handleSubmit}
                  disabled={!myClue.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>{t.submitClue}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.submittedBadge}>
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                <Text style={styles.submittedText}>"{mySubmittedClue}"</Text>
              </View>
            )}

            {/* All submitted clues */}
            {clueCount > 0 && (
              <View style={styles.listCard}>
                <Text style={styles.listCardTitle}>{t.allClues}</Text>
                {Object.entries(clues).map(([pid, clue]) => (
                  <View key={pid} style={styles.listRow}>
                    <Text style={styles.listRowLeft}>{players?.[pid]?.name || 'Player'}</Text>
                    <Text style={styles.listRowRight}>{clue}</Text>
                  </View>
                ))}
              </View>
            )}

            <HostBtn label={t.advanceDiscuss} onPress={() => advancePhase(roomCode, 'discussion')} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ─── DISCUSSION PHASE ─────────────────────────────────────────────
  if (gameData.phase === 'discussion') {
    const clues = gameData.clues || {};

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <ScrollView contentContainerStyle={styles.content}>
          <Header label={t.discussion} />
          <Text style={styles.phaseDesc}>{t.discussionDesc}</Text>

          {/* Clues recap */}
          {Object.keys(clues).length > 0 && (
            <View style={styles.listCard}>
              <Text style={styles.listCardTitle}>{t.allClues}</Text>
              {Object.entries(clues).map(([pid, clue]) => (
                <View key={pid} style={styles.listRow}>
                  <Text style={styles.listRowLeft}>{players?.[pid]?.name || 'Player'}</Text>
                  <Text style={styles.listRowRight}>{clue}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Video call button */}
          {gameData.videoCallEnabled && (
            <TouchableOpacity style={styles.videoBtn} onPress={openVideoCall} activeOpacity={0.85}>
              <Ionicons name="videocam" size={22} color="#fff" />
              <Text style={styles.videoBtnText}>{t.videoCall}</Text>
            </TouchableOpacity>
          )}

          <HostBtn label={t.advanceVote} onPress={() => advancePhase(roomCode, 'voting')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── VOTING PHASE ─────────────────────────────────────────────────
  if (gameData.phase === 'voting') {
    const votes = gameData.votes || {};
    const voteCount = Object.keys(votes).length;
    const myVoteId = votes[playerId] || myVote;

    const voteCounts = {};
    Object.values(votes).forEach(id => { voteCounts[id] = (voteCounts[id] || 0) + 1; });

    const handleVote = async (targetId) => {
      if (myVoteId) { Alert.alert('', t.alreadyVoted); return; }
      setMyVote(targetId);
      await submitVote(roomCode, playerId, targetId);
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <ScrollView contentContainerStyle={styles.content}>
          <Header label={t.voting} />
          <Text style={styles.phaseDesc}>{t.votingDesc}</Text>
          <Text style={styles.progressText}>{t.votesSent(voteCount, totalPlayers)}</Text>

          <View style={{ gap: 10, marginBottom: 20 }}>
            {playerOrder.map(pid => {
              const p = players?.[pid];
              if (!p) return null;
              const isMe = pid === playerId;
              const iVotedFor = myVoteId === pid;
              const numVotes = voteCounts[pid] || 0;
              return (
                <TouchableOpacity
                  key={pid}
                  style={[
                    styles.voteCard,
                    iVotedFor && styles.voteCardActive,
                    isMe && { opacity: 0.35 },
                  ]}
                  onPress={() => !isMe && handleVote(pid)}
                  disabled={isMe || !!myVoteId}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.voteName, iVotedFor && { color: '#fff' }]}>{p.name}</Text>
                  {numVotes > 0 && (
                    <View style={styles.votePill}>
                      <Text style={styles.votePillText}>{numVotes}</Text>
                    </View>
                  )}
                  {iVotedFor && <Ionicons name="checkmark-circle" size={20} color="#fff" />}
                </TouchableOpacity>
              );
            })}
          </View>

          <HostBtn label={t.advanceReveal} onPress={() => advancePhase(roomCode, 'reveal')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── REVEAL PHASE ─────────────────────────────────────────────────
  if (gameData.phase === 'reveal') {
    const votes = gameData.votes || {};
    const voteCounts = {};
    Object.values(votes).forEach(id => { voteCounts[id] = (voteCounts[id] || 0) + 1; });
    const mostVotedId = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const spyIds = gameData.imposterIds || [];
    const spyCaught = spyIds.includes(mostVotedId);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <ScrollView contentContainerStyle={styles.content}>
          <Header label={t.reveal} />

          <Text style={[styles.outcome, { color: spyCaught ? colors.primary : '#ff1a1a' }]}>
            {spyCaught ? t.spyCaught : t.spyEscaped}
          </Text>

          {/* Spy reveal */}
          {spyIds.map(sid => (
            <View key={sid} style={styles.spyCard}>
              <Text style={styles.spyName}>{players?.[sid]?.name || 'Spy'}</Text>
              <Text style={styles.spyRole}>SPY</Text>
            </View>
          ))}

          {/* Word reveal */}
          <View style={styles.wordCard}>
            <Text style={styles.wordLabel}>{t.theWordWas}</Text>
            <Text style={styles.wordText}>{gameData.secretWord}</Text>
          </View>

          {/* Vote summary */}
          <View style={styles.listCard}>
            <Text style={styles.listCardTitle}>{t.votes}</Text>
            {playerOrder.map(pid => {
              const p = players?.[pid];
              const n = voteCounts[pid] || 0;
              if (!p) return null;
              return (
                <View key={pid} style={styles.listRow}>
                  <Text style={styles.listRowLeft}>{p.name}</Text>
                  <Text style={styles.listRowRight}>{n} vote{n !== 1 ? 's' : ''}</Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Home')} activeOpacity={0.85}>
            <Ionicons name="home-outline" size={20} color={isDarkMode ? '#000' : '#fff'} />
            <Text style={styles.primaryBtnText}>{t.home}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" style={{ flex: 1 }} />
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 24,
  },
  closeBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.text,
  },
  phaseLabel: { fontSize: 18, fontWeight: '900', letterSpacing: 3, color: isDarkMode ? '#fff' : '#000' },
  phaseDesc: { fontSize: 14, color: isDarkMode ? '#aaa' : colors.text, textAlign: 'center', marginBottom: 18 },
  progressText: {
    textAlign: 'center', fontSize: 13,
    color: isDarkMode ? '#aaa' : colors.text, marginBottom: 18, fontStyle: 'italic',
  },
  roleCard: {
    backgroundColor: colors.surface, borderRadius: 18, padding: 24,
    alignItems: 'center', borderWidth: 3, marginBottom: 16, gap: 12,
  },
  roleName: { fontSize: 38, fontWeight: '900', letterSpacing: 4 },
  roleDesc: { fontSize: 14, color: isDarkMode ? '#aaa' : colors.text, textAlign: 'center', lineHeight: 22 },
  wordCard: {
    backgroundColor: colors.surface, borderRadius: 18, padding: 20,
    alignItems: 'center', marginBottom: 20,
    borderWidth: 2, borderColor: isDarkMode ? '#333' : '#ddd', gap: 8,
  },
  wordLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, color: isDarkMode ? '#aaa' : colors.text },
  wordText: { fontSize: 32, fontWeight: '900', color: isDarkMode ? '#fff' : '#000', letterSpacing: 2 },
  hintText: { fontSize: 14, color: isDarkMode ? '#aaa' : colors.text, fontStyle: 'italic' },
  waitingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    justifyContent: 'center', paddingVertical: 14,
  },
  waitingBadgeText: { color: isDarkMode ? '#aaa' : colors.text, fontSize: 14, fontStyle: 'italic' },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: isDarkMode ? '#fff' : '#000',
    paddingVertical: 17, borderRadius: 14,
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : '#000', marginTop: 10,
  },
  primaryBtnText: { color: isDarkMode ? '#000' : '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: isDarkMode ? '#aaa' : colors.text },
  clueInput: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 16,
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : '#000',
    fontSize: 20, color: isDarkMode ? '#fff' : '#000', fontWeight: '700',
  },
  submittedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderRadius: 12, padding: 14,
    marginBottom: 16, borderWidth: 1.5, borderColor: colors.primary,
  },
  submittedText: { color: isDarkMode ? '#fff' : '#000', fontSize: 16, fontWeight: '700', flex: 1 },
  listCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    marginBottom: 16, borderWidth: 1.5, borderColor: isDarkMode ? '#333' : '#ddd', gap: 8,
  },
  listCardTitle: {
    fontSize: 11, fontWeight: '800', letterSpacing: 3,
    color: isDarkMode ? '#aaa' : colors.text, marginBottom: 4,
  },
  listRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#222' : '#eee',
  },
  listRowLeft: { fontSize: 14, color: isDarkMode ? '#aaa' : colors.text, fontWeight: '600' },
  listRowRight: { fontSize: 15, fontWeight: '800', color: isDarkMode ? '#fff' : '#000' },
  videoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#0066ff', paddingVertical: 16, borderRadius: 14,
    marginBottom: 14, borderWidth: 2, borderColor: '#0044cc',
  },
  videoBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  hostBtn: {
    backgroundColor: 'transparent', paddingVertical: 14, borderRadius: 14,
    borderWidth: 2, borderColor: colors.primary, alignItems: 'center',
    marginTop: 10, gap: 4,
  },
  hostBtnText: { color: colors.primary, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  hostOnly: { fontSize: 11, color: isDarkMode ? '#555' : '#bbb', letterSpacing: 1 },
  voteCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 14,
    padding: 16, borderWidth: 2, borderColor: isDarkMode ? '#333' : '#ddd', gap: 10,
  },
  voteCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  voteName: { flex: 1, fontSize: 17, fontWeight: '700', color: isDarkMode ? '#fff' : '#000' },
  votePill: {
    backgroundColor: isDarkMode ? '#333' : '#e5e5e5',
    borderRadius: 10, paddingVertical: 2, paddingHorizontal: 8,
  },
  votePillText: { fontSize: 13, fontWeight: '800', color: isDarkMode ? '#fff' : '#000' },
  outcome: { fontSize: 30, fontWeight: '900', textAlign: 'center', marginBottom: 24, letterSpacing: 1 },
  spyCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 18,
    borderWidth: 3, borderColor: '#ff1a1a', marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  spyName: { fontSize: 22, fontWeight: '900', color: '#ff1a1a' },
  spyRole: { fontSize: 12, fontWeight: '800', letterSpacing: 3, color: '#ff1a1a' },
});
