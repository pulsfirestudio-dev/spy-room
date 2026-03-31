# Spy Room

Social deduction party game built with React Native / Expo. Local pass-and-play + Firebase multiplayer. Android package `com.pulsfirestudio.spyroom`.

## Stack

- React Native (Expo managed workflow)
- Firebase Firestore (multiplayer)
- RevenueCat (IAP / premium)
- AsyncStorage (local persistence)
- @react-navigation/native-stack

## Read these first depending on task

- `project-state.md` — current goals, active work, blockers
- `architecture.md` — app structure, game flows, providers, navigation
- `ui-ux.md` — theme system, component patterns, design direction
- `context.md` — product/domain context, target users, brand
- `tools.md` — dev commands, build scripts, dependency rules

## Working rules

- This is Expo managed workflow — do not suggest bare RN commands (`react-native link`, `pod install`).
- Primary testing is on physical Android via Expo Go tunnel. Always consider Android-first.
- App uses three context providers (Settings → Theme → Premium). Do not introduce Redux or Zustand.
- All screens use `@react-navigation/native-stack` with `headerShown: false`. New screens must follow this.
- Do not create new context providers without discussing the need first.
- Use `npx expo install` for Expo-compatible packages to get the correct SDK version.
- Do **not** install `react-native-reanimated` or `react-native-worklets-core` — known build conflicts.
- Do **not** import Supabase SDK anywhere in this project.
- Do **not** use `--legacy-peer-deps` unless peer dependency resolution explicitly fails.
- Check for existing patterns in the codebase and follow them (naming, file structure, styling).
- If a fix touches more than one file, explain why before proceeding.
