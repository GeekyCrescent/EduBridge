import "./global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import HomeScreen from "./components/HomeScreen";
import CenterScreen from "./components/CenterScreen";
import SkillTreeScreen from "./components/SkillTreeScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#020617",
            borderTopColor: "#1e293b",
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarActiveTintColor: "#34d399",
          tabBarInactiveTintColor: "#64748b",
        }}
      >
        <Tab.Screen
          name="Inicio"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color: color }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Centro"
          component={CenterScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color: color }}>📚</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Árbol"
          component={SkillTreeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color: color }}>🌳</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}