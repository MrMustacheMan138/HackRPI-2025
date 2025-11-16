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
  if (level >= 2) return require("../../assets/images/level1.png");
  return require("../../assets/images/IMG_02011.png");
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

  const petImage = getPetImage(pet.level);
  const stageName = pet.stage?.name ?? "Sprout";

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
              <Text style={styles.petMood}>
                Mood: <Text style={styles.petMoodValue}>{pet.mood}</Text>
              </Text>
              <Text style={styles.petStat}>XP: {pet.xp}</Text>
              <Text style={styles.petStat}>Level: {pet.level}</Text>
              {pet.message && (
                <Text style={styles.petMessage}>{pet.message}</Text>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actionsWrapper}>
              <TouchableOpacity
                style={[styles.actionButton, styles.recycleButton]}
                onPress={() => openActionModal("recycle")}
              >
                <Text style={styles.actionText}>RECYCLE ♻️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.walkButton]}
                onPress={() => openActionModal("walk")}
              >
                <Text style={styles.actionText}>WALK 🚶</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.energyButton]}
                onPress={() => openActionModal("energySave")}
              >
                <Text style={styles.actionText}>SAVE ENERGY 💡</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Action detail modal */}
      <Modal
        visible={isActionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              width: "90%",
              maxWidth: 420,
              borderRadius: 28,
              padding: 22,
              backgroundColor: "#FFE8F7",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 12,
                color: "#7C3AED",
              }}
            >
              {pendingActionType === "recycle" && "What did you recycle?"}
              {pendingActionType === "walk" && "How long did you walk?"}
              {pendingActionType === "energySave" && "How did you save energy?"}
            </Text>

            {/* Recycle options */}
            {pendingActionType === "recycle" && (
              <>
                {["Plastic", "Paper", "Electronics"].map((option) => (
                  <Pressable
                    key={option}
                    onPress={() =>
                      handleConfirmAction(option as ActionDetail)
                    }
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 999,
                      backgroundColor: "#FFFFFF",
                      marginBottom: 8,
                      shadowColor: "#F5C2E7",
                      shadowOpacity: 0.2,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>{option}</Text>
                  </Pressable>
                ))}
              </>
            )}

            {/* Walk options */}
            {pendingActionType === "walk" && (
              <>
                {["Short walk", "Medium walk", "Long walk"].map((option) => (
                  <Pressable
                    key={option}
                    onPress={() =>
                      handleConfirmAction(option as ActionDetail)
                    }
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 999,
                      backgroundColor: "#FFFFFF",
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>{option}</Text>
                  </Pressable>
                ))}
              </>
            )}

            {/* Energy-save options */}
            {pendingActionType === "energySave" && (
              <>
                {[
                  "Turned off lights",
                  "Shorter shower",
                  "Unplugged devices",
                ].map((option) => (
                  <Pressable
                    key={option}
                    onPress={() =>
                      handleConfirmAction(option as ActionDetail)
                    }
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 999,
                      backgroundColor: "#FFFFFF",
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>{option}</Text>
                  </Pressable>
                ))}
              </>
            )}

            <Pressable
              onPress={() => setIsActionModalVisible(false)}
              style={{ marginTop: 8, alignSelf: "center" }}
            >
              <Text style={{ color: "#6B7280" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* History sidebar */}
      <HistorySidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        history={history}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // whole screen background
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // or "#FFEAF7" if you like
  },

  // 👇 new style for the bg image
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

  // glows are now unused; you can delete these if you want
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
    width: 400,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 180,
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
    fontFamily: "Baloo2_400Regular",
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
    fontFamily: "Baloo2_600SemiBold",
    fontSize: 20,
    color: "#FB7185",
    marginBottom: 6,
  },
  petMood: {
    fontFamily: "Baloo2_400Regular",
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 2,
  },
  petMoodValue: {
    fontFamily: "Baloo2_600SemiBold",
    color: "#F59E0B",
  },
  petStat: {
    fontFamily: "Baloo2_400Regular",
    fontSize: 14,
    color: "#6B7280",
  },
  petMessage: {
    fontFamily: "Baloo2_400Regular",
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
    fontFamily: "Baloo2_600SemiBold",
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
    fontFamily: "Baloo2_600SemiBold",
    color: "#7F1D1D",
    letterSpacing: 1.1,
    fontSize: 12,
  },

  floatingHistoryButton: {
    position: "absolute",
    top: 20,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C084FC",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    zIndex: 100,
  },
  floatingHistoryText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4B5563",
  },
});

// // app/(tabs)/index.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   Image,
//   Modal,
//   Pressable,
//   ImageBackground,
// } from "react-native";
// import { getPetState, logAction, resetPet, loadHistory} from "../../src/logic/petState.js";
// import HistorySidebar from "./components/history_sidebar";
// //import { playSound } from "../../src/utils/sounds";
// import {
//   Baloo2_400Regular,
//   Baloo2_600SemiBold,
// } from "@expo-google-fonts/baloo-2";
// import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
// import { ImageBackground } from "react-native";

// const bgImage = require("../../assets/images/background.jpg");

// type ActionType = "recycle" | "walk" | "energySave";

// type ActionDetail =
//   | "Plastic"
//   | "Paper"
//   | "Electronics"
//   | "Short walk"
//   | "Medium walk"
//   | "Long walk"
//   | "Turned off lights"
//   | "Shorter shower"
//   | "Unplugged devices";

// type PetState = {
//   mood: string;
//   xp: number;
//   level: number;
//   lastUpdated: number;
//   message?: string;
//   stage?: { name: string };
// };

// function getPetImage(level: number) {
//   if (level >= 4) return require("../../assets/images/level3.png");
//   if (level >= 3) return require("../../assets/images/level2.png");
//   if (level >= 2) return require("../../assets/images/level1.png");
//   return require("../../assets/images/IMG_02011.png");
// }

// export default function PetScreen() {
//   const [pet, setPet] = useState<PetState>({
//     mood: "neutral",
//     xp: 0,
//     level: 1,
//     lastUpdated: Date.now(),
//   });

//   // Load pet state on mount
//   useEffect(() => {
//     async function fetchPet() {
//       const petData = await getPetState();
//       if (petData) setPet(petData);

//       const historyData = await loadHistory();
//       setHistory(historyData);
//     }
//     fetchPet();
//   }, []);

//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const [history, setHistory] = useState<any[]>([]);
//   const [pendingActionType, setPendingActionType] =
//     useState<ActionType | null>(null);
//   const [isActionModalVisible, setIsActionModalVisible] = useState(false);

//   const handleAction = async (
//     actionType: ActionType,
//     detail?: ActionDetail
//   ) => {
//     const oldLevel = pet.level; // Save the current level
//     const updatedPet = await logAction(actionType, detail);
//     setPet(updatedPet);

//     // Check if leveled up and play sound
//     if (updatedPet.level > oldLevel) {
//       //playSound("levelUp");
//     }

//     // Refresh history after action
//     const historyData = await loadHistory();
//     setHistory(historyData);
//   };
  
//   const openActionModal = (type: ActionType) => {
//     setPendingActionType(type);
//     setIsActionModalVisible(true);
//   };

//   const handleConfirmAction = async (detail: ActionDetail) => {
//     if (!pendingActionType) return;

//     await handleAction(pendingActionType, detail);

//     setIsActionModalVisible(false);
//     setPendingActionType(null);
//   };


//   const petImage = getPetImage(pet.level);
//   const stageName = pet.stage?.name ?? "Sprout";

//   return (
//     <SafeAreaView style={styles.safeArea}>
//         {/* Floating History Button - TOP RIGHT */}
//         <TouchableOpacity 
//           style={styles.floatingHistoryButton} 
//           onPress={() => setSidebarVisible(true)}
//         >
//           <Text style={styles.floatingHistoryText}>☰</Text>
//         </TouchableOpacity>
//         <ImageBackground source={bgImage} style={styles.backgroundImage}>
//             <TouchableOpacity ... />

//             <View style={styles.container}>
//                 ...your pet UI...
//             </View>

//             <HistorySidebar ... />
//         </ImageBackground>

//           {/* Title */}
//           <Text style={styles.appTitle}>Eco Pet</Text>
//           <Text style={styles.appSubtitle}>Your tiny forest guardian</Text>

//           {/* Pet card */}
//           <View style={styles.petCard}>
//             <Image 
//                 source={petImage} 
//                 style={styles.petImage}
//                 resizeMode="contain"
//             />
//             <Text style={styles.petName}>{stageName}</Text>
//             <Text style={styles.petMood}>
//               Mood: <Text style={styles.petMoodValue}>{pet.mood}</Text>
//             </Text>
//             <Text style={styles.petStat}>XP: {pet.xp}</Text>
//             <Text style={styles.petStat}>Level: {pet.level}</Text>
//             {pet.message && (
//               <Text style={styles.petMessage}>{pet.message}</Text>
//             )}
//           </View>

//           {/* Actions */}
//           <View style={styles.actionsWrapper}>
//             <TouchableOpacity
//                 style={[styles.actionButton, styles.recycleButton]}
//                 onPress={() => openActionModal("recycle")}
//             >
//                 <Text style={styles.actionText}>RECYCLE ♻️</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={[styles.actionButton, styles.walkButton]}
//                 onPress={() => openActionModal("walk")}
//             >
//                 <Text style={styles.actionText}>WALK 🚶</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={[styles.actionButton, styles.energyButton]}
//                 onPress={() => openActionModal("energySave")}
//             >
//                 <Text style={styles.actionText}>SAVE ENERGY 💡</Text>
//             </TouchableOpacity>
//           </View>
//           {/* Reset */}
//         </View>
//       </View>

//       {/* Action detail modal */}
//       <Modal
//         visible={isActionModalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setIsActionModalVisible(false)}
//       >
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "rgba(0,0,0,0.4)",
//           }}
//         >
//           <View
//             style={{
//               width: "90%",
//               maxWidth: 420,
//               borderRadius: 28,
//               padding: 22,
//               backgroundColor: "#FFE8F7",
//               alignSelf: "center",
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 20,
//                 fontWeight: "700",
//                 textAlign: "center",
//                 marginBottom: 12,
//                 color: "#7C3AED",
//               }}
//             >
//               {pendingActionType === "recycle" && "What did you recycle?"}
//               {pendingActionType === "walk" && "How long did you walk?"}
//               {pendingActionType === "energySave" && "How did you save energy?"}
//             </Text>

//             {/* Recycle options */}
//             {pendingActionType === "recycle" && (
//               <>
//                 {["Plastic", "Paper", "Electronics"].map((option) => (
//                   <Pressable
//                     key={option}
//                     onPress={() =>
//                       handleConfirmAction(option as ActionDetail)
//                     }
//                     style={{
//                       paddingVertical: 10,
//                       paddingHorizontal: 14,
//                       borderRadius: 999,
//                       backgroundColor: "#FFFFFF",
//                       marginBottom: 8,
//                       shadowColor: "#F5C2E7",
//                       shadowOpacity: 0.2,
//                       shadowRadius: 6,
//                       shadowOffset: { width: 0, height: 2 },
//                     }}
//                   >
//                     <Text style={{ textAlign: "center" }}>{option}</Text>
//                   </Pressable>
//                 ))}
//               </>
//             )}

//             {/* Walk options */}
//             {pendingActionType === "walk" && (
//               <>
//                 {["Short walk", "Medium walk", "Long walk"].map((option) => (
//                   <Pressable
//                     key={option}
//                     onPress={() =>
//                       handleConfirmAction(option as ActionDetail)
//                     }
//                     style={{
//                       paddingVertical: 10,
//                       paddingHorizontal: 14,
//                       borderRadius: 999,
//                       backgroundColor: "#FFFFFF",
//                       marginBottom: 8,
//                     }}
//                   >
//                     <Text style={{ textAlign: "center" }}>{option}</Text>
//                   </Pressable>
//                 ))}
//               </>
//             )}

//             {/* Energy-save options */}
//             {pendingActionType === "energySave" && (
//               <>
//                 {[
//                   "Turned off lights",
//                   "Shorter shower",
//                   "Unplugged devices",
//                 ].map((option) => (
//                   <Pressable
//                     key={option}
//                     onPress={() =>
//                       handleConfirmAction(option as ActionDetail)
//                     }
//                     style={{
//                       paddingVertical: 10,
//                       paddingHorizontal: 14,
//                       borderRadius: 999,
//                       backgroundColor: "#FFFFFF",
//                       marginBottom: 8,
//                     }}
//                   >
//                     <Text style={{ textAlign: "center" }}>{option}</Text>
//                   </Pressable>
//                 ))}
//               </>
//             )}

//             <Pressable
//               onPress={() => setIsActionModalVisible(false)}
//               style={{ marginTop: 8, alignSelf: "center" }}
//             >
//               <Text style={{ color: "#6B7280" }}>Cancel</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>

//       {/* NEW ADD */}
//       <HistorySidebar 
//         visible={sidebarVisible}
//         onClose={() => setSidebarVisible(false)}
//         history={history}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   // whole screen background
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#FFEAF7",
//   },
//   background: {
//     flex: 1,
//     backgroundColor: "#FFEAF7",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   // soft pastel glows behind the egg
//   glowTop: {
//     position: "absolute",
//     top: -80,
//     width: 260,
//     height: 260,
//     borderRadius: 130,
//     backgroundColor: "rgba(244, 187, 255, 0.55)", // lilac glow
//   },
//   glowBottom: {
//     position: "absolute",
//     bottom: -100,
//     width: 320,
//     height: 320,
//     borderRadius: 160,
//     backgroundColor: "rgba(186, 230, 253, 0.55)", // baby-blue glow
//   },

//   // 🌸 egg shell card (smaller + tighter)
//   container: {
//     width: 400,              // was 400
//     paddingVertical: 20,     // was 20
//     paddingHorizontal: 20,   // was 20
//     borderRadius: 180,       // was 200
//     backgroundColor: "#FFB3DA",
//     borderWidth: 4,
//     borderColor: "#FF8CCF",
//     alignItems: "center",
//     shadowColor: "#F472B6",
//     shadowOpacity: 0.35,
//     shadowRadius: 22,
//     shadowOffset: { width: 0, height: 10 },
//   },

//   // title text above “screen”
//   appTitle: {
//     fontFamily: "PressStart2P_400Regular",
//     fontSize: 18,
//     color: "#7C3AED", // purple
//     textAlign: "center",
//     letterSpacing: 1.5,
//     marginBottom: 6,
//   },
//   appSubtitle: {
//     fontFamily: "Baloo2_400Regular",
//     fontSize: 13,
//     color: "#A855F7",
//     textAlign: "center",
//     marginTop: 0,
//     marginBottom: 16,
//   },


//   // 🪟 LCD screen area (slightly shorter)
//   petCard: {
//     width: "80%",
//     alignItems: "center",
//     paddingVertical: 10,     // was 16
//     paddingHorizontal: 10,   // was 12
//     borderRadius: 24,
//     backgroundColor: "#FFFDF5",
//     borderWidth: 1.5,
//     borderColor: "#FBCFE8",
//     marginBottom: 14,        // was 18
//   },
//   petEmoji: {
//     fontSize: 52,
//     marginBottom: 4,
//   },
//   petName: {
//     fontFamily: "Baloo2_600SemiBold",
//     fontSize: 20,
//     color: "#FB7185", // coral pink
//     marginBottom: 6,
//   },
//   petMood: {
//     fontFamily: "Baloo2_400Regular",
//     fontSize: 15,
//     color: "#4B5563",
//     marginBottom: 2,
//   },
//   petMoodValue: {
//     fontFamily: "Baloo2_600SemiBold",
//     color: "#F59E0B", // soft yellow
//   },
//   petStat: {
//     fontFamily: "Baloo2_400Regular",
//     fontSize: 14,
//     color: "#6B7280",
//   },
//   petMessage: {
//     fontFamily: "Baloo2_400Regular",
//     marginTop: 8,
//     fontSize: 13,
//     color: "#7C3AED",
//     textAlign: "center",
//     fontStyle: "italic",
//   },
//   petImage: {
//     width: 120,
//     height: 120,
//     marginBottom: 8,
//   },

//   // actions + buttons
//   actionsWrapper: {
//     marginTop: 8,            // was 12
//     width: "55%",            // was 50%, this gives a bit more room so they don't stack weirdly
//     gap: 8,                  // was 10
//   },
//   actionButton: {
//     width: "100%",
//     paddingVertical: 5,     // keep this smaller so the stack isn’t huge
//     borderRadius: 999,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#F9A8D4",
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   actionText: {
//     fontFamily: "Baloo2_600SemiBold",
//     letterSpacing: 0.5,
//     fontSize: 14,            // slightly smaller
//   },

//   // individual pastel colors
//   recycleButton: {
//     backgroundColor: "#BBF7D0", // mint
//   },
//   walkButton: {
//     backgroundColor: "#BFDBFE", // baby blue
//   },
//   energyButton: {
//     backgroundColor: "#FDE68A", // pastel yellow
//   },

//   // 🔁 reset button
//   resetButton: {
//     marginTop: 18,
//     alignSelf: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 9,
//     borderRadius: 999,
//     backgroundColor: "#FECACA", // soft red/pink
//     shadowColor: "#FCA5A5",
//     shadowOpacity: 0.35,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//   },
//   resetText: {
//     fontFamily: "Baloo2_600SemiBold",
//     color: "#7F1D1D",
//     letterSpacing: 1.1,
//     fontSize: 12,
//   },

//   // Floating history button (top right)
//   floatingHistoryButton: {
//     position: "absolute",
//     top: 20, // Adjust based on your header
//     right: 30,
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#E9D5FF", // soft purple
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#C084FC",
//     shadowOpacity: 0.35,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     zIndex: 100,
//   },
//   floatingHistoryText: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#4B5563", // dark gray to match UI
//   },
// });


// // app/(tabs)/index.tsx
// import React, { useEffect, useState } from "react";
// import { View, Text, Button, StyleSheet } from "react-native";
// import { getPetState, logAction, resetPet } from "../../src/logic/petState.js";

// type ActionType = "recycle" | "walk" | "energySave";

// type PetState = {
//   mood: string;
//   xp: number;
//   level: number;
//   lastUpdated: number;
// };

// export default function HomeScreen() {
//   const [pet, setPet] = useState<PetState>({
//     mood: "neutral",
//     xp: 0,
//     level: 1,
//     lastUpdated: Date.now(),
//   });

//   // Load pet state on mount
//   useEffect(() => {
//     async function fetchPet() {
//       const petData = await getPetState();
//       if (petData) setPet(petData);
//     }
//     fetchPet();
//   }, []);

//   const handleAction = async (actionType: ActionType) => {
//     const updatedPet = await logAction(actionType);
//     setPet(updatedPet);
//   };

//   const handleReset = async () => {
//     const resetedPet = await resetPet();
//     setPet(resetedPet);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Eco Pet 🌱</Text>

//       <View style={styles.stats}>
//         <Text style={styles.stat}>Mood: {pet.mood}</Text>
//         <Text style={styles.stat}>XP: {pet.xp}</Text>
//         <Text style={styles.stat}>Level: {pet.level}</Text>
//       </View>

//       <View style={styles.buttonRow}>
//         <Button title="Recycle ♻️" onPress={() => handleAction("recycle")} />
//         <Button title="Walk 🚶" onPress={() => handleAction("walk")} />
//         <Button
//           title="Save Energy 💡"
//           onPress={() => handleAction("energySave")}
//         />
//       </View>

//       <View style={styles.resetWrapper}>
//         <Button title="Reset Pet 🔄" onPress={handleReset} color="red" />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5", // 👈 change this to any color you want
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   stats: {
//     marginBottom: 24,
//     alignItems: "center",
//   },
//   stat: {
//     fontSize: 18,
//     marginVertical: 2,
//   },
//   buttonRow: {
//     width: "100%",
//     gap: 10,
//     marginBottom: 16,
//   },
//   resetWrapper: {
//     marginTop: 8,
//   },
// });
