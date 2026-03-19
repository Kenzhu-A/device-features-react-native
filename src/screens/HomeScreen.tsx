import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { useTravel } from '../context/TravelContext';
import { useTheme } from '../context/ThemeContext';
import { EntryItem } from '../components/EntryItem';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const { entries, removeEntry, isLoading } = useTravel();
  const { colors, toggleTheme, isDarkMode } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
          <Text style={{ color: colors.text }}>{isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</Text>
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: colors.text, fontSize: 18 }}>No Entries yet</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <EntryItem entry={item} onRemove={removeEntry} />}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Text style={styles.fabText}>+ Add Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, alignItems: 'flex-end' },
  themeBtn: { padding: 8, borderWidth: 1, borderColor: '#888', borderRadius: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingBottom: 80 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#007AFF', padding: 16, borderRadius: 30,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4,
  },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});