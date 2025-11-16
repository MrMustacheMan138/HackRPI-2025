import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

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
  const dropAnim = useRef(new Animated.Value(-40)).current; // drop from above
  const iconSlide = useRef(new Animated.Value(0)).current;  // move icon left
  const textSlide = useRef(new Animated.Value(0)).current;  // slide text right
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Step 1: Fade in + Drop down
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(dropAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // Step 2: Icon slides left & Text slides out to the right
      Animated.parallel([
        Animated.timing(iconSlide, {
          toValue: -40, // icon goes left
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 1, // reveal width
          duration: 450,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Auto hide
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => onHide());
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const textWidth = textSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 230],
  });

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
      {/* Icon sliding slightly left */}
      <Animated.View style={{ transform: [{ translateX: iconSlide }] }}>
        <View style={styles.iconWrapper}>
          <Image
            source={require("../../assets/images/trophy_placeholder.png")}
            style={styles.icon}
          />
        </View>
      </Animated.View>

      {/* Text sliding to the right */}
      <Animated.View
        style={[
          styles.textBox,
          {
            width: textWidth,
          },
        ]}
      >
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
    transform: [{ translateX: -130 }], // center the whole toast
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
    overflow: "hidden",
  },

  title: {
    fontFamily: "PressStart2P_400Regular",
    color: "#FFFFFF",
    fontSize: 11,
    marginBottom: 6,
  },

  desc: {
    fontFamily: "PressStart2P_400Regular",
    color: "#AAAAAA",
    fontSize: 8,
    lineHeight: 12,
  },
});
