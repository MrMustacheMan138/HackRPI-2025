// app/(tabs)/components/history_sidebar.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";

type HistoryEntry = {
  id: string;
  action: "recycle" | "walk" | "energySave";
  xp: number;
  timestamp: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onResetPet?: () => void;
};

// Static mappings
const actionEmojis: Record<HistoryEntry["action"], string> = {
  recycle: "♻️",
  walk: "🚶",
  energySave: "💡",
};

const actionNames: Record<HistoryEntry["action"], string> = {
  recycle: "Recycled",
  walk: "Walked",
  energySave: "Saved energy",
};

const actionIcons: Record<HistoryEntry["action"], any> = {
  recycle: require("../../assets/images/trophy_placeholder.png"),
  walk: require("../../assets/images/trophy_placeholder.png"),
  energySave: require("../../assets/images/trophy_placeholder.png"),
};

// Format timestamps
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

// Animated XP component
function AnimatedXP({ xp }: { xp: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [xp]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.Text style={[styles.xp, { transform: [{ translateY }], opacity }]}>
      +{xp} XP
    </Animated.Text>
  );
}

export default function HistorySidebar({
  visible,
  onClose,
  history,
  onResetPet,
}: Props) {
  if (!visible) return null;

  const handleResetPress = () => {
    if (onResetPet) onResetPet();
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
                <Text style={styles.emoji}>{actionEmojis[entry.action]}</Text>
                <Image source={actionIcons[entry.action]} style={styles.icon} />
                <View style={styles.entryContent}>
                  <Text style={styles.actionName}>{actionNames[entry.action]}</Text>
                  <Text style={styles.timestamp}>{formatTimestamp(entry.timestamp)}</Text>
                </View>
                <AnimatedXP xp={entry.xp} />
              </View>
            ))
          )}
        </ScrollView>

        {onResetPet && (
          <TouchableOpacity style={styles.resetButton} onPress={handleResetPress}>
            <Text style={styles.resetText}>Reset to Egg</Text>
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
  entry: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", paddingVertical: 12, paddingHorizontal: 12, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: "#FBCFE8" },
  emoji: { fontSize: 24, marginRight: 8 },
  icon: { width: 24, height: 24, marginRight: 8 },
  entryContent: { flex: 1 },
  actionName: { fontFamily: "Baloo2_600SemiBold", fontSize: 15, color: "#111827", marginBottom: 2 },
  timestamp: { fontFamily: "Baloo2_400Regular", fontSize: 12, color: "#9CA3AF" },
  xp: { fontFamily: "Baloo2_600SemiBold", fontSize: 14, color: "#10B981" },
  resetButton: { marginHorizontal: 16, marginBottom: 18, paddingVertical: 10, borderRadius: 999, backgroundColor: "#FECACA", alignItems: "center", justifyContent: "center", shadowColor: "#FCA5A5", shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  resetText: { fontFamily: "Baloo2_600SemiBold", fontSize: 13, color: "#7F1D1D", letterSpacing: 0.5 },
});
