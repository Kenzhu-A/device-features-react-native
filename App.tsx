import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { TravelProvider } from './src/context/TravelContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TravelProvider>
          <AppNavigator />
        </TravelProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}