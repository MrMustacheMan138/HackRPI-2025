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

type ActionType = "recycle" | "walk" | "energySave";

type PetState = {
  mood: string;
  xp: number;
  level: number;
  lastUpdated: number;
  message?: string;
  stage?: { name: string };
};

function getPetEmoji(level: number) {
  if (level >= 4) return "🌳"; // final evolution
  if (level >= 3) return "🌲";
  if (level >= 2) return "🌿";
  return "🌱";
}

export default function HomeScreen() {
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

  const petEmoji = getPetEmoji(pet.level);
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
            <Text style={styles.petEmoji}>{petEmoji}</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#050816",
  },
  background: {
    flex: 1,
    backgroundColor: "#050816", // deep night sky
    justifyContent: "center",
    alignItems: "center",
  },
  glowTop: {
    position: "absolute",
    top: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(56,189,248,0.25)", // cyan glow
  },
  glowBottom: {
    position: "absolute",
    bottom: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(74,222,128,0.25)", // green glow
  },
  container: {
    width: "92%",
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "rgba(15,23,42,0.96)", // slate card
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    shadowColor: "#22c55e",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#e5e7eb",
    textAlign: "center",
    letterSpacing: 1.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  petCard: {
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(15,118,110,0.15)",
    borderWidth: 1,
    borderColor: "rgba(45,212,191,0.5)",
    marginBottom: 20,
  },
  petEmoji: {
    fontSize: 56,
    marginBottom: 4,
  },
  petName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#a7f3d0",
    marginBottom: 6,
  },
  petMood: {
    fontSize: 16,
    color: "#e5e7eb",
    marginBottom: 2,
  },
  petMoodValue: {
    fontWeight: "700",
    color: "#facc15",
  },
  petStat: {
    fontSize: 15,
    color: "#cbd5f5",
  },
  petMessage: {
    marginTop: 10,
    fontSize: 14,
    color: "#bbf7d0",
    textAlign: "center",
    fontStyle: "italic",
  },
  actionsWrapper: {
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22c55e",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  actionText: {
    color: "#f9fafb",
    fontWeight: "700",
    letterSpacing: 1.5,
    fontSize: 14,
  },
  recycleButton: {
    backgroundColor: "#22c55e",
  },
  walkButton: {
    backgroundColor: "#38bdf8",
  },
  energyButton: {
    backgroundColor: "#f97316",
  },
  resetButton: {
    marginTop: 20,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#ef4444",
    shadowColor: "#f87171",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  resetText: {
    color: "#f9fafb",
    fontWeight: "800",
    letterSpacing: 1.2,
    fontSize: 13,
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
