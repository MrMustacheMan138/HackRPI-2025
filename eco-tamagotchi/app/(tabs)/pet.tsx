// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
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
} from "react-native";
import {
  getPetState,
  logAction,
  resetPet,
  loadHistory,
} from "../../src/logic/petState.js";
import HistorySidebar from "./components/history_sidebar";
// import { playSound } from "../../src/utils/sounds";
import {
  Baloo2_400Regular,
  Baloo2_600SemiBold,
} from "@expo-google-fonts/baloo-2";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";

const bgImage = require("../../assets/images/newnew.png");

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
  lastUpdated: number;
  message?: string;
  stage?: { name: string };
};

function getPetImage(level: number) {
  if (level >= 4) return require("../../assets/images/level3.png");
  if (level >= 3) return require("../../assets/images/level2.png");
  if (level >= 2) return require("../../assets/images/blob.gif");
  return require("../../assets/images/egg.gif");
}

export default function PetScreen() {
  const [pet, setPet] = useState<PetState>({
    mood: "neutral",
    xp: 0,
    level: 1,
    lastUpdated: Date.now(),
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [pendingActionType, setPendingActionType] =
    useState<ActionType | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  // Load pet state & history on mount
  useEffect(() => {
    async function fetchPet() {
      const petData = await getPetState();
      if (petData) setPet(petData);

      const historyData = await loadHistory();
      setHistory(historyData);
    }
    fetchPet();
  }, []);

  const handleAction = async (actionType: ActionType, detail?: ActionDetail) => {
    const oldLevel = pet.level;
    const updatedPet = await logAction(actionType, detail);
    setPet(updatedPet);

    // if (updatedPet.level > oldLevel) {
    //   playSound("levelUp");
    // }

    const historyData = await loadHistory();
    setHistory(historyData);
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

  // 🔁 RESET HANDLER – used by sidebar button
  const handleResetPet = async () => {
    const newPet = await resetPet();     // resets to default (egg, level 1, xp 0)
    setPet(newPet);

    const historyData = await loadHistory(); // keep or clear history as your logic decides
    setHistory(historyData);
  };

  const petImage = getPetImage(pet.level);
  const stageName = pet.stage?.name ?? "Egg";

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background image wraps the main content */}
      <ImageBackground
        source={bgImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Floating History Button - TOP RIGHT */}
        <TouchableOpacity
          style={styles.floatingHistoryButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Text style={styles.floatingHistoryText}>☰</Text>
        </TouchableOpacity>

        {/* Center content over background */}
        <View style={styles.background}>
          <View style={styles.container}>
            {/* Title */}
            <Text style={styles.appTitle}>Tama</Text>

            {/* Pet card */}
            <View style={styles.petCard}>
              <Image
                source={petImage}
                style={styles.petImage}
                resizeMode="contain"
              />
              <Text style={styles.petName}>{stageName}</Text>
              <Text style={styles.petLevel}>Level: {pet.level}</Text>
              <Text style={styles.petMood}>
                Mood: <Text style={styles.petMoodValue}>{pet.mood}</Text>
              </Text>
              <Text style={styles.petStat}>XP: {pet.xp}</Text>
            </View>

            {/* Actions */}
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
        </View>Fhi
      </ImageBackground>

      {/* Action detail modal */}
      <Modal
        visible={isActionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        {/* ...your existing modal JSX exactly as you have it... */}
        {/* I’m not retyping for brevity, but keep it the same */}
      </Modal>

      {/* History sidebar */}
      <HistorySidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        history={history}
        onResetPet={handleResetPet}   // 👈 wire reset into sidebar
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glowTop: {
    position: "absolute",
    top: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(244, 187, 255, 0.55)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(186, 230, 253, 0.55)",
  },
  container: {
    width: 450,
    paddingVertical: 50,
    paddingHorizontal: 30,
    borderRadius: 225,
    backgroundColor: "#FFB3DA",
    borderWidth: 4,
    borderColor: "#FF8CCF",
    alignItems: "center",
    shadowColor: "#F472B6",
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
  },
  appTitle: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 18,
    color: "#7C3AED",
    textAlign: "center",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  appSubtitle: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 13,
    color: "#A855F7",
    textAlign: "center",
    marginTop: 0,
    marginBottom: 16,
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
  petEmoji: {
    fontSize: 52,
    marginBottom: 4,
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
  petMessage: {
    fontFamily: "PressStart2P_400Regular",
    marginTop: 8,
    fontSize: 13,
    color: "#7C3AED",
    textAlign: "center",
    fontStyle: "italic",
  },
  petImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  actionsWrapper: {
    marginTop: 8,
    width: "55%",
    gap: 8,
  },
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
  recycleButton: {
    backgroundColor: "#BBF7D0",
  },
  walkButton: {
    backgroundColor: "#BFDBFE",
  },
  energyButton: {
    backgroundColor: "#FDE68A",
  },
  resetButton: {
    marginTop: 18,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#FECACA",
    shadowColor: "#FCA5A5",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  resetText: {
    fontFamily: "PressStart2P_400Regular",
    color: "#7F1D1D",
    letterSpacing: 1.1,
    fontSize: 12,
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
});
