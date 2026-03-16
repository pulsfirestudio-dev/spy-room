// screens/JoinRoomScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform,
  ActivityIndicator, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { joinRoom } from '../utils/RoomManager';

const T = {
  en: {
    title: 'JOIN ROOM',
    roomCode: 'ROOM CODE',
    enterCode: 'Enter 6-character code...',
    yourName: 'YOUR NAME',
    enterName: 'Enter your name...',
    join: 'JOIN GAME',
    back: 'BACK',
    noName: 'Please enter your name',
    codeLength: 'Code must be 6 characters',
  },
  lt: {
    title: 'PRISIJUNGTI',
    roomCode: 'KAMBARIO KODAS',
    enterCode: 'Įveskite 6 simbolių kodą...',
    yourName: 'JŪSŲ VARDAS',
    enterName: 'Įveskite vardą...',
    join: 'PRISIJUNGTI',
    back: 'ATGAL',
    noName: 'Įveskite vardą',
    codeLength: 'Kodas turi būti 6 simboliai',
  },
};

export default function JoinRoomScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const lang = route.params?.language || 'en';
  const t = T[lang] || T.en;

  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState(route.params?.playerName || '');
  const [loading, setLoading] = useState(false);
  const styles = getStyles(colors, isDarkMode);

  const handleJoin = async () => {
    if (!playerName.trim()) { Alert.alert('', t.noName); return; }
    if (roomCode.trim().length !== 6) { Alert.alert('', t.codeLength); return; }
    try {
      setLoading(true);
      const { roomCode: code, playerId, language: roomLang } = await joinRoom(roomCode.trim(), playerName.trim());
      navigation.replace('Lobby', {
        roomCode: code,
        playerId,
        playerName: playerName.trim(),
        language: roomLang || lang,
        isHost: false,
      });
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not join room. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#fff' : colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{t.title}</Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.roomCode}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.enterCode}
                placeholderTextColor={isDarkMode ? '#555' : '#aaa'}
                value={roomCode}
                onChangeText={text => setRoomCode(text.toUpperCase())}
                maxLength={6}
                autoCapitalize="characters"
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.yourName}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.enterName}
                placeholderTextColor={isDarkMode ? '#555' : '#aaa'}
                value={playerName}
                onChangeText={setPlayerName}
                maxLength={15}
                autoCapitalize="words"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.joinButton, loading && { opacity: 0.6 }]}
            onPress={handleJoin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={isDarkMode ? '#000' : '#fff'} />
              : (
                <>
                  <Ionicons name="enter" size={20} color={isDarkMode ? '#000' : '#fff'} />
                  <Text style={styles.joinButtonText}>{t.join}</Text>
                </>
              )
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.backButtonText}>{t.back}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 40,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.text,
  },
  title: { fontSize: 22, fontWeight: '900', color: isDarkMode ? '#fff' : '#000', letterSpacing: 2 },
  form: { gap: 24, marginBottom: 36 },
  inputGroup: { gap: 8 },
  label: { fontSize: 12, fontWeight: '800', color: isDarkMode ? '#aaa' : '#666', letterSpacing: 2 },
  input: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 18,
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : '#000',
    fontSize: 20, color: isDarkMode ? '#fff' : '#000', fontWeight: '700', letterSpacing: 4,
  },
  joinButton: {
    backgroundColor: isDarkMode ? '#fff' : '#000',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: 14, marginBottom: 14, gap: 10,
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : '#000',
  },
  joinButtonText: { color: isDarkMode ? '#000' : '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 2 },
  backButtonLarge: {
    backgroundColor: colors.surface, paddingVertical: 15,
    borderRadius: 14, alignItems: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#333' : '#ccc',
  },
  backButtonText: { color: isDarkMode ? '#aaa' : '#666', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
});
