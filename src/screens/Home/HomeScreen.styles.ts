import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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