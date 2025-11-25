import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { PaperProvider, MD3DarkTheme, Text } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useTranslation } from 'react-i18next';

// Importar configuraciones
import './i18n'; // Inicializar i18n
import { useAppStore } from './store/useAppStore';
import { haptic, sounds, setSettingsGetter } from './utils/feedback';

// Importar pantallas
import HomeScreen from "./components/HomeScreen";
import CenterScreen from "./components/CenterScreen";
import SkillTreeScreen from "./components/SkillTreeScreen";

// Importar componente de celebración
import { Celebration } from './components/ui/Celebration';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#10b981',
    secondary: '#0ea5e9',
    tertiary: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    onSurface: '#f1f5f9',
    onSurfaceVariant: '#94a3b8',
    elevation: {
      level0: 'transparent',
      level1: '#1e293b',
      level2: '#1e293b',
      level3: '#334155',
      level4: '#334155',
      level5: '#475569',
    },
  },
  roundness: 20,
};

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  // Celebration state
  const [celebration, setCelebration] = useState<{
    visible: boolean;
    type: 'levelUp' | 'achievement' | 'adventureComplete' | 'streak';
    title: string;
    subtitle?: string;
  }>({
    visible: false,
    type: 'levelUp',
    title: '',
  });

  // Store
  const loadFromStorage = useAppStore((state) => state.loadFromStorage);
  const progress = useAppStore((state) => state.progress);
  const settings = useAppStore((state) => state.settings);

  // Configurar el getter de settings para feedback
  useEffect(() => {
    setSettingsGetter(() => settings);
  }, [settings]);

  const tabs = [
    { name: t('nav_home'), icon: 'home', iconOutline: 'home-outline' },
    { name: t('nav_mentor'), icon: 'robot', iconOutline: 'robot-outline' },
    { name: t('nav_progress'), icon: 'chart-line', iconOutline: 'chart-line' },
  ];

  useEffect(() => {
    async function prepare() {
      try {
        // Cargar fuentes
        await Font.loadAsync(MaterialCommunityIcons.font);
        
        // Cargar datos guardados
        await loadFromStorage();
        
        // Precargar sonidos
        await sounds.preload();
        
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        setIsReady(true);
      }
    }
    prepare();

    if (Platform.OS === 'web') {
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.margin = '0';
      document.body.style.overflow = 'hidden';
    }
  }, []);

  // Monitorear cambios de nivel para mostrar celebración
  const previousLevel = React.useRef(progress.level);
  useEffect(() => {
    if (progress.level > previousLevel.current) {
      setCelebration({
        visible: true,
        type: 'levelUp',
        title: t('celebration_level_up'),
        subtitle: `¡Ahora eres nivel ${progress.level}!`,
      });
      previousLevel.current = progress.level;
    }
  }, [progress.level]);

  const handleTabPress = async (index: number) => {
    await haptic.selection();
    setActiveTab(index);
  };

  if (!fontsLoaded || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🌍 {t('loading')}</Text>
      </View>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 0:
        return <HomeScreen />;
      case 1:
        return <CenterScreen />;
      case 2:
        return <SkillTreeScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          {/* Main Content */}
          <View style={styles.content}>
            {renderScreen()}
          </View>

          {/* Custom Tab Bar */}
          <View style={styles.tabBar}>
            {tabs.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <TouchableOpacity
                  key={tab.name}
                  onPress={() => handleTabPress(index)}
                  style={styles.tabItem}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={(isActive ? tab.icon : tab.iconOutline) as any}
                    size={24}
                    color={isActive ? '#10b981' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: isActive ? '#10b981' : '#64748b' }
                    ]}
                  >
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Celebration Modal */}
          <Celebration
            visible={celebration.visible}
            type={celebration.type}
            title={celebration.title}
            subtitle={celebration.subtitle}
            onDismiss={() => setCelebration({ ...celebration, visible: false })}
          />
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#10b981',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    height: Platform.OS === 'web' ? 60 : 70,
    paddingBottom: Platform.OS === 'web' ? 0 : 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});