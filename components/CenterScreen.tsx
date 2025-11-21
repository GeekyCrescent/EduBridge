import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { Audio } from "expo-av";
import MentorKaiService, { PerfilEstudiante } from "../services/MentorKaiService";

export default function CenterScreen() {
  const [perfil, setPerfil] = useState<PerfilEstudiante | null>(null);
  const [explicacion, setExplicacion] = useState<string>("");
  const [pregunta, setPregunta] = useState<string>("");
  const [respuestaUsuario, setRespuestaUsuario] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);
  const [conexionActiva, setConexionActiva] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [reproduciendoAudio, setReproduciendoAudio] = useState<boolean>(false);

  useEffect(() => {
    verificarConexion();
    
    // Configurar audio
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
      } catch (error) {
        console.error("Error configurando audio:", error);
      }
    };

    setupAudio();

    return () => {
      // Limpiar audio al desmontar
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const verificarConexion = async () => {
    const activo = await MentorKaiService.verificarConexion();
    setConexionActiva(activo);
    if (!activo) {
      Alert.alert(
        "Error de conexión",
        "No se puede conectar al servidor. Asegúrate de que el backend esté corriendo en http://localhost:5000"
      );
    } else {
      cargarPerfil();
    }
  };

  const cargarPerfil = async () => {
    const perfilData = await MentorKaiService.obtenerPerfil();
    if (perfilData) {
      setPerfil(perfilData);
    }
  };

  const iniciarAprendizaje = async () => {
    setCargando(true);
    setFeedback("");
    setRespuestaUsuario("");

    const flujo = await MentorKaiService.flujoCompleto();
    if (flujo) {
      setExplicacion(flujo.explicacion);
      setPregunta(flujo.pregunta);
    } else {
      Alert.alert("Error", "No se pudo obtener la lección");
    }
    setCargando(false);
  };

  const enviarRespuesta = async () => {
    if (!respuestaUsuario.trim()) {
      Alert.alert("Error", "Por favor escribe una respuesta");
      return;
    }

    setCargando(true);
    const retroalimentacion = await MentorKaiService.obtenerRetroalimentacion(
      pregunta,
      respuestaUsuario
    );

    if (retroalimentacion) {
      setFeedback(retroalimentacion);
    } else {
      Alert.alert("Error", "No se pudo obtener retroalimentación");
    }
    setCargando(false);
  };

  const leerTexto = async (texto: string) => {
    try {
      setReproduciendoAudio(true);
      
      // Si ya hay un audio reproduciéndose, detenerlo
      if (sound) {
        await sound.unloadAsync();
      }

      // Obtener audio en base64 del backend
      const audioBase64 = await MentorKaiService.textoAAudio(texto);
      
      if (!audioBase64) {
        Alert.alert("Error", "No se pudo generar el audio");
        setReproduciendoAudio(false);
        return;
      }

      // Crear URI de datos (data URI) directamente
      const dataUri = `data:audio/mp3;base64,${audioBase64}`;

      // Crear y reproducir el audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: dataUri },
        { shouldPlay: true }
      );

      setSound(newSound);

      // Cuando termine de reproducir
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          setReproduciendoAudio(false);
        }
      });

    } catch (error) {
      console.error("Error reproduciendo audio:", error);
      Alert.alert("Error", "No se pudo reproducir el audio");
      setReproduciendoAudio(false);
    }
  };

  if (!conexionActiva) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-xl font-bold text-white mb-2">
            Sin conexión al servidor
          </Text>
          <Text className="text-sm text-slate-400 text-center mb-4">
            Asegúrate de que el backend esté corriendo:
          </Text>
          <View className="bg-slate-800 rounded-xl p-4 mb-4">
            <Text className="text-xs text-emerald-400 font-mono">
              python implementacionReact.py
            </Text>
          </View>
          <TouchableOpacity
            onPress={verificarConexion}
            className="bg-emerald-500 rounded-2xl px-6 py-3"
          >
            <Text className="text-white font-semibold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-xs text-emerald-400 font-semibold tracking-[1px] uppercase">
            Mentor Kai
          </Text>
          <Text className="text-2xl font-bold text-white mt-1">
            Aprendizaje Personalizado
          </Text>
          {perfil && (
            <Text className="text-sm text-slate-400 mt-2">
              ¡Hola {perfil.nombre}! 👋
            </Text>
          )}
        </View>

        {/* Botón para iniciar */}
        {!explicacion && (
          <TouchableOpacity
            onPress={iniciarAprendizaje}
            disabled={cargando}
            className="bg-emerald-500 rounded-2xl p-4 items-center mb-4"
          >
            {cargando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Comenzar Lección 🚀
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Explicación */}
        {explicacion && (
          <View className="bg-slate-800 rounded-3xl p-5 mb-4 border border-slate-700">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-emerald-400 font-bold text-lg">
                📚 Explicación
              </Text>
              <TouchableOpacity onPress={() => leerTexto(explicacion)}>
                <Text className="text-2xl">🔊</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white text-base leading-6">{explicacion}</Text>
          </View>
        )}

        {/* Pregunta */}
        {pregunta && (
          <View className="bg-slate-800 rounded-3xl p-5 mb-4 border border-slate-700">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sky-400 font-bold text-lg">
                ❓ Pregunta
              </Text>
              <TouchableOpacity onPress={() => leerTexto(pregunta)}>
                <Text className="text-2xl">🔊</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white text-base leading-6 mb-4">
              {pregunta}
            </Text>

            {!feedback && (
              <>
                <TextInput
                  className="bg-slate-900 text-white rounded-2xl px-4 py-3 mb-3 border border-slate-600"
                  placeholder="Escribe tu respuesta..."
                  placeholderTextColor="#64748b"
                  value={respuestaUsuario}
                  onChangeText={setRespuestaUsuario}
                  multiline
                />
                <TouchableOpacity
                  onPress={enviarRespuesta}
                  disabled={cargando}
                  className="bg-sky-500 rounded-2xl p-3 items-center"
                >
                  {cargando ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold">Enviar</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Retroalimentación */}
        {feedback && (
          <View className="bg-slate-800 rounded-3xl p-5 mb-4 border border-emerald-700">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-emerald-400 font-bold text-lg">
                ✨ Retroalimentación
              </Text>
              <TouchableOpacity onPress={() => leerTexto(feedback)}>
                <Text className="text-2xl">🔊</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white text-base leading-6 mb-4">
              {feedback}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setExplicacion("");
                setPregunta("");
                setFeedback("");
                setRespuestaUsuario("");
              }}
              className="bg-emerald-500 rounded-2xl p-3 items-center"
            >
              <Text className="text-white font-bold">Nueva Lección</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}