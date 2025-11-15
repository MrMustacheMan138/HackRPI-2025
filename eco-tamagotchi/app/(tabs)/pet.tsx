// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { getPetState, logAction, resetPet } from "../../src/logic/petState.js";
import { Image } from 'react-native';

type ActionType = "recycle" | "walk" | "energySave";

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
  return require("../../assets/images/egg.png");
}

export default function PetScreen() {
  const [pet, setPet] = useState<PetState>({
    mood: "neutral",
    xp: 0,
    level: 1,
    lastUpdated: Date.now(),
  });

  // Load pet state on mount
  useEffect(() => {
    async function fetchPet() {
      const petData = await getPetState();
      if (petData) setPet(petData);
    }
    fetchPet();
  }, []);

  const handleAction = async (actionType: ActionType) => {
    const updatedPet = await logAction(actionType);
    setPet(updatedPet);
  };

  const handleReset = async () => {
    const resetedPet = await resetPet();
    setPet(resetedPet);
  };

  const petEmoji = getPetImage(pet.level);
  const stageName = pet.stage?.name ?? "Sprout";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.appTitle}>Eco Pet</Text>
          <Text style={styles.appSubtitle}>Your tiny forest guardian</Text>

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
              onPress={() => handleAction("recycle")}
            >
              <Text style={styles.actionText}>RECYCLE ♻️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.walkButton]}
              onPress={() => handleAction("walk")}
            >
              <Text style={styles.actionText}>WALK 🚶</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.energyButton]}
              onPress={() => handleAction("energySave")}
            >
              <Text style={styles.actionText}>SAVE ENERGY 💡</Text>
            </TouchableOpacity>
          </View>

          {/* Reset */}
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>RESET PET 🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // whole screen background
  safeArea: {
    flex: 1,
    backgroundColor: "#FFEAF7", // soft pastel pink
  },
  background: {
    flex: 1,
    backgroundColor: "#FFEAF7",
    justifyContent: "center",
    alignItems: "center",
  },

  // soft pastel glows behind the egg
  glowTop: {
    position: "absolute",
    top: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(244, 187, 255, 0.55)", // lilac glow
  },
  glowBottom: {
    position: "absolute",
    bottom: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(186, 230, 253, 0.55)", // baby-blue glow
  },

  // 🌸 egg shell card
  container: {
    width: 320,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 200, // egg-ish
    backgroundColor: "#FFB3DA", // pastel pink shell
    borderWidth: 2,
    borderColor: "#FF8CCF",
    alignItems: "center",
    shadowColor: "#F472B6",
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
  },

  // title text above “screen”
  appTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#7C3AED", // purple
    textAlign: "center",
    letterSpacing: 1.5,
  },
  appSubtitle: {
    fontSize: 12,
    color: "#A855F7",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },

  // 🪟 LCD screen area (where pet + stats live)
  petCard: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 24,
    backgroundColor: "#FFFDF5", // soft cream screen
    borderWidth: 1.5,
    borderColor: "#FBCFE8",
    marginBottom: 18,
  },
  petEmoji: {
    fontSize: 52,
    marginBottom: 4,
  },
  petName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FB7185", // coral pink
    marginBottom: 6,
  },
  petMood: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 2,
  },
  petMoodValue: {
    fontWeight: "700",
    color: "#F59E0B", // soft yellow
  },
  petStat: {
    fontSize: 14,
    color: "#6B7280",
  },
  petMessage: {
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

  // 💖 bottom action buttons (like Tamagotchi buttons area)
  actionsWrapper: {
    marginTop: 12,
    width: "100%",
    gap: 10,
  },
  actionButton: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F9A8D4",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  actionText: {
    fontWeight: "700",
    letterSpacing: 1.2,
    fontSize: 13,
  },

  // individual pastel colors
  recycleButton: {
    backgroundColor: "#BBF7D0", // mint
  },
  walkButton: {
    backgroundColor: "#BFDBFE", // baby blue
  },
  energyButton: {
    backgroundColor: "#FDE68A", // pastel yellow
  },

  // 🔁 reset button
  resetButton: {
    marginTop: 18,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#FECACA", // soft red/pink
    shadowColor: "#FCA5A5",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  resetText: {
    color: "#7F1D1D",
    fontWeight: "800",
    letterSpacing: 1.1,
    fontSize: 12,
  },
});




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
