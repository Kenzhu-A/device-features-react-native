import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { useTravel } from '../context/TravelContext';
import { useTheme } from '../context/ThemeContext';

// Configure Notifications for foreground viewing
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Kept for Android compatibility
    shouldShowBanner: true, // Required for newer Expo SDKs (iOS)
    shouldShowList: true,   // Required for newer Expo SDKs (iOS Notification Center)
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddEntry'>;

export const AddTravelEntryScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { addEntry } = useTravel();
  const { colors } = useTheme();

  const handleTakePhoto = async () => {
    // 1. Request Camera Permission
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPerm.status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
      return;
    }

    // 2. Take Picture
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7, // Optimize size
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      await fetchLocation();
    }
  };

  const fetchLocation = async () => {
    setIsProcessing(true);
    try {
      // 3. Request Location Permission
      const locPerm = await Location.requestForegroundPermissionsAsync();
      if (locPerm.status !== 'granted') {
        Alert.alert('Permission Denied', 'We need location permissions to get your address.');
        return;
      }

      // Get Coordinates & Reverse Geocode
      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        const formattedAddress = `${place.name || ''} ${place.street || ''}, ${place.city || ''}, ${place.region || ''}`.trim().replace(/^,\s*/, '');
        setAddress(formattedAddress || 'Unknown Location');
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location.');
      setAddress('Location unavailable');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!imageUri || !address) {
      Alert.alert('Incomplete', 'Please take a photo to get your location first.');
      return;
    }

    // 4. Request Notification Permission
    const notifPerm = await Notifications.requestPermissionsAsync();
    if (notifPerm.status !== 'granted') {
      Alert.alert('Warning', 'Notifications are disabled, but your entry will still be saved.');
    }

    const newEntry = {
      id: Date.now().toString(),
      imageUri,
      address,
      timestamp: Date.now(),
    };

    await addEntry(newEntry);

    // Send Local Push Notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Diary Updated! ✈️",
        body: `New travel entry saved at ${address}`,
      },
      trigger: null, // trigger immediately
    });

    navigation.goBack(); // State clears automatically since screen unmounts
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.card }]}>
            <Text style={{ color: colors.text }}>No Photo Taken</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleTakePhoto} disabled={isProcessing}>
        <Text style={styles.btnText}>Take Picture</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        {isProcessing ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Text style={[styles.addressText, { color: colors.text }]}>
            {address ? `📍 ${address}` : 'Take a photo to get location'}
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.saveBtn, (!imageUri || !address || isProcessing) && styles.disabledBtn]} 
        onPress={handleSave}
      >
        <Text style={styles.saveBtnText}>Save Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  imageContainer: { width: '100%', height: 300, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: '#888' },
  btn: { backgroundColor: '#34C759', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  infoContainer: { minHeight: 40, justifyContent: 'center', marginBottom: 20 },
  addressText: { fontSize: 16, textAlign: 'center', fontWeight: '500' },
  saveBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#A2C8F2' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
});