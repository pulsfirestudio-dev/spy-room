# UI / UX

## Theme system
- Follow the existing `ThemeProvider` — use the `colors` object and `isDarkMode` flag.
- Default is dark mode with a neon gaming aesthetic.
- Match existing color values and spacing when building new screens.

## Component patterns
- Use `AppButton` for all buttons. Do not create one-off styled buttons.
- Check how similar screens handle layout, padding, and fonts before building new UI.

## Preferred patterns
- Local `translations` objects per screen for i18n (not a global i18n library).
- Route params for passing language and game config between screens.
- AsyncStorage for lightweight persistence (premium cache, settings, language preference).
- Firebase Firestore for multiplayer state — all room logic goes through `RoomManager.js`.
- `SoundManager.js` and `HapticsManager.js` as the only entry points for audio and haptic feedback.

## Design direction
- Dark-mode-first, neon gaming aesthetic
- Clean, modern, party-game friendly
- Mobile-first (Android primary target)
- Consistent spacing and font sizing across screens
