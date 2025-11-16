// app/(tabs)/pet.tsx
// Cleaned and organized version

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
} from "react-native";

// Correct paths
import { petState } from "../../src/logic/petState.js";
import AchievementsSidebar from ".././components/achievements_sidebar";
import HistorySidebar from "../history_sidebar.tsx";

export default function PetScreen() {
  const { level, xp, streak, updateXp } = petState;

  const [petMood, setPetMood] = useState("happy");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Bounce animation
  const playBounce = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle pet tap
  const handlePetPress = () => {
    playBounce();
    updateXp(5);
    setPetMood("excited");
    setTimeout(() => setPetMood("happy"), 1000);
  };

  // Mood decay
  useEffect(() => {
    const timer = setInterval(() => {
      if (petMood === "happy") setPetMood("neutral");
    }, 10000);

    return () => clearInterval(timer);
  }, [petMood]);

  // Image map
  const petImage = {
    happy: require("../../assets/pet/happy.png"),
    neutral: require("../../assets/pet/neutral.png"),
    excited: require("../../assets/pet/excited.png"),
    sad: require("../../assets/pet/sad.png"),
  }[petMood];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Eco Pet</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Level: {level}</Text>
        <Text style={styles.stat}>XP: {xp}</Text>
        <Text style={styles.stat}>Streak: {streak} days</Text>
      </View>

      <TouchableOpacity onPress={handlePetPress} activeOpacity={0.8}>
        <Animated.Image
          source={petImage}
          style={[styles.petImage, { transform: [{ scale: scaleAnim }] }]}
        />
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.sidebarButton}
          onPress={() => setSidebarOpen(true)}
        >
          <Text style={styles.buttonText}>Achievements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sidebarButton}
          onPress={() => setHistoryOpen(true)}
        >
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Achievements Sidebar */}
      <Modal visible={sidebarOpen} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <AchievementsSidebar onClose={() => setSidebarOpen(false)} />
        </View>
      </Modal>

      {/* History Sidebar */}
      <Modal visible={historyOpen} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <HistorySidebar onClose={() => setHistoryOpen(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF6DD",
    alignItems: "center",
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },
  statsContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  stat: {
    fontSize: 18,
    fontWeight: "500",
  },
  petImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  sidebarButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
});
