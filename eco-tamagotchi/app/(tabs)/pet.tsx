import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  Pressable,
  ImageBackground,
  Animated,
} from "react-native";
import {
  getPetState,
  logAction,
  resetPet,
  loadHistory,
} from "../../src/logic/petState.js";
import HistorySidebar from "./components/history_sidebar";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";

// Background image
const bgImage = require("../../assets/images/newnew.png");

// Types
type ActionType = "recycle" | "walk" | "energySave";
type ActionDetail =
  | "Plastic"
  | "Paper"
  | "Electronics"
  | "Short walk"
  | "Medium walk"
  | "Long walk"
  | "Turned off lights"
  | "Shorter shower"
  | "Unplugged devices";
type PetState = {
  mood: string;
  xp: number;
  level: number;
  coins?: number;
  lastUpdated: number;
  message?: string;
  stage?: { name: string };
  actions?: Record<string, number>;
};
type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: any;
};

// Load achievements from JSON
const achievements: Achievement[] = require("../../src/storage/achievements.json");

// Pet image based on level
function getPetImage(level: number) {
  if (level >= 64) return require("../../assets/images/level3.png");
  if (level >= 32) return require("../../assets/images/Small_Man.gif");
  if (level >= 16) return require("../../assets/images/blob.gif");
  return require("../../assets/images/egg.gif");
}

export default function PetScreen() {
  const [pet, setPet] = useState<PetState>({
    mood: "neutral",
    xp: 0,
    level: 1,
    lastUpdated: Date.now(),
    actions: {},
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [pendingActionType, setPendingActionType] =
    useState<ActionType | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  // Achievement toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Load pet state & history
  useEffect(() => {
    async function fetchPet() {
      const petData = await getPetState();
      const historyData = await loadHistory();
      if (petData) setPet(petData);
      setHistory(historyData);
    }
    fetchPet();
  }, []);

  // Handle actions
  const handleAction = async (actionType: ActionType, detail?: ActionDetail) => {
    const oldLevel = pet.level;
    const updatedPet = await logAction(actionType, detail);
    setPet(updatedPet);

    const historyData = await loadHistory();
    setHistory(historyData);

    checkAchievements(updatedPet, oldLevel);
  };

  const openActionModal = (type: ActionType) => {
    setPendingActionType(type);
    setIsActionModalVisible(true);
  };

  const handleConfirmAction = async (detail: ActionDetail) => {
    if (!pendingActionType) return;
    await handleAction(pendingActionType, detail);
    setIsActionModalVisible(false);
    setPendingActionType(null);
  };

  // Reset pet
  const handleResetPet = async () => {
    const newPet = await resetPet();
    setPet(newPet);
    const historyData = await loadHistory();
    setHistory(historyData);
  };

  // Check achievements dynamically
  const checkAchievements = (updatedPet: PetState, oldLevel: number) => {
    const unlockedAchievements = achievements.filter((ach) => {
      // Level requirement
      if (ach.requirement.level && updatedPet.level >= ach.requirement.level && oldLevel < ach.requirement.level)
        return true;

      // Action requirement
      if (ach.requirement.action) {
        const count = updatedPet.actions?.[ach.requirement.action] || 0;
        return count >= ach.requirement.count;
      }

      return false;
    });

    unlockedAchievements.forEach(showAchievementToast);
  };

  // Toast animation
  const showAchievementToast = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      setToastVisible(false);
      setCurrentAchievement(null);
    });
  };

  const petImage = getPetImage(pet.level);
  const stageName = pet.stage?.name ?? "Egg";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
        {/* Coin Counter */}
        <View style={styles.coinCounter}>
          <Text style={styles.coinText}>${pet.coins || 0}</Text>
        </View>

        {/* History Sidebar button */}
        <TouchableOpacity style={styles.floatingHistoryButton} onPress={() => setSidebarVisible(true)}>
          <Text style={styles.floatingHistoryText}>☰</Text>
        </TouchableOpacity>

        <View style={styles.background}>
          <View style={styles.container}>
            <Text style={styles.appTitle}>Tama</Text>

            <View style={styles.petCard}>
              <Image source={petImage} style={styles.petImage} resizeMode="contain" />
              <Text style={styles.petName}>{stageName}</Text>
              <Text style={styles.petLevel}>Level: {pet.level}</Text>
              <Text style={styles.petMood}>
                Mood: <Text style={styles.petMoodValue}>{pet.mood}</Text>
              </Text>
              <Text style={styles.petStat}>XP: {pet.xp}</Text>
            </View>

            <View style={styles.actionsWrapper}>
              <TouchableOpacity style={[styles.actionButton, styles.recycleButton]} onPress={() => openActionModal("recycle")}>
                <Text style={styles.actionText}>RECYCLE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.walkButton]} onPress={() => openActionModal("walk")}>
                <Text style={styles.actionText}>WALK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.energyButton]} onPress={() => openActionModal("energySave")}>
                <Text style={styles.actionText}>SAVE ENERGY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Action modal */}
      <Modal visible={isActionModalVisible} transparent animationType="fade" onRequestClose={() => setIsActionModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View style={{ width: "90%", maxWidth: 420, borderRadius: 28, padding: 22, backgroundColor: "#FFE8F7", alignSelf: "center" }}>
            <Text style={{ fontFamily: "PressStart2P_400Regular", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 12, color: "#7C3AED" }}>
              {pendingActionType === "recycle" && "What did you recycle?"}
              {pendingActionType === "walk" && "How long did you walk?"}
              {pendingActionType === "energySave" && "How did you save energy?"}
            </Text>
            {pendingActionType === "recycle" &&
              ["Plastic", "Paper", "Electronics"].map(option => (
                <Pressable key={option} onPress={() => handleConfirmAction(option as ActionDetail)} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#FFF", marginBottom: 8 }}>
                  <Text style={{ fontFamily: "PressStart2P_400Regular", textAlign: "center" }}>{option}</Text>
                </Pressable>
              ))}
            {pendingActionType === "walk" &&
              ["Short walk", "Medium walk", "Long walk"].map(option => (
                <Pressable key={option} onPress={() => handleConfirmAction(option as ActionDetail)} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#FFF", marginBottom: 8 }}>
                  <Text style={{ fontFamily: "PressStart2P_400Regular", textAlign: "center" }}>{option}</Text>
                </Pressable>
              ))}
            {pendingActionType === "energySave" &&
              ["Turned off lights", "Shorter shower", "Unplugged devices"].map(option => (
                <Pressable key={option} onPress={() => handleConfirmAction(option as ActionDetail)} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#FFF", marginBottom: 8 }}>
                  <Text style={{ fontFamily: "PressStart2P_400Regular", textAlign: "center" }}>{option}</Text>
                </Pressable>
              ))}
            <Pressable onPress={() => setIsActionModalVisible(false)} style={{ marginTop: 8, alignSelf: "center" }}>
              <Text style={{ fontFamily: "PressStart2P_400Regular", color: "#6B7280" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* History Sidebar */}
      <HistorySidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        history={history}
        petActions={pet.actions}
        achievements={achievements}
        onResetPet={handleResetPet}
      />

      {/* Achievement toast */}
      {toastVisible && currentAchievement && (
        <Animated.View style={[styles.toastContainer, {
          opacity: toastAnim,
          transform: [{translateY: toastAnim.interpolate({ inputRange:[0,1], outputRange:[-100,0] })}]
        }]}>
          <Image source={require("../../assets/images/trophy_placeholder.png")} style={styles.toastIcon} />
          <View style={{marginLeft:12}}>
            <Text style={styles.toastTitle}>{currentAchievement.title}</Text>
            <Text style={styles.toastDescription}>{currentAchievement.description}</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  background: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    width: 450,
    paddingVertical: 50,
    paddingHorizontal: 30,
    borderRadius: 225,
    backgroundColor: "#FFB3DA",
    borderWidth: 4,
    borderColor: "#FF8CCF",
    alignItems: "center",
  },
  appTitle: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 18,
    color: "#7C3AED",
    textAlign: "center",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  petCard: {
    width: "80%",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 24,
    backgroundColor: "#FFFDF5",
    borderWidth: 1.5,
    borderColor: "#FBCFE8",
    marginBottom: 14,
  },
  petName: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 20,
    color: "#FB7185",
    marginBottom: 6,
  },
  petLevel: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 18,
    fontWeight: "bold",
    color: "#7C3AED",
    marginBottom: 12,
  },
  petMood: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 2,
  },
  petMoodValue: {
    fontFamily: "PressStart2P_400Regular",
    color: "#F59E0B",
  },
  petStat: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 14,
    color: "#6B7280",
  },
  petImage: { width: 120, height: 120, marginBottom: 8 },
  actionsWrapper: { marginTop: 8, width: "55%", gap: 8 },
  actionButton: {
    width: "100%",
    paddingVertical: 5,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F9A8D4",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  actionText: {
    fontFamily: "PressStart2P_400Regular",
    letterSpacing: 0.5,
    fontSize: 14,
  },
  recycleButton: { backgroundColor: "#BBF7D0" },
  walkButton: { backgroundColor: "#BFDBFE" },
  energyButton: { backgroundColor: "#FDE68A" },

  // Coin counter (top left)
  coinCounter: {
    position: "absolute",
    top: 20,
    left: 30,
    backgroundColor: "#FFD700",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFA500",
    zIndex: 100,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  coinText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },

  floatingHistoryButton: {
    position: "absolute",
    top: 20,
    right: 30,
    padding: 8,
    zIndex: 100,
  },
  floatingHistoryText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4B5563",
  },

  // Achievement toast
  toastContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  toastIcon: { width: 48, height: 48, borderRadius: 8 },
  toastTitle: {
    fontFamily: "PressStart2P_400Regular",
    color: "#FFF",
    fontSize: 14,
  },
  toastDescription: {
    fontFamily: "PressStart2P_400Regular",
    color: "#D1D5DB",
    fontSize: 10,
  },
});
