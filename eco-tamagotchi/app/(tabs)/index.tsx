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

  useEffect(() => {
    async function checkPet() {
      const pet = await getPetState();
      if (pet) setHasPet(true);
    }
    checkPet();
  }, []);

  const handlePress = async () => {
    if (!hasPet) {
      await resetPet();
      setHasPet(true);
    }
<<<<<<< Updated upstream

    // navigate to the Pet tab
    router.push("/(tabs)/pet");
=======
    navigation.navigate("Pet" as never);
>>>>>>> Stashed changes
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
    fontSize: 30,
    fontFamily: "PressStart2P_400Regular",
    color: "#1F2933",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 32,
    maxWidth: "90%",
  },

  // ⭐ PIXEL SUBTITLE
  subtitle: {
    fontSize: 15,
    fontFamily: "PressStart2P_400Regular",
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,

    // ⭐ NEW — centers the paragraph & reduces width
    maxWidth: 1000,      // limit long lines
    width: "85%",       // responsive padding on each side
    alignSelf: "center",
  },

  // ⭐ BUTTON
  ctaButton: {
<<<<<<< Updated upstream
    marginTop: 4,
    backgroundColor: "#FFB3DA",
    paddingHorizontal: 28,
    paddingVertical: 12,
=======
    marginTop: 10,
    backgroundColor: "#FFB3DA",
    paddingHorizontal: 30,
    paddingVertical: 16,
>>>>>>> Stashed changes
    borderRadius: 999,
    shadowColor: "#F472B6",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  // ⭐ PIXEL BUTTON TEXT
  ctaText: {
    color: "#512051",
<<<<<<< Updated upstream
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.8,
=======
    fontSize: 12,
    fontFamily: "PressStart2P_400Regular",
    letterSpacing: 1,
    textAlign: "center",
>>>>>>> Stashed changes
  },
});
