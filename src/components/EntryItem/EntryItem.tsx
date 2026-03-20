import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TravelEntry } from '../../types/types';
import { useTheme } from '../../context/ThemeContext';
import { styles } from './EntryItem.styles';

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

