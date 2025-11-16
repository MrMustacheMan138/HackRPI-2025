// src/components/AchievementToast.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet, Image } from "react-native";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string; // path to icon image
};

type Props = {
  achievement: Achievement;
  index: number; // for stacking multiple toasts
  onHide: () => void;
};

export default function AchievementToast({ achievement, index, onHide }: Props) {
  const textAnim = useRef(new Animated.Value(-150)).current; // text slides horizontally
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate text sliding in from left of icon
    Animated.parallel([
      Animated.timing(textAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide after 3 sec
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(textAnim, {
          toValue: -150,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { top: 20 + index * 70 }]}>
      {/* Fixed icon */}
      <Image source={{ uri: achievement.icon }} style={styles.icon} />

      {/* Sliding text */}
      <Animated.View
        style={[
          styles.textWrapper,
          { transform: [{ translateX: textAnim }], opacity: opacityAnim },
        ]}
      >
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.description}>{achievement.description}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    width: 280,
    zIndex: 999,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24, // make it circular
    backgroundColor: "#444", // fallback if icon fails
  },
  textWrapper: {
    marginLeft: 12,
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flex: 1,
  },
  title: { fontFamily: "PressStart2P_400Regular", color: "#FFF", fontSize: 12 },
  description: { fontFamily: "PressStart2P_400Regular", color: "#DDD", fontSize: 10 },
});
