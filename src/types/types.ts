export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  timestamp: number;
}

export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};