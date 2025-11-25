import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ============================================
// 🌍 MASCOTA - KAI el pequeño explorador
// ============================================
export const MascotKai = ({ 
  mood = 'happy', 
  size = 80,
  animate = true,
  message = ''
}: {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'waving' | 'sleeping';
  size?: number;
  animate?: boolean;
  message?: string;
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animate) {
      // Animación de rebote suave
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -8,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animación de saludo
      if (mood === 'waving') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(waveAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }
  }, [animate, mood]);

  const getMoodEmoji = () => {
    switch (mood) {
      case 'happy': return '😊';
      case 'thinking': return '🤔';
      case 'celebrating': return '🎉';
      case 'waving': return '👋';
      case 'sleeping': return '😴';
      default: return '😊';
    }
  };

  const waveRotation = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg'],
  });

  return (
    <View style={styles.mascotContainer}>
      <Animated.View
        style={[
          styles.mascotBody,
          {
            width: size,
            height: size,
            transform: [{ translateY: bounceAnim }],
          },
        ]}
      >
        {/* Cuerpo principal */}
        <View style={[styles.kaiBody, { width: size, height: size }]}>
          {/* Cara */}
          <View style={styles.kaiFace}>
            {/* Ojos */}
            <View style={styles.kaiEyes}>
              <View style={[styles.kaiEye, { width: size * 0.15, height: size * 0.15 }]}>
                <View style={[styles.kaiPupil, { width: size * 0.08, height: size * 0.08 }]} />
              </View>
              <View style={[styles.kaiEye, { width: size * 0.15, height: size * 0.15 }]}>
                <View style={[styles.kaiPupil, { width: size * 0.08, height: size * 0.08 }]} />
              </View>
            </View>
            {/* Sonrisa */}
            <View style={[styles.kaiSmile, { width: size * 0.3, height: size * 0.15 }]} />
          </View>
          
          {/* Mochila (representa el viaje) */}
          <View style={[styles.kaiBackpack, { width: size * 0.3, height: size * 0.4 }]}>
            <MaterialCommunityIcons name="earth" size={size * 0.15} color="#fff" />
          </View>

          {/* Gorro de explorador */}
          <View style={[styles.kaiHat, { width: size * 0.6, height: size * 0.2 }]} />
        </View>

        {/* Mano saludando */}
        {mood === 'waving' && (
          <Animated.View
            style={[
              styles.kaiHand,
              {
                transform: [{ rotate: waveRotation }],
                right: -size * 0.15,
                top: size * 0.3,
              },
            ]}
          >
            <Text style={{ fontSize: size * 0.25 }}>👋</Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Burbuja de mensaje */}
      {message && (
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>{message}</Text>
          <View style={styles.speechArrow} />
        </View>
      )}
    </View>
  );
};

// ============================================
// 🗺️ TARJETA DE AVENTURA
// ============================================
export const AdventureCard = ({
  title,
  subtitle,
  icon,
  color = '#10b981',
  progress = 0,
  isLocked = false,
  stars = 0,
  maxStars = 3,
  onPress,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  color?: string;
  progress?: number;
  isLocked?: boolean;
  stars?: number;
  maxStars?: number;
  onPress?: () => void;
  children?: React.ReactNode;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (progress >= 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [progress]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLocked}
    >
      <Animated.View
        style={[
          styles.adventureCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: isLocked ? 0.5 : 1,
          },
        ]}
      >
        {/* Decoración de esquina */}
        <View style={[styles.cardCornerDecor, { backgroundColor: color + '30' }]}>
          <View style={[styles.cardCornerInner, { backgroundColor: color }]} />
        </View>

        {/* Contenido principal */}
        <View style={styles.adventureCardContent}>
          {/* Icono con estilo de insignia */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
              <MaterialCommunityIcons
                name={isLocked ? 'lock' : icon as any}
                size={32}
                color={isLocked ? '#475569' : color}
              />
            </View>
            {progress >= 1 && (
              <Animated.View
                style={[
                  styles.badgeGlow,
                  {
                    backgroundColor: color,
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.8],
                    }),
                  },
                ]}
              />
            )}
          </View>

          {/* Información */}
          <View style={styles.adventureInfo}>
            <Text style={styles.adventureTitle}>{title}</Text>
            {subtitle && <Text style={styles.adventureSubtitle}>{subtitle}</Text>}
            
            {/* Estrellas */}
            <View style={styles.starsRow}>
              {[...Array(maxStars)].map((_, i) => (
                <MaterialCommunityIcons
                  key={i}
                  name={i < stars ? 'star' : 'star-outline'}
                  size={18}
                  color={i < stars ? '#fbbf24' : '#475569'}
                  style={styles.star}
                />
              ))}
            </View>
          </View>

          {/* Indicador de progreso circular */}
          {!isLocked && (
            <View style={styles.progressRing}>
              <View style={[styles.progressRingBg, { borderColor: color + '30' }]}>
                <Text style={[styles.progressRingText, { color }]}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Barra de progreso estilizada */}
        {!isLocked && (
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: color,
                  width: `${progress * 100}%`,
                },
              ]}
            >
              {progress > 0.1 && (
                <View style={styles.progressShine} />
              )}
            </Animated.View>
          </View>
        )}

        {children}
      </Animated.View>
    </Pressable>
  );
};

// ============================================
// 🎯 BOTÓN DE MISIÓN
// ============================================
export const MissionButton = ({
  label,
  icon,
  color = '#10b981',
  onPress,
  size = 'medium',
  disabled = false,
  pulse = false,
}: {
  label: string;
  icon?: string;
  color?: string;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  pulse?: boolean;
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pulse && !disabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [pulse, disabled]);

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 12 },
    medium: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 14 },
    large: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 16 },
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        Animated.timing(pressAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.timing(pressAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.missionButton,
          {
            backgroundColor: disabled ? '#334155' : color,
            paddingVertical: sizeStyles[size].paddingVertical,
            paddingHorizontal: sizeStyles[size].paddingHorizontal,
            transform: [
              { scale: pulseAnim },
              {
                scale: pressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                }),
              },
            ],
          },
        ]}
      >
        {/* Efecto de brillo */}
        <View style={styles.buttonShine} />

        {icon && (
          <MaterialCommunityIcons
            name={icon as any}
            size={sizeStyles[size].fontSize + 4}
            color="#fff"
            style={styles.buttonIcon}
          />
        )}
        <Text
          style={[
            styles.missionButtonText,
            { fontSize: sizeStyles[size].fontSize },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

// ============================================
// 🏆 INSIGNIA DE LOGRO
// ============================================
export const AchievementBadge = ({
  icon,
  title,
  description,
  earned = false,
  rarity = 'common',
  onPress,
}: {
  icon: string;
  title: string;
  description?: string;
  earned?: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  onPress?: () => void;
}) => {
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (earned && rarity !== 'common') {
      Animated.loop(
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [earned, rarity]);

  const rarityColors = {
    common: '#94a3b8',
    rare: '#0ea5e9',
    epic: '#8b5cf6',
    legendary: '#fbbf24',
  };

  const color = rarityColors[rarity];

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.achievementBadge, { opacity: earned ? 1 : 0.4 }]}>
        {/* Hexágono de fondo */}
        <View style={[styles.hexagon, { backgroundColor: earned ? color + '20' : '#1e293b' }]}>
          <View style={[styles.hexagonBorder, { borderColor: earned ? color : '#334155' }]}>
            <MaterialCommunityIcons
              name={earned ? icon as any : 'lock'}
              size={28}
              color={earned ? color : '#475569'}
            />
          </View>
        </View>

        {/* Brillo animado para rarezas altas */}
        {earned && rarity !== 'common' && (
          <Animated.View
            style={[
              styles.badgeShine,
              {
                transform: [
                  {
                    translateX: shineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 50],
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        <Text style={styles.achievementTitle}>{title}</Text>
        {description && <Text style={styles.achievementDesc}>{description}</Text>}
        
        {/* Indicador de rareza */}
        <View style={[styles.rarityIndicator, { backgroundColor: color }]}>
          <Text style={styles.rarityText}>{rarity.toUpperCase()}</Text>
        </View>
      </View>
    </Pressable>
  );
};

// ============================================
// 🌈 BARRA DE NIVEL/XP
// ============================================
export const XPBar = ({
  currentXP,
  maxXP,
  level,
  color = '#10b981',
}: {
  currentXP: number;
  maxXP: number;
  level: number;
  color?: string;
}) => {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const progress = currentXP / maxXP;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.xpBarContainer}>
      <View style={styles.xpLevelBadge}>
        <Text style={styles.xpLevelText}>Nv.{level}</Text>
      </View>

      <View style={styles.xpTrack}>
        <Animated.View
          style={[
            styles.xpFill,
            {
              backgroundColor: color,
              width: fillAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <View style={styles.xpShine} />
        </Animated.View>

        {/* Marcadores de progreso */}
        {[0.25, 0.5, 0.75].map((marker) => (
          <View
            key={marker}
            style={[styles.xpMarker, { left: `${marker * 100}%` }]}
          />
        ))}
      </View>

      <Text style={styles.xpText}>
        {currentXP}/{maxXP} XP
      </Text>
    </View>
  );
};

// ============================================
// 🗣️ BURBUJA DE DIÁLOGO
// ============================================
export const DialogBubble = ({
  message,
  speaker = 'kai',
  variant = 'normal',
  onPress,
}: {
  message: string;
  speaker?: 'kai' | 'user' | 'system';
  variant?: 'normal' | 'tip' | 'celebration' | 'question';
  onPress?: () => void;
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [message]);

  const variantStyles = {
    normal: { bg: '#1e293b', border: '#334155', icon: null },
    tip: { bg: '#fef3c7', border: '#fbbf24', icon: 'lightbulb-on' },
    celebration: { bg: '#d1fae5', border: '#10b981', icon: 'party-popper' },
    question: { bg: '#dbeafe', border: '#3b82f6', icon: 'help-circle' },
  };

  const style = variantStyles[variant];

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.dialogBubble,
          {
            backgroundColor: style.bg,
            borderColor: style.border,
            transform: [{ scale: bounceAnim }],
          },
        ]}
      >
        {style.icon && (
          <MaterialCommunityIcons
            name={style.icon as any}
            size={20}
            color={style.border}
            style={styles.dialogIcon}
          />
        )}
        <Text style={[styles.dialogText, { color: variant === 'normal' ? '#f1f5f9' : '#1e293b' }]}>
          {message}
        </Text>

        {/* Flecha del diálogo */}
        <View
          style={[
            styles.dialogArrow,
            {
              borderTopColor: style.bg,
              [speaker === 'user' ? 'right' : 'left']: 20,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

// ============================================
// ESTILOS
// ============================================
const styles = StyleSheet.create({
  // Mascota Kai
  mascotContainer: {
    alignItems: 'center',
  },
  mascotBody: {
    position: 'relative',
  },
  kaiBody: {
    backgroundColor: '#10b981',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  kaiFace: {
    alignItems: 'center',
    paddingTop: 10,
  },
  kaiEyes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  kaiEye: {
    backgroundColor: '#fff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kaiPupil: {
    backgroundColor: '#1e293b',
    borderRadius: 100,
  },
  kaiSmile: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopWidth: 0,
  },
  kaiBackpack: {
    position: 'absolute',
    right: -10,
    bottom: 10,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kaiHat: {
    position: 'absolute',
    top: -15,
    backgroundColor: '#fbbf24',
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  kaiHand: {
    position: 'absolute',
  },
  speechBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 12,
    maxWidth: 200,
    position: 'relative',
  },
  speechText: {
    color: '#1e293b',
    fontSize: 13,
    textAlign: 'center',
  },
  speechArrow: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },

  // Adventure Card
  adventureCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardCornerDecor: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    borderBottomLeftRadius: 60,
  },
  cardCornerInner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomLeftRadius: 30,
  },
  adventureCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    zIndex: -1,
  },
  adventureInfo: {
    flex: 1,
    marginLeft: 16,
  },
  adventureTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  adventureSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  progressRing: {
    marginLeft: 8,
  },
  progressRingBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  progressRingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#334155',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    position: 'relative',
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Mission Button
  missionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonIcon: {
    marginRight: 8,
  },
  missionButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  // Achievement Badge
  achievementBadge: {
    alignItems: 'center',
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  hexagon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  hexagonBorder: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeShine: {
    position: 'absolute',
    width: 20,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: [{ rotate: '45deg' }],
  },
  achievementTitle: {
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  achievementDesc: {
    color: '#94a3b8',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  rarityIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  rarityText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },

  // XP Bar
  xpBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 16,
  },
  xpLevelBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  xpLevelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  xpTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#334155',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  xpFill: {
    height: '100%',
    borderRadius: 6,
    position: 'relative',
  },
  xpShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  xpMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#1e293b',
  },
  xpText: {
    color: '#94a3b8',
    fontSize: 11,
    marginLeft: 12,
    fontWeight: '600',
  },

  // Dialog Bubble
  dialogBubble: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: 12,
  },
  dialogIcon: {
    marginRight: 10,
  },
  dialogText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  dialogArrow: {
    position: 'absolute',
    bottom: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});