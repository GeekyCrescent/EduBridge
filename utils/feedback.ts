import { Platform } from 'react-native';

// ============================================
// 🔊 TEXT-TO-SPEECH (Compatible con Web)
// ============================================

// Importar Speech solo en móvil
let Speech: any = null;
let Haptics: any = null;
let Audio: any = null;

// Cargar módulos nativos solo en plataformas compatibles
if (Platform.OS !== 'web') {
  Speech = require('expo-speech');
  Haptics = require('expo-haptics');
  Audio = require('expo-av').Audio;
}

// Store mock para evitar errores de importación circular
let getSettings = () => ({ soundEnabled: true, hapticsEnabled: true, speechRate: 0.9 });

export const setSettingsGetter = (getter: () => any) => {
  getSettings = getter;
};

export const kaiSpeak = async (
  text: string,
  language: string = 'es-ES',
  options?: {
    pitch?: number;
    rate?: number;
    onDone?: () => void;
    onError?: (error: any) => void;
  }
) => {
  const settings = getSettings();
  
  if (!settings.soundEnabled) {
    options?.onDone?.();
    return;
  }

  // Web: Usar Web Speech API
  if (Platform.OS === 'web') {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.pitch = options?.pitch ?? 1.1;
        utterance.rate = options?.rate ?? settings.speechRate ?? 0.9;
        utterance.onend = () => options?.onDone?.();
        utterance.onerror = (e) => options?.onError?.(e);
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.log('Web Speech API error:', error);
        options?.onError?.(error);
      }
    } else {
      console.log('Web Speech API not supported');
      options?.onDone?.();
    }
    return;
  }

  // Móvil: Usar expo-speech
  try {
    if (Speech) {
      await Speech.stop();
      Speech.speak(text, {
        language,
        pitch: options?.pitch ?? 1.1,
        rate: options?.rate ?? settings.speechRate ?? 0.9,
        onDone: options?.onDone,
        onError: options?.onError,
      });
    }
  } catch (error) {
    console.error('Error en speech:', error);
    options?.onError?.(error);
  }
};

export const stopSpeaking = async () => {
  if (Platform.OS === 'web') {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return;
  }

  try {
    if (Speech) {
      await Speech.stop();
    }
  } catch (error) {
    console.error('Error stopping speech:', error);
  }
};

export const isSpeaking = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return 'speechSynthesis' in window ? window.speechSynthesis.speaking : false;
  }

  try {
    return Speech ? await Speech.isSpeakingAsync() : false;
  } catch {
    return false;
  }
};

// ============================================
// 📳 HAPTIC FEEDBACK
// ============================================
export const haptic = {
  light: async () => {
    if (Platform.OS === 'web' || !getSettings().hapticsEnabled) return;
    
    try {
      if (Haptics) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      // Silenciar error
    }
  },

  medium: async () => {
    if (Platform.OS === 'web' || !getSettings().hapticsEnabled) return;
    
    try {
      if (Haptics) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      // Silenciar error
    }
  },

  heavy: async () => {
    if (Platform.OS === 'web' || !getSettings().hapticsEnabled) return;
    
    try {
      if (Haptics) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      // Silenciar error
    }
  },

  success: async () => {
    if (Platform.OS === 'web' || !getSettings().hapticsEnabled) return;
    
    try {
      if (Haptics) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      // Silenciar error
    }
  },

  warning: async () => {
    if (Platform.OS === 'web' || !getSettings().hapticsEnabled) return;
    
    try {
      if (Haptics) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (error) {
      // Silenciar error
    }
  },

  error: async () => {
    if (Platform.OS === 'web' || !getSettings().hapticsEnabled) return;
    
    try {
      if (Haptics) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      // Silenciar error
    }
  },

  selection: async () => {
    if (Platform.OS === 'web' || !getSettings().hapticsEnabled) return;
    
    try {
      if (Haptics) {
        await Haptics.selectionAsync();
      }
    } catch (error) {
      // Silenciar error
    }
  },
};

// ============================================
// 🎵 SOUND EFFECTS
// ============================================
export const sounds = {
  preload: async () => {
    if (Platform.OS === 'web') return;
    
    try {
      if (Audio) {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      }
    } catch (error) {
      console.log('Error setting audio mode:', error);
    }
  },

  playSuccess: async () => {
    if (!getSettings().soundEnabled) return;
    
    // En web, usar Web Audio API o simplemente haptic
    if (Platform.OS === 'web') {
      // Podríamos usar Web Audio API aquí si quisiéramos
      return;
    }

    await haptic.success();
  },

  playClick: async () => {
    if (!getSettings().soundEnabled) return;
    await haptic.light();
  },

  playCelebration: async () => {
    if (!getSettings().soundEnabled) return;
    await haptic.success();
  },

  playLevelUp: async () => {
    if (!getSettings().soundEnabled) return;
    await haptic.heavy();
  },

  playError: async () => {
    if (!getSettings().soundEnabled) return;
    await haptic.error();
  },
};

// ============================================
// 🎉 FEEDBACK COMBINADO
// ============================================
export const feedback = {
  success: async () => {
    await Promise.all([
      haptic.success(),
      sounds.playSuccess(),
    ]);
  },

  tap: async () => {
    await Promise.all([
      haptic.light(),
      sounds.playClick(),
    ]);
  },

  celebrate: async () => {
    await Promise.all([
      haptic.heavy(),
      sounds.playCelebration(),
    ]);
  },

  levelUp: async () => {
    await Promise.all([
      haptic.heavy(),
      sounds.playLevelUp(),
    ]);
  },

  error: async () => {
    await Promise.all([
      haptic.error(),
      sounds.playError(),
    ]);
  },

  select: async () => {
    await haptic.selection();
  },
};