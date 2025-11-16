// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";

// Import pet state logic (no .js extension)
import { getPetState, resetPet } from "../../src/logic/petState";

export default function HomeScreen() {
  const [hasPet, setHasPet] = useState(false);

  // Check if a pet already exists
  useEffect(() => {
    let isMounted = true;

    async function checkPet() {
      const petData = await getPetState();
      if (isMounted && petData) {
        setHasPet(true);
      }
    }

    // call immediately
    // call immediately
    checkPet();

    // then every 5 seconds (tune this)
    const intervalId = setInterval(checkPet, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handlePress = async () => {
    // Create/reset pet if none exists
    if (!hasPet) {
      await resetPet();
      setHasPet(true);
    }

    router.push("/pet");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../../assets/images/wallpaper4.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.textBox}>
            <Text style={styles.title}>Eco-Tamagotchi</Text>
            <Text style={styles.subtitle}>
              Take care of your Tamagotchi friend by logging real-world eco-actions
              like recycling, walking, and saving energy. As you build habits, your
              pet grows happier and evolves!
            </Text>
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={handlePress}>
            <Text style={styles.ctaText}>
              {hasPet ? "View Pet" : "Create New Pet"}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  textBox: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    width: "90%",
    maxWidth: 600,
  },

  // ⭐ PIXEL TITLE
  title: {
    fontSize: 22,
    fontFamily: "PressStart2P_400Regular",
    color: "#1F2933",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 32,
  },
    
  subtitle: {
    fontSize: 12,
    fontFamily: "PressStart2P_400Regular",
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 40,
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
