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
  index: number; // for stacking
  onHide: () => void;
};

export default function AchievementToast({ achievement, index, onHide }: Props) {
  const slideAnim = useRef(new Animated.Value(-100)).current; // starts above screen
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0 + index * 70, // stack vertically
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
        Animated.timing(slideAnim, {
          toValue: -100,
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
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Image source={{ uri: achievement.icon }} style={styles.icon} />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.description}>{achievement.description}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 12,
    width: 280,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 999,
  },
  icon: { width: 48, height: 48, marginRight: 10, borderRadius: 6 },
  textWrapper: { flex: 1 },
  title: { fontFamily: "PressStart2P_400Regular", color: "#FFF", fontSize: 12 },
  description: { fontFamily: "PressStart2P_400Regular", color: "#DDD", fontSize: 10 },
});
