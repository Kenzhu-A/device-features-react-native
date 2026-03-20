import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../types/types';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { AddTravelEntryScreen } from '../screens/AddTravelEntry/AddTravelEntryScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false, // Removes the bottom border line for a cleaner look
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Travel Diary',
            headerRight: () => (
              <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
                <Feather 
                  name={isDarkMode ? 'sun' : 'moon'} 
                  size={24} 
                  color={colors.text} 
                />
              </TouchableOpacity>
            )
          }} 
        />
        <Stack.Screen 
          name="AddEntry" 
          component={AddTravelEntryScreen} 
          options={{ 
            title: 'New Entry',
            headerBackTitle: '', // This safely hides the back text on iOS in v7
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};