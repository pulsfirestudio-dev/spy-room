// utils/SoundManager.js
import { Audio } from 'expo-av';

let _soundEnabled = true;
export function setSoundEnabled(val) { _soundEnabled = val; }

const play = async (source, volume = 1.0) => {
  if (!_soundEnabled) return;
  try {
    const { sound } = await Audio.Sound.createAsync(source, { volume, shouldPlay: true });
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch (e) {
    console.warn('SoundManager error:', e);
  }
};

const SoundManager = {
  preloadAll: async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
      });
    } catch (e) {
      console.warn('SoundManager preload error:', e);
    }
  },

  unloadAll: async () => {},

  playCountdownBeep: () => play(require('../assets/sounds/countdown_beep.wav'), 0.8),
  playTimesUp: () => play(require('../assets/sounds/Times up.mp3'), 1.0),
  playSpyRevealed: () => play(require('../assets/sounds/spy_revealed.wav'), 0.9),
};

export default SoundManager;