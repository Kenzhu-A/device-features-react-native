import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../types/types';
import { useTravel } from '../context/TravelContext';
import { useTheme } from '../context/ThemeContext';
import { EntryItem } from '../components/EntryItem';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const { entries, removeEntry, isLoading } = useTravel();
  const { colors } = useTheme();

  // Prevent hardware back button from exiting app on this screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Returning true prevents default behavior (exiting the app)
        return true; 
      };

      // addEventListener returns a subscription object in modern React Native
      const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Clean up the subscription when the screen loses focus
      return () => backHandlerSubscription.remove();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {entries.length === 0 ? (
        <View style={styles.center}>
          <Feather name="map" size={64} color={colors.textSecondary} style={styles.emptyIcon} />
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '600' }}>No Entries yet</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <EntryItem entry={item} onRemove={removeEntry} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddEntry')}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyIcon: { marginBottom: 16, opacity: 0.5 },
  list: { padding: 16, paddingBottom: 100 },
  fab: {
    position: 'absolute', 
    bottom: 30, 
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.3, 
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 }
  },
});