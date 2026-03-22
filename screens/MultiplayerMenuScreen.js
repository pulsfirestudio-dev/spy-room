// screens/MultiplayerMenuScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { createRoom } from '../utils/RoomManager';
import { LinearGradient } from 'expo-linear-gradient';

const T = {
  en: {
    title: 'MULTIPLAYER',
    subtitle: 'Play with friends online',
    yourName: 'YOUR NAME',
    namePlaceholder: 'Enter your name...',
    hostGame: 'HOST A GAME',
    joinGame: 'JOIN A GAME',
    hostDesc: 'Create a room & invite friends',
    joinDesc: 'Enter a code to join a room',
    nameRequired: 'Please enter your name',
    back: 'BACK',
  },
  lt: {
    title: 'DAUGIAŽAIDIS',
    subtitle: 'Žaisk su draugais internetu',
    yourName: 'JŪSŲ VARDAS',
    namePlaceholder: 'Įveskite vardą...',
    hostGame: 'SUKURTI KAMBARĮ',
    joinGame: 'PRISIJUNGTI',
    hostDesc: 'Sukurk kambarį ir pakvieski draugus',
    joinDesc: 'Įvesk kodą prisijungimui',
    nameRequired: 'Įveskite vardą',
    back: 'ATGAL',
  },
};

export default function MultiplayerMenuScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const lang = route.params?.language || 'en';
  const t = T[lang] || T.en;

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const styles = getStyles(colors, isDarkMode);

  const handleHost = async () => {
    if (!name.trim()) { Alert.alert('', t.nameRequired); return; }
    try {
      setLoading(true);
      const { roomCode, playerId } = await createRoom(name.trim(), lang);
      navigation.replace('Lobby', {
        roomCode, playerId, playerName: name.trim(), language: lang, isHost: true,
      });
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not create room. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    if (!name.trim()) { Alert.alert('', t.nameRequired); return; }
    navigation.navigate('JoinRoom', { language: lang, playerName: name.trim() });
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isDarkMode && <LinearGradient colors={['#3EC9C1', '#1a7ac7']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none" />}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? colors.background : '#3EC9C1'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#fff' : colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{t.title}</Text>
            <View style={{ width: 44 }} />
          </View>

          <Text style={styles.subtitle}>{t.subtitle}</Text>

          <View style={styles.nameSection}>
            <Text style={styles.label}>{t.yourName}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.namePlaceholder}
              placeholderTextColor={isDarkMode ? '#555' : 'rgba(0,0,0,0.4)'}
              value={name}
              onChangeText={setName}
              maxLength={15}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.cards}>
            {/* HOST */}
            <TouchableOpacity
              style={[styles.card, styles.cardPrimary]}
              onPress={handleHost}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <>
                  <Ionicons name="wifi" size={36} color="#fff" />
                  <Text style={styles.cardTitle}>{t.hostGame}</Text>
                  <Text style={styles.cardDesc}>{t.hostDesc}</Text>
                </>
              )}
            </TouchableOpacity>

            {/* JOIN */}
            <TouchableOpacity
              style={[styles.card, styles.cardSecondary]}
              onPress={handleJoin}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Ionicons name="enter-outline" size={36} color={isDarkMode ? '#fff' : '#000'} />
              <Text style={[styles.cardTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{t.joinGame}</Text>
              <Text style={[styles.cardDesc, { color: isDarkMode ? '#aaa' : colors.text }]}>{t.joinDesc}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.text,
  },
  title: { fontSize: 20, fontFamily: 'Special_Elite_400Regular', color: isDarkMode ? '#fff' : '#000', letterSpacing: 3 },
  subtitle: { textAlign: 'center', color: isDarkMode ? '#aaa' : colors.text, fontSize: 13, marginBottom: 32, fontFamily: 'Special_Elite_400Regular' },
  nameSection: { marginBottom: 28 },
  label: { fontSize: 12, fontFamily: 'Special_Elite_400Regular', letterSpacing: 2, color: isDarkMode ? '#aaa' : colors.text, marginBottom: 8 },
  input: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 16,
    borderWidth: 2, borderColor: isDarkMode ? '#fff' : '#000',
    fontSize: 16, color: isDarkMode ? '#fff' : '#000', fontFamily: 'Special_Elite_400Regular',
  },
  cards: { gap: 14 },
  card: { borderRadius: 18, padding: 28, alignItems: 'center', gap: 10, borderWidth: 2 },
  cardPrimary: { backgroundColor: colors.primary, borderColor: isDarkMode ? colors.primary : '#000000' },
  cardSecondary: { backgroundColor: colors.surface, borderColor: isDarkMode ? '#fff' : '#000' },
  cardTitle: { fontSize: 16, fontFamily: 'Special_Elite_400Regular', letterSpacing: 2, color: '#fff' },
  cardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontFamily: 'Special_Elite_400Regular' },
});
