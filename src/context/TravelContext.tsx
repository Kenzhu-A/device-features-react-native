import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry } from '../types/types';

interface TravelContextProps {
  entries: TravelEntry[];
  addEntry: (entry: TravelEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TravelContext = createContext<TravelContextProps | undefined>(undefined);
const STORAGE_KEY = '@travel_entries';

export const TravelProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedEntries) setEntries(JSON.parse(storedEntries));
    } catch (error) {
      console.error('Failed to load entries', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = async (entry: TravelEntry) => {
    try {
      const updatedEntries = [entry, ...entries];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Failed to save entry', error);
    }
  };

  const removeEntry = async (id: string) => {
    try {
      const updatedEntries = entries.filter((e) => e.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Failed to remove entry', error);
    }
  };

  return (
    <TravelContext.Provider value={{ entries, addEntry, removeEntry, isLoading }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) throw new Error('useTravel must be used within a TravelProvider');
  return context;
};