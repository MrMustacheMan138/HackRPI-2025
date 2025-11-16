// app/(tabs)/pet.tsx
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
import AchievementsSidebar from "./components/achievements_sidebar";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";

// Background & shell images
const bgImage = require("../../assets/images/newnew.png");
const shellImage = require("../../assets/images/machine.png");

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
  const [history, setHistory] = useState<any[]>([]);
  const [pendingActionType, setPendingActionType] =
    useState<ActionType | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  // Sidebars visibility
  const [historyVisible, setHistoryVisible] = useState(false);
  const [achievementsVisible, setAchievementsVisible] = useState(false);

  // Achievement toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Slide animation for side buttons
  const logButtonAnim = useRef(new Animated.Value(100)).current;
  const achButtonAnim = useRef(new Animated.Value(100)).current;

  // 🔁 Load pet state & history periodically
  useEffect(() => {
    let isMounted = true;

    async function fetchPet() {
      try {
        const petData = await getPetState();
        const historyData = await loadHistory();
        if (!isMounted) return;
        if (petData) setPet(petData);
        setHistory(historyData);
      } catch (e) {
        console.log("Error loading pet:", e);
      }
    }

    fetchPet();
    const intervalId = setInterval(fetchPet, 5000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Animate side buttons in on mount
  useEffect(() => {
    Animated.timing(logButtonAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(achButtonAnim, {
      toValue: 0,
      duration: 500,
      delay: 100,
      useNativeDriver: true,
    }).start();
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
      if (
        ach.requirement.level &&
        updatedPet.level >= ach.requirement.level &&
        oldLevel < ach.requirement.level
      )
        return true;

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

        {/* Centered machine + screen + buttons */}
        <View style={styles.background}>
          <View style={styles.shellWrapper}>
            <Text style={styles.appTitle}>Tama</Text>
            <ImageBackground source={shellImage} style={styles.shell} resizeMode="contain">
              <View style={styles.screen}>
                <Image source={petImage} style={styles.petImage} resizeMode="contain" />
                <Text style={styles.petName}>{stageName}</Text>
                <Text style={styles.petLevel}>Level: {pet.level}</Text>
                <Text style={styles.petMood}>
                  Mood: <Text style={styles.petMoodValue}>{pet.mood}</Text>
                </Text>
                <Text style={styles.petStat}>XP: {pet.xp}</Text>

                {/* Action Buttons */}
                <View style={styles.actionsWrapper}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.recycleButton]}
                    onPress={() => openActionModal("recycle")}
                  >
                    <Text style={styles.actionText}>RECYCLE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.walkButton]}
                    onPress={() => openActionModal("walk")}
                  >
                    <Text style={styles.actionText}>WALK</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.energyButton]}
                    onPress={() => openActionModal("energySave")}
                  >
                    <Text style={styles.actionText}>SAVE ENERGY</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>

        {/* Side Buttons */}
        <Animated.View style={[styles.sideButton, { top: 50, transform: [{ translateX: logButtonAnim }] }]}>
          <TouchableOpacity style={styles.sideButtonInner} onPress={() => setHistoryVisible(true)}>
            <Text style={styles.sideButtonText}>Action Log</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.sideButton, { top: 120, transform: [{ translateX: achButtonAnim }] }]}>
          <TouchableOpacity style={styles.sideButtonInner} onPress={() => setAchievementsVisible(true)}>
            <Text style={styles.sideButtonText}>Achievements</Text>
          </TouchableOpacity>
        </Animated.View>

      </ImageBackground>

      {/* Action Modal */}
      <Modal visible={isActionModalVisible} transparent animationType="fade" onRequestClose={() => setIsActionModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View style={{ width: "90%", maxWidth: 420, borderRadius: 28, padding: 22, backgroundColor: "#FFE8F7", alignSelf: "center" }}>
            <Text style={{ fontFamily: "PressStart2P_400Regular", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 12, color: "#7C3AED" }}>
              {pendingActionType === "recycle" && "What did you recycle?"}
              {pendingActionType === "walk" && "How long did you walk?"}
              {pendingActionType === "energySave" && "How did you save energy?"}
            </Text>

            {pendingActionType === "recycle" &&
              [{label: "Plastic", xp: 5}, {label: "Paper", xp: 5}, {label: "Electronics", xp: 20}].map((item) => (
                <Pressable key={item.label} onPress={() => handleConfirmAction(item.label as ActionDetail)}
                  style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#FFF", marginBottom: 8 }}>
                  <Text style={{ fontFamily: "PressStart2P_400Regular", textAlign: "center" }}>
                    {item.label} <Text style={{ fontSize: 10, color: "#22C55E" }}>+{item.xp}XP</Text>
                  </Text>
                </Pressable>
              ))}

            {pendingActionType === "walk" &&
              [{label: "Short walk", xp: 5}, {label: "Medium walk", xp: 10}, {label: "Long walk", xp: 15}].map((item) => (
                <Pressable key={item.label} onPress={() => handleConfirmAction(item.label as ActionDetail)}
                  style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#FFF", marginBottom: 8 }}>
                  <Text style={{ fontFamily: "PressStart2P_400Regular", textAlign: "center" }}>
                    {item.label} <Text style={{ fontSize: 10, color: "#22C55E" }}>+{item.xp}XP</Text>
                  </Text>
                </Pressable>
              ))}

            {pendingActionType === "energySave" &&
              [{label: "Turned off lights", xp: 3}, {label: "Shorter shower", xp: 5}, {label: "Unplugged devices", xp: 5}].map((item) => (
                <Pressable key={item.label} onPress={() => handleConfirmAction(item.label as ActionDetail)}
                  style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#FFF", marginBottom: 8 }}>
                  <Text style={{ fontFamily: "PressStart2P_400Regular", textAlign: "center" }}>
                    {item.label} <Text style={{ fontSize: 10, color: "#22C55E" }}>+{item.xp}XP</Text>
                  </Text>
                </Pressable>
              ))}

            <Pressable onPress={() => setIsActionModalVisible(false)} style={{ marginTop: 8, alignSelf: "center" }}>
              <Text style={{ fontFamily: "PressStart2P_400Regular", color: "#6B7280" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Sidebars */}
      {historyVisible && <HistorySidebar visible={historyVisible} onClose={() => setHistoryVisible(false)} history={history} petActions={pet.actions} achievements={achievements} onResetPet={handleResetPet} />}
      {achievementsVisible && <AchievementsSidebar visible={achievementsVisible} onClose={() => setAchievementsVisible(false)} achievements={achievements} pet={pet} />}
      
      {/* Achievement toast */}
      {toastVisible && currentAchievement && (
        <Animated.View style={[styles.toastContainer, { opacity: toastAnim, transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) }] }]}>
          <Image source={require("../../assets/images/trophy_placeholder.png")} style={styles.toastIcon} />
          <View style={{ marginLeft: 12 }}>
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

  shellWrapper: { alignItems: "center", justifyContent: "center" },
  shell: { width: 350, height: 350, alignItems: "center", justifyContent: "center", position: "relative" },
  screen: { position: "absolute", top: "26%", left: "22%", right: "22%", bottom: "30%", backgroundColor: "transparent", borderRadius: 12, alignItems: "center", justifyContent: "flex-start", paddingHorizontal: 8, paddingVertical: 6 },
  appTitle: { fontFamily: "PressStart2P_400Regular", fontSize: 18, color: "#7C3AED", textAlign: "center", letterSpacing: 1.5, marginBottom: 10 },
  petImage: { width: 80, height: 80, marginBottom: 6 },
  petName: { fontFamily: "PressStart2P_400Regular", fontSize: 16, color: "#FB7185", marginBottom: 4, textAlign: "center" },
  petLevel: { fontFamily: "PressStart2P_400Regular", fontSize: 12, color: "#7C3AED", marginBottom: 4 },
  petMood: { fontFamily: "PressStart2P_400Regular", fontSize: 11, color: "#4B5563", marginBottom: 2 },
  petMoodValue: { fontFamily: "PressStart2P_400Regular", color: "#F59E0B" },
  petStat: { fontFamily: "PressStart2P_400Regular", fontSize: 11, color: "#6B7280", marginBottom: 8 },
  actionsWrapper: { marginTop: 8, width: 220, gap: 8 },
  actionButton: { width: "100%", paddingVertical: 6, borderRadius: 999, alignItems: "center", justifyContent: "center", shadowColor: "#F9A8D4", shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  actionText: { fontFamily: "PressStart2P_400Regular", letterSpacing: 0.5, fontSize: 12 },
  recycleButton: { backgroundColor: "#BBF7D0" },
  walkButton: { backgroundColor: "#BFDBFE" },
  energyButton: { backgroundColor: "#FDE68A" },

  coinCounter: { position: "absolute", top: 20, left: 30, backgroundColor: "#FFD700", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: "#FFA500", zIndex: 100, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  coinText: { fontFamily: "PressStart2P_400Regular", fontSize: 16, color: "#000", fontWeight: "bold" },

  sideButton: { position: "absolute", right: 10, zIndex: 100 },
  sideButtonInner: { backgroundColor: "#7C3AED", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  sideButtonText: { fontFamily: "PressStart2P_400Regular", color: "#FFF", fontSize: 12 },

  toastContainer: { position: "absolute", top: 50, left: 20, right: 20, flexDirection: "row", alignItems: "center", backgroundColor: "#1F2937", padding: 12, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  toastIcon: { width: 48, height: 48, borderRadius: 8 },
  toastTitle: { fontFamily: "PressStart2P_400Regular", color: "#FFF", fontSize: 14 },
  toastDescription: { fontFamily: "PressStart2P_400Regular", color: "#D1D5DB", fontSize: 10 },
});
