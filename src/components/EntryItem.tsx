import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { TravelEntry } from '../types/types';
import { useTheme } from '../context/ThemeContext';

interface Props {
  entry: TravelEntry;
  onRemove: (id: string) => void;
}

export const EntryItem = ({ entry, onRemove }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Image source={{ uri: entry.imageUri }} style={styles.image} />
      <View style={styles.details}>
        <Text style={[styles.address, { color: colors.text }]} numberOfLines={2}>
          {entry.address}
        </Text>
        <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(entry.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 100, height: 100 },
  details: { flex: 1, padding: 10, justifyContent: 'space-between' },
  address: { fontSize: 14, fontWeight: '500' },
  removeBtn: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#FF3B30', borderRadius: 4 },
  removeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});