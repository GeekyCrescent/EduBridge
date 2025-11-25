import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Paragraph, Surface, Button } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CenterScreen() {
  return (
    <View style={styles.container}>
      <Surface style={styles.content}>
        <MaterialCommunityIcons name="robot" size={80} color="#10b981" />
        <Title style={styles.title}>Mentor Kai</Title>
        <Paragraph style={styles.subtitle}>
          Tu asistente personal de aprendizaje
        </Paragraph>
        <Button
          mode="contained"
          style={styles.button}
          buttonColor="#10b981"
          icon="play"
        >
          Comenzar lección
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  title: {
    color: '#f1f5f9',
    marginTop: 16,
    fontSize: 28,
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
  },
});