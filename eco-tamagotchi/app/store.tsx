// app/store.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";

const bgImage = require("../assets/images/newnew.png");

// Placeholder store items
const storeItems = [
  { id: 1, name: "Item 1", price: 50 },
  { id: 2, name: "Item 2", price: 100 },
  { id: 3, name: "Item 3", price: 150 },
];

export default function StoreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={bgImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Store</Text>
            <View style={{ width: 80 }} />
          </View>

          <ScrollView style={styles.storeContent} contentContainerStyle={styles.scrollContent}>
            <View style={styles.itemsGrid}>
              {storeItems.map((item) => (
                <TouchableOpacity key={item.id} style={styles.itemBox}>
                  <View style={styles.imageContainer}>
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.placeholderText}>🎁</Text>
                    </View>
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>${item.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#7C3AED",
    borderRadius: 8,
  },
  backText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 12,
    color: "#FFF",
  },
  title: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 18,
    color: "#7C3AED",
    textAlign: "center",
  },
  storeContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  itemBox: {
    width: "23%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 5,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 2,
    borderColor: "#FFB3DA",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 3,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFF5FA",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE8F7",
  },
  placeholderText: {
    fontSize: 16,
  },
  itemName: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 6,
    color: "#1F2933",
    textAlign: "center",
    marginBottom: 3,
  },
  priceTag: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#FFA500",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  priceText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 6,
    color: "#000",
    fontWeight: "bold",
  },
});
