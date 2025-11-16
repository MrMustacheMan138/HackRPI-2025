// app/(tabs)/components/history_sidebar.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

type HistoryEntry = {
  id: string;
  action: string;
  xp: number;
  timestamp: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  // 👇 new optional callback from parent to reset pet
  onResetPet?: () => void;
};

const actionEmojis = {
  recycle: "♻️",
  walk: "🚶",
  energySave: "💡",
};

const actionNames = {
  recycle: "Recycled",
  walk: "Walked",
  energySave: "Saved energy",
};

function formatTimestamp(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function HistorySidebar({
  visible,
  onClose,
  history,
  onResetPet,
}: Props) {
  if (!visible) return null;

  const handleResetPress = () => {
    if (onResetPet) {
      onResetPet(); // parent does reset + state update
    }
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <View style={styles.sidebar}>
        <View style={styles.header}>
          <Text style={styles.title}>Action Log</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {history.length === 0 ? (
            <Text style={styles.emptyText}>
              No actions yet! Start taking care of your pet 🌱
            </Text>
          ) : (
            history.map((entry) => (
              <View key={entry.id} style={styles.entry}>
                <Text style={styles.emoji}>
                  {actionEmojis[
                    entry.action as keyof typeof actionEmojis
                  ] || "🌱"}
                </Text>
                <View style={styles.entryContent}>
                  <Text style={styles.actionName}>
                    {actionNames[
                      entry.action as keyof typeof actionNames
                    ] || entry.action}
                  </Text>
                  <Text style={styles.timestamp}>
                    {formatTimestamp(entry.timestamp)}
                  </Text>
                </View>
                <Text style={styles.xp}>+{entry.xp} XP</Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* 🔁 Reset-to-egg button at bottom of sidebar */}
        {onResetPet && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPress}
          >
            <Text style={styles.resetText}>Reset to Egg</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "#FFF5FA", // soft pastel to match main screen
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: -3, height: 0 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: "#FFB3DA",
    backgroundColor: "#FFE5F1",
  },
  title: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 12,
    color: "#7C3AED",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFB3DA",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontFamily: "Baloo2_600SemiBold",
    fontSize: 18,
    color: "#512051",
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  emptyText: {
    fontFamily: "Baloo2_400Regular",
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FBCFE8",
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  entryContent: {
    flex: 1,
  },
  actionName: {
    fontFamily: "Baloo2_600SemiBold",
    fontSize: 15,
    color: "#111827",
    marginBottom: 2,
  },
  timestamp: {
    fontFamily: "Baloo2_400Regular",
    fontSize: 12,
    color: "#9CA3AF",
  },
  xp: {
    fontFamily: "Baloo2_600SemiBold",
    fontSize: 14,
    color: "#10B981",
  },

  // 🔁 reset button styles
  resetButton: {
    marginHorizontal: 16,
    marginBottom: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#FECACA",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FCA5A5",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  resetText: {
    fontFamily: "Baloo2_600SemiBold",
    fontSize: 13,
    color: "#7F1D1D",
    letterSpacing: 0.5,
  },
});
