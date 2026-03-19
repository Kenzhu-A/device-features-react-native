import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { useTravel } from '../context/TravelContext';
import { useTheme } from '../context/ThemeContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, 
    shouldShowBanner: true, 
    shouldShowList: true,   
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
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPerm.status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      await fetchLocation();
    }
  };

  const fetchLocation = async () => {
    setIsProcessing(true);
    try {
      const locPerm = await Location.requestForegroundPermissionsAsync();
      if (locPerm.status !== 'granted') {
        Alert.alert('Permission Denied', 'We need location permissions to get your address.');
        return;
      }

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

  const confirmSave = () => {
    if (!imageUri || !address) {
      Alert.alert('Incomplete', 'Please take a photo to get your location first.');
      return;
    }

    Alert.alert(
      "Save Entry",
      "Do you want to save this travel entry?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: handleSave }
      ]
    );
  };

  const handleSave = async () => {
    const notifPerm = await Notifications.requestPermissionsAsync();
    if (notifPerm.status !== 'granted') {
      console.log('Notifications disabled');
    }

    const newEntry = {
      id: Date.now().toString(),
      imageUri: imageUri as string,
      address: address as string,
      timestamp: Date.now(),
    };

    await addEntry(newEntry);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Diary Updated! ✈️",
        body: `New travel entry saved at ${address}`,
      },
      trigger: null,
    });

    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={handleTakePhoto}
        activeOpacity={0.8}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="camera" size={40} color={colors.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: '500' }}>Tap to Take a Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="map-pin" size={20} color={colors.primary} style={styles.icon} />
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Location</Text>
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
          ) : (
            <Text style={[styles.addressText, { color: colors.text }]}>
              {address ? address : 'Waiting for photo...'}
            </Text>
          )}
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity 
        style={[styles.saveBtn, { backgroundColor: colors.primary }, (!imageUri || !address || isProcessing) && styles.disabledBtn]} 
        onPress={confirmSave}
        disabled={!imageUri || !address || isProcessing}
      >
        <Feather name="check" size={20} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.saveBtnText}>Save Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  imageContainer: { 
    width: '100%', 
    height: 320, 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  image: { width: '100%', height: '100%' },
  placeholder: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    borderRadius: 16 
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center'
  },
  icon: { marginRight: 16 },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  addressText: { fontSize: 16, fontWeight: '500' },
  saveBtn: { 
    flexDirection: 'row',
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 20
  },
  disabledBtn: { opacity: 0.5 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
});