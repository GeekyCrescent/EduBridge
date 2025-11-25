import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  age: number;
  originCountry: string;
  currentCountry: string;
  language: string;
  grade: string;
}

interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  completedAdventures: string[];
  achievements: string[];
  unlockedSkills: string[];
}

interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  speechRate: number;
  theme: 'dark' | 'light';
  notificationsEnabled: boolean;
}

interface AppState {
  // Usuario
  user: UserProfile;
  progress: UserProgress;
  settings: AppSettings;
  isFirstTime: boolean;
  
  // Acciones de usuario
  setUser: (user: Partial<UserProfile>) => void;
  
  // Acciones de progreso
  addXP: (amount: number) => void;
  completeAdventure: (id: string) => void;
  unlockAchievement: (id: string) => void;
  unlockSkill: (id: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  
  // Acciones de configuración
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  
  // Persistencia
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  resetProgress: () => void;
}

const initialUser: UserProfile = {
  name: '',
  age: 0,
  originCountry: '',
  currentCountry: '',
  language: 'es',
  grade: '',
};

const initialProgress: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  completedAdventures: [],
  achievements: [],
  unlockedSkills: [],
};

const initialSettings: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  speechRate: 0.9,
  theme: 'dark',
  notificationsEnabled: true,
};

// Calcular nivel basado en XP
const calculateLevel = (xp: number): number => {
  // Cada nivel requiere más XP: nivel 1 = 0-99, nivel 2 = 100-249, etc.
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 850) return 4;
  if (xp < 1300) return 5;
  if (xp < 1850) return 6;
  if (xp < 2500) return 7;
  if (xp < 3250) return 8;
  if (xp < 4100) return 9;
  return 10;
};

// XP necesario para el siguiente nivel
export const getXPForNextLevel = (level: number): number => {
  const thresholds = [100, 250, 500, 850, 1300, 1850, 2500, 3250, 4100, 5000];
  return thresholds[Math.min(level - 1, thresholds.length - 1)];
};

// XP del nivel actual
export const getXPForCurrentLevel = (level: number): number => {
  if (level <= 1) return 0;
  const thresholds = [0, 100, 250, 500, 850, 1300, 1850, 2500, 3250, 4100];
  return thresholds[Math.min(level - 1, thresholds.length - 1)];
};

export const useAppStore = create<AppState>((set, get) => ({
  user: initialUser,
  progress: initialProgress,
  settings: initialSettings,
  isFirstTime: true,

  // Acciones de usuario
  setUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData },
      isFirstTime: false,
    }));
    get().saveToStorage();
  },

  // Acciones de progreso
  addXP: (amount) => {
    set((state) => {
      const newXP = state.progress.xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > state.progress.level;
      
      return {
        progress: {
          ...state.progress,
          xp: newXP,
          level: newLevel,
        },
      };
    });
    get().saveToStorage();
  },

  completeAdventure: (id) => {
    set((state) => {
      if (state.progress.completedAdventures.includes(id)) {
        return state;
      }
      return {
        progress: {
          ...state.progress,
          completedAdventures: [...state.progress.completedAdventures, id],
        },
      };
    });
    get().saveToStorage();
  },

  unlockAchievement: (id) => {
    set((state) => {
      if (state.progress.achievements.includes(id)) {
        return state;
      }
      return {
        progress: {
          ...state.progress,
          achievements: [...state.progress.achievements, id],
        },
      };
    });
    get().saveToStorage();
  },

  unlockSkill: (id) => {
    set((state) => {
      if (state.progress.unlockedSkills.includes(id)) {
        return state;
      }
      return {
        progress: {
          ...state.progress,
          unlockedSkills: [...state.progress.unlockedSkills, id],
        },
      };
    });
    get().saveToStorage();
  },

  incrementStreak: () => {
    set((state) => ({
      progress: {
        ...state.progress,
        streak: state.progress.streak + 1,
      },
    }));
    get().saveToStorage();
  },

  resetStreak: () => {
    set((state) => ({
      progress: {
        ...state.progress,
        streak: 0,
      },
    }));
    get().saveToStorage();
  },

  // Acciones de configuración
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
    get().saveToStorage();
  },

  toggleSound: () => {
    set((state) => ({
      settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
    }));
    get().saveToStorage();
  },

  toggleHaptics: () => {
    set((state) => ({
      settings: { ...state.settings, hapticsEnabled: !state.settings.hapticsEnabled },
    }));
    get().saveToStorage();
  },

  // Persistencia
  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem('edubridge_data');
      if (data) {
        const parsed = JSON.parse(data);
        set({
          user: parsed.user || initialUser,
          progress: parsed.progress || initialProgress,
          settings: parsed.settings || initialSettings,
          isFirstTime: parsed.isFirstTime ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      const data = JSON.stringify({
        user: state.user,
        progress: state.progress,
        settings: state.settings,
        isFirstTime: state.isFirstTime,
      });
      await AsyncStorage.setItem('edubridge_data', data);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  resetProgress: () => {
    set({
      progress: initialProgress,
    });
    get().saveToStorage();
  },
}));