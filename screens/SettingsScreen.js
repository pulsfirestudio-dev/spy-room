// screens/SettingsScreen.js
import React, { useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Switch, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { usePremium } from '../context/PremiumContext';

const translations = {
  en: {
    title: 'SETTINGS',
    appearance: 'APPEARANCE',
    theme: 'Dark Mode',
    themeSub: 'Switch between dark and light',
    audio: 'AUDIO',
    sound: 'Sound Effects',
    soundSub: 'Beeps, buzzer, spy sting',
    language: 'LANGUAGE',
    selectLanguage: 'App Language',
    back: 'BACK',
    premium: 'PREMIUM',
    premiumStatus: 'Premium Status',
    premiumActive: 'Premium Unlocked',
    premiumInactive: 'Unlock Premium',
    restorePurchases: 'Restore Purchases',
    restoreSub: 'Recover purchases on this device',
  },
  lt: {
    title: 'NUSTATYMAI',
    appearance: 'IŠVAIZDA',
    theme: 'Tamsus režimas',
    themeSub: 'Keisti tarp tamsaus ir šviesaus',
    audio: 'GARSAS',
    sound: 'Garso efektai',
    soundSub: 'Pyptelėjimai, sirena, šnipo skambutis',
    language: 'KALBA',
    selectLanguage: 'Programos kalba',
    back: 'ATGAL',
    premium: 'PREMIUM',
    premiumStatus: 'Premium būsena',
    premiumActive: 'Premium atrakinta',
    premiumInactive: 'Atrakinti Premium',
    restorePurchases: 'Atkurti pirkimus',
    restoreSub: 'Atkurti pirkimus šiame įrenginyje',
  },
};

export default function SettingsScreen({ navigation, route }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { soundEnabled, setSoundEnabled } = useSettings();
  const { isPremium, isLoading, restorePurchases } = usePremium();
  const lang = route.params?.language || 'en';
  const t = translations[lang];
  const styles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);
  const border = isDarkMode ? '#ffffff' : '#000000';
  const [restoreLoading, setRestoreLoading] = useState(false);

  const SettingRow = ({ label, subtitle, value, onValueChange, icon }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={isDarkMode ? '#fff' : '#000'} style={styles.rowIcon} />
        <View>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowSub}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: isDarkMode ? '#444' : '#ccc', true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );

  const NavRow = ({ label, subtitle, icon, onPress, rightContent }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={isDarkMode ? '#fff' : '#000'} style={styles.rowIcon} />
        <View>
          <Text style={styles.rowLabel}>{label}</Text>
          {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.rowRight}>
        {rightContent}
        <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#666' : '#999'} />
      </View>
    </TouchableOpacity>
  );

  const handleRestorePurchases = async () => {
    setRestoreLoading(true);
    const result = await restorePurchases();
    setRestoreLoading(false);
    Alert.alert(
      result.success ? 'Success' : 'Info',
      result.message
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#fff' : colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Appearance */}
        <Text style={styles.sectionTitle}>{t.appearance}</Text>
        <View style={[styles.card, { borderColor: border }]}>
          <SettingRow
            icon={isDarkMode ? 'moon' : 'sunny'}
            label={t.theme}
            subtitle={t.themeSub}
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
        </View>

        {/* Audio */}
        <Text style={styles.sectionTitle}>{t.audio}</Text>
        <View style={[styles.card, { borderColor: border }]}>
          <SettingRow
            icon="volume-high-outline"
            label={t.sound}
            subtitle={t.soundSub}
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />

        </View>

        {/* Language */}
        <Text style={styles.sectionTitle}>{t.language}</Text>
        <View style={[styles.card, { borderColor: border }]}>
          <NavRow
            icon="globe-outline"
            label={t.selectLanguage}
            onPress={() => navigation.navigate('SelectLanguage', { currentLang: lang })}
            rightContent={
              <Text style={styles.flagText}>{lang === 'lt' ? '🇱🇹' : '🇬🇧'}</Text>
            }
          />
        </View>

        {/* Premium */}
        <Text style={styles.sectionTitle}>{t.premium}</Text>
        <View style={[styles.card, { borderColor: border }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="star" size={22} color={isPremium ? colors.primary : isDarkMode ? '#888' : '#999'} style={styles.rowIcon} />
              <View>
                <Text style={styles.rowLabel}>{t.premiumStatus}</Text>
                <Text style={[
                  styles.rowSub,
                  { color: isPremium ? colors.primary : isDarkMode ? '#888' : '#999' }
                ]}>
                  {isPremium ? t.premiumActive : t.premiumInactive}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={[styles.row, restoreLoading && { opacity: 0.6 }]}
            onPress={handleRestorePurchases}
            disabled={restoreLoading}
            activeOpacity={0.8}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="download-outline" size={22} color={isDarkMode ? '#fff' : '#000'} style={styles.rowIcon} />
              <View>
                <Text style={styles.rowLabel}>{t.restorePurchases}</Text>
                <Text style={styles.rowSub}>{t.restoreSub}</Text>
              </View>
            </View>
            {restoreLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#666' : '#999'} />
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingTop: 36 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 32,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: isDarkMode ? colors.primary : colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isDarkMode ? '#fff' : colors.text,
  },
  title: {
    fontSize: 24, fontWeight: '900',
    color: isDarkMode ? '#fff' : '#000', letterSpacing: 3,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: '800', letterSpacing: 3,
    color: isDarkMode ? '#aaa' : '#666', marginBottom: 10, marginLeft: 4,
  },
  card: {
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 2, marginBottom: 28, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 16,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { marginRight: 14 },
  rowLabel: {
    fontSize: 18, fontWeight: '700',
    color: isDarkMode ? '#fff' : '#000',
  },
  rowSub: {
    fontSize: 14, color: isDarkMode ? '#888' : '#999',
    marginTop: 2,
  },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  divider: {
    height: 1, backgroundColor: isDarkMode ? '#333' : '#eee',
    marginHorizontal: 16,
  },
  flagText: { fontSize: 22 },
});