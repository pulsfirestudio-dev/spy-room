// HowToPlayScreen.js
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const translations = {
  en: {
    title: 'HOW TO PLAY',
    step1: 'Gather Your Crew',
    step1Text: 'Round up 3 to 12 players. Everyone grabs a seat in the circle of trust... or deception.',
    step2: 'The Secret Word',
    step2Text: 'Each round, everyone except the Spy sees the secret word. The Spy is left in the dark, scrambling to blend in.',
    step3: 'Drop Your Clues',
    step3Text: 'Go around and give clues related to the secret word — either use a one-word clue or talk about what the word means to you. Be clever, but not too obvious!',
    step4: 'Cast Your Votes',
    step4Text: 'Everyone votes on who they think is the Spy. Majority rules. Choose wisely.',
    step5: 'The Reveal',
    step5Text: 'If the Spy fools the group — Spies win! If caught red-handed — Agents take the victory!',
    proTips: 'PRO TIPS',
    tip1: '• Spies: Listen carefully and mirror the energy. Vague is your friend.',
    tip2: "• Agents: Watch for hesitation or clues that don't quite fit.",
    tip3: "• Chaos Round: There's a chance everyone becomes a Spy. When paranoia hits maximum — trust no one.",
    back: 'BACK',
  },
  lt: {
    title: 'KAIP ŽAISTI',
    step1: 'Surinkite Komandą',
    step1Text: 'Sušaukite 3–12 žaidėjų. Visi atsisėda pasitikėjimo rate... arba apgaulės.',
    step2: 'Slaptas Žodis',
    step2Text: 'Kiekvieno rato metu visi, išskyrus Šnipą, mato slaptą žodį. Šnipas lieka tamsoje ir bando prisitaikyti.',
    step3: 'Meskite Užuominas',
    step3Text: 'Eikite ratu ir duokite užuominas susijusias su slaptu žodžiu — naudokite vieną žodį arba papasakokite, ką tas žodis jums reiškia. Būkite protingi, bet ne per daug akivaizdūs!',
    step4: 'Balsuokite',
    step4Text: 'Visi balsuoja, kas yra Šnipas. Dauguma nusprendžia. Rinkitės protingai.',
    step5: 'Atskleidimas',
    step5Text: 'Jei Šnipas apgauna grupę — laimi Šnipai! Jei pagautas — Agentai švenčia pergalę!',
    proTips: 'PATARIMAI PROFIAMS',
    tip1: '• Šnipai: Klausykitės atidžiai ir atkartokite energiją. Neaiškumas — jūsų draugas.',
    tip2: '• Agentai: Stebėkite dvejones ar užuominas, kurios kiek neįtinka.',
    tip3: '• Chaos Ratas: Yra tikimybė, kad visi taps Šnipais. Kai paranoja pasiekia viršūnę — nepasitikėkite niekuo.',
    back: 'ATGAL',
  },
  es: {
    title: 'CÓMO JUGAR',
    step1: 'Reúne tu Equipo',
    step1Text: 'Reúne entre 3 y 12 jugadores. Todos se sientan en el círculo de confianza... o engaño.',
    step2: 'La Palabra Secreta',
    step2Text: 'Cada ronda, todos excepto el Espía ven la palabra secreta. El Espía está en la oscuridad intentando mezclarse.',
    step3: 'Da tus Pistas',
    step3Text: 'Turno a turno da pistas sobre la palabra secreta — usa una pista de una palabra o habla sobre lo que significa para ti. ¡Sé inteligente, pero no demasiado obvio!',
    step4: 'Vota',
    step4Text: 'Todos votan sobre quién creen que es el Espía. La mayoría decide. Elige sabiamente.',
    step5: 'La Revelación',
    step5Text: '¡Si el Espía engaña al grupo, los Espías ganan! ¡Si lo atrapan, los Agentes se llevan la victoria!',
    proTips: 'CONSEJOS PRO',
    tip1: '• Espías: Escucha con atención y copia la energía. Lo vago es tu amigo.',
    tip2: '• Agentes: Fíjate en las dudas o pistas que no encajan del todo.',
    tip3: '• Ronda Caótica: Hay posibilidades de que todos sean Espías. Cuando la paranoia alcanza su máximo — no confíes en nadie.',
    back: 'ATRÁS',
  },
  fr: {
    title: 'COMMENT JOUER',
    step1: 'Réunissez votre équipe',
    step1Text: 'Rassemblez 3 à 12 joueurs. Tout le monde s\'installe dans le cercle de confiance... ou de tromperie.',
    step2: 'Le mot secret',
    step2Text: 'Chaque round, tout le monde sauf l\'Espion voit le mot secret. L\'Espion est dans le noir et essaie de se fondre.',
    step3: 'Donnez vos indices',
    step3Text: 'À tour de rôle, donnez des indices sur le mot secret — utilisez un indice d\'un mot ou parlez de ce que le mot signifie pour vous. Soyez malin, mais pas trop évident !',
    step4: 'Votez',
    step4Text: 'Tout le monde vote sur qui est l\'Espion selon eux. La majorité l\'emporte. Choisissez judicieusement.',
    step5: 'La révélation',
    step5Text: 'Si l\'Espion trompe le groupe — les Espions gagnent ! S\'il est pris — les Agents remportent la victoire !',
    proTips: 'CONSEILS PRO',
    tip1: '• Espions : Écoutez attentivement et reproduisez l\'énergie. Le vague est votre ami.',
    tip2: '• Agents : Surveillez les hésitations ou les indices qui ne collent pas.',
    tip3: '• Round Chaos : Il y a une chance que tout le monde devienne Espion. Quand la paranoïa atteint son maximum — ne faites confiance à personne.',
    back: 'RETOUR',
  },
  de: {
    title: 'WIE MAN SPIELT',
    step1: 'Versammle dein Team',
    step1Text: 'Sammle 3 bis 12 Spieler. Alle setzen sich in den Kreis des Vertrauens... oder der Täuschung.',
    step2: 'Das geheime Wort',
    step2Text: 'Jede Runde sehen alle außer dem Spion das geheime Wort. Der Spion tappt im Dunkeln und versucht sich einzufügen.',
    step3: 'Gib Hinweise',
    step3Text: 'Reihum gib Hinweise zum geheimen Wort — nutze einen Ein-Wort-Hinweis oder erzähle, was das Wort für dich bedeutet. Sei clever, aber nicht zu offensichtlich!',
    step4: 'Abstimmen',
    step4Text: 'Alle stimmen darüber ab, wer ihrer Meinung nach der Spion ist. Die Mehrheit entscheidet. Wähle weise.',
    step5: 'Die Enthüllung',
    step5Text: 'Wenn der Spion die Gruppe täuscht — gewinnen die Spione! Wenn er erwischt wird — feiern die Agenten den Sieg!',
    proTips: 'PROFI-TIPPS',
    tip1: '• Spione: Höre genau zu und spiegele die Energie. Vage ist dein Freund.',
    tip2: '• Agenten: Achte auf Zögern oder Hinweise, die nicht ganz passen.',
    tip3: '• Chaos-Runde: Es besteht die Möglichkeit, dass alle zum Spion werden. Wenn die Paranoia den Höhepunkt erreicht — vertraue niemandem.',
    back: 'ZURÜCK',
  },
  pl: {
    title: 'JAK GRAĆ',
    step1: 'Zbierz swoją ekipę',
    step1Text: 'Zgromadź od 3 do 12 graczy. Wszyscy siadają w kręgu zaufania... lub zdrady.',
    step2: 'Tajne słowo',
    step2Text: 'W każdej rundzie wszyscy oprócz Szpiega widzą tajne słowo. Szpieg pozostaje w ciemności i próbuje się wtopić.',
    step3: 'Dawaj wskazówki',
    step3Text: 'Kolejno dawajcie wskazówki dotyczące tajnego słowa — użyj jednowyrazowej wskazówki lub powiedz, co to słowo dla ciebie znaczy. Bądź sprytny, ale nie zbyt oczywisty!',
    step4: 'Głosuj',
    step4Text: 'Wszyscy głosują na osobę, którą uważają za Szpiega. Decyduje większość. Wybieraj mądrze.',
    step5: 'Ujawnienie',
    step5Text: 'Jeśli Szpieg oszuka grupę — Szpiedzy wygrywają! Jeśli zostanie złapany — Agenci świętują zwycięstwo!',
    proTips: 'PORADY PRO',
    tip1: '• Szpiedzy: Słuchaj uważnie i naśladuj energię. Vagueness to twój przyjaciel.',
    tip2: '• Agenci: Obserwuj wahania lub wskazówki, które nie do końca pasują.',
    tip3: '• Runda Chaosu: Jest szansa, że wszyscy zostaną Szpiegami. Gdy paranoja osiągnie szczyt — nikomu nie ufaj.',
    back: 'WRÓĆ',
  },
  pt: {
    title: 'COMO JOGAR',
    step1: 'Reúna seu Grupo',
    step1Text: 'Reúna de 3 a 12 jogadores. Todos se sentam no círculo de confiança... ou traição.',
    step2: 'A Palavra Secreta',
    step2Text: 'Em cada rodada, todos exceto o Espião veem a palavra secreta. O Espião fica no escuro tentando se misturar.',
    step3: 'Dê suas Pistas',
    step3Text: 'Revezem dando pistas sobre a palavra secreta — use uma pista de uma palavra ou fale sobre o que a palavra significa para você. Seja inteligente, mas não muito óbvio!',
    step4: 'Vote',
    step4Text: 'Todos votam em quem acham que é o Espião. A maioria decide. Escolha com sabedoria.',
    step5: 'A Revelação',
    step5Text: 'Se o Espião enganar o grupo — os Espiões vencem! Se for pego — os Agentes comemoram a vitória!',
    proTips: 'DICAS PRO',
    tip1: '• Espiões: Ouça com atenção e espelhe a energia. O vago é seu amigo.',
    tip2: '• Agentes: Observe hesitações ou pistas que não se encaixam direito.',
    tip3: '• Rodada Caos: Há uma chance de todos virarem Espiões. Quando a paranoia atinge o máximo — não confie em ninguém.',
    back: 'VOLTAR',
  },
  it: {
    title: 'COME GIOCARE',
    step1: 'Riunisci la tua squadra',
    step1Text: 'Raduna da 3 a 12 giocatori. Tutti si siedono nel cerchio della fiducia... o dell\'inganno.',
    step2: 'La parola segreta',
    step2Text: 'Ogni round, tutti tranne la Spia vedono la parola segreta. La Spia è al buio e cerca di mimetizzarsi.',
    step3: 'Dai i tuoi indizi',
    step3Text: 'A turno daite indizi sulla parola segreta — usa un indizio di una parola o parla di cosa significa quella parola per te. Sii furbo, ma non troppo ovvio!',
    step4: 'Vota',
    step4Text: 'Tutti votano su chi pensano sia la Spia. La maggioranza decide. Scegli con saggezza.',
    step5: 'La rivelazione',
    step5Text: 'Se la Spia inganna il gruppo — le Spie vincono! Se viene catturata — gli Agenti festeggiano la vittoria!',
    proTips: 'CONSIGLI PRO',
    tip1: '• Spie: Ascolta attentamente e rispecchia l\'energia. Il vago è tuo amico.',
    tip2: '• Agenti: Osserva esitazioni o indizi che non si adattano bene.',
    tip3: '• Round Caos: C\'è la possibilità che tutti diventino Spie. Quando la paranoia raggiunge il massimo — non fidarti di nessuno.',
    back: 'INDIETRO',
  },
  nl: {
    title: 'HOE TE SPELEN',
    step1: 'Verzamel je team',
    step1Text: 'Verzamel 3 tot 12 spelers. Iedereen gaat zitten in de cirkel van vertrouwen... of bedrog.',
    step2: 'Het geheime woord',
    step2Text: 'Elke ronde zien alle spelers behalve de Spion het geheime woord. De Spion staat in het duister en probeert op te gaan in de groep.',
    step3: 'Geef aanwijzingen',
    step3Text: 'Geef om de beurt aanwijzingen over het geheime woord — gebruik een aanwijzing van één woord of vertel wat het woord voor jou betekent. Wees slim, maar niet te voor de hand liggend!',
    step4: 'Stem',
    step4Text: 'Iedereen stemt op wie zij denken dat de Spion is. De meerderheid beslist. Kies verstandig.',
    step5: 'De onthulling',
    step5Text: 'Als de Spion de groep voor de gek houdt — winnen de Spionnen! Als hij betrapt wordt — vieren de Agenten de overwinning!',
    proTips: 'PRO TIPS',
    tip1: '• Spionnen: Luister goed en spiegel de energie. Vaag zijn is je vriend.',
    tip2: '• Agenten: Let op aarzeling of aanwijzingen die niet helemaal kloppen.',
    tip3: '• Chaosronde: Er is een kans dat iedereen een Spion wordt. Als de paranoia het maximum bereikt — vertrouw niemand.',
    back: 'TERUG',
  },
  ro: {
    title: 'CUM SE JOACĂ',
    step1: 'Adună-ți echipa',
    step1Text: 'Adună între 3 și 12 jucători. Toți se așează în cercul de încredere... sau înșelăciune.',
    step2: 'Cuvântul secret',
    step2Text: 'În fiecare rundă, toți în afară de Spion văd cuvântul secret. Spionul este în întuneric și încearcă să se integreze.',
    step3: 'Dă indicii',
    step3Text: 'Pe rând, dați indicii despre cuvântul secret — folosiți un indiciu de un cuvânt sau vorbiți despre ce înseamnă cuvântul pentru voi. Fiți inteligenți, dar nu prea evidenți!',
    step4: 'Votează',
    step4Text: 'Toți votează cine cred că este Spionul. Majoritatea decide. Alege cu înțelepciune.',
    step5: 'Dezvăluirea',
    step5Text: 'Dacă Spionul păcălește grupul — Spionii câștigă! Dacă este prins — Agenții sărbătoresc victoria!',
    proTips: 'SFATURI PRO',
    tip1: '• Spioni: Ascultă cu atenție și oglindește energia. Vagul este prietenul tău.',
    tip2: '• Agenți: Urmărește ezitările sau indiciile care nu se potrivesc.',
    tip3: '• Runda Haos: Există șansa ca toți să devină Spioni. Când paranoia atinge maximum — nu ai încredere în nimeni.',
    back: 'ÎNAPOI',
  },
};

export default function HowToPlayScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const lang = route.params?.language || 'en';
  const t = translations[lang];
  const styles = getStyles(colors, isDarkMode);

  const steps = [
    { icon: 'people',          iconBg: ['#1a6b8a', '#2196a8'], title: t.step1, text: t.step1Text },
    { icon: 'eye',             iconBg: ['#c0392b', '#e74c3c'], title: t.step2, text: t.step2Text },
    { icon: 'chatbubbles',     iconBg: ['#6a1b9a', '#9c27b0'], title: t.step3, text: t.step3Text },
    { icon: 'people',          iconBg: ['#1a6b8a', '#2196a8'], title: t.step4, text: t.step4Text },
    { icon: 'game-controller', iconBg: ['#e65100', '#f57c00'], title: t.step5, text: t.step5Text },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {!isDarkMode && <LinearGradient colors={['#3EC9C1', '#1a7ac7']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none" />}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? colors.background : '#3EC9C1'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo3.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.stepsContainer}>
          {steps.map((step, i) => (
            <View key={i} style={styles.stepCard}>
              <LinearGradient colors={step.iconBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.stepIconGradient}>
                <Ionicons name={step.icon} size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>{t.proTips}</Text>
          <Text style={styles.tipText}>{t.tip1}</Text>
          <Text style={styles.tipText}>{t.tip2}</Text>
          <Text style={styles.tipText}>{t.tip3}</Text>
        </View>
        <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingTop: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: isDarkMode ? colors.primary : colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.text },
  title: { fontSize: 26, fontWeight: '900', color: isDarkMode ? '#fff' : '#000', letterSpacing: 2, textShadowColor: isDarkMode ? colors.primary : 'transparent', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: isDarkMode ? 2 : 0 },
  placeholder: { width: 44 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 120, height: 120, opacity: 0.72 },
  stepsContainer: { gap: 15, marginBottom: 25 },
  stepCard: { backgroundColor: colors.surface, padding: 22, borderRadius: 16, borderWidth: 2, borderColor: isDarkMode ? '#fff' : '#000' },
  stepIconGradient: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  stepTitle: { fontSize: 20, fontWeight: '800', color: isDarkMode ? '#fff' : '#000', marginBottom: 8, letterSpacing: 1 },
  stepText: { fontSize: 16, color: isDarkMode ? '#fff' : '#000', lineHeight: 23 },
  tipsCard: { backgroundColor: colors.primary + '15', padding: 22, borderRadius: 16, borderWidth: 2, borderColor: colors.primary, marginBottom: 25 },
  tipsTitle: { fontSize: 20, fontWeight: '800', color: isDarkMode ? '#fff' : '#000', marginBottom: 15, letterSpacing: 1 },
  tipText: { fontSize: 16, color: isDarkMode ? '#fff' : '#000', marginBottom: 8, lineHeight: 23 },
  backButtonLarge: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 12, gap: 10, borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.text },
  backButtonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
});