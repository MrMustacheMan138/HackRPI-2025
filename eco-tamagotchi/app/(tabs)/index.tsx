// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { getPetState, resetPet } from "../../src/logic/petState.js";

export default function HomeScreen() {
  const [hasPet, setHasPet] = useState(false);

  // on first mount, check if a pet already exists
  useEffect(() => {
    async function checkPet() {
      const pet = await getPetState();
      if (pet) setHasPet(true);
    }
    checkPet();
  }, []);

  const handlePress = async () => {
    // if no pet yet, create/reset one
    if (!hasPet) {
      await resetPet();
      setHasPet(true);
    }

    // navigate to the Pet tab
    router.push("/(tabs)/pet");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Eco-Tamagotchi🌱</Text>
        <Text style={styles.subtitle}>
          Take care of your Tamagotchi friend by logging real-world eco-actions
          like recycling, walking, and saving energy. As you build habits, your
          pet grows happier and evolves!
        </Text>

        <TouchableOpacity style={styles.ctaButton} onPress={handlePress}>
          <Text style={styles.ctaText}>
            {hasPet ? "View Pet" : "Create New Pet"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#BEE3FF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BEE3FF",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2933",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  ctaButton: {
    marginTop: 4,
    backgroundColor: "#FFB3DA",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: "#F472B6",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  ctaText: {
    color: "#512051",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.8,
  },
});
