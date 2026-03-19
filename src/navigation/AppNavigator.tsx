import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { HomeScreen } from '../screens/HomeScreen';
import { AddTravelEntryScreen } from '../screens/AddTravelEntryScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { colors, isDarkMode } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: !isDarkMode,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Travel Diary' }} />
        <Stack.Screen name="AddEntry" component={AddTravelEntryScreen} options={{ title: 'New Entry' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};