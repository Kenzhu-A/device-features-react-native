import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: { 
    background: string; 
    text: string; 
    textSecondary: string;
    card: string; 
    primary: string;
    danger: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const colors = {
    background: isDarkMode ? '#121212' : '#F7F7F9',
    text: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    textSecondary: isDarkMode ? '#A1A1AA' : '#8E8E93',
    card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primary: '#007AFF',
    danger: '#FF3B30',
    border: isDarkMode ? '#38383A' : '#E5E5EA',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};