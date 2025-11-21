import "../global.css"
import React, { useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import Svg, { Line, Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

// ===== CONFIGURACIÓN DEL SKILL TREE =====
const TREE_WIDTH = 900;
const TREE_HEIGHT = 900;

// Centro del círculo principal (un poco más abajo como en el ejemplo)
const CENTER_X = TREE_WIDTH / 2;
const CENTER_Y = TREE_HEIGHT * 0.7;

// Distancias radiales de cada "anillo"
const RADIAL_LEVELS = [0, 150, 270, 390];

type BranchDef = {
  id: string;
  label: string;
  angleDeg: number;
  titles: string[];
};
const BRANCHES: BranchDef[] = [
  {
    id: "hist",
    label: "Historia",
    angleDeg: -60,
    titles: [
      "Héroes del Fútbol en la Historia",
      "Grandes Partidos del Pasado",
      "Viajes por Ciudades Legendarias"
    ],
  },
  {
    id: "cult",
    label: "Cultura",
    angleDeg: -30,
    titles: [
      "Marruecos y España: Dos Mundos, Un Niño",
      "Fiestas, Colores y Tradiciones",
      "Arte y Dibujos del Mundo"
    ],
  },
  {
    id: "math",
    label: "Matemáticas",
    angleDeg: 0,
    titles: [
      "Cálculo de Goles y Marcadores",
      "Estrategias Numéricas del Campo",
      "Jugadas con Formas y Figuras",
      "Desafíos de Cálculo para Campeones"
    ],
  },
  {
    id: "lang",
    label: "Idioma",
    angleDeg: 30,
    titles: [
      "Español para Hacer Amigos",
      "Palabras para el Campo y el Recreo",
      "Hablar con Confianza como un Crack"
    ],
  },
  {
    id: "sci",
    label: "Ciencias",
    angleDeg: 60,
    titles: [
      "El Cuerpo del Futbolista",
      "Cómo Se Mueve el Balón",
      "La Ciencia del Deporte",
      "Curiosidades del Mundo Natural"
    ],
  },
];


type SkillNodeType = {
  id: string;
  title: string;
  x: number;
  y: number;
  unlocked: boolean;
  isRoot?: boolean;
};

type EdgeType = {
  from: string;
  to: string;
};

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(radius: number, angleDeg: number) {
  const rad = degToRad(angleDeg);
  return {
    x: CENTER_X + radius * Math.cos(rad),
    // restamos al eje Y para que los ángulos positivos vayan hacia arriba
    y: CENTER_Y - radius * Math.sin(rad),
  };
}

// Construimos nodos y edges en base a las ramas
const nodes: SkillNodeType[] = [];
const edges: EdgeType[] = [];

// Nodo raíz en el centro
nodes.push({
  id: "root",
  title: "Mohammed\nRabat",
  x: CENTER_X,
  y: CENTER_Y,
  unlocked: true,
  isRoot: true,
});

BRANCHES.forEach((branch) => {
  branch.titles.forEach((title, idx) => {
    const radius = RADIAL_LEVELS[idx + 1]; // +1 porque 0 es root
    const { x, y } = polarToCartesian(radius, branch.angleDeg);
    const id = `${branch.id}-${idx + 1}`;

    nodes.push({
      id,
      title,
      x,
      y,
      unlocked: idx === 0, // solo el primero de cada rama
    });

    // root -> primer nodo
    if (idx === 0) {
      edges.push({ from: "root", to: id });
    } else {
      // nodos siguientes de la cadena
      const prevId = `${branch.id}-${idx}`;
      edges.push({ from: prevId, to: id });
    }
  });
});

// ===== UI DE NODOS =====
type SkillNodeProps = {
  node: SkillNodeType;
};

const SkillNode: React.FC<SkillNodeProps> = ({ node }) => {
  const size = node.isRoot ? 120 : 70;
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const outerGlowSize = size + (node.unlocked || node.isRoot ? 18 : 0);

  const handlePress = () => {
    if (node.unlocked || node.isRoot) {
      // Animación de escala y brillo
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.85,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.15,
            friction: 3,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Navegar después de la animación
        setTimeout(() => {
          navigation.navigate('Centro' as never);
        }, 200);
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={{
        position: "absolute",
        left: node.x - outerGlowSize / 2,
        top: node.y - outerGlowSize / 2,
        width: outerGlowSize,
        height: outerGlowSize,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Halo exterior para los desbloqueados */}
      {(node.unlocked || node.isRoot) && (
        <Animated.View
          className="rounded-full"
          style={{
            width: outerGlowSize,
            height: outerGlowSize,
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.6],
            }),
            transform: [
              {
                scale: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
            ],
          }}
        />
      )}

      <Animated.View
        className={`items-center justify-center rounded-full border shadow-lg ${
          node.isRoot
            ? "bg-emerald-400 border-emerald-100"
            : node.unlocked
            ? "bg-slate-100"
            : "bg-slate-800"
        }`}
        style={{
          position: "absolute",
          width: size,
          height: size,
          shadowOpacity: node.unlocked || node.isRoot ? 0.8 : 0.4,
          shadowRadius: node.unlocked || node.isRoot ? 14 : 8,
          borderColor: node.isRoot ? '#d1fae5' : node.unlocked ? 'rgba(110, 231, 183, 0.8)' : 'rgba(71, 85, 105, 0.8)',
          transform: [{ scale: scaleAnim }],
        }}
      >
        {/* Icono placeholder tipo "ability" */}
        <View className="w-8 h-8 rounded-full items-center justify-center mb-1" style={{ borderWidth: 1, borderColor: 'rgba(148, 163, 184, 0.5)' }}>
          <Text
            className={`text-[18px] ${
              node.unlocked || node.isRoot ? "text-slate-900" : "text-slate-200"
            }`}
          >
            {node.isRoot ? "◎" : "✦"}
          </Text>
        </View>

        <Text
          className={`text-[9px] text-center px-1 font-semibold ${
            node.unlocked || node.isRoot ? "text-slate-900" : "text-slate-200"
          }`}
          style={{
            opacity: node.unlocked || node.isRoot ? 1 : 0.85
          }}
          numberOfLines={2}
        >
          {node.title}
        </Text>

        {!node.isRoot && (
          <Text className="mt-[1px] text-[9px]">
            {node.unlocked ? "●" : "🔒"}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ===== PANTALLA PRINCIPAL =====
const SkillTreeRadial: React.FC = () => {
  // valor inicial desplazado un poquito para que se vea centrado
  const pan = useRef(
    new Animated.ValueXY({ x: -TREE_WIDTH / 6, y: -TREE_HEIGHT / 4 })
  ).current;

  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Solo activar el pan si se mueve más de 10 pixels
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        isDragging.current = true;
        pan.setOffset({
          x: (pan as any).x._value,
          y: (pan as any).y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        // Reset después de un pequeño delay para permitir que el tap se procese
        setTimeout(() => {
          isDragging.current = false;
        }, 100);
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        setTimeout(() => {
          isDragging.current = false;
        }, 100);
      },
    })
  ).current;

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-4 pt-4 pb-5">
        {/* HEADER */}
        <View className="mb-3 flex-row items-center justify-between pt-10">
          <View>
            <Text className="text-xs text-emerald-400 font-semibold tracking-[1px] uppercase" style={{ opacity: 0.9 }}>
              Árbol de habilidades
            </Text>
            <Text className="text-lg font-bold text-slate-50">
              Rutas de aprendizaje
            </Text>
            <Text className="text-[11px] text-slate-400 mt-1">
              Arrastra el mapa para explorar el skill tree.
            </Text>
          </View>
        </View>

        {/* CONTENEDOR DEL TREE */}
        <View className="flex-1 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden">
          <Animated.View
            style={{
              width: TREE_WIDTH,
              height: TREE_HEIGHT,
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
          >
            {/* FONDO — círculos concéntricos tipo HUD */}
            <Svg
              width={TREE_WIDTH}
              height={TREE_HEIGHT}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              {/* círculos del “radar” */}
              {[160, 280, 400, 520].map((r, idx) => (
                <Circle
                  key={r}
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r={r}
                  stroke={idx % 2 === 0 ? "#1f2933" : "#111827"}
                  strokeWidth={idx === 2 ? 1.4 : 1}
                  strokeDasharray={idx === 3 ? "3 6" : "2 10"}
                  opacity={0.4 - idx * 0.06}
                  fill="none"
                />
              ))}
            </Svg>

            {/* LÍNEAS ENTRE NODOS */}
            <Svg
              width={TREE_WIDTH}
              height={TREE_HEIGHT}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              {edges.map((edge) => {
                const from = nodes.find((n) => n.id === edge.from)!;
                const to = nodes.find((n) => n.id === edge.to)!;

                return (
                  <Line
                    key={`${edge.from}-${edge.to}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#4b5563"
                    strokeWidth={3}
                    strokeLinecap="round"
                    opacity={0.9}
                  />
                );
              })}
            </Svg>

            {/* NODOS */}
            {nodes.map((node) => (
              <SkillNode key={node.id} node={node} />
            ))}
          </Animated.View>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default SkillTreeRadial;
