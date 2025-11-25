import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Modal } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { feedback } from '../../utils/feedback';

const { width, height } = Dimensions.get('window');

interface CelebrationProps {
  visible: boolean;
  type: 'levelUp' | 'achievement' | 'adventureComplete' | 'streak';
  title: string;
  subtitle?: string;
  icon?: string;
  onDismiss: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const Celebration = ({
  visible,
  type,
  title,
  subtitle,
  icon,
  onDismiss,
  autoHide = true,
  autoHideDelay = 3000,
}: CelebrationProps) => {
  const confettiRef = useRef<ConfettiCannon>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (visible) {
      // Trigger haptic and sound
      if (type === 'levelUp') {
        feedback.levelUp();
      } else {
        feedback.celebrate();
      }

      // Show confetti
      setShowConfetti(true);

      // Animate modal
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide
      if (autoHide) {
        setTimeout(() => {
          handleDismiss();
        }, autoHideDelay);
      }
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfetti(false);
      onDismiss();
    });
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'levelUp':
        return {
          color: '#fbbf24',
          bgColor: '#fbbf24' + '20',
          defaultIcon: 'arrow-up-bold-circle',
          confettiColors: ['#fbbf24', '#f59e0b', '#fcd34d', '#fef3c7'],
        };
      case 'achievement':
        return {
          color: '#8b5cf6',
          bgColor: '#8b5cf6' + '20',
          defaultIcon: 'trophy',
          confettiColors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed'],
        };
      case 'adventureComplete':
        return {
          color: '#10b981',
          bgColor: '#10b981' + '20',
          defaultIcon: 'flag-checkered',
          confettiColors: ['#10b981', '#34d399', '#6ee7b7', '#059669'],
        };
      case 'streak':
        return {
          color: '#f43f5e',
          bgColor: '#f43f5e' + '20',
          defaultIcon: 'fire',
          confettiColors: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48'],
        };
      default:
        return {
          color: '#10b981',
          bgColor: '#10b981' + '20',
          defaultIcon: 'star',
          confettiColors: ['#10b981', '#0ea5e9', '#8b5cf6', '#fbbf24'],
        };
    }
  };

  const config = getTypeConfig();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        {/* Confetti */}
        {showConfetti && (
          <ConfettiCannon
            ref={confettiRef}
            count={100}
            origin={{ x: width / 2, y: -20 }}
            autoStart
            fadeOut
            explosionSpeed={400}
            fallSpeed={3000}
            colors={config.confettiColors}
          />
        )}

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Surface style={[styles.modal, { borderColor: config.color }]}>
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
              <MaterialCommunityIcons
                name={(icon || config.defaultIcon) as any}
                size={48}
                color={config.color}
              />
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: config.color }]}>{title}</Text>

            {/* Subtitle */}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

            {/* Stars decoration */}
            <View style={styles.starsRow}>
              {[...Array(3)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={{
                    transform: [
                      {
                        scale: scaleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        rotate: scaleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  }}
                >
                  <MaterialCommunityIcons
                    name="star"
                    size={24}
                    color="#fbbf24"
                    style={{ marginHorizontal: 4 }}
                  />
                </Animated.View>
              ))}
            </View>
          </Surface>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    maxWidth: 320,
  },
  modal: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 3,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default Celebration;