// app/(tabs)/components/achievements_sidebar.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

type Achievement = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
};

type HistoryEntry = {
  timestamp: number;
  actionType: string;
  detail?: string;
  xpGain?: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  achievements?: Achievement[];
  history?: HistoryEntry[];
  showAchievements?: boolean;
  petActions?: Record<string, number>;
  onResetPet?: () => void;
};

export default function AchievementsSidebar({
  visible,
  onClose,
  achievements = [],
  history = [],
  showAchievements = true,
  petActions,
  onResetPet,
}: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <View style={styles.sidebar}>
        <View style={styles.header}>
          <Text style={styles.title}>{showAchievements ? "Achievements" : "Action Log"}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {showAchievements ? (
            achievements.length === 0 ? (
              <Text style={styles.emptyText}>No achievements yet! 🌱</Text>
            ) : (
              achievements.map((ach) => (
                <View key={ach.id} style={styles.entry}>
                  <Text style={styles.achievementTitle}>
                    {ach.earned ? "🏆 " : "🔒 "}
                    {ach.title}
                  </Text>
                  <Text style={styles.achievementDesc}>{ach.description}</Text>
                </View>
              ))
            )
          ) : (
            history.length === 0 ? (
              <Text style={styles.emptyText}>No actions logged yet! 🌱</Text>
            ) : (
              history.map((entry, idx) => (
                <View key={idx} style={styles.entry}>
                  <Text style={styles.achievementTitle}>
                    {entry.actionType}: {entry.detail}
                  </Text>
                  <Text style={styles.achievementDesc}>
                    {entry.xpGain ? `+${entry.xpGain} XP` : ""} • {new Date(entry.timestamp).toLocaleString()}
                  </Text>
                </View>
              ))
            )
          )}
        </ScrollView>

        {!showAchievements && onResetPet && (
          <TouchableOpacity onPress={onResetPet} style={styles.resetButton}>
            <Text style={styles.resetText}>Reset Pet</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.45)" },
  sidebar: { position: "absolute", right: 0, top: 0, bottom: 0, width: 300, backgroundColor: "#FFF5FA", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: -3, height: 0 } },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: "#FFB3DA", backgroundColor: "#FFE5F1" },
  title: { fontFamily: "PressStart2P_400Regular", fontSize: 12, color: "#7C3AED", textTransform: "uppercase", letterSpacing: 1 },
  closeButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#FFB3DA", alignItems: "center", justifyContent: "center" },
  closeText: { fontFamily: "Baloo2_600SemiBold", fontSize: 18, color: "#512051" },
  scrollView: { flex: 1, padding: 12 },
  emptyText: { fontFamily: "Baloo2_400Regular", textAlign: "center", color: "#9CA3AF", fontSize: 14, marginTop: 40, paddingHorizontal: 20 },
  entry: { backgroundColor: "#FFFFFF", paddingVertical: 12, paddingHorizontal: 12, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: "#FBCFE8" },
  achievementTitle: { fontFamily: "Baloo2_600SemiBold", fontSize: 15, color: "#111827", marginBottom: 2 },
  achievementDesc: { fontFamily: "Baloo2_400Regular", fontSize: 12, color: "#9CA3AF" },
  resetButton: { margin: 16, backgroundColor: "#EF4444", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  resetText: { fontFamily: "Baloo2_600SemiBold", fontSize: 14, color: "#FFF" },
});
