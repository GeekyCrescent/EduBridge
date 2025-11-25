import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet, Animated, Dimensions } from "react-native";
import { Title, Paragraph, Text, Surface, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  MascotKai, 
  AdventureCard, 
  MissionButton, 
  XPBar, 
  DialogBubble,
  AchievementBadge 
} from './ui/EduBridgeUI';

const { width } = Dimensions.get('window');

interface Adventure {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  progress: number;
  stars: number;
  maxStars: number;
  isLocked: boolean;
  category: string;
}

const adventures: Adventure[] = [
  {
    id: '1',
    title: '🗺️ Conoce tu nuevo país',
    subtitle: 'Descubre dónde estás ahora',
    icon: 'map-marker-radius',
    color: '#10b981',
    progress: 1,
    stars: 3,
    maxStars: 3,
    isLocked: false,
    category: 'orientacion',
  },
  {
    id: '2',
    title: '📞 Números importantes',
    subtitle: 'Por si necesitas ayuda',
    icon: 'phone-alert',
    color: '#ef4444',
    progress: 1,
    stars: 3,
    maxStars: 3,
    isLocked: false,
    category: 'seguridad',
  },
  {
    id: '3',
    title: '🚌 Cómo moverte',
    subtitle: 'Calles, direcciones y señales',
    icon: 'bus',
    color: '#0ea5e9',
    progress: 0.6,
    stars: 2,
    maxStars: 3,
    isLocked: false,
    category: 'transporte',
  },
  {
    id: '4',
    title: '🏫 Tu nueva escuela',
    subtitle: 'Clases, tareas y profes',
    icon: 'school',
    color: '#8b5cf6',
    progress: 0.3,
    stars: 1,
    maxStars: 3,
    isLocked: false,
    category: 'escuela',
  },
  {
    id: '5',
    title: '👋 Cultura y costumbres',
    subtitle: 'Cómo saluda la gente',
    icon: 'hand-wave',
    color: '#ec4899',
    progress: 0.4,
    stars: 1,
    maxStars: 3,
    isLocked: false,
    category: 'cultura',
  },
  {
    id: '6',
    title: '🛒 Cosas que verás mucho',
    subtitle: 'Dinero, transporte y tiendas',
    icon: 'cart',
    color: '#f59e0b',
    progress: 0,
    stars: 0,
    maxStars: 3,
    isLocked: false,
    category: 'vida-diaria',
  },
  {
    id: '7',
    title: '❄️ Clima y ropa',
    subtitle: 'Qué usar según el tiempo',
    icon: 'weather-partly-cloudy',
    color: '#06b6d4',
    progress: 0,
    stars: 0,
    maxStars: 3,
    isLocked: false,
    category: 'clima',
  },
  {
    id: '8',
    title: '🤝 Cómo hacer amigos',
    subtitle: 'Frases para acercarte',
    icon: 'account-heart',
    color: '#f43f5e',
    progress: 0,
    stars: 0,
    maxStars: 3,
    isLocked: true,
    category: 'social',
  },
];

const welcomeMessages = [
  "¡Hola! Soy Kai, tu guía en esta aventura 🌍",
  "Juntos vamos a explorar tu nuevo hogar",
  "¿Listo para aprender cosas increíbles?",
  "Cada día es una nueva aventura 💚",
];

const dailyTips = [
  { message: "¿Sabías que decir 'por favor' abre muchas puertas?", variant: 'tip' as const },
  { message: "¡Genial! Ya completaste 2 aventuras hoy 🎉", variant: 'celebration' as const },
  { message: "¿Necesitas ayuda con algo específico?", variant: 'question' as const },
];

export default function HomeScreen() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const mascotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.stagger(200, [
      Animated.spring(headerAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(mascotAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotar mensajes de bienvenida
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % welcomeMessages.length);
    }, 4000);

    // Mostrar tip después de 2 segundos
    setTimeout(() => setShowTip(true), 2000);

    return () => clearInterval(messageInterval);
  }, []);

  const completedCount = adventures.filter(a => a.progress >= 1).length;
  const totalXP = adventures.reduce((acc, a) => acc + Math.round(a.progress * 100), 0);

  return (
    <View style={styles.container}>
      {/* Header con gradiente visual */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Decoración de fondo */}
        <View style={styles.headerDecoration}>
          <View style={[styles.decorCircle, styles.decorCircle1]} />
          <View style={[styles.decorCircle, styles.decorCircle2]} />
          <View style={[styles.decorCircle, styles.decorCircle3]} />
        </View>

        <View style={styles.headerContent}>
          {/* Logo y título */}
          <View style={styles.brandContainer}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="bridge" size={28} color="#10b981" />
            </View>
            <View>
              <Text style={styles.brandName}>EduBridge</Text>
              <Text style={styles.brandTagline}>Tu puente al nuevo hogar</Text>
            </View>
          </View>

          {/* Stats rápidos */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>completadas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalXP}</Text>
              <Text style={styles.statLabel}>XP total</Text>
            </View>
          </View>
        </View>

        {/* Barra de XP */}
        <XPBar currentXP={totalXP} maxXP={1000} level={3} color="#10b981" />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de bienvenida con mascota */}
        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: mascotAnim,
              transform: [{ scale: mascotAnim }],
            },
          ]}
        >
          <Surface style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <MascotKai 
                mood="waving" 
                size={100} 
                message={welcomeMessages[currentMessage]}
              />
            </View>

            {/* Botón de misión diaria */}
            <View style={styles.dailyMissionContainer}>
              <MissionButton
                label="Misión del día"
                icon="star-circle"
                color="#fbbf24"
                pulse
                onPress={() => console.log('Misión diaria')}
              />
            </View>
          </Surface>
        </Animated.View>

        {/* Tip del día */}
        {showTip && (
          <Animated.View
            style={{
              opacity: mascotAnim,
            }}
          >
            <DialogBubble
              message={dailyTips[0].message}
              variant={dailyTips[0].variant}
              speaker="kai"
            />
          </Animated.View>
        )}

        {/* Título de sección */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons name="compass-rose" size={24} color="#10b981" />
            <Title style={styles.sectionTitle}>Tus aventuras</Title>
          </View>
          <Text style={styles.sectionSubtitle}>
            {completedCount} de {adventures.length} completadas
          </Text>
        </View>

        {/* Lista de aventuras */}
        {adventures.map((adventure, index) => (
          <Animated.View
            key={adventure.id}
            style={{
              opacity: headerAnim,
              transform: [
                {
                  translateX: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            }}
          >
            <AdventureCard
              title={adventure.title}
              subtitle={adventure.subtitle}
              icon={adventure.icon}
              color={adventure.color}
              progress={adventure.progress}
              stars={adventure.stars}
              maxStars={adventure.maxStars}
              isLocked={adventure.isLocked}
              onPress={() => console.log('Abrir aventura:', adventure.title)}
            />
          </Animated.View>
        ))}

        {/* Sección de logros recientes */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons name="trophy" size={24} color="#fbbf24" />
            <Title style={styles.sectionTitle}>Tus logros</Title>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsRow}
        >
          <AchievementBadge
            icon="map-check"
            title="Explorador"
            description="Primera aventura"
            earned={true}
            rarity="common"
          />
          <AchievementBadge
            icon="phone-check"
            title="Preparado"
            description="Números guardados"
            earned={true}
            rarity="rare"
          />
          <AchievementBadge
            icon="star-face"
            title="Estrella"
            description="3 estrellas"
            earned={true}
            rarity="epic"
          />
          <AchievementBadge
            icon="crown"
            title="Leyenda"
            description="Todas completadas"
            earned={false}
            rarity="legendary"
          />
        </ScrollView>

        {/* Mensaje motivacional final */}
        <Surface style={styles.motivationalCard}>
          <View style={styles.motivationalContent}>
            <MaterialCommunityIcons name="heart" size={40} color="#f43f5e" />
            <Title style={styles.motivationalTitle}>¡Vas increíble!</Title>
            <Paragraph style={styles.motivationalText}>
              Cada paso que das te acerca más a sentirte como en casa.
              Recuerda: ser diferente es tu superpoder 🦸‍♂️
            </Paragraph>
            <MissionButton
              label="Seguir explorando"
              icon="arrow-right"
              color="#10b981"
              size="large"
            />
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  decorCircle1: {
    width: 150,
    height: 150,
    backgroundColor: '#10b981',
    top: -50,
    right: -30,
  },
  decorCircle2: {
    width: 100,
    height: 100,
    backgroundColor: '#0ea5e9',
    top: 20,
    left: -40,
  },
  decorCircle3: {
    width: 80,
    height: 80,
    backgroundColor: '#8b5cf6',
    bottom: -20,
    right: 50,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#10b981' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  brandName: {
    color: '#f1f5f9',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTagline: {
    color: '#94a3b8',
    fontSize: 12,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#475569',
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  welcomeContent: {
    marginBottom: 20,
  },
  dailyMissionContainer: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#f1f5f9',
    marginLeft: 8,
    fontSize: 20,
  },
  sectionSubtitle: {
    color: '#64748b',
    fontSize: 12,
  },
  achievementsRow: {
    paddingVertical: 8,
    gap: 16,
  },
  motivationalCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    marginTop: 24,
    marginBottom: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  motivationalContent: {
    padding: 32,
    alignItems: 'center',
  },
  motivationalTitle: {
    color: '#f1f5f9',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 24,
  },
  motivationalText: {
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});
