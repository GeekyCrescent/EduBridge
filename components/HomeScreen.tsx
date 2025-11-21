// App.tsx
import React from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";

type CulturalSection = {
  id: number;
  emoji: string;
  title: string;
  subtitle?: string;
  items: string[];
  tip?: string;
};

const sections: CulturalSection[] = [
  {
    id: 1,
    emoji: "🗺️",
    title: "Conoce tu nuevo país",
    subtitle: "Descubre dónde estás ahora",
    items: [
      "Este es el país donde vives ahora.",
      "Aquí te mostramos en qué región o estado estás.",
      "Verás la bandera y sabrás qué representa.",
    ],
    tip: "Vamos a explorar tu nuevo hogar paso a paso. 🎯",
  },
  {
    id: 2,
    emoji: "☎️",
    title: "Números importantes",
    subtitle: "Por si necesitas ayuda",
    items: [
      "Policía: si algo te asusta o es peligroso.",
      "Ambulancia: si alguien está muy lastimado.",
      "Bomberos: si hay fuego o mucho humo.",
      "Línea para niños: si necesitas hablar con alguien.",
    ],
    tip: "Es mejor tenerlos guardados aunque nunca los uses. 💚",
  },
  {
    id: 3,
    emoji: "🧭",
    title: "Cómo moverte sin perderte",
    subtitle: "Calles, direcciones y señales",
    items: [
      "Aprende cómo se leen las calles y los números de las casas.",
      "Reconoce señales para cruzar la calle con seguridad.",
      "Si te pierdes: respira, quédate en un lugar seguro y pide ayuda a un adulto.",
    ],
    tip: "Perderse a veces pasa. Encontrarte también. 🙂",
  },
  {
    id: 4,
    emoji: "🏫",
    title: "Tu nueva escuela",
    subtitle: "Clases, tareas y profes",
    items: [
      "Conoce cómo se organizan las clases en tu nueva escuela.",
      "Descubre qué cosas suelen pedir de tarea.",
      "Aprende cómo pedir ayuda a tus maestros.",
    ],
    tip: "Todas las escuelas son diferentes, pero todas quieren que aprendas.",
  },


  {
    id: 5,
    emoji: "🗣️",
    title: "Cultura y costumbres",
    subtitle: "Cómo saluda y habla la gente",
    items: [
      "Aprende formas comunes de saludar y despedirte.",
      "Descubre qué cosas se consideran respetuosas.",
      "Practica frases para pedir que te expliquen algo de nuevo.",
    ],
    tip: "No hay preguntas tontas, solo respuestas útiles. 😉",
  },
  {
    id: 6,
    emoji: "👀",
    title: "Cosas que verás mucho",
    subtitle: "Dinero, transporte y tiendas",
    items: [
      "Conoce cómo se ve el dinero del país.",
      "Aprende cómo funcionan los autobuses o el metro.",
      "Descubre cómo se organizan las tiendas y supermercados.",
    ],
    tip: "Si algo no sabes cómo funciona… ¡pregunta! A muchos les gusta ayudar.",
  },
  {
    id: 7,
    emoji: "🌤️",
    title: "Clima y ropa",
    subtitle: "Qué usar según el tiempo",
    items: [
      "Ideas de qué usar cuando hace mucho frío.",
      "Consejos para cuidarte cuando hace mucho calor.",
      "Qué hacer si llueve muy fuerte en tu ciudad.",
    ],
    tip: "No existe el clima malo, solo ropa equivocada. 😄",
  },
  {
    id: 8,
    emoji: "🧑‍🤝‍🧑",
    title: "Cómo hacer amigos",
    subtitle: "Frases para acercarte a los demás",
    items: [
      "Frases para invitar a alguien a jugar.",
      "Cómo presentarte y preguntar el nombre.",
      "Cómo pedir sentarte con alguien en clase.",
    ],
    tip: "Muchos amigos comienzan con una sola palabra: “Hola”.",
  },
  {
    id: 9,
    emoji: "🏥",
    title: "Salud y lugares importantes",
    subtitle: "Hospitales, farmacias y más",
    items: [
      "Qué es un hospital y cuándo ir a urgencias.",
      "Cómo reconocer una farmacia para conseguir medicina.",
      "Otros lugares útiles como bibliotecas o centros comunitarios.",
    ],
    tip: "Si algo duele o te preocupa, avisa siempre a un adulto.",
  },
  {
    id: 10,
    emoji: "🔤",
    title: "Frases útiles",
    subtitle: "Para el idioma de tu nuevo hogar",
    items: [
      "Hola, me llamo…",
      "No entiendo.",
      "¿Puedes ayudarme, por favor?",
      "¿Dónde está…?",
      "Gracias.",
    ],
    tip: "Practicar estas frases te hará más seguro cada día. 💪",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-4 pb-3 border-b border-sky-100 bg-white">
        <Text className="text-xs font-semibold text-sky-700 uppercase tracking-[2px]">
          EduBridge
        </Text>
        <Text className="mt-1 text-2xl font-extrabold text-slate-900">
          Guía cultural
        </Text>
        <Text className="mt-1 text-sm text-slate-500">
          Pensado para niños que llegan a un país nuevo. 🌍
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Pequeño “progress” estilo Duolingo */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <View className="h-2 w-full rounded-full bg-sky-100 overflow-hidden">
              <View className="h-full w-3/4 rounded-full bg-sky-500" />
            </View>
            <Text className="mt-1 text-[11px] text-slate-500">
              10 módulos culturales · Progreso: 7/10 completados
            </Text>
          </View>
          <View className="px-3 py-1 rounded-full bg-sky-50 border border-sky-100">
            <Text className="text-[11px] font-semibold text-sky-700">
              Nivel cultural A1
            </Text>
          </View>
        </View>

        {sections.map((section) => (
          <View
            key={section.id}
            className="mb-4 rounded-3xl bg-sky-50 border border-sky-100 p-4 shadow-sm"
          >
            {/* Header de la tarjeta */}
            <View className="flex-row items-center mb-3">
              <View className="mr-3 h-11 w-11 rounded-2xl bg-sky-100 items-center justify-center">
                <Text style={{ fontSize: 26 }}>{section.emoji}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] font-semibold text-sky-700">
                    MÓDULO {section.id}
                  </Text>
                  <View className="px-2 py-[2px] rounded-full bg-white border border-sky-100">
                    <Text className="text-[10px] font-semibold text-sky-600">
                      Básico
                    </Text>
                  </View>
                </View>
                <Text className="mt-[2px] text-[16px] font-extrabold text-slate-900">
                  {section.title}
                </Text>
                {section.subtitle && (
                  <Text className="text-[12px] text-slate-500 mt-[2px]">
                    {section.subtitle}
                  </Text>
                )}
              </View>
            </View>

            {/* Contenido principal */}
            <View className="mt-1">
              {section.items.map((item, index) => (
                <View key={index} className="flex-row items-start mb-1.5">
                  <Text className="mt-[1px] mr-2 text-sky-600 text-xs">•</Text>
                  <Text className="flex-1 text-[13px] leading-5 text-slate-700">
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            {/* Tip estilo Duolingo */}
            {section.tip && (
              <View className="mt-3 rounded-2xl bg-sky-100/80 px-3 py-2">
                <Text className="text-[11px] font-semibold text-sky-800">
                  TIP ✨
                </Text>
                <Text className="text-[12px] text-sky-900 mt-[2px]">
                  {section.tip}
                </Text>
              </View>
            )}
          </View>
        ))}

        <View className="mt-4 mb-8 items-center">
          <View className="px-4 py-2 rounded-full bg-sky-500 shadow">
            <Text className="text-xs font-semibold text-white">
              ¡Listo para seguir aprendiendo sobre tu nuevo hogar! 💚
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
