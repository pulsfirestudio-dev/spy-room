// screens/SettingsScreen.js
import React, { useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, ScrollView, Switch, ActivityIndicator, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { usePremium } from '../context/PremiumContext';
import { LinearGradient } from 'expo-linear-gradient';

const translations = {
  en: {
    title: 'SETTINGS',
    appearance: 'APPEARANCE',
    theme: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    themeSystem: 'System',
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
    legal: 'LEGAL',
    privacyPolicy: 'Privacy Policy',
    privacyPolicySub: 'How we handle your data',
    termsOfService: 'Terms of Service',
    termsOfServiceSub: 'Rules for using the app',
  },
  lt: {
    title: 'NUSTATYMAI',
    appearance: 'IŠVAIZDA',
    theme: 'Tema',
    themeDark: 'Tamsi',
    themeLight: 'Šviesi',
    themeSystem: 'Sistema',
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
    legal: 'TEISINĖ INFORMACIJA',
    privacyPolicy: 'Privatumo politika',
    privacyPolicySub: 'Kaip tvarkome jūsų duomenis',
    termsOfService: 'Naudojimo sąlygos',
    termsOfServiceSub: 'Programos naudojimo taisyklės',
  },
  es: {
    title: 'AJUSTES',
    appearance: 'APARIENCIA',
    theme: 'Tema',
    themeDark: 'Oscuro',
    themeLight: 'Claro',
    themeSystem: 'Sistema',
    audio: 'AUDIO',
    sound: 'Efectos de sonido',
    soundSub: 'Pitidos, zumbador, sonido de espía',
    language: 'IDIOMA',
    selectLanguage: 'Idioma de la app',
    back: 'ATRÁS',
    premium: 'PREMIUM',
    premiumStatus: 'Estado Premium',
    premiumActive: 'Premium Activado',
    premiumInactive: 'Desbloquear Premium',
    restorePurchases: 'Restaurar compras',
    restoreSub: 'Recuperar compras en este dispositivo',
    legal: 'LEGAL',
    privacyPolicy: 'Política de privacidad',
    privacyPolicySub: 'Cómo manejamos tus datos',
    termsOfService: 'Términos de servicio',
    termsOfServiceSub: 'Reglas para usar la app',
  },
  fr: {
    title: 'PARAMÈTRES',
    appearance: 'APPARENCE',
    theme: 'Thème',
    themeDark: 'Sombre',
    themeLight: 'Clair',
    themeSystem: 'Système',
    audio: 'AUDIO',
    sound: 'Effets sonores',
    soundSub: 'Bips, sonnerie, son d\'espion',
    language: 'LANGUE',
    selectLanguage: 'Langue de l\'app',
    back: 'RETOUR',
    premium: 'PREMIUM',
    premiumStatus: 'Statut Premium',
    premiumActive: 'Premium Activé',
    premiumInactive: 'Débloquer Premium',
    restorePurchases: 'Restaurer les achats',
    restoreSub: 'Récupérer les achats sur cet appareil',
    legal: 'LÉGAL',
    privacyPolicy: 'Politique de confidentialité',
    privacyPolicySub: 'Comment nous gérons vos données',
    termsOfService: 'Conditions d\'utilisation',
    termsOfServiceSub: 'Règles d\'utilisation de l\'app',
  },
  de: {
    title: 'EINSTELLUNGEN',
    appearance: 'DARSTELLUNG',
    theme: 'Thema',
    themeDark: 'Dunkel',
    themeLight: 'Hell',
    themeSystem: 'System',
    audio: 'AUDIO',
    sound: 'Soundeffekte',
    soundSub: 'Pieptöne, Buzzer, Spionton',
    language: 'SPRACHE',
    selectLanguage: 'App-Sprache',
    back: 'ZURÜCK',
    premium: 'PREMIUM',
    premiumStatus: 'Premium-Status',
    premiumActive: 'Premium freigeschaltet',
    premiumInactive: 'Premium freischalten',
    restorePurchases: 'Käufe wiederherstellen',
    restoreSub: 'Käufe auf diesem Gerät wiederherstellen',
    legal: 'RECHTLICHES',
    privacyPolicy: 'Datenschutzrichtlinie',
    privacyPolicySub: 'Wie wir deine Daten verwalten',
    termsOfService: 'Nutzungsbedingungen',
    termsOfServiceSub: 'Regeln für die App-Nutzung',
  },
  pl: {
    title: 'USTAWIENIA',
    appearance: 'WYGLĄD',
    theme: 'Motyw',
    themeDark: 'Ciemny',
    themeLight: 'Jasny',
    themeSystem: 'System',
    audio: 'DŹWIĘK',
    sound: 'Efekty dźwiękowe',
    soundSub: 'Sygnały, brzęczyk, dźwięk szpiega',
    language: 'JĘZYK',
    selectLanguage: 'Język aplikacji',
    back: 'WRÓĆ',
    premium: 'PREMIUM',
    premiumStatus: 'Status Premium',
    premiumActive: 'Premium odblokowane',
    premiumInactive: 'Odblokuj Premium',
    restorePurchases: 'Przywróć zakupy',
    restoreSub: 'Odzyskaj zakupy na tym urządzeniu',
    legal: 'PRAWNE',
    privacyPolicy: 'Polityka prywatności',
    privacyPolicySub: 'Jak obsługujemy Twoje dane',
    termsOfService: 'Warunki korzystania',
    termsOfServiceSub: 'Zasady korzystania z aplikacji',
  },
  pt: {
    title: 'CONFIGURAÇÕES',
    appearance: 'APARÊNCIA',
    theme: 'Tema',
    themeDark: 'Escuro',
    themeLight: 'Claro',
    themeSystem: 'Sistema',
    audio: 'ÁUDIO',
    sound: 'Efeitos sonoros',
    soundSub: 'Bipes, buzzer, som de espião',
    language: 'IDIOMA',
    selectLanguage: 'Idioma do app',
    back: 'VOLTAR',
    premium: 'PREMIUM',
    premiumStatus: 'Status Premium',
    premiumActive: 'Premium Ativado',
    premiumInactive: 'Desbloquear Premium',
    restorePurchases: 'Restaurar compras',
    restoreSub: 'Recuperar compras neste dispositivo',
    legal: 'LEGAL',
    privacyPolicy: 'Política de privacidade',
    privacyPolicySub: 'Como gerenciamos seus dados',
    termsOfService: 'Termos de serviço',
    termsOfServiceSub: 'Regras para usar o app',
  },
  it: {
    title: 'IMPOSTAZIONI',
    appearance: 'ASPETTO',
    theme: 'Tema',
    themeDark: 'Scuro',
    themeLight: 'Chiaro',
    themeSystem: 'Sistema',
    audio: 'AUDIO',
    sound: 'Effetti sonori',
    soundSub: 'Bip, buzzer, suono spia',
    language: 'LINGUA',
    selectLanguage: 'Lingua dell\'app',
    back: 'INDIETRO',
    premium: 'PREMIUM',
    premiumStatus: 'Stato Premium',
    premiumActive: 'Premium Attivato',
    premiumInactive: 'Sblocca Premium',
    restorePurchases: 'Ripristina acquisti',
    restoreSub: 'Recupera acquisti su questo dispositivo',
    legal: 'LEGALE',
    privacyPolicy: 'Informativa sulla privacy',
    privacyPolicySub: 'Come gestiamo i tuoi dati',
    termsOfService: 'Termini di servizio',
    termsOfServiceSub: 'Regole per l\'uso dell\'app',
  },
  nl: {
    title: 'INSTELLINGEN',
    appearance: 'UITERLIJK',
    theme: 'Thema',
    themeDark: 'Donker',
    themeLight: 'Licht',
    themeSystem: 'Systeem',
    audio: 'GELUID',
    sound: 'Geluidseffecten',
    soundSub: 'Piepjes, buzzer, spiongeluid',
    language: 'TAAL',
    selectLanguage: 'App-taal',
    back: 'TERUG',
    premium: 'PREMIUM',
    premiumStatus: 'Premium Status',
    premiumActive: 'Premium Ontgrendeld',
    premiumInactive: 'Premium Ontgrendelen',
    restorePurchases: 'Aankopen herstellen',
    restoreSub: 'Herstel aankopen op dit apparaat',
    legal: 'JURIDISCH',
    privacyPolicy: 'Privacybeleid',
    privacyPolicySub: 'Hoe wij uw gegevens verwerken',
    termsOfService: 'Servicevoorwaarden',
    termsOfServiceSub: 'Regels voor het gebruik van de app',
  },
  ro: {
    title: 'SETĂRI',
    appearance: 'ASPECT',
    theme: 'Temă',
    themeDark: 'Întunecat',
    themeLight: 'Luminos',
    themeSystem: 'Sistem',
    audio: 'AUDIO',
    sound: 'Efecte sonore',
    soundSub: 'Bip-uri, sonerie, sunet de spion',
    language: 'LIMBĂ',
    selectLanguage: 'Limba aplicației',
    back: 'ÎNAPOI',
    premium: 'PREMIUM',
    premiumStatus: 'Status Premium',
    premiumActive: 'Premium Activat',
    premiumInactive: 'Deblochează Premium',
    restorePurchases: 'Restaurează achizițiile',
    restoreSub: 'Recuperează achizițiile pe acest dispozitiv',
    legal: 'LEGAL',
    privacyPolicy: 'Politica de confidențialitate',
    privacyPolicySub: 'Cum gestionăm datele tale',
    termsOfService: 'Termeni și condiții',
    termsOfServiceSub: 'Reguli pentru utilizarea aplicației',
  },
};

export default function SettingsScreen({ navigation, route }) {
  const { colors, isDarkMode, themeMode, setThemeMode } = useTheme();
  const { soundEnabled, setSoundEnabled } = useSettings();
  const { isPremium, isLoading, restorePurchases, purchasePremium } = usePremium();
  const lang = route.params?.language || 'en';
  const t = translations[lang] || translations.en;
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
        <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#666' : colors.text} />
      </View>
    </TouchableOpacity>
  );

  const ThemeSegment = () => {
    const options = [
      { key: 'dark', label: t.themeDark, icon: 'moon' },
      { key: 'system', label: t.themeSystem, icon: 'phone-portrait-outline' },
      { key: 'light', label: t.themeLight, icon: 'sunny' },
    ];
    return (
      <View style={styles.segment}>
        {options.map(({ key, label, icon }, idx) => {
          const active = themeMode === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.segmentBtn,
                active && { backgroundColor: colors.primary },
                idx === 0 && styles.segmentFirst,
                idx === options.length - 1 && styles.segmentLast,
              ]}
              onPress={() => setThemeMode(key)}
              activeOpacity={0.8}
            >
              <Ionicons name={icon} size={16} color={active ? '#fff' : isDarkMode ? '#aaa' : colors.text} />
              <Text style={[styles.segmentLabel, active && { color: '#fff' }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const handleUnlockPremium = async () => {
    if (!isPremium) await purchasePremium();
  };

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
      {!isDarkMode && <LinearGradient colors={['#3EC9C1', '#1a7ac7']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none" />}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? colors.background : '#3EC9C1'} />

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
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="contrast-outline" size={22} color={isDarkMode ? '#fff' : '#000'} style={styles.rowIcon} />
              <Text style={styles.rowLabel}>{t.theme}</Text>
            </View>
          </View>
          <ThemeSegment />
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
              <Text style={styles.flagText}>{{ en: '🇬🇧', lt: '🇱🇹', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', pl: '🇵🇱', pt: '🇧🇷', it: '🇮🇹', nl: '🇳🇱', ro: '🇷🇴' }[lang] || '🇬🇧'}</Text>
            }
          />
        </View>

        {/* Premium */}
        <Text style={styles.sectionTitle}>{t.premium}</Text>
        <View style={[styles.card, { borderColor: border }]}>
          <TouchableOpacity style={styles.row} onPress={handleUnlockPremium} disabled={isPremium} activeOpacity={0.8}>
            <View style={styles.rowLeft}>
              <Ionicons name="star" size={22} color={isPremium ? colors.primary : isDarkMode ? '#888' : colors.textSecondary} style={styles.rowIcon} />
              <View>
                <Text style={styles.rowLabel}>{t.premiumStatus}</Text>
                <Text style={[
                  styles.rowSub,
                  { color: isPremium ? colors.primary : isDarkMode ? '#888' : colors.textSecondary }
                ]}>
                  {isPremium ? t.premiumActive : t.premiumInactive}
                </Text>
              </View>
            </View>
            {!isPremium && (
              <View style={styles.rowRight}>
                <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#666' : colors.text} />
              </View>
            )}
          </TouchableOpacity>
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
              <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#666' : colors.text} />
            )}
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <Text style={styles.sectionTitle}>{t.legal}</Text>
        <View style={[styles.card, { borderColor: border }]}>
          <NavRow
            icon="document-text-outline"
            label={t.privacyPolicy}
            subtitle={t.privacyPolicySub}
            onPress={() => Linking.openURL('https://pulsfirestudio-dev.github.io/spy-room/privacy-policy.html')}
          />
          <View style={styles.divider} />
          <NavRow
            icon="shield-checkmark-outline"
            label={t.termsOfService}
            subtitle={t.termsOfServiceSub}
            onPress={() => Linking.openURL('https://pulsfirestudio-dev.github.io/spy-room/terms-of-use.html')}
          />
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
    color: isDarkMode ? '#aaa' : colors.text, marginBottom: 10, marginLeft: 4,
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
    fontSize: 14, color: isDarkMode ? '#888' : colors.textSecondary,
    marginTop: 2,
  },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  divider: {
    height: 1, backgroundColor: isDarkMode ? '#333' : '#eee',
    marginHorizontal: 16,
  },
  flagText: { fontSize: 22 },
  segment: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#ccc',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  segmentFirst: { borderRightWidth: 1, borderColor: isDarkMode ? '#333' : '#ccc' },
  segmentLast: { borderLeftWidth: 1, borderColor: isDarkMode ? '#333' : '#ccc' },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: isDarkMode ? '#aaa' : colors.text,
  },
});