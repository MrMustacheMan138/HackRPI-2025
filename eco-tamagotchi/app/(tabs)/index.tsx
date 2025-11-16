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

// Import pet state logic (no .js extension)
import { getPetState, resetPet } from "../../src/logic/petState";

export default function HomeScreen() {
  const [hasPet, setHasPet] = useState(false);

  // Check if a pet already exists
  useEffect(() => {
    async function checkPet() {
      try {
        const pet = await getPetState();
        console.log("Loaded pet:", pet);

        if (pet) {
          setHasPet(true);
        }
      } catch (err) {
        console.log("Error loading pet:", err);
      }
    }

    checkPet();
  }, []);

  const handlePress = async () => {
    // Create/reset pet if none exists
    if (!hasPet) {
      await resetPet();
      setHasPet(true);
    }

    // 🚀 Navigate to pet.tsx (correct path for your folder structure)
    router.push("/pet");
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

  // ⭐ PIXEL TITLE
  title: {
    fontSize: 22,
    fontFamily: "PressStart2P_400Regular",
    color: "#1F2933",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 32, // Avoids clipping with pixel font
  },
    
  subtitle: {
    fontSize: 12,
    fontFamily: "PressStart2P_400Regular",
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,

    // ⭐ NEW — centers the paragraph & reduces width
    maxWidth: 900,      // limit long lines
    width: "85%",       // responsive padding on each side
    alignSelf: "center",
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
