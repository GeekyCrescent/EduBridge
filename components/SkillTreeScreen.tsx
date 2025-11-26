import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  Modal,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Line, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ==================== TYPES ====================
type SkillNode = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xpRequired: number;
  xpCurrent: number;
  branch: string;
  level: number; // 0 = center, 1, 2, 3 = outer levels
  angle: number; // angle in degrees from center
};

type Branch = {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  icon: string;
  angle: number; // base angle for this branch
};

// ==================== DATA ====================
const BRANCHES: Branch[] = [
  { id: 'culture', name: 'Culture', color: '#ef4444', glowColor: '#fca5a5', icon: '🎭', angle: 90 },
  { id: 'language', name: 'Language', color: '#22d3ee', glowColor: '#a5f3fc', icon: '💬', angle: 30 },
  { id: 'social', name: 'Social', color: '#22c55e', glowColor: '#86efac', icon: '🤝', angle: -30 },
  { id: 'navigation', name: 'Navigation', color: '#a855f7', glowColor: '#d8b4fe', icon: '🧭', angle: -90 },
  { id: 'academic', name: 'Academic', color: '#eab308', glowColor: '#fde047', icon: '📚', angle: -150 },
  { id: 'safety', name: 'Safety', color: '#ec4899', glowColor: '#f9a8d4', icon: '🛡️', angle: 150 },
];

const SKILLS: SkillNode[] = [
  // Center node
  { id: 'center', title: 'Your Journey', description: 'Start your adventure in a new country', icon: '🌟', unlocked: true, xpRequired: 0, xpCurrent: 0, branch: 'center', level: 0, angle: 0 },
  
  // Culture Branch (Red) - angle 90
  { id: 'culture-1', title: 'Greetings', description: 'Learn how people say hello', icon: '👋', unlocked: true, xpRequired: 50, xpCurrent: 50, branch: 'culture', level: 1, angle: 90 },
  { id: 'culture-2', title: 'Traditions', description: 'Discover local celebrations', icon: '🎉', unlocked: true, xpRequired: 100, xpCurrent: 75, branch: 'culture', level: 2, angle: 90 },
  { id: 'culture-3', title: 'Customs', description: 'Understand daily habits', icon: '🏠', unlocked: false, xpRequired: 150, xpCurrent: 0, branch: 'culture', level: 3, angle: 90 },
  { id: 'culture-2b', title: 'Holidays', description: 'Learn about special days', icon: '🎄', unlocked: false, xpRequired: 120, xpCurrent: 0, branch: 'culture', level: 2, angle: 110 },
  
  // Language Branch (Cyan) - angle 30
  { id: 'language-1', title: 'Basic Words', description: 'Essential vocabulary', icon: '📝', unlocked: true, xpRequired: 50, xpCurrent: 50, branch: 'language', level: 1, angle: 30 },
  { id: 'language-2', title: 'Phrases', description: 'Common expressions', icon: '💭', unlocked: true, xpRequired: 100, xpCurrent: 100, branch: 'language', level: 2, angle: 30 },
  { id: 'language-3', title: 'Conversations', description: 'Talk with confidence', icon: '🗣️', unlocked: false, xpRequired: 150, xpCurrent: 0, branch: 'language', level: 3, angle: 30 },
  { id: 'language-2b', title: 'Numbers', description: 'Count and calculate', icon: '🔢', unlocked: true, xpRequired: 80, xpCurrent: 80, branch: 'language', level: 2, angle: 50 },
  { id: 'language-3b', title: 'Reading', description: 'Understand written text', icon: '📖', unlocked: false, xpRequired: 200, xpCurrent: 0, branch: 'language', level: 3, angle: 10 },
  
  // Social Branch (Green) - angle -30
  { id: 'social-1', title: 'Making Friends', description: 'How to approach others', icon: '😊', unlocked: true, xpRequired: 50, xpCurrent: 50, branch: 'social', level: 1, angle: -30 },
  { id: 'social-2', title: 'Playground', description: 'Games and activities', icon: '⚽', unlocked: true, xpRequired: 100, xpCurrent: 60, branch: 'social', level: 2, angle: -30 },
  { id: 'social-3', title: 'Teamwork', description: 'Work together with others', icon: '🤜', unlocked: false, xpRequired: 150, xpCurrent: 0, branch: 'social', level: 3, angle: -30 },
  { id: 'social-2b', title: 'Kindness', description: 'Being nice to everyone', icon: '💚', unlocked: false, xpRequired: 90, xpCurrent: 0, branch: 'social', level: 2, angle: -10 },
  
  // Navigation Branch (Purple) - angle -90
  { id: 'navigation-1', title: 'My School', description: 'Find your way around', icon: '🏫', unlocked: true, xpRequired: 50, xpCurrent: 50, branch: 'navigation', level: 1, angle: -90 },
  { id: 'navigation-2', title: 'My City', description: 'Explore your neighborhood', icon: '🏙️', unlocked: false, xpRequired: 100, xpCurrent: 30, branch: 'navigation', level: 2, angle: -90 },
  { id: 'navigation-3', title: 'Transport', description: 'Buses, trains and more', icon: '🚌', unlocked: false, xpRequired: 150, xpCurrent: 0, branch: 'navigation', level: 3, angle: -90 },
  { id: 'navigation-2b', title: 'Street Signs', description: 'Read important signs', icon: '🚸', unlocked: false, xpRequired: 80, xpCurrent: 0, branch: 'navigation', level: 2, angle: -70 },
  
  // Academic Branch (Yellow) - angle -150
  { id: 'academic-1', title: 'Classroom', description: 'School rules and routines', icon: '✏️', unlocked: true, xpRequired: 50, xpCurrent: 50, branch: 'academic', level: 1, angle: -150 },
  { id: 'academic-2', title: 'Homework', description: 'Complete assignments', icon: '📓', unlocked: true, xpRequired: 100, xpCurrent: 100, branch: 'academic', level: 2, angle: -150 },
  { id: 'academic-3', title: 'Tests', description: 'Prepare for exams', icon: '📋', unlocked: false, xpRequired: 150, xpCurrent: 0, branch: 'academic', level: 3, angle: -150 },
  { id: 'academic-2b', title: 'Subjects', description: 'Math, science and more', icon: '🔬', unlocked: false, xpRequired: 120, xpCurrent: 0, branch: 'academic', level: 2, angle: -130 },
  { id: 'academic-3b', title: 'Projects', description: 'Create amazing work', icon: '🎨', unlocked: false, xpRequired: 180, xpCurrent: 0, branch: 'academic', level: 3, angle: -170 },
  
  // Safety Branch (Pink) - angle 150
  { id: 'safety-1', title: 'Emergency', description: 'Important numbers', icon: '📞', unlocked: true, xpRequired: 50, xpCurrent: 50, branch: 'safety', level: 1, angle: 150 },
  { id: 'safety-2', title: 'Health', description: 'Stay healthy and safe', icon: '🏥', unlocked: false, xpRequired: 100, xpCurrent: 20, branch: 'safety', level: 2, angle: 150 },
  { id: 'safety-3', title: 'First Aid', description: 'Basic help skills', icon: '🩹', unlocked: false, xpRequired: 150, xpCurrent: 0, branch: 'safety', level: 3, angle: 150 },
  { id: 'safety-2b', title: 'Strangers', description: 'Staying safe with others', icon: '⚠️', unlocked: false, xpRequired: 90, xpCurrent: 0, branch: 'safety', level: 2, angle: 170 },
];

// ==================== HELPER FUNCTIONS ====================
const polarToCartesian = (angle: number, radius: number, centerX: number, centerY: number) => {
  const angleRad = (angle - 90) * (Math.PI / 180);
  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  };
};

const getBranchColor = (branchId: string): string => {
  const branch = BRANCHES.find(b => b.id === branchId);
  return branch?.color || '#ffffff';
};

const getGlowColor = (branchId: string): string => {
  const branch = BRANCHES.find(b => b.id === branchId);
  return branch?.glowColor || '#ffffff';
};

// ==================== COMPONENTS ====================

// Skill Node Component
const SkillNodeComponent = ({ 
  skill, 
  x, 
  y, 
  onPress 
}: { 
  skill: SkillNode; 
  x: number; 
  y: number;
  onPress: () => void;
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const color = skill.branch === 'center' ? '#ffffff' : getBranchColor(skill.branch);
  const glowColor = skill.branch === 'center' ? '#ffffff' : getGlowColor(skill.branch);
  const size = skill.level === 0 ? 80 : 56;

  useEffect(() => {
    if (skill.unlocked) {
      // Pulse animation for unlocked nodes
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [skill.unlocked]);

  return (
    <TouchableOpacity
      style={[
        styles.skillNode,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Glow effect */}
      {skill.unlocked && (
        <Animated.View
          style={[
            styles.nodeGlow,
            {
              width: size + 20,
              height: size + 20,
              borderRadius: (size + 20) / 2,
              backgroundColor: glowColor,
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.5],
              }),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}
      
      {/* Main node */}
      <Animated.View
        style={[
          styles.nodeInner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: skill.unlocked ? color : '#374151',
            backgroundColor: skill.unlocked ? `${color}20` : '#1f2937',
            transform: [{ scale: skill.unlocked ? pulseAnim : 1 }],
          },
        ]}
      >
        {/* Inner circle decoration */}
        <View
          style={[
            styles.nodeInnerCircle,
            {
              width: size - 12,
              height: size - 12,
              borderRadius: (size - 12) / 2,
              borderColor: skill.unlocked ? `${color}60` : '#374151',
            },
          ]}
        >
          <Text style={[styles.nodeIcon, { fontSize: skill.level === 0 ? 32 : 24 }]}>
            {skill.unlocked ? skill.icon : '🔒'}
          </Text>
        </View>
      </Animated.View>

      {/* Progress ring for partially completed */}
      {skill.unlocked && skill.xpCurrent < skill.xpRequired && skill.xpRequired > 0 && (
        <View style={[styles.progressRing, { width: size + 8, height: size + 8 }]}>
          <View
            style={[
              styles.progressArc,
              {
                borderColor: color,
                transform: [{ rotate: `${(skill.xpCurrent / skill.xpRequired) * 360}deg` }],
              },
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

// Connection Line Component
const ConnectionLine = ({ 
  x1, 
  y1, 
  x2, 
  y2, 
  color, 
  unlocked 
}: { 
  x1: number; 
  y1: number; 
  x2: number; 
  y2: number;
  color: string;
  unlocked: boolean;
}) => {
  return (
    <Svg style={StyleSheet.absoluteFill}>
      {/* Glow line */}
      {unlocked && (
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={6}
          opacity={0.3}
          strokeLinecap="round"
        />
      )}
      {/* Main line */}
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={unlocked ? color : '#374151'}
        strokeWidth={3}
        opacity={unlocked ? 1 : 0.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

// Skill Detail Modal
const SkillDetailModal = ({ 
  skill, 
  visible, 
  onClose 
}: { 
  skill: SkillNode | null; 
  visible: boolean;
  onClose: () => void;
}) => {
  if (!skill) return null;
  
  const color = skill.branch === 'center' ? '#10b981' : getBranchColor(skill.branch);
  const progress = skill.xpRequired > 0 ? (skill.xpCurrent / skill.xpRequired) * 100 : 100;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <Surface style={[styles.modalContent, { borderColor: color }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { backgroundColor: `${color}20` }]}>
              <Text style={styles.modalIcon}>{skill.icon}</Text>
              <Text style={[styles.modalTitle, { color }]}>{skill.title}</Text>
            </View>

            {/* Description */}
            <Text style={styles.modalDescription}>{skill.description}</Text>

            {/* Progress */}
            {skill.xpRequired > 0 && (
              <View style={styles.modalProgress}>
                <View style={styles.modalProgressHeader}>
                  <Text style={styles.modalProgressLabel}>Progress</Text>
                  <Text style={[styles.modalProgressValue, { color }]}>
                    {skill.xpCurrent}/{skill.xpRequired} XP
                  </Text>
                </View>
                <View style={styles.modalProgressBar}>
                  <View 
                    style={[
                      styles.modalProgressFill, 
                      { width: `${progress}%`, backgroundColor: color }
                    ]} 
                  />
                </View>
              </View>
            )}

            {/* Status */}
            <View style={[styles.modalStatus, { backgroundColor: skill.unlocked ? `${color}20` : '#374151' }]}>
              <MaterialCommunityIcons 
                name={skill.unlocked ? 'check-circle' : 'lock'} 
                size={20} 
                color={skill.unlocked ? color : '#9ca3af'} 
              />
              <Text style={[styles.modalStatusText, { color: skill.unlocked ? color : '#9ca3af' }]}>
                {skill.unlocked ? 'Unlocked' : 'Complete previous skills to unlock'}
              </Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity 
              style={[
                styles.modalButton, 
                { backgroundColor: skill.unlocked ? color : '#374151' }
              ]}
              disabled={!skill.unlocked}
            >
              <Text style={styles.modalButtonText}>
                {skill.unlocked ? 'Practice Now' : 'Locked'}
              </Text>
              {skill.unlocked && (
                <MaterialCommunityIcons name="play" size={20} color="white" />
              )}
            </TouchableOpacity>
          </Surface>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ==================== MAIN SCREEN ====================
export default function SkillTreeScreen() {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Tree dimensions
  const TREE_WIDTH = 600;
  const TREE_HEIGHT = 700;
  const CENTER_X = TREE_WIDTH / 2;
  const CENTER_Y = TREE_HEIGHT / 2;
  
  // Radius for each level
  const LEVEL_RADIUS = [0, 100, 180, 260];

  // Calculate positions for all skills
  const getSkillPosition = (skill: SkillNode) => {
    if (skill.level === 0) {
      return { x: CENTER_X, y: CENTER_Y };
    }
    return polarToCartesian(skill.angle, LEVEL_RADIUS[skill.level], CENTER_X, CENTER_Y);
  };

  // Get connections between nodes
  const getConnections = () => {
    const connections: { from: SkillNode; to: SkillNode }[] = [];
    
    SKILLS.forEach(skill => {
      if (skill.level === 0) return;
      
      // Find parent node
      let parentSkill: SkillNode | undefined;
      
      if (skill.level === 1) {
        parentSkill = SKILLS.find(s => s.level === 0);
      } else {
        // Find the previous level node in the same branch with closest angle
        const sameBranchPrevLevel = SKILLS.filter(
          s => s.branch === skill.branch && s.level === skill.level - 1
        );
        
        if (sameBranchPrevLevel.length > 0) {
          parentSkill = sameBranchPrevLevel.reduce((closest, current) => {
            const closestDiff = Math.abs(closest.angle - skill.angle);
            const currentDiff = Math.abs(current.angle - skill.angle);
            return currentDiff < closestDiff ? current : closest;
          });
        }
      }
      
      if (parentSkill) {
        connections.push({ from: parentSkill, to: skill });
      }
    });
    
    return connections;
  };

  const handleSkillPress = (skill: SkillNode) => {
    setSelectedSkill(skill);
    setModalVisible(true);
  };

  const connections = getConnections();

  // Calculate total XP
  const totalXP = SKILLS.reduce((sum, skill) => sum + skill.xpCurrent, 0);
  const unlockedCount = SKILLS.filter(s => s.unlocked).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Skill Tree</Text>
            <Text style={styles.headerSubtitle}>Your learning journey</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <MaterialCommunityIcons name="star" size={16} color="#fbbf24" />
              <Text style={styles.statText}>{totalXP} XP</Text>
            </View>
            <View style={styles.statBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color="#22c55e" />
              <Text style={styles.statText}>{unlockedCount}/{SKILLS.length}</Text>
            </View>
          </View>
        </View>
        
        {/* Branch Legend */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.legendScroll}
          contentContainerStyle={styles.legendContainer}
        >
          {BRANCHES.map(branch => (
            <View key={branch.id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: branch.color }]} />
              <Text style={styles.legendText}>{branch.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Skill Tree */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.treeContainer}
        contentContainerStyle={[
          styles.treeContent,
          { width: TREE_WIDTH, height: TREE_HEIGHT },
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentOffset={{ x: (TREE_WIDTH - SCREEN_WIDTH) / 2, y: 0 }}
      >
        {/* Background circles */}
        <Svg style={StyleSheet.absoluteFill}>
          {LEVEL_RADIUS.slice(1).map((radius, index) => (
            <Circle
              key={index}
              cx={CENTER_X}
              cy={CENTER_Y}
              r={radius}
              stroke="#1f2937"
              strokeWidth={1}
              strokeDasharray="5,5"
              fill="none"
              opacity={0.5}
            />
          ))}
        </Svg>

        {/* Connection Lines */}
        {connections.map((conn, index) => {
          const fromPos = getSkillPosition(conn.from);
          const toPos = getSkillPosition(conn.to);
          const color = getBranchColor(conn.to.branch);
          const unlocked = conn.from.unlocked && conn.to.unlocked;
          
          return (
            <ConnectionLine
              key={index}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              color={color}
              unlocked={unlocked}
            />
          );
        })}

        {/* Skill Nodes */}
        {SKILLS.map(skill => {
          const pos = getSkillPosition(skill);
          return (
            <SkillNodeComponent
              key={skill.id}
              skill={skill}
              x={pos.x}
              y={pos.y}
              onPress={() => handleSkillPress(skill)}
            />
          );
        })}
      </ScrollView>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* Bottom info */}
      <Surface style={styles.bottomInfo}>
        <MaterialCommunityIcons name="information-outline" size={20} color="#64748b" />
        <Text style={styles.bottomInfoText}>
          Tap on any skill to see details. Complete adventures to unlock new skills!
        </Text>
      </Surface>
    </View>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#1e293b',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statText: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '600',
  },
  legendScroll: {
    marginTop: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  treeContainer: {
    flex: 1,
  },
  treeContent: {
    position: 'relative',
  },
  skillNode: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeGlow: {
    position: 'absolute',
  },
  nodeInner: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  nodeInnerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  nodeIcon: {
    textAlign: 'center',
  },
  progressRing: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressArc: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 2,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    width: SCREEN_WIDTH - 48,
    maxWidth: 360,
    overflow: 'hidden',
    borderWidth: 2,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  modalDescription: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalProgress: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalProgressLabel: {
    color: '#64748b',
    fontSize: 14,
  },
  modalProgressValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalProgressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    gap: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  bottomInfoText: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
});
