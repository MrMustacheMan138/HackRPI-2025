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
  const dropAnim = useRef(new Animated.Value(-60)).current; // drop from above
  const iconAnim = useRef(new Animated.Value(0)).current; // left move
  const textWidth = useRef(new Animated.Value(0)).current; // text width reveal
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1: Fade in + drop
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dropAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Step 2: icon left, text reveal
      Animated.parallel([
        Animated.timing(iconAnim, {
          toValue: -40,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textWidth, {
          toValue: 230,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();
    });

    // Auto hide after 3s
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textWidth, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(iconAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          top: 40 + index * 70,
          opacity: opacityAnim,
          transform: [{ translateY: dropAnim }],
        },
      ]}
    >
      {/* Icon */}
      <Animated.View style={{ transform: [{ translateX: iconAnim }] }}>
        <View style={styles.iconWrapper}>
          <Image
            source={require("../../assets/images/trophy_placeholder.png")}
            style={styles.icon}
          />
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textBox, { width: textWidth }]}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.desc}>{achievement.description}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -130 }],
    flexDirection: "row",
    alignItems: "center",
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
    overflow: "hidden",
  },
  title: {
    fontFamily: "PressStart2P_400Regular",
    color: "#FFFFFF",
    fontSize: 11,
    marginBottom: 4,
  },
  desc: {
    fontFamily: "PressStart2P_400Regular",
    color: "#AAAAAA",
    fontSize: 8,
    lineHeight: 12,
  },
});
