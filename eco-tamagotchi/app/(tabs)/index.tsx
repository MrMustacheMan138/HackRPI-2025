// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getPetState, logAction, resetPet } from "../../src/logic/petState.js";

type ActionType = "recycle" | "walk" | "energySave";

type PetState = {
  mood: string;
  xp: number;
  level: number;
  lastUpdated: number;
};

export default function HomeScreen() {
  const [pet, setPet] = useState<PetState>({
    mood: "neutral",
    xp: 0,
    level: 1,
    lastUpdated: Date.now(),
  });

  // Load pet state on mount
  useEffect(() => {
    async function fetchPet() {
      const petData = await getPetState();
      if (petData) setPet(petData);
    }
    fetchPet();
  }, []);

  const handleAction = async (actionType: ActionType) => {
    const updatedPet = await logAction(actionType);
    setPet(updatedPet);
  };

  const handleReset = async () => {
    const resetedPet = await resetPet();
    setPet(resetedPet);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eco Pet 🌱</Text>

      <View style={styles.stats}>
        <Text style={styles.stat}>Mood: {pet.mood}</Text>
        <Text style={styles.stat}>XP: {pet.xp}</Text>
        <Text style={styles.stat}>Level: {pet.level}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Button title="Recycle ♻️" onPress={() => handleAction("recycle")} />
        <Button title="Walk 🚶" onPress={() => handleAction("walk")} />
        <Button
          title="Save Energy 💡"
          onPress={() => handleAction("energySave")}
        />
      </View>

      <View style={styles.resetWrapper}>
        <Button title="Reset Pet 🔄" onPress={handleReset} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // 👈 change this to any color you want
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stats: {
    marginBottom: 24,
    alignItems: "center",
  },
  stat: {
    fontSize: 18,
    marginVertical: 2,
  },
  buttonRow: {
    width: "100%",
    gap: 10,
    marginBottom: 16,
  },
  resetWrapper: {
    marginTop: 8,
  },
});
