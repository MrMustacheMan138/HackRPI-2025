import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";

// Achievement icon mapping
const achievementIcons: Record<string, any> = {
  recycler: require("../../../assets/images/trophy_placeholder.png"),
  first_steps: require("../../../assets/images/trophy_placeholder.png"),
  energy_saver: require("../../../assets/images/trophy_placeholder.png"),
  level_5: require("../../../assets/images/trophy_placeholder.png"),
};

// Props
type HistorySidebarProps = {
  visible: boolean;
  onClose: () => void;
  history: any[];
  petActions?: Record<string, number>;
  achievements?: any[];
  onResetPet: () => void;
};

export default function HistorySidebar({
  visible,
  onClose,
  history,
  petActions = {},
  achievements = [],
  onResetPet,
}: HistorySidebarProps) {
  const [view, setView] = useState<"menu" | "actions" | "achievements">("menu");

  const renderMenu = () => (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setView("actions")}>
        <Text style={styles.menuButtonText}>View Action Log</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => setView("achievements")}>
        <Text style={styles.menuButtonText}>View Achievements</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuButton, {backgroundColor:"#F87171"}]} onPress={onResetPet}>
        <Text style={styles.menuButtonText}>Reset to Egg</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuButton, {backgroundColor:"#9CA3AF"}]} onPress={onClose}>
        <Text style={styles.menuButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActions = () => (
    <View style={{flex:1}}>
      <Text style={styles.title}>Action Log</Text>
      <FlatList
        data={[...history].reverse()}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.actionItem}>
            <Text style={styles.actionText}>{item.action} - {item.detail ?? ""}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => setView("menu")}>
        <Text style={styles.menuButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAchievements = () => (
    <View style={{flex:1}}>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => {
          const unlocked = petActions[item.id];
          return (
            <View style={styles.achievementItem}>
              <Image
                source={achievementIcons[item.id] || achievementIcons.recycler}
                style={[styles.achievementIcon, {opacity: unlocked ? 1 : 0.3}]}
              />
              <Text style={[styles.achievementText, {color: unlocked ? "#FFF" : "#A1A1AA"}]}>
                {item.title}
              </Text>
            </View>
          );
        }}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => setView("menu")}>
        <Text style={styles.menuButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.sidebar}>
          {view === "menu" && renderMenu()}
          {view === "actions" && renderActions()}
          {view === "achievements" && renderAchievements()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground:{flex:1, backgroundColor:"rgba(0,0,0,0.4)", justifyContent:"center", alignItems:"center"},
  sidebar:{width:"90%", maxHeight:"80%", backgroundColor:"#1F2937", borderRadius:16, padding:16},
  menu:{flex:1, justifyContent:"center", gap:12},
  menuButton:{backgroundColor:"#4B5563", padding:12, borderRadius:12, alignItems:"center"},
  menuButtonText:{fontFamily:"PressStart2P_400Regular", color:"#FFF", fontSize:12},
  title:{fontFamily:"PressStart2P_400Regular", color:"#FFF", fontSize:14, marginBottom:8, textAlign:"center"},
  actionItem:{padding:8, borderBottomWidth:1, borderBottomColor:"#374151"},
  actionText:{fontFamily:"PressStart2P_400Regular", color:"#FFF", fontSize:12},
  backButton:{marginTop:12, backgroundColor:"#4B5563", padding:10, borderRadius:12, alignItems:"center"},
  achievementItem:{flex:1, alignItems:"center", margin:8},
  achievementIcon:{width:48,height:48,borderRadius:8, marginBottom:4},
  achievementText:{fontFamily:"PressStart2P_400Regular", fontSize:10, textAlign:"center"}
});
