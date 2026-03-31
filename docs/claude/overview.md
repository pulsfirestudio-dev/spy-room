# Overview

**Spy Room** is a React Native / Expo social deduction party game (local pass-and-play + Firebase multiplayer). Version 2.1.0, Android package `com.pulsfirestudio.spyroom`.

## Game Flow (Local Single-Device)

`HomeScreen` → `CreateRoomScreen` → `GameScreen` (role reveal + clue phase + discussion + voting) → `RevealResultScreen`

The `CreateRoomScreen` holds all word/category data for local games. Each category entry is `{ word: string, hint: string }` — the hint is shown to spies when Clue Assist is enabled.

## Game Flow (Multiplayer)

`MultiplayerMenuScreen` → `JoinRoomScreen` / `LobbyScreen` → `MultiplayerGameScreen`

Multiplayer uses Firebase Firestore (`utils/firebase.js`, `utils/RoomManager.js`). Room codes are 6-character alphanumeric strings. Game state lives in the `rooms/{roomCode}` document. `utils/wordCategories.js` is the shared word data used by multiplayer (mirrored from local data in `CreateRoomScreen.js`).

## Context Providers (wrap entire app in this order)

1. `SettingsProvider` — sound enabled/disabled
2. `ThemeProvider` — dark/light mode, exposes `colors` object and `isDarkMode`; defaults to dark (neon gaming aesthetic)
3. `PremiumProvider` — RevenueCat IAP via `react-native-purchases`; premium status cached in AsyncStorage under `'premiumStatus'`

**Important:** Premium status loads from AsyncStorage cache at startup only — RevenueCat is not called until `purchasePremium()` or `restorePurchases()` is explicitly triggered.

## Premium / Monetisation

- Free: 5 categories (Random, Everyday Objects, Famous People, Animals, Irish Slang)
- Premium: 6 additional categories — gated via `usePremium()` hook
- IAP handled by RevenueCat; entitlement key is `'premium'`
- `VoteCategoriesScreen` lets users vote on upcoming weekly categories

## Localisation

English (`en`) and Lithuanian (`lt`) are supported. Each screen that needs i18n defines a local `translations` object keyed by language code. Language is passed as a route param and stored in AsyncStorage.

## Navigation

All screens use `@react-navigation/native-stack` with `headerShown: false`. Screen names: `Home`, `Settings`, `CreateRoom`, `VoteCategories`, `JoinRoom`, `Lobby`, `MultiplayerMenu`, `MultiplayerGame`, `Game`, `HowToPlay`, `CustomCategory`, `SelectLanguage`, `Discussion`, `RevealResult`.

## Utilities

- `SoundManager.js` — expo-av audio playback; check `soundEnabled` from SettingsContext before playing
- `HapticsManager.js` — expo-haptics wrapper
- `components/AppButton.js` — shared styled button
- `components/WeeklyCategoriesModal.js` — shown on game creation for weekly category feature
