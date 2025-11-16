// app/store.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { getPetState } from "../src/logic/petState";
import AsyncStorage from "@react-native-async-storage/async-storage";

const bgImage = require("../assets/images/newnew.png");
const PET_KEY = "pet_state_v1";

// Placeholder store items
const storeItems = [
  { id: 1, name: "Poffle", price: 150 },
  { id: 2, name: "Tamagotchi Wallpaper", price: 50 },
  { id: 3, name: "Blossib", price: 150 },
  { id: 5, name: "Blue Shell", price: 250 },
];

export default function StoreScreen() {
  const [coins, setCoins] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadCoins();
      loadInventory();
    }, [])
  );

  const loadCoins = async () => {
    const petData = await getPetState();
    setCoins(petData.coins || 0);
  };

  const loadInventory = async () => {
    try {
      const stored = await AsyncStorage.getItem(PET_KEY);
      if (stored) {
        const petData = JSON.parse(stored);
        setPurchasedItems(petData.inventory || []);
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
  };

  const handlePurchase = async (item: typeof storeItems[0]) => {
    console.log("Attempting to purchase:", item.name, "Current coins:", coins);
    
    if (coins < item.price) {
      Alert.alert("Not Enough Coins", `You need $${item.price} to buy this item!`);
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(PET_KEY);
      console.log("Current pet data:", stored);
      
      if (stored) {
        const petData = JSON.parse(stored);
        const currentCoins = petData.coins || 0;
        const newCoins = currentCoins - item.price;
        
        console.log("Old coins:", currentCoins, "New coins:", newCoins);
        
        const currentInventory = petData.inventory || [];
        const updatedInventory = [...currentInventory, item.name];
        
        const updatedPet = {
          ...petData,
          coins: newCoins,
          inventory: updatedInventory,
        };

        await AsyncStorage.setItem(PET_KEY, JSON.stringify(updatedPet));
        console.log("Updated pet saved");
        
        setCoins(newCoins);
        setPurchasedItems(updatedInventory);
        
        Alert.alert("Purchase Successful!", `You bought ${item.name} for $${item.price}!\n\nRemaining coins: $${newCoins}`);
      }
    } catch (error) {
      console.error("Error purchasing item:", error);
      Alert.alert("Error", "Failed to purchase item");
    }
  };

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
            <View style={styles.coinDisplay}>
              <Text style={styles.coinText}>${coins}</Text>
            </View>
          </View>

          <ScrollView style={styles.storeContent} contentContainerStyle={styles.scrollContent}>
            <View style={styles.itemsGrid}>
              {storeItems.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.itemBox}
                  onPress={() => handlePurchase(item)}
                >
                  <View style={styles.imageContainer}>
                    {item.id === 1 ? (
                      <Image
                        source={require("../assets/images/egg2.png")}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    ) : item.id === 2 ? (
                      <Image
                        source={require("../assets/images/wallpaper3.jpg")}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    ) : item.id === 3 ? (
                      <Image
                        source={require("../assets/images/egg3.png")}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    ) : item.id === 5 ? (
                      <Image
                        source={require("../assets/images/eggshell.png")}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.placeholderText}>🎁</Text>
                    )}
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

        {/* Inventory Box */}
        {purchasedItems.length > 0 && (
          <View style={styles.inventoryBox}>
            <Text style={styles.inventoryTitle}>Inventory</Text>
            {purchasedItems.map((item, index) => (
              <Text key={index} style={styles.inventoryItem}>
                • {item}
              </Text>
            ))}
          </View>
        )}
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
  coinDisplay: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  coinText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
  },
  storeContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  itemBox: {
    width: 180,
    minWidth: 140,
    maxWidth: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    marginHorizontal: 10,
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
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFF5FA",
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    width: "80%",
    height: "80%",
  },
  placeholderText: {
    fontSize: 32,
  },
  itemName: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    color: "#1F2933",
    textAlign: "center",
    marginBottom: 6,
  },
  priceTag: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    fontSize: 10,
    color: "#000",
    fontWeight: "bold",
  },
  inventoryBox: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7C3AED",
    maxWidth: 200,
    maxHeight: 300,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  inventoryTitle: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 12,
    color: "#7C3AED",
    marginBottom: 8,
    textAlign: "center",
  },
  inventoryItem: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 8,
    color: "#1F2933",
    marginBottom: 4,
  },
});
