hay
moose7288
Invisible

ellumine

 — Yesterday at 1:25 PM
we're in low
in one of the sleeping rooms
like the second room
ellumine

 — Yesterday at 1:45 PM
Great — here are **all four things** you asked for:
✅ **Folder structure**
✅ **Baseline code templates for each person**
✅ **UI mockups (text-based, hackathon quick)**
✅ **Data model diagram**
✅ **Demo script**
Expand
message.txt
8 KB
MustaucheDr. — Yesterday at 1:46 PM
https://devpost.com/software/1116138/joins/Pnm-SmZEiXhnLQc3FiWdIw
ellumine

 — Yesterday at 1:47 PM
https://chatgpt.com/share/6918cad1-ad48-8007-8296-dc81d2d61fbf
ChatGPT
ChatGPT - Setup Expo Project
Shared via ChatGPT
Image
ellumine

 — Yesterday at 2:43 PM
https://8fjtv70-anonymous-8081.exp.direct/explore
MustaucheDr. — Yesterday at 3:55 PM
theres another group in this room now 😒
hay — Yesterday at 3:55 PM
yeah ://
ellumine

 — Yesterday at 4:08 PM
Oof
I’m coming back
MustaucheDr. — Yesterday at 4:09 PM
ok
MustaucheDr. — Yesterday at 4:51 PM
Image
MustaucheDr.
 changed the group name: HackRPI. Edit Group — Yesterday at 4:51 PM
MustaucheDr.
 changed the group name: HackRPI 2025. Edit Group — Yesterday at 4:51 PM
MustaucheDr. — Yesterday at 4:56 PM
https://coolors.co/bffff1-6883ba-0e0e52-568259-9b7e46
Coolors.co
Coolors.co
View and edit this palette on Coolors.co or create your own color schemes.
color palette
Carina — Yesterday at 5:06 PM
Coming back
ellumine

 — Yesterday at 5:24 PM
Image
Image
Carina — Yesterday at 5:49 PM
omg ur computer turned off aliya 😭
whats ur pin?
ellumine

 — Yesterday at 5:49 PM
💀
5946
hay — Yesterday at 8:41 PM
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Baloo+2:wght@600&display=swap');
Carina — Yesterday at 9:28 PM
guys theyre gonna set up the sleep rooms in here so theyre kicking us out of here 😭
we gonna need to move all our stuff out
MustaucheDr. — Yesterday at 9:28 PM
oh 😭😭
we are coming back
sorry 😭
hay — Yesterday at 9:29 PM
coming back too
MustaucheDr. — Yesterday at 9:40 PM
where are you guys moving too
to
hay — Yesterday at 9:42 PM
we’re sitting at the middle tables
where we sat during the beginning
MustaucheDr. — Yesterday at 9:43 PM
in great hall?
ok
Carina — Yesterday at 9:52 PM
exp://odj0e1a-anonymous-8081.exp.direct
hay — Yesterday at 9:58 PM
https://docs.google.com/document/d/1bIAFj99g3totwriJktF0qWOiZFAz0bGpPwr3LAt8xWk/edit?usp=sharing
ellumine

 — Yesterday at 10:01 PM
We’re coming back
hay — Yesterday at 10:02 PM
yay
we're at one of the first tables
next to the entrance of dcc
ellumine

 — Yesterday at 10:13 PM
Image
hay — Yesterday at 10:26 PM
Image
MustaucheDr. — Yesterday at 10:38 PM
Image
hay — Yesterday at 10:43 PM
https://www.aseprite.org/
Aseprite
Animated sprite editor & pixel art tool
Image
MustaucheDr. — Yesterday at 10:47 PM
Image
Carina — Yesterday at 10:48 PM
https://odj0ela-carinaaal-8081.exp.direct/Home
https://odj0ela-carinaaal-8081.exp.direct/Pet
MustaucheDr. — Yesterday at 11:58 PM
Image
MustaucheDr. — 12:20 AM
Image
MustaucheDr. — 12:32 AM
1.Spirril → 2. Trellith → 3. Verdanthor
Image
MustaucheDr. — 12:45 AM
habico?
hay — 12:52 AM
// src/logic/personality.js

// const ACTION_MESSAGES = {
//   recycle: 'Your pet is proud you recycled! ♻️',
//   walk: 'Your pet loved the fresh air from your walk! 🌿',
//   energySave: 'Your pet glows with all that saved energy! 💡',
// };

export function getPersonalityMessage(petState, lastActionId) {
  // Prefer specific message based on action
  // if (lastActionId && ACTION_MESSAGES[lastActionId]) {
  //   return ACTION_MESSAGES[lastActionId];
  // }

  // If pet is sad
  if (petState.mood === 'sad') {
    return 'Your pet looks sluggish… maybe time for another eco action?';
  }

  // Level-based flavor
  if (petState.level >= 4) {
    return 'Your pet has become a mighty Forest Spirit! 🌳';
  }

  if (petState.level >= 2) {
    return 'Your pet feels stronger with each eco-friendly habit! 💪';
  }

  // Default
  return 'Your pet is feeling okay. Keep up the eco habits! 🌱';
}
// src/logic/personality.js

// const ACTION_MESSAGES = {
//   recycle: 'Your pet is proud you recycled! ♻️',
//   walk: 'Your pet loved the fresh air from your walk! 🌿',
//   energySave: 'Your pet glows with all that saved energy! 💡',
// };

export function getPersonalityMessage(petState, lastActionId) {
  // Prefer specific message based on action
  // if (lastActionId && ACTION_MESSAGES[lastActionId]) {
  //   return ACTION_MESSAGES[lastActionId];
  // }

  // If pet is sad
  if (petState.mood === 'sad') {
    return 'Your pet looks sluggish… maybe time for another eco action?';
  }

  // Level-based flavor
  if (petState.level >= 4) {
    return 'Your pet has become a mighty Forest Spirit! 🌳';
  }

  if (petState.level >= 2) {
    return 'Your pet feels stronger with each eco-friendly habit! 💪';
  }

  // Default
  return 'Your pet is feeling okay. Keep up the eco habits! 🌱';
}
MustaucheDr. — 1:29 AM
Image
MustaucheDr. — 1:29 AM
^
Carina — 2:16 AM
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
};
type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

// Achievement icon mapping (local images)
const achievementIcons: Record<string, any> = {
  recycler: require("../../assets/images/trophy_placeholder.png"),
  first_steps: require("../../assets/images/trophy_placeholder.png"),
  energy_saver: require("../../assets/images/trophy_placeholder.png"),
  level_5: require("../../assets/images/trophy_placeholder.png"),
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
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [pendingActionType, setPendingActionType] = useState<ActionType | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  // Achievement state
  const [toastVisible, setToastVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const toastAnim = new Animated.Value(0);

  // Load pet state & history
  useEffect(() => {
    async function fetchPet() {
      const petData = await getPetState();
      if (petData) setPet(petData);

      const historyData = await loadHistory();
      setHistory(historyData);
    }
    fetchPet();
... (225 lines left)
Collapse
message.txt
14 KB
4
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
};
type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

// Achievement icon mapping (local images)
const achievementIcons: Record<string, any> = {
  recycler: require("../../assets/images/trophy_placeholder.png"),
  first_steps: require("../../assets/images/trophy_placeholder.png"),
  energy_saver: require("../../assets/images/trophy_placeholder.png"),
  level_5: require("../../assets/images/trophy_placeholder.png"),
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
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [pendingActionType, setPendingActionType] = useState<ActionType | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  // Achievement state
  const [toastVisible, setToastVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const toastAnim = new Animated.Value(0);

  // Load pet state & history
  useEffect(() => {
    async function fetchPet() {
      const petData = await getPetState();
      if (petData) setPet(petData);

      const historyData = await loadHistory();
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

    // Check for achievements
    checkAchievements(updatedPet, oldLevel, actionType, detail);
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

  // Check achievements
  const checkAchievements = (updatedPet: PetState, oldLevel: number, actionType: ActionType, detail?: ActionDetail) => {
    let unlocked: Achievement | null = null;

    if (actionType === "recycle" && !history.some(h => h.action === "recycle")) {
      unlocked = achievements.find(a => a.id === "recycler") || null;
    } else if (actionType === "walk" && !history.some(h => h.action === "walk")) {
      unlocked = achievements.find(a => a.id === "first_steps") || null;
    } else if (actionType === "energySave" && !history.some(h => h.action === "energySave")) {
      unlocked = achievements.find(a => a.id === "energy_saver") || null;
    } else if (updatedPet.level >= 5 && oldLevel < 5) {
      unlocked = achievements.find(a => a.id === "level_5") || null;
    }

    if (unlocked) showAchievementToast(unlocked);
  };

  // Show toast animation
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
        {/* Coin Counter - TOP LEFT */}
        <View style={styles.coinCounter}>
          <Text style={styles.coinText}>${pet.coins || 0}</Text>
        </View>

        {/* Floating History Button - TOP RIGHT */}
        <TouchableOpacity
          style={styles.floatingHistoryButton}
          onPress={() => setSidebarVisible(true)}
        >
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

      {/* History sidebar */}
      <HistorySidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} history={history} onResetPet={handleResetPet} />

      {/* Achievement Toast */}
      {toastVisible && currentAchievement && (
        <Animated.View style={[styles.toastContainer, { opacity: toastAnim, transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) }] }]}>
          <Image source={achievementIcons[currentAchievement.id]} style={styles.toastIcon} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.toastTitle}>{currentAchievement.title}</Text>
            <Text style={styles.toastDescription}>{currentAchievement.description}</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  background: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { width: 450, paddingVertical: 50, paddingHorizontal: 30, borderRadius: 225, backgroundColor: "#FFB3DA", borderWidth: 4, borderColor: "#FF8CCF", alignItems: "center" },
  appTitle: { fontFamily: "PressStart2P_400Regular", fontSize: 18, color: "#7C3AED", textAlign: "center", letterSpacing: 1.5, marginBottom: 6 },
  petCard: { width: "80%", alignItems: "center", paddingVertical: 10, paddingHorizontal: 10, borderRadius: 24, backgroundColor: "#FFFDF5", borderWidth: 1.5, borderColor: "#FBCFE8", marginBottom: 14 },
  petName: { fontFamily: "PressStart2P_400Regular", fontSize: 20, color: "#FB7185", marginBottom: 6 },
  petLevel: { fontFamily: "PressStart2P_400Regular", fontSize: 18, fontWeight: "bold", color: "#7C3AED", marginBottom: 12 },
  petMood: { fontFamily: "PressStart2P_400Regular", fontSize: 15, color: "#4B5563", marginBottom: 2 },
  petMoodValue: { fontFamily: "PressStart2P_400Regular", color: "#F59E0B" },
  petStat: { fontFamily: "PressStart2P_400Regular", fontSize: 14, color: "#6B7280" },
  petImage: { width: 120, height: 120, marginBottom: 8 },
  actionsWrapper: { marginTop: 8, width: "55%", gap: 8 },
  actionButton: { width: "100%", paddingVertical: 5, borderRadius: 999, alignItems: "center", justifyContent: "center", shadowColor: "#F9A8D4", shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  actionText: { fontFamily: "PressStart2P_400Regular", letterSpacing: 0.5, fontSize: 14 },
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
  
  floatingHistoryButton: { position: "absolute", top: 20, right: 30, padding: 8, zIndex: 100 },
  floatingHistoryText: { fontSize: 24, fontWeight: "700", color: "#4B5563" },

  // Achievement toast
  toastContainer: { position: "absolute", top: 50, left: 20, right: 20, flexDirection: "row", alignItems: "center", backgroundColor: "#1F2937", padding: 12, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  toastIcon: { width: 48, height: 48, borderRadius: 8 },
  toastTitle: { fontFamily: "PressStart2P_400Regular", color: "#FFF", fontSize: 14 },
  toastDescription: { fontFamily: "PressStart2P_400Regular", color: "#D1D5DB", fontSize: 10 },
});