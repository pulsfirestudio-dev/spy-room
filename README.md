# 🕵️ Spy Room
> **Lies. Clues. Chaos.**

Spy Room is a social deduction party game for 3–12 players. One or more players are secretly assigned as spies — everyone else knows the secret word. Can the agents expose the spy before they blend in?

---

## 📱 Download
[![Google Play](https://img.shields.io/badge/Google_Play-Coming_Soon-green?style=for-the-badge&logo=google-play)](https://play.google.com)

---

## 🎮 How to Play
1. **One device, pass around** — no app needed for other players
2. Each player secretly views their role (Agent or Spy) and the secret word
3. Everyone takes turns giving one-word clues about the secret word
4. **Agents** try to expose the spy through discussion
5. **The Spy** tries to blend in without knowing the word
6. Vote to eliminate — if the spy is caught, agents win. If not, the spy wins!

---

## ✨ Features
- 🎲 **5 free categories** — Random, Everyday Objects, Famous People, Animals, Irish Slang
- 💰 **6 premium categories** — Professions, Gen Z Mode, Adult Party Mode, Movies & TV, Fantasy & Mythology, Famous Songs
- ⏱️ **Timer mode** — 15 seconds per player to keep things tense
- 🕵️ **Multiple spies** — 1, 2 or 3 hidden roles
- 🎯 **Clue Assist** — gives the spy a category hint
- 💥 **Chaos Round** — random chance all players become spies
- 🔊 **Sound effects** — countdown beeps, buzzer, spy reveal sting
- 🌙 **Dark & Light mode**
- 🇬🇧 🇱🇹 **English & Lithuanian**
- 🌐 **Online multiplayer** — real-time rooms via Firebase
- 📴 **Pass & play mode** — fully offline, no internet needed

---

## 🛠️ Built With
- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase](https://firebase.google.com/) — real-time multiplayer
- [RevenueCat](https://www.revenuecat.com/) — in-app purchases
- [expo-av](https://docs.expo.dev/versions/latest/sdk/av/) — sound effects
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — haptic feedback

---

## 📁 Project Structure
```
Spy-Room/
├── assets/
│   ├── sounds/           # WAV/MP3 sound effects
│   └── App-logo.png      # App logo
├── components/           # Reusable UI components
├── context/
│   ├── ThemeContext.js    # Dark/light mode
│   └── SettingsContext.js # Sound & vibration settings
├── screens/
│   ├── HomeScreen.js
│   ├── CreateRoomScreen.js
│   ├── GameScreen.js
│   ├── DiscussionScreen.js
│   ├── RevealResultScreen.js
│   ├── HowToPlayScreen.js
│   ├── SettingsScreen.js
│   └── SelectLanguageScreen.js
├── utils/
│   ├── SoundManager.js   # Audio playback
│   └── HapticsManager.js # Vibration
└── App.js
```

---

## 🚀 Getting Started
```bash
# Install dependencies
npm install

# Start Expo (use --tunnel for cross-device testing)
npx expo start --clear --tunnel

# Run on Android
npx expo run:android
```

---

## 📄 Legal
- [Privacy Policy](./privacy-policy.md)
- [Terms of Use](./terms-of-use.md)

---

## 👨‍💻 Developer
**Pulsefire Studio**  
📧 pulsfirestudio@gmail.com  
🇮🇪 Ireland

---
*Made with ❤️ for party nights*
