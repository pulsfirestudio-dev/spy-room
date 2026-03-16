// screens/LobbyScreen.js — Multiplayer lobby (host & guest)
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Share, Alert, ActivityIndicator,
  StatusBar, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { listenToRoom, startGame, leaveRoom } from '../utils/RoomManager';
import { CATEGORY_NAMES } from '../utils/wordCategories';

const T = {
  en: {
    title: 'LOBBY',
    waiting: 'Waiting for players to join...',
    waitingHost: 'Waiting for host to start the game...',
    players: 'PLAYERS',
    start: 'START GAME',
    leave: 'LEAVE',
    share: 'SHARE CODE',
    host: 'HOST',
    you: 'YOU',
    config: 'GAME SETTINGS',
    category: 'CATEGORY',
    spies: 'NUMBER OF SPIES',
    timeLimit: 'TIME LIMIT',
    timePer: 'SECONDS PER PLAYER',
    videoCall: 'VIDEO CALL',
    clueAssist: 'CLUE ASSIST (hint word)',
    minPlayers: 'Need at least 3 players to start.',
    shareMsg: (code) => `Join my Spy Room game! 🕵️\nRoom code: ${code}\nDownload Spy Room to play!`,
  },
  lt: {
    title: 'LOBIJUS',
    waiting: 'Laukiama žaidėjų...',
    waitingHost: 'Laukiama, kol šeimininkas pradės žaidimą...',
    players: 'ŽAIDĖJAI',
    start: 'PRADĖTI ŽAIDIMĄ',
    leave: 'IŠEITI',
    share: 'DALINTIS KODU',
    host: 'ŠEIMININKAS',
    you: 'TU',
    config: 'ŽAIDIMO NUSTATYMAI',
    category: 'KATEGORIJA',
    spies: 'ŠNIPŲ SKAIČIUS',
    timeLimit: 'LAIKO LIMITAS',
    timePer: 'SEKUNDĖS ŽAIDĖJUI',
    videoCall: 'VAIZDO SKAMBUTIS',
    clueAssist: 'UŽUOMINOS PAGALBA',
    minPlayers: 'Reikia bent 3 žaidėjų.',
    shareMsg: (code) => `Prisijunk prie mano Spy Room žaidimo! 🕵️\nKodo: ${code}\nParsisiųsk Spy Room!`,
  },
};

export default function LobbyScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const { roomCode, playerId, playerName, language, isHost } = route.params || {};
  const t = T[language] || T.en;

  const [roomData, setRoomData] = useState(null);
  const [starting, setStarting] = useState(false);

  // Game config — host only
  const [categoryId, setCategoryId] = useState('Random');
  const [numSpies, setNumSpies] = useState(1);
  const [timeLimitOn, setTimeLimitOn] = useState(false);
  const [timePerPerson, setTimePerPerson] = useState(30);
  const [videoCall, setVideoCall] = useState(true);
  const [clueAssist, setClueAssist] = useState(false);

  const hasNavigated = useRef(false);
  const styles = getStyles(colors, isDarkMode);

  useEffect(() => {
    if (!roomCode) return;
    const unsub = listenToRoom(roomCode, (data) => {
      if (!data) return;
      setRoomData(data);
      if (data.status === 'game' && !hasNavigated.current) {
        hasNavigated.current = true;
        navigation.replace('MultiplayerGame', { roomCode, playerId, playerName, language });
      }
    });
    return () => unsub();
  }, [roomCode]);

  const handleShare = async () => {
    try {
      await Share.share({ message: t.shareMsg(roomCode) });
    } catch (_) {}
  };

  const handleStart = async () => {
    const players = roomData?.players || {};
    if (Object.keys(players).length < 3) { Alert.alert('', t.minPlayers); return; }
    try {
      setStarting(true);
      await startGame(roomCode, {
        categoryId,
        numImposters: numSpies,
        timeLimit: timeLimitOn,
        timePerPerson,
        clueAssist,
        videoCallEnabled: videoCall,
      });
    } catch (e) {
      Alert.alert('Error', e.message);
      setStarting(false);
    }
  };

  const handleLeave = async () => {
    await leaveRoom(roomCode, playerId);
    navigation.navigate('Home');
  };

  const players = roomData
    ? Object.entries(roomData.players || {}).sort((a, b) => a[1].joinedAt - b[1].joinedAt)
    : [];
  const playerCount = players.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLeave} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#fff' : colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Room Code Card */}
        <View style={[styles.codeCard, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
          <Text style={styles.codeLabel}>ROOM CODE</Text>
          <Text style={styles.codeText}>{roomCode}</Text>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Ionicons name="share-social-outline" size={17} color={isDarkMode ? '#000' : '#fff'} />
            <Text style={styles.shareBtnText}>{t.share}</Text>
          </TouchableOpacity>
        </View>

        {/* Player List */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.players} ({playerCount})</Text>
          <View style={styles.playerList}>
            {!roomData && <ActivityIndicator color={colors.primary} />}
            {players.map(([id, p]) => (
              <View key={id} style={styles.playerRow}>
                <View style={[styles.playerDot, { backgroundColor: p.isHost ? colors.primary : (isDarkMode ? '#444' : '#ccc') }]} />
                <Text style={styles.playerName}>{p.name}</Text>
                <View style={styles.badges}>
                  {p.isHost && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{t.host}</Text>
                    </View>
                  )}
                  {id === playerId && (
                    <View style={[styles.badge, { backgroundColor: isDarkMode ? '#333' : '#e5e5e5' }]}>
                      <Text style={[styles.badgeText, { color: isDarkMode ? '#fff' : '#000' }]}>{t.you}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Game Config — host only */}
        {isHost && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t.config}</Text>

            {/* Category */}
            <Text style={styles.configLabel}>{t.category}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {CATEGORY_NAMES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, categoryId === cat && styles.catChipActive]}
                  onPress={() => setCategoryId(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.catChipText, categoryId === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Spies stepper */}
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>{t.spies}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity style={styles.stepBtn} onPress={() => setNumSpies(s => Math.max(1, s - 1))}>
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepValue}>{numSpies}</Text>
                <TouchableOpacity style={styles.stepBtn} onPress={() => setNumSpies(s => Math.min(3, s + 1))}>
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Time limit toggle */}
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>{t.timeLimit}</Text>
              <Switch
                value={timeLimitOn}
                onValueChange={setTimeLimitOn}
                trackColor={{ false: isDarkMode ? '#333' : '#ccc', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>

            {timeLimitOn && (
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>{t.timePer}</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => setTimePerPerson(s => Math.max(10, s - 5))}>
                    <Text style={styles.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepValue}>{timePerPerson}s</Text>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => setTimePerPerson(s => Math.min(120, s + 5))}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Video call toggle */}
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>{t.videoCall}</Text>
              <Switch
                value={videoCall}
                onValueChange={setVideoCall}
                trackColor={{ false: isDarkMode ? '#333' : '#ccc', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>

            {/* Clue assist toggle */}
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>{t.clueAssist}</Text>
              <Switch
                value={clueAssist}
                onValueChange={setClueAssist}
                trackColor={{ false: isDarkMode ? '#333' : '#ccc', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        )}

        {!isHost && (
          <Text style={styles.waitingText}>{t.waitingHost}</Text>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {isHost && (
            <TouchableOpacity
              style={[styles.startBtn, (playerCount < 3 || starting) && { opacity: 0.45 }]}
              onPress={handleStart}
              disabled={playerCount < 3 || starting}
              activeOpacity={0.85}
            >
              {starting
                ? <ActivityIndicator color={isDarkMode ? '#000' : '#fff'} />
                : (
                  <>
                    <Ionicons name="play" size={20} color={isDarkMode ? '#000' : '#fff'} />
                    <Text style={styles.startBtnText}>{t.start}</Text>
                  </>
                )
              }
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave} activeOpacity={0.8}>
            <Ionicons name="exit-outline" size={18} color="#ff1a1a" />
            <Text style={styles.leaveBtnText}>{t.leave}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.text,
  },
  title: { fontSize: 22, fontWeight: '900', letterSpacing: 3, color: isDarkMode ? '#fff' : '#000' },
  codeCard: {
    backgroundColor: colors.surface, borderRadius: 18, padding: 20,
    alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', marginBottom: 24, gap: 8,
  },
  codeLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, color: isDarkMode ? '#aaa' : colors.text },
  codeText: { fontSize: 40, fontWeight: '900', letterSpacing: 10, color: isDarkMode ? '#fff' : '#000' },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: isDarkMode ? '#fff' : '#000',
    paddingVertical: 9, paddingHorizontal: 20, borderRadius: 20, marginTop: 4,
  },
  shareBtnText: { color: isDarkMode ? '#000' : '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  section: { marginBottom: 22 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, color: isDarkMode ? '#aaa' : colors.text, marginBottom: 12 },
  playerList: { gap: 8 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 12,
    padding: 14, borderWidth: 1.5, borderColor: isDarkMode ? '#333' : '#ddd', gap: 10,
  },
  playerDot: { width: 10, height: 10, borderRadius: 5 },
  playerName: { flex: 1, fontSize: 16, fontWeight: '700', color: isDarkMode ? '#fff' : '#000' },
  badges: { flexDirection: 'row', gap: 6 },
  badge: { backgroundColor: colors.primary, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  configLabel: {
    fontSize: 11, fontWeight: '800', letterSpacing: 2,
    color: isDarkMode ? '#aaa' : colors.text, marginBottom: 6,
  },
  catChip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: colors.surface, borderWidth: 1.5,
    borderColor: isDarkMode ? '#444' : '#ccc', marginRight: 8,
  },
  catChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catChipText: { fontSize: 13, fontWeight: '700', color: isDarkMode ? '#aaa' : colors.text },
  catChipTextActive: { color: '#fff' },
  configRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10, backgroundColor: colors.surface,
    padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: isDarkMode ? '#333' : '#ddd',
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  stepBtnText: { color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 22 },
  stepValue: {
    fontSize: 18, fontWeight: '800', color: isDarkMode ? '#fff' : '#000',
    minWidth: 40, textAlign: 'center',
  },
  waitingText: {
    textAlign: 'center', color: isDarkMode ? '#aaa' : colors.text,
    fontSize: 14, fontStyle: 'italic', marginBottom: 24,
  },
  actions: { gap: 12 },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: isDarkMode ? '#fff' : '#000',
    paddingVertical: 18, borderRadius: 14, borderWidth: 2,
    borderColor: isDarkMode ? '#fff' : '#000',
  },
  startBtnText: { color: isDarkMode ? '#000' : '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 2 },
  leaveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 15, borderRadius: 14, borderWidth: 2, borderColor: '#ff1a1a',
  },
  leaveBtnText: { color: '#ff1a1a', fontSize: 15, fontWeight: '700' },
});
