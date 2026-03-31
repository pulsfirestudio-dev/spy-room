# Commands

## Dev Commands
```bash
# Install dependencies
npm install

# Start Expo dev server (scan QR with Expo Go)
npx expo start

# Run directly on device/emulator
npx expo start --android
npx expo start --ios

# Build for production (EAS)
npx eas build --platform android
npx eas build --platform ios
```

There is no test runner configured in this project.

## Dependency Rules

- Use `npx expo install` for Expo-compatible packages to get the correct SDK version.
- Do **not** install `react-native-reanimated` or `react-native-worklets-core` — known to cause build conflicts.
- Do **not** import Supabase SDK anywhere in this project (Supabase is used in DriveDeck, not here).
- Do **not** use `--legacy-peer-deps` unless peer dependency resolution explicitly fails and there is no alternative.

## Claude Code Context Skills

- **Expo/React Native awareness** — this is an Expo managed workflow. Do not suggest bare React Native commands (`react-native link`, `pod install`) unless ejected.
- **Platform awareness** — primary testing is on physical Android via Expo Go tunnel. Always consider Android-first.
- **State management** — app uses three context providers (Settings → Theme → Premium). Do not introduce Redux or Zustand.
- **Navigation** — all screens use `@react-navigation/native-stack` with `headerShown: false`. New screens must follow this pattern.
- Do **not** create new context providers without discussing the need first.
