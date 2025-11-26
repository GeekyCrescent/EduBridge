import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// ==================== YOUSSEF'S PROFILE ====================
const STUDENT = {
  name: "Youssef",
  age: 11,
  grade: "6th grade",
  originCountry: "Morocco",
  originCity: "Casablanca",
  currentCountry: "Spain",
  currentCity: "Madrid",
  timeInCountry: "5 months",
  hobby: "playing soccer and drawing cartoons",
  favoriteTeam: "Real Madrid",
  favoritePlayer: "Hakimi",
  favoriteFood: "chicken tajine and pizza",
  favoriteSeries: "Captain Tsubasa",
  pet: "a cat named Simba (stayed with uncle)",
  favoriteSubject: "Natural Sciences - loves animals",
  difficultSubject: "Math, especially fractions",
  bestFriend: "Pablo",
  dream: "visit Santiago Bernabéu stadium",
  phrase: "Bismillah",
};

// ==================== TYPES ====================
type Adventure = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  total: number;
  personalNote?: string;
};

type DailyMission = {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  icon: string;
};

// ==================== DATA PERSONALIZED FOR YOUSSEF ====================
const ADVENTURES: Adventure[] = [
  {
    id: '1',
    title: '⚽ Soccer Math',
    description: 'Learn fractions with soccer!',
    icon: 'soccer',
    color: '#22c55e',
    progress: 1,
    total: 5,
    personalNote: 'Like dividing the field!',
  },
  {
    id: '2',
    title: '🗺️ Know Madrid',
    description: 'Explore your new city',
    icon: 'map-marker',
    color: '#3b82f6',
    progress: 2,
    total: 5,
    personalNote: 'Find the Bernabéu!',
  },
  {
    id: '3',
    title: '📞 Emergency Numbers',
    description: 'Important help in Spain',
    icon: 'phone',
    color: '#ef4444',
    progress: 0,
    total: 3,
    personalNote: 'Tell your family too!',
  },
  {
    id: '4',
    title: '🏫 School Spanish',
    description: 'Words for class with Pablo',
    icon: 'school',
    color: '#8b5cf6',
    progress: 1,
    total: 4,
    personalNote: 'Impress your teacher!',
  },
  {
    id: '5',
    title: '🍕 Food & Ordering',
    description: 'Order pizza like a pro!',
    icon: 'food-apple',
    color: '#f59e0b',
    progress: 0,
    total: 4,
    personalNote: 'Beyond tajine & pizza!',
  },
  {
    id: '6',
    title: '🦁 Animal Kingdom',
    description: 'Your favorite - animals!',
    icon: 'paw',
    color: '#06b6d4',
    progress: 3,
    total: 5,
    personalNote: 'Like learning about Simba!',
  },
];

const DAILY_MISSIONS: DailyMission[] = [
  { id: '1', title: 'Practice fractions with soccer', xp: 30, completed: false, icon: 'soccer' },
  { id: '2', title: 'Learn 5 new Spanish words', xp: 25, completed: true, icon: 'alphabetical' },
  { id: '3', title: 'Talk to Kai for 5 minutes', xp: 20, completed: false, icon: 'microphone' },
];

// ==================== SPEECH HOOK - FIXED ====================
const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Small delay to ensure cancel completes
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Get voices and set English voice
        const setVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          const englishVoice = voices.find(v => v.lang === 'en-US') 
            || voices.find(v => v.lang.startsWith('en'))
            || voices[0];
          if (englishVoice) {
            utterance.voice = englishVoice;
          }
        };
        
        // Voices might not be loaded yet
        if (window.speechSynthesis.getVoices().length > 0) {
          setVoice();
        } else {
          window.speechSynthesis.onvoiceschanged = setVoice;
        }
        
        utterance.onstart = () => {
          console.log('Speech started');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('Speech ended');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.log('Speech error:', event.error);
          setIsSpeaking(false);
        };
        
        utterance.onpause = () => {
          console.log('Speech paused');
        };
        
        utterance.onresume = () => {
          console.log('Speech resumed');
        };
        
        utteranceRef.current = utterance;
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
        
        // Chrome fix: Chrome stops speaking after ~15 seconds, need to resume
        const resumeInterval = setInterval(() => {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            // Keep alive
          } else if (!window.speechSynthesis.speaking) {
            clearInterval(resumeInterval);
            setIsSpeaking(false);
          }
        }, 1000);
        
      }, 100);
    }
  }, []);

  const stop = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking };
};

// ==================== COMPONENTS ====================

const AnimatedCard = ({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, delay]);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

// Kai Speaking Animation Overlay - COMPLETELY FIXED
const KaiSpeakingOverlay = ({ visible, text, onClose, isSpeaking }: { visible: boolean; text: string; onClose: () => void; isSpeaking: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Wave animations
  const waveAnims = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;
  
  const animationRefs = useRef<{ [key: string]: Animated.CompositeAnimation }>({});

  // Scale in/out animation
  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, { 
        toValue: 1, 
        friction: 8, 
        tension: 40, 
        useNativeDriver: true 
      }).start();
    } else {
      Animated.timing(scaleAnim, { 
        toValue: 0, 
        duration: 200, 
        useNativeDriver: true 
      }).start();
    }
  }, [visible, scaleAnim]);

  // Speaking animations - separate effect
  useEffect(() => {
    // Clear previous animations
    Object.values(animationRefs.current).forEach(anim => {
      if (anim) anim.stop();
    });
    animationRefs.current = {};

    if (visible && isSpeaking) {
      // Bounce animation for avatar
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -15, duration: 300, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 15, duration: 300, useNativeDriver: true }),
        ])
      );
      bounceAnimation.start();
      animationRefs.current.bounce = bounceAnimation;

      // Glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 0.8, duration: 600, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        ])
      );
      glowAnimation.start();
      animationRefs.current.glow = glowAnimation;

      // Pulse animation for border
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      );
      pulseAnimation.start();
      animationRefs.current.pulse = pulseAnimation;

      // Wave animations - staggered
      waveAnims.forEach((anim, index) => {
        const waveAnimation = Animated.loop(
          Animated.sequence([
            Animated.delay(index * 100),
            Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.2, duration: 250, useNativeDriver: true }),
          ])
        );
        waveAnimation.start();
        animationRefs.current[`wave${index}`] = waveAnimation;
      });

    } else {
      // Reset all values when not speaking
      bounceAnim.setValue(0);
      glowAnim.setValue(0.3);
      pulseAnim.setValue(1);
      waveAnims.forEach(anim => anim.setValue(0.3));
    }

    return () => {
      Object.values(animationRefs.current).forEach(anim => {
        if (anim) anim.stop();
      });
    };
  }, [visible, isSpeaking, bounceAnim, glowAnim, pulseAnim, waveAnims]);

  if (!visible) return null;

  return (
    <View style={styles.speakingOverlay}>
      <Animated.View style={[
        styles.speakingCard, 
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {/* Background glow */}
        <Animated.View style={[
          styles.speakingGlow, 
          { opacity: glowAnim }
        ]} />
        
        {/* Kai Avatar with bounce */}
        <Animated.View style={[
          styles.speakingAvatar, 
          { transform: [{ translateY: bounceAnim }] }
        ]}>
          <Animated.View style={[
            styles.avatarCircle,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            <Text style={styles.avatarEmoji}>🤖</Text>
          </Animated.View>
          {isSpeaking && (
            <View style={styles.speakingIndicator}>
              <Text style={styles.speakingIndicatorEmoji}>🔊</Text>
            </View>
          )}
        </Animated.View>

        {/* Sound waves equalizer */}
        <View style={styles.soundWaves}>
          {waveAnims.map((anim, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.soundWave,
                index === 2 && styles.soundWaveCenter,
                (index === 1 || index === 3) && styles.soundWaveMid,
                { 
                  transform: [{ scaleY: anim }],
                  opacity: anim 
                }
              ]} 
            />
          ))}
        </View>

        {/* Status label */}
        <View style={[styles.statusBadge, isSpeaking ? styles.statusBadgeSpeaking : styles.statusBadgeDone]}>
          <Text style={styles.statusText}>
            {isSpeaking ? '🔊 Kai is speaking...' : '✓ Done speaking'}
          </Text>
        </View>
        
        {/* Message bubble */}
        <View style={styles.speakingBubble}>
          <ScrollView style={styles.bubbleScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.speakingText}>{text}</Text>
          </ScrollView>
        </View>

        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
          <MaterialCommunityIcons name="close" size={20} color="white" />
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const StreakBadge = ({ streak }: { streak: number }) => (
  <View style={styles.streakBadge}>
    <Text style={styles.streakEmoji}>🔥</Text>
    <Text style={styles.streakNumber}>{streak}</Text>
    <Text style={styles.streakLabel}>days</Text>
  </View>
);

const XPBadge = ({ xp }: { xp: number }) => (
  <View style={styles.xpBadge}>
    <MaterialCommunityIcons name="star" size={16} color="#fbbf24" />
    <Text style={styles.xpNumber}>{xp}</Text>
  </View>
);

const AdventureCard = ({ adventure, onPress }: { adventure: Adventure; onPress: () => void }) => {
  const progressPercent = (adventure.progress / adventure.total) * 100;
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Surface style={[styles.adventureCard, { borderLeftColor: adventure.color }]}>
        <View style={styles.adventureHeader}>
          <View style={[styles.adventureIconBox, { backgroundColor: `${adventure.color}20` }]}>
            <MaterialCommunityIcons name={adventure.icon as any} size={24} color={adventure.color} />
          </View>
          <View style={styles.adventureInfo}>
            <Text style={styles.adventureTitle}>{adventure.title}</Text>
            <Text style={styles.adventureDesc}>{adventure.description}</Text>
            {adventure.personalNote && (
              <Text style={[styles.adventureNote, { color: adventure.color }]}>
                💡 {adventure.personalNote}
              </Text>
            )}
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: adventure.color }]} />
          </View>
          <Text style={styles.progressText}>{adventure.progress}/{adventure.total}</Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const MissionItem = ({ mission, onPress }: { mission: DailyMission; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.missionItem, mission.completed && styles.missionCompleted]}>
      <View style={[styles.missionIcon, mission.completed && styles.missionIconCompleted]}>
        {mission.completed ? (
          <MaterialCommunityIcons name="check" size={18} color="white" />
        ) : (
          <MaterialCommunityIcons name={mission.icon as any} size={18} color="#10b981" />
        )}
      </View>
      <View style={styles.missionInfo}>
        <Text style={[styles.missionTitle, mission.completed && styles.missionTitleCompleted]}>
          {mission.title}
        </Text>
        <View style={styles.missionXP}>
          <MaterialCommunityIcons name="star" size={12} color="#fbbf24" />
          <Text style={styles.missionXPText}>+{mission.xp} XP</Text>
        </View>
      </View>
      {!mission.completed && (
        <View style={styles.missionAction}>
          <Text style={styles.missionActionText}>Go</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

// ==================== MAIN COMPONENT ====================
export default function HomeScreen() {
  const { speak, stop, isSpeaking } = useSpeech();
  const [showSpeaking, setShowSpeaking] = useState(false);
  const [speakingText, setSpeakingText] = useState('');

  const currentStreak = 5;
  const totalXP = 420;

  const handleKaiSpeak = useCallback((text: string) => {
    setSpeakingText(text);
    setShowSpeaking(true);
    // Small delay to let the modal animate in first
    setTimeout(() => {
      speak(text);
    }, 300);
  }, [speak]);

  const handleCloseSpeaking = useCallback(() => {
    stop();
    setShowSpeaking(false);
  }, [stop]);

  const welcomeMessage = `Hey ${STUDENT.name}! Great to see you, champion! Remember when you won that tournament in Casablanca as goalkeeper? You showed everyone what you can do! Today we're going to conquer fractions the same way. Bismillah, let's do this!`;

  const motivationalMessage = `${STUDENT.name}, imagine the soccer field divided into parts - that's exactly what fractions are! Like when Hakimi runs through half the field, that's one half! Your drawing skills help too - when you divide your paper for cartoons, you're already using fractions. You've got this, champion!`;

  const madridCultureMessage = `${STUDENT.name}, let me tell you about your new home, Madrid! It's the capital of Spain and home to the famous Santiago Bernabéu stadium where Real Madrid plays! Madrid has amazing museums like the Prado, beautiful parks like Retiro where you can play soccer with Pablo, and delicious food like churros with chocolate! The people here love soccer just like you, and you can even see Hakimi's Morocco play sometimes! Madrid is a perfect place for a future LaLiga star like you!`;

  return (
    <View style={styles.container}>
      {/* Speaking Overlay */}
      <KaiSpeakingOverlay 
        visible={showSpeaking} 
        text={speakingText} 
        onClose={handleCloseSpeaking}
        isSpeaking={isSpeaking}
      />

      {/* Header */}
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hey, {STUDENT.name}! ⚽</Text>
            <Text style={styles.subtitle}>Ready to score some goals today?</Text>
          </View>
          <View style={styles.headerBadges}>
            <StreakBadge streak={currentStreak} />
            <XPBadge xp={totalXP} />
          </View>
        </View>

        {/* Daily Progress - Soccer themed */}
        <AnimatedCard delay={100}>
          <View style={styles.dailyProgress}>
            <View style={styles.dailyProgressHeader}>
              <Text style={styles.dailyProgressTitle}>⚽ Today's Match</Text>
              <Text style={styles.dailyProgressPercent}>60%</Text>
            </View>
            <View style={styles.dailyProgressBar}>
              <View style={[styles.dailyProgressFill, { width: '60%' }]} />
            </View>
            <Text style={styles.dailyProgressHint}>
              2 more goals to win today! Like scoring at Santiago Bernabéu! 🏟️
            </Text>
          </View>
        </AnimatedCard>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Kai Welcome Card */}
        <AnimatedCard delay={200}>
          <Surface style={styles.kaiCard}>
            <View style={styles.kaiHeader}>
              <View style={styles.kaiAvatar}>
                <Text style={{ fontSize: 36 }}>🤖</Text>
              </View>
              <View style={styles.kaiInfo}>
                <Text style={styles.kaiName}>Kai - Your Mentor</Text>
                <Text style={styles.kaiStatus}>🟢 Ready to help you!</Text>
              </View>
            </View>
            <Text style={styles.kaiMessage}>
              Bismillah, {STUDENT.name}! 🌟 Ready to learn fractions using soccer? 
              Imagine the field divided in half - that's 1/2! Let's make math as fun as scoring goals! ⚽
            </Text>
            <TouchableOpacity 
              style={styles.kaiButton}
              onPress={() => handleKaiSpeak(welcomeMessage)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="volume-high" size={20} color="white" />
              <Text style={styles.kaiButtonText}>Listen to Kai</Text>
            </TouchableOpacity>
          </Surface>
        </AnimatedCard>

        {/* NEW: Madrid Culture Card */}
        <AnimatedCard delay={220}>
          <Surface style={styles.madridCard}>
            <View style={styles.madridHeader}>
              <Text style={styles.madridEmoji}>🏟️</Text>
              <View style={styles.madridInfo}>
                <Text style={styles.madridTitle}>Discover Madrid!</Text>
                <Text style={styles.madridSubtitle}>Your new home in Spain</Text>
              </View>
            </View>
            <View style={styles.madridHighlights}>
              <View style={styles.madridItem}>
                <Text style={styles.madridItemEmoji}>⚽</Text>
                <Text style={styles.madridItemText}>Bernabéu Stadium</Text>
              </View>
              <View style={styles.madridItem}>
                <Text style={styles.madridItemEmoji}>🎨</Text>
                <Text style={styles.madridItemText}>Prado Museum</Text>
              </View>
              <View style={styles.madridItem}>
                <Text style={styles.madridItemEmoji}>🌳</Text>
                <Text style={styles.madridItemText}>Retiro Park</Text>
              </View>
              <View style={styles.madridItem}>
                <Text style={styles.madridItemEmoji}>🍫</Text>
                <Text style={styles.madridItemText}>Churros!</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.madridButton}
              onPress={() => handleKaiSpeak(madridCultureMessage)}
            >
              <MaterialCommunityIcons name="volume-high" size={18} color="white" />
              <Text style={styles.madridButtonText}>Learn about Madrid from Kai!</Text>
            </TouchableOpacity>
          </Surface>
        </AnimatedCard>

        {/* Personal Card - Youssef's Journey */}
        <AnimatedCard delay={250}>
          <Surface style={styles.journeyCard}>
            <View style={styles.journeyHeader}>
              <Text style={styles.journeyEmoji}>🌍</Text>
              <View>
                <Text style={styles.journeyTitle}>{STUDENT.name}'s Journey</Text>
                <Text style={styles.journeySubtitle}>
                  {STUDENT.originCity} → {STUDENT.currentCity}
                </Text>
              </View>
            </View>
            <View style={styles.journeyStats}>
              <View style={styles.journeyStat}>
                <Text style={styles.journeyStatValue}>5</Text>
                <Text style={styles.journeyStatLabel}>months in Spain</Text>
              </View>
              <View style={styles.journeyDivider} />
              <View style={styles.journeyStat}>
                <Text style={styles.journeyStatValue}>⚽</Text>
                <Text style={styles.journeyStatLabel}>Champion GK</Text>
              </View>
              <View style={styles.journeyDivider} />
              <View style={styles.journeyStat}>
                <Text style={styles.journeyStatValue}>🎨</Text>
                <Text style={styles.journeyStatLabel}>Artist</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.journeyButton}
              onPress={() => handleKaiSpeak(motivationalMessage)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="lightbulb" size={18} color="#f59e0b" />
              <Text style={styles.journeyButtonText}>Get motivated by Kai!</Text>
            </TouchableOpacity>
          </Surface>
        </AnimatedCard>

        {/* Daily Missions */}
        <AnimatedCard delay={300}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📋 Today's Training</Text>
              <Text style={styles.sectionBadge}>1/3</Text>
            </View>
            <View style={styles.missionsList}>
              {DAILY_MISSIONS.map((mission) => (
                <MissionItem 
                  key={mission.id} 
                  mission={mission} 
                  onPress={() => console.log('Mission:', mission.title)} 
                />
              ))}
            </View>
          </View>
        </AnimatedCard>

        {/* Featured Adventure - Fractions */}
        <AnimatedCard delay={400}>
          <Surface style={styles.featuredCard}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>⭐ RECOMMENDED FOR YOU</Text>
            </View>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredIcon}>⚽</Text>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredTitle}>Soccer Fractions</Text>
                <Text style={styles.featuredDesc}>
                  Learn fractions by dividing the soccer field! Perfect for you, {STUDENT.name}!
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.featuredButton}>
              <Text style={styles.featuredButtonText}>Start Learning</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="white" />
            </TouchableOpacity>
          </Surface>
        </AnimatedCard>

        {/* Adventures */}
        <AnimatedCard delay={500}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎯 Your Adventures</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.adventuresList}>
              {ADVENTURES.slice(0, 4).map((adventure, index) => (
                <AnimatedCard key={adventure.id} delay={600 + index * 80}>
                  <AdventureCard 
                    adventure={adventure} 
                    onPress={() => console.log('Adventure:', adventure.title)} 
                  />
                </AnimatedCard>
              ))}
            </View>
          </View>
        </AnimatedCard>

        {/* Quick Actions */}
        <AnimatedCard delay={800}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Quick Practice</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#22c55e20' }]}>
                <Text style={{ fontSize: 26 }}>⚽</Text>
                <Text style={styles.quickActionText}>Soccer Math</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#3b82f620' }]}>
                <MaterialCommunityIcons name="microphone" size={26} color="#3b82f6" />
                <Text style={styles.quickActionText}>Speak</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#f59e0b20' }]}>
                <Text style={{ fontSize: 26 }}>🎨</Text>
                <Text style={styles.quickActionText}>Draw & Learn</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#8b5cf620' }]}>
                <MaterialCommunityIcons name="gamepad-variant" size={26} color="#8b5cf6" />
                <Text style={styles.quickActionText}>Games</Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedCard>

        {/* Tip Card - Personal */}
        <AnimatedCard delay={900}>
          <Surface style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipEmoji}>💡</Text>
              <Text style={styles.tipTitle}>Tip for {STUDENT.name}</Text>
            </View>
            <Text style={styles.tipText}>
              When you draw your cartoons, you're already using fractions! Dividing your paper into sections 
              is just like dividing a pizza with your sister. You're a natural! 🎨
            </Text>
          </Surface>
        </AnimatedCard>

        {/* Dream Card */}
        <AnimatedCard delay={1000}>
          <Surface style={styles.dreamCard}>
            <Text style={styles.dreamEmoji}>🏟️</Text>
            <Text style={styles.dreamTitle}>Your Dream</Text>
            <Text style={styles.dreamText}>
              Visit Santiago Bernabéu and see Real Madrid play! Every lesson brings you closer to speaking 
              Spanish perfectly and enjoying the match! ⚽
            </Text>
          </Surface>
        </AnimatedCard>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  
  // Header
  header: { paddingTop: 48, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { color: '#f1f5f9', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  headerBadges: { flexDirection: 'row', gap: 8 },
  
  // Badges
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f59e0b20', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 16, gap: 3 },
  streakEmoji: { fontSize: 14 },
  streakNumber: { color: '#f59e0b', fontSize: 14, fontWeight: '800' },
  streakLabel: { color: '#f59e0b', fontSize: 10 },
  xpBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbbf2420', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 16, gap: 3 },
  xpNumber: { color: '#fbbf24', fontSize: 14, fontWeight: '800' },
  
  // Daily Progress
  dailyProgress: { backgroundColor: '#334155', borderRadius: 14, padding: 14 },
  dailyProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dailyProgressTitle: { color: '#f1f5f9', fontSize: 15, fontWeight: '700' },
  dailyProgressPercent: { color: '#22c55e', fontSize: 15, fontWeight: '800' },
  dailyProgressBar: { height: 8, backgroundColor: '#1e293b', borderRadius: 4, overflow: 'hidden' },
  dailyProgressFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 4 },
  dailyProgressHint: { color: '#94a3b8', fontSize: 12, marginTop: 8 },
  
  // Content
  content: { flex: 1 },
  contentContainer: { padding: 16 },
  
  // Kai Card
  kaiCard: { backgroundColor: '#1e293b', borderRadius: 18, padding: 18, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#10b981' },
  kaiHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  kaiAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#10b98130', justifyContent: 'center', alignItems: 'center' },
  kaiInfo: { flex: 1 },
  kaiName: { color: '#10b981', fontSize: 15, fontWeight: '700' },
  kaiStatus: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  kaiMessage: { color: '#f1f5f9', fontSize: 14, lineHeight: 20, marginBottom: 14 },
  kaiButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10b981', borderRadius: 12, paddingVertical: 12, gap: 8 },
  kaiButtonText: { color: 'white', fontSize: 14, fontWeight: '700' },

  // Madrid Culture Card
  madridCard: { backgroundColor: '#1e293b', borderRadius: 18, padding: 18, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#3b82f6' },
  madridHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  madridEmoji: { fontSize: 40 },
  madridInfo: { flex: 1 },
  madridTitle: { color: '#3b82f6', fontSize: 17, fontWeight: '700' },
  madridSubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  madridHighlights: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  madridItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#334155', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, gap: 6 },
  madridItemEmoji: { fontSize: 16 },
  madridItemText: { color: '#f1f5f9', fontSize: 12, fontWeight: '600' },
  madridButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 12, gap: 8 },
  madridButtonText: { color: 'white', fontSize: 14, fontWeight: '700' },
  
  // Journey Card
  journeyCard: { backgroundColor: '#1e293b', borderRadius: 18, padding: 18, marginBottom: 14 },
  journeyHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  journeyEmoji: { fontSize: 36 },
  journeyTitle: { color: '#f1f5f9', fontSize: 16, fontWeight: '700' },
  journeySubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  journeyStats: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 14 },
  journeyStat: { alignItems: 'center' },
  journeyStatValue: { color: '#f1f5f9', fontSize: 20, fontWeight: '800' },
  journeyStatLabel: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  journeyDivider: { width: 1, height: 30, backgroundColor: '#334155' },
  journeyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f59e0b20', borderRadius: 10, paddingVertical: 10, gap: 6 },
  journeyButtonText: { color: '#f59e0b', fontSize: 13, fontWeight: '600' },
  
  // Section
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#f1f5f9', fontSize: 17, fontWeight: '700' },
  sectionBadge: { color: '#94a3b8', fontSize: 13, backgroundColor: '#334155', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 8 },
  seeAllText: { color: '#10b981', fontSize: 13, fontWeight: '600' },
  
  // Missions
  missionsList: { gap: 8 },
  missionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 12, padding: 12, gap: 10 },
  missionCompleted: { opacity: 0.6 },
  missionIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#10b98120', justifyContent: 'center', alignItems: 'center' },
  missionIconCompleted: { backgroundColor: '#10b981' },
  missionInfo: { flex: 1 },
  missionTitle: { color: '#f1f5f9', fontSize: 14, fontWeight: '600' },
  missionTitleCompleted: { textDecorationLine: 'line-through', color: '#64748b' },
  missionXP: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  missionXPText: { color: '#fbbf24', fontSize: 12, fontWeight: '600' },
  missionAction: { backgroundColor: '#10b981', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  missionActionText: { color: 'white', fontSize: 12, fontWeight: '700' },
  
  // Featured Card
  featuredCard: { backgroundColor: '#1e293b', borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 2, borderColor: '#22c55e' },
  featuredBadge: { alignSelf: 'flex-start', backgroundColor: '#22c55e', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, marginBottom: 12 },
  featuredBadgeText: { color: 'white', fontSize: 10, fontWeight: '800' },
  featuredContent: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  featuredIcon: { fontSize: 44 },
  featuredInfo: { flex: 1 },
  featuredTitle: { color: '#f1f5f9', fontSize: 18, fontWeight: '700' },
  featuredDesc: { color: '#94a3b8', fontSize: 13, marginTop: 4, lineHeight: 18 },
  featuredButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#22c55e', borderRadius: 12, paddingVertical: 14, gap: 8 },
  featuredButtonText: { color: 'white', fontSize: 15, fontWeight: '700' },
  
  // Adventures
  adventuresList: { gap: 10 },
  adventureCard: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderLeftWidth: 4 },
  adventureHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  adventureIconBox: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  adventureInfo: { flex: 1 },
  adventureTitle: { color: '#f1f5f9', fontSize: 14, fontWeight: '700' },
  adventureDesc: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  adventureNote: { fontSize: 11, marginTop: 3, fontStyle: 'italic' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBar: { flex: 1, height: 5, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  
  // Quick Actions
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  quickAction: { width: (width - 62) / 4, aspectRatio: 1, borderRadius: 14, justifyContent: 'center', alignItems: 'center', gap: 4 },
  quickActionText: { color: '#f1f5f9', fontSize: 10, fontWeight: '600', textAlign: 'center' },
  
  // Tip Card
  tipCard: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderLeftWidth: 4, borderLeftColor: '#f59e0b', marginBottom: 14 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  tipEmoji: { fontSize: 18 },
  tipTitle: { color: '#f59e0b', fontSize: 14, fontWeight: '700' },
  tipText: { color: '#94a3b8', fontSize: 13, lineHeight: 18 },
  
  // Dream Card
  dreamCard: { backgroundColor: '#1e293b', borderRadius: 18, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  dreamEmoji: { fontSize: 50, marginBottom: 10 },
  dreamTitle: { color: '#f1f5f9', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  dreamText: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  
  // Speaking Overlay - Enhanced & Fixed
  speakingOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.92)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 9999 
  },
  speakingCard: { 
    backgroundColor: '#1e293b', 
    borderRadius: 28, 
    padding: 28, 
    alignItems: 'center', 
    width: width - 40, 
    maxWidth: 400,
    maxHeight: '85%',
    borderWidth: 3, 
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  speakingGlow: { 
    position: 'absolute', 
    top: -40, 
    width: 160, 
    height: 160, 
    borderRadius: 80, 
    backgroundColor: '#10b981' 
  },
  speakingAvatar: { 
    marginBottom: 16, 
    position: 'relative' 
  },
  avatarCircle: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    backgroundColor: '#10b98125', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 4, 
    borderColor: '#10b981' 
  },
  avatarEmoji: { 
    fontSize: 55 
  },
  speakingIndicator: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#22c55e', 
    borderRadius: 16, 
    width: 32, 
    height: 32, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1e293b',
  },
  speakingIndicatorEmoji: { 
    fontSize: 16 
  },
  soundWaves: { 
    flexDirection: 'row', 
    gap: 6, 
    marginBottom: 16, 
    height: 60, 
    alignItems: 'center' 
  },
  soundWave: { 
    width: 8, 
    height: 24, 
    backgroundColor: '#10b981', 
    borderRadius: 4 
  },
  soundWaveMid: { 
    height: 40 
  },
  soundWaveCenter: { 
    height: 55 
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusBadgeSpeaking: {
    backgroundColor: '#10b98130',
  },
  statusBadgeDone: {
    backgroundColor: '#64748b30',
  },
  statusText: { 
    color: '#f1f5f9', 
    fontSize: 15, 
    fontWeight: '700' 
  },
  speakingBubble: { 
    backgroundColor: '#334155', 
    borderRadius: 20, 
    padding: 18, 
    width: '100%', 
    marginBottom: 20,
    maxHeight: 180,
  },
  bubbleScroll: {
    maxHeight: 140,
  },
  speakingText: { 
    color: '#f1f5f9', 
    fontSize: 15, 
    lineHeight: 24, 
    textAlign: 'center' 
  },
  closeButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#64748b', 
    paddingVertical: 14, 
    paddingHorizontal: 32, 
    borderRadius: 16, 
    gap: 8 
  },
  closeButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '700' 
  },
});
