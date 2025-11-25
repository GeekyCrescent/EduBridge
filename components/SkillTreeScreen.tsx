import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, StyleSheet, Animated, Pressable, Dimensions } from "react-native";
import {
  Title,
  Paragraph,
  Surface,
  ProgressBar,
  Text,
  Button,
  Chip,
  IconButton,
} from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  maxLevel: number;
  category: 'cultural' | 'idioma' | 'academico' | 'social';
  unlocked: boolean;
  xp: number;
  maxXp: number;
  prerequisites: string[];
}

const skills: Skill[] = [
  {
    id: 'orientacion',
    name: 'Orientación básica',
    description: 'Conoce tu nuevo país y ciudad',
    icon: 'compass',
    level: 3,
    maxLevel: 5,
    category: 'cultural',
    unlocked: true,
    xp: 180,
    maxXp: 200,
    prerequisites: [],
  },
  {
    id: 'emergencias',
    name: 'Números de emergencia',
    description: 'Sabe cuándo y cómo pedir ayuda',
    icon: 'phone-alert',
    level: 5,
    maxLevel: 5,
    category: 'cultural',
    unlocked: true,
    xp: 200,
    maxXp: 200,
    prerequisites: ['orientacion'],
  },
  {
    id: 'transporte',
    name: 'Transporte público',
    description: 'Usa autobuses y metro con confianza',
    icon: 'bus',
    level: 2,
    maxLevel: 5,
    category: 'cultural',
    unlocked: true,
    xp: 80,
    maxXp: 200,
    prerequisites: ['orientacion'],
  },
  {
    id: 'saludos',
    name: 'Saludos básicos',
    description: 'Di hola y adiós en el nuevo idioma',
    icon: 'hand-wave',
    level: 4,
    maxLevel: 5,
    category: 'idioma',
    unlocked: true,
    xp: 160,
    maxXp: 200,
    prerequisites: [],
  },
  {
    id: 'conversacion',
    name: 'Conversación simple',
    description: 'Habla sobre ti y tus intereses',
    icon: 'chat',
    level: 2,
    maxLevel: 5,
    category: 'idioma',
    unlocked: true,
    xp: 90,
    maxXp: 200,
    prerequisites: ['saludos'],
  },
  {
    id: 'escuela',
    name: 'Rutinas escolares',
    description: 'Comprende el sistema educativo',
    icon: 'school',
    level: 3,
    maxLevel: 5,
    category: 'academico',
    unlocked: true,
    xp: 140,
    maxXp: 200,
    prerequisites: ['saludos'],
  },
  {
    id: 'matematicas',
    name: 'Matemáticas adaptadas',
    description: 'Aprende con ejemplos culturales',
    icon: 'calculator',
    level: 1,
    maxLevel: 5,
    category: 'academico',
    unlocked: true,
    xp: 45,
    maxXp: 200,
    prerequisites: ['escuela'],
  },
  {
    id: 'hacer-amigos',
    name: 'Hacer amigos',
    description: 'Técnicas para conectar con otros',
    icon: 'account-group',
    level: 2,
    maxLevel: 5,
    category: 'social',
    unlocked: true,
    xp: 75,
    maxXp: 200,
    prerequisites: ['conversacion'],
  },
  {
    id: 'trabajo-equipo',
    name: 'Trabajo en equipo',
    description: 'Colabora en proyectos grupales',
    icon: 'account-multiple',
    level: 1,
    maxLevel: 5,
    category: 'social',
    unlocked: false,
    xp: 0,
    maxXp: 200,
    prerequisites: ['hacer-amigos', 'escuela'],
  },
  {
    id: 'presentaciones',
    name: 'Presentaciones públicas',
    description: 'Habla frente a la clase con seguridad',
    icon: 'presentation',
    level: 0,
    maxLevel: 5,
    category: 'academico',
    unlocked: false,
    xp: 0,
    maxXp: 200,
    prerequisites: ['conversacion', 'trabajo-equipo'],
  },
];

// Componente de tarjeta animada
const AnimatedSkillCard = ({ 
  skill, 
  index, 
  isSelected, 
  onPress,
  getCategoryColor,
  getCategoryLabel 
}: {
  skill: Skill;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  getCategoryColor: (category: string) => string;
  getCategoryLabel: (category: string) => string;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(expandAnim, {
      toValue: isSelected ? 1 : 0,
      friction: 10,
      tension: 50,
      useNativeDriver: false,
    }).start();
  }, [isSelected]);

  const progress = (skill.xp / skill.maxXp) * 100;
  const categoryColor = getCategoryColor(skill.category);

  const expandedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160],
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            borderLeftColor: categoryColor,
            opacity: skill.unlocked ? (pressed ? 0.9 : 1) : 0.5,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={styles.cardContent}>
          {/* Header de la tarjeta */}
          <View style={styles.cardHeader}>
            <Surface style={[styles.iconContainer, { backgroundColor: skill.unlocked ? categoryColor + '20' : '#1e293b' }]}>
              <MaterialCommunityIcons
                name={skill.unlocked ? skill.icon as any : 'lock'}
                size={28}
                color={skill.unlocked ? categoryColor : '#475569'}
              />
            </Surface>

            <View style={styles.cardInfo}>
              <View style={styles.chipRow}>
                <Chip
                  mode="flat"
                  compact
                  style={[styles.categoryChip, { backgroundColor: categoryColor + '20' }]}
                >
                  <Text style={[styles.categoryChipText, { color: categoryColor }]}>
                    {getCategoryLabel(skill.category).toUpperCase()}
                  </Text>
                </Chip>
                {skill.unlocked && (
                  <View style={styles.starsContainer}>
                    {[...Array(skill.maxLevel)].map((_, i) => (
                      <MaterialCommunityIcons
                        key={i}
                        name={i < skill.level ? 'star' : 'star-outline'}
                        size={12}
                        color={i < skill.level ? '#fbbf24' : '#475569'}
                      />
                    ))}
                  </View>
                )}
              </View>
              <Title style={styles.skillName}>{skill.name}</Title>
              <Paragraph style={styles.skillDescription}>{skill.description}</Paragraph>
            </View>

            {/* Círculo de progreso */}
            {skill.unlocked && (
              <View style={styles.progressCircle}>
                <View style={[styles.progressCircleInner, { borderColor: categoryColor }]}>
                  <Text style={[styles.progressText, { color: categoryColor }]}>
                    {skill.level}/{skill.maxLevel}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Contenido expandible */}
          {skill.unlocked && (
            <Animated.View style={[styles.expandedContent, { maxHeight: expandedHeight, opacity: expandAnim }]}>
              <View style={styles.divider} />
              
              <View style={styles.xpContainer}>
                <View style={styles.xpLabels}>
                  <Text style={styles.xpLabel}>Experiencia</Text>
                  <Text style={[styles.xpValue, { color: categoryColor }]}>
                    {skill.xp} / {skill.maxXp} XP
                  </Text>
                </View>
                <ProgressBar
                  progress={skill.xp / skill.maxXp}
                  color={categoryColor}
                  style={styles.xpProgressBar}
                />
              </View>

              {skill.prerequisites.length > 0 && (
                <View style={styles.prerequisitesContainer}>
                  <Text style={styles.prerequisitesLabel}>Desbloqueado con:</Text>
                  <View style={styles.prerequisiteChips}>
                    {skill.prerequisites.map(prereq => {
                      const prereqSkill = skills.find(s => s.id === prereq);
                      return (
                        <Chip
                          key={prereq}
                          compact
                          icon="check-circle"
                          style={styles.prereqChip}
                          textStyle={styles.prereqChipText}
                        >
                          {prereqSkill?.name}
                        </Chip>
                      );
                    })}
                  </View>
                </View>
              )}

              <Button
                mode="contained"
                icon="play-circle"
                style={styles.practiceButton}
                contentStyle={styles.practiceButtonContent}
                buttonColor={categoryColor}
                onPress={() => console.log('Practicar:', skill.name)}
              >
                Practicar
              </Button>
            </Animated.View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function SkillTreeScreen() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'cultural' | 'idioma' | 'academico' | 'social'>('all');
  
  // Animaciones del header
  const headerAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const totalXp = skills.reduce((acc, skill) => acc + skill.xp, 0);
  const totalMaxXp = skills.reduce((acc, skill) => acc + skill.maxXp, 0);
  const globalProgress = (totalXp / totalMaxXp) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cultural': return '#10b981';
      case 'idioma': return '#0ea5e9';
      case 'academico': return '#8b5cf6';
      case 'social': return '#ec4899';
      default: return '#64748b';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cultural': return 'Cultural';
      case 'idioma': return 'Idioma';
      case 'academico': return 'Académico';
      case 'social': return 'Social';
      default: return category;
    }
  };

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(s => s.category === filter);

  const filters = [
    { key: 'all', label: 'Todas', icon: null, color: '#10b981' },
    { key: 'cultural', label: 'Cultural', icon: 'earth', color: '#10b981' },
    { key: 'idioma', label: 'Idioma', icon: 'translate', color: '#0ea5e9' },
    { key: 'academico', label: 'Académico', icon: 'book-open-variant', color: '#8b5cf6' },
    { key: 'social', label: 'Social', icon: 'account-heart', color: '#ec4899' },
  ];

  const animatedProgress = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, globalProgress / 100],
  });

  return (
    <View style={styles.container}>
      {/* Header con animación */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerLabel}>TU PROGRESO</Text>
            <Title style={styles.headerTitle}>Árbol de habilidades</Title>
            <Paragraph style={styles.headerSubtitle}>{totalXp} XP ganados</Paragraph>
          </View>

          {/* Círculo de progreso global */}
          <View style={styles.globalProgressCircle}>
            <View style={styles.globalProgressInner}>
              <Text style={styles.globalProgressText}>{Math.round(globalProgress)}%</Text>
            </View>
          </View>
        </View>

        {/* Filtros con animación */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((f, index) => (
            <Animated.View
              key={f.key}
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
              <Pressable
                onPress={() => setFilter(f.key as any)}
                style={({ pressed }) => [
                  styles.filterChip,
                  {
                    backgroundColor: filter === f.key ? f.color : '#334155',
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
              >
                {f.icon && (
                  <MaterialCommunityIcons
                    name={f.icon as any}
                    size={16}
                    color={filter === f.key ? '#fff' : '#94a3b8'}
                    style={styles.filterIcon}
                  />
                )}
                <Text
                  style={[
                    styles.filterText,
                    { color: filter === f.key ? '#fff' : '#94a3b8' },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Lista de habilidades */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredSkills.map((skill, index) => (
          <AnimatedSkillCard
            key={skill.id}
            skill={skill}
            index={index}
            isSelected={selectedSkill === skill.id}
            onPress={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
            getCategoryColor={getCategoryColor}
            getCategoryLabel={getCategoryLabel}
          />
        ))}

        {/* Resumen de categorías */}
        <Animated.View
          style={[
            styles.summaryContainer,
            {
              opacity: headerAnim,
            },
          ]}
        >
          <Surface style={styles.summaryCard}>
            <Title style={styles.summaryTitle}>📊 Resumen de progreso</Title>

            {['cultural', 'idioma', 'academico', 'social'].map((category, index) => {
              const categorySkills = skills.filter(s => s.category === category);
              const categoryXp = categorySkills.reduce((acc, s) => acc + s.xp, 0);
              const categoryMaxXp = categorySkills.reduce((acc, s) => acc + s.maxXp, 0);
              const categoryProgress = (categoryXp / categoryMaxXp) * 100;

              return (
                <Animated.View
                  key={category}
                  style={[
                    styles.categoryProgressItem,
                    {
                      opacity: progressAnim,
                      transform: [
                        {
                          translateX: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-30, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.categoryProgressHeader}>
                    <Text style={styles.categoryProgressLabel}>
                      {getCategoryLabel(category)}
                    </Text>
                    <Text style={[styles.categoryProgressValue, { color: getCategoryColor(category) }]}>
                      {Math.round(categoryProgress)}%
                    </Text>
                  </View>
                  <ProgressBar
                    progress={categoryProgress / 100}
                    color={getCategoryColor(category)}
                    style={styles.categoryProgressBar}
                  />
                </Animated.View>
              );
            })}
          </Surface>
        </Animated.View>

        {/* Mensaje motivacional */}
        <Animated.View
          style={[
            styles.motivationalContainer,
            {
              opacity: progressAnim,
              transform: [
                {
                  scale: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Surface style={styles.motivationalCard}>
            <MaterialCommunityIcons name="trophy-variant" size={40} color="#fbbf24" />
            <Title style={styles.motivationalTitle}>¡Sigue así!</Title>
            <Paragraph style={styles.motivationalText}>
              Cada habilidad que desbloqueas te acerca más a sentirte como en casa 🏠
            </Paragraph>
          </Surface>
        </Animated.View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#1e293b',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerLabel: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  headerTitle: {
    color: '#f1f5f9',
    marginTop: 4,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
  },
  globalProgressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: '#10b981',
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  globalProgressInner: {
    alignItems: 'center',
  },
  globalProgressText: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: '700',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryChip: {
    height: 18,
  },
  categoryChipText: {
    fontSize: 9,
    fontWeight: '700',
  },
  starsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  skillName: {
    color: '#f1f5f9',
    fontSize: 15,
    marginBottom: 2,
  },
  skillDescription: {
    color: '#94a3b8',
    fontSize: 12,
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
  },
  expandedContent: {
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginTop: 16,
    marginBottom: 12,
  },
  xpContainer: {
    marginBottom: 12,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  xpValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  xpProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
  },
  prerequisitesContainer: {
    marginBottom: 12,
  },
  prerequisitesLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 6,
  },
  prerequisiteChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  prereqChip: {
    height: 24,
    backgroundColor: '#334155',
  },
  prereqChipText: {
    fontSize: 10,
    color: '#10b981',
  },
  practiceButton: {
    borderRadius: 12,
    marginTop: 4,
  },
  practiceButtonContent: {
    paddingVertical: 6,
  },
  summaryContainer: {
    marginTop: 8,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#1e293b',
  },
  summaryTitle: {
    color: '#f1f5f9',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryProgressItem: {
    marginBottom: 12,
  },
  categoryProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryProgressLabel: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryProgressValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  categoryProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
  },
  motivationalContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  motivationalCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  motivationalTitle: {
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  motivationalText: {
    color: '#d1fae5',
    textAlign: 'center',
    marginTop: 4,
  },
});
