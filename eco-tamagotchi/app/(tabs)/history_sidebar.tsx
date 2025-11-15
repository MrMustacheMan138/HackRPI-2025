import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';

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
};

const actionEmojis = {
  recycle: '♻️',
  walk: '🚶',
  energySave: '💡',
};

const actionNames = {
  recycle: 'Recycled',
  walk: 'Walked',
  energySave: 'Saved energy',
};

function formatTimestamp(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function HistorySidebar({ visible, onClose, history }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      
      <View style={styles.sidebar}>
        <View style={styles.header}>
          <Text style={styles.title}>📜 Action Log</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {history.length === 0 ? (
            <Text style={styles.emptyText}>No actions yet! Start taking care of your pet 🌱</Text>
          ) : (
            history.map((entry) => (
              <View key={entry.id} style={styles.entry}>
                <Text style={styles.emoji}>
                  {actionEmojis[entry.action as keyof typeof actionEmojis] || '⭐'}
                </Text>
                <View style={styles.entryContent}>
                  <Text style={styles.actionName}>
                    {actionNames[entry.action as keyof typeof actionNames] || entry.action}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFF5F7',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: -2, height: 0 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#FFB3DA',
    backgroundColor: '#FFE5F1',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7C3AED',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFB3DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#512051',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  entryContent: {
    flex: 1,
  },
  actionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2933',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  xp: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },
});