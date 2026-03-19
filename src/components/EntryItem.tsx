import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TravelEntry } from '../types/types';
import { useTheme } from '../context/ThemeContext';

interface Props {
  entry: TravelEntry;
  onRemove: (id: string) => void;
}

export const EntryItem = ({ entry, onRemove }: Props) => {
  const { colors } = useTheme();

  const confirmRemove = () => {
    Alert.alert(
      "Remove Entry",
      "Are you sure you want to delete this travel entry?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onRemove(entry.id) }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: entry.imageUri }} style={styles.image} />
      <View style={styles.details}>
        <View style={styles.textContainer}>
          <Feather name="map-pin" size={14} color={colors.primary} style={styles.pinIcon} />
          <Text style={[styles.address, { color: colors.text }]} numberOfLines={2}>
            {entry.address}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.removeBtn} 
          onPress={confirmRemove}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="trash-2" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  },
  image: { width: 110, height: 110 },
  details: { 
    flex: 1, 
    padding: 14, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 10
  },
  pinIcon: { marginTop: 2, marginRight: 6 },
  address: { fontSize: 15, fontWeight: '500', lineHeight: 20 },
  removeBtn: { padding: 4 },
});