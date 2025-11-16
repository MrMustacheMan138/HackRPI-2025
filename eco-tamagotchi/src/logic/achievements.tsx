// src/components/AchievementToast.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet, Image } from "react-native";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type Props = {
  achievement: Achievement;
  index: number;
  onHide: () => void;
};

export default function AchievementToast({ achievement, index, onHide }: Props) {
  const slideAnim = useRef(new Animated.Value(0)).current; // width reveal
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide width and fade in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: false, // width animation = can't use native
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade + slide out after 3s
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
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

  const textWidth = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // final text width
  });

  return (
    <View style={[styles.container, { top: 20 + index * 70 }]}>
      {/* Circle Trophy Icon */}
      <View style={styles.iconWrapper}>
        <Image
          source={require("../../assets/images/trophy_placeholder.png")}
          style={styles.icon}
        />
      </View>

      {/* Sliding Reveal Text */}
      <Animated.View
        style={[
          styles.textBox,
          { width: textWidth, opacity: opacityAnim },
        ]}
      >
        <Text style={styles.title}>{achievement.title}</Text>
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
    width: 260,
    zIndex: 999,
  },

  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  icon: {
    width: 40,
    height: 40,
  },

  textBox: {
    backgroundColor: "#1F2937",
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: "hidden", // prevents showing text until slideAnim expands
  },

  title: {
    fontFamily: "PressStart2P_400Regular",
    color: "#FFFFFF",
    fontSize: 11,
  },
});
