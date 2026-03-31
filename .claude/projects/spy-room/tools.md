# Tools

## Install dependencies
```bash
npm install
```

## Start dev server
```bash
npx expo start
```

## Run on device/emulator
```bash
npx expo start --android
npx expo start --ios
```

## Production builds (EAS)
```bash
npx eas build --platform android
npx eas build --platform ios
```

## Install Expo-compatible packages
```bash
npx expo install <package-name>
```

## No test runner
There is no test runner configured in this project.

## Dependency rules
- Use `npx expo install` for Expo-compatible packages (correct SDK version).
- Do **not** install `react-native-reanimated` or `react-native-worklets-core`.
- Do **not** import Supabase SDK.
- Do **not** use `--legacy-peer-deps` unless explicitly needed.

## Obsidian Local REST API
- Runs on port `27123`
- API key stored in `.claude/settings.json`
- Used for reading/writing notes during dev sessions
