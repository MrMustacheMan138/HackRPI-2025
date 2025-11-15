import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getPetState, logAction, resetPet } from "./src/logic/petState.js";

export default function App() {
  const [pet, setPet] = useState({
    mood: "neutral",
    xp: 0,
    level: 1,
    lastUpdated: Date.now(),
  });

  // Load pet state on mount
  useEffect(() => {
    async function fetchPet() {
      const petData = await getPetState();
      setPet(petData);
    }
    fetchPet();
  }, []);

  const handleAction = async (actionType: "recycle" | "walk" | "energySave") => {
    const updatedPet = await logAction(actionType);
    setPet(updatedPet);
  };

  const handleReset = async () => {
    const resetedPet = await resetPet();
    setPet(resetedPet);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eco Pet</Text>
      <Text>Mood: {pet.mood}</Text>
      <Text>XP: {pet.xp}</Text>
      <Text>Level: {pet.level}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Recycle ♻️" onPress={() => handleAction("recycle")} />
        <Button title="Walk 🚶" onPress={() => handleAction("walk")} />
        <Button title="Save Energy 💡" onPress={() => handleAction("energySave")} />
      </View>

      <Button title="Reset Pet 🔄" onPress={handleReset} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 20,
    width: "100%",
    justifyContent: "space-between",
    height: 150,
  },
});
