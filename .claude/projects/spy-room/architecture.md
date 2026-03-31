# Architecture

## Game Flow (Local)
`HomeScreen` → `CreateRoomScreen` → `GameScreen` (role reveal → clue phase → discussion → voting) → `RevealResultScreen`

`CreateRoomScreen` holds all word/category data for local games. Each category entry is `{ word: string, hint: string }` — the hint is shown to spies when Clue Assist is enabled.

## Game Flow (Multiplayer)
`MultiplayerMenuScreen` → `JoinRoomScreen` / `LobbyScreen` → `MultiplayerGameScreen`

Multiplayer uses Firebase Firestore (`utils/firebase.js`, `utils/RoomManager.js`). Room codes are 6-character alphanumeric strings. Game state lives in the `rooms/{roomCode}` document. `utils/wordCategories.js` is the shared word data used by multiplayer.

## Context Providers (wrap entire app in this order)
1. `SettingsProvider` — sound enabled/disabled
2. `ThemeProvider` — dark/light mode, exposes `colors` object and `isDarkMode`; defaults to dark
3. `PremiumProvider` — RevenueCat IAP via `react-native-purchases`; premium status cached in AsyncStorage under `'premiumStatus'`

**Important:** Premium status loads from AsyncStorage cache at startup only — RevenueCat is not called until `purchasePremium()` or `restorePurchases()` is explicitly triggered.

## Navigation
All screens use `@react-navigation/native-stack` with `headerShown: false`.

Screen names: `Home`, `Settings`, `CreateRoom`, `VoteCategories`, `JoinRoom`, `Lobby`, `MultiplayerMenu`, `MultiplayerGame`, `Game`, `HowToPlay`, `CustomCategory`, `SelectLanguage`, `Discussion`, `RevealResult`.

## Localisation
English (`en`) and Lithuanian (`lt`). Each screen defines a local `translations` object keyed by language code. Language is passed as a route param and stored in AsyncStorage.

## Key files
- `App.js` — root, wraps providers and navigator
- `screens/` — all screen components
- `components/AppButton.js` — shared button component
- `components/WeeklyCategoriesModal.js` — weekly category voting modal
- `context/` — Settings, Theme, Premium providers
- `utils/firebase.js` — Firebase config and init
- `utils/RoomManager.js` — multiplayer room logic
- `utils/wordCategories.js` — shared word/category data
- `utils/SoundManager.js` — audio playback (expo-av)
- `utils/HapticsManager.js` — haptic feedback (expo-haptics)
