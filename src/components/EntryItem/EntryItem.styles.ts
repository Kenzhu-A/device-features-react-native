import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  },
  image: { width: 110, height: 110 },
  details: { 
    flex: 1, 
    padding: 14, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 10
  },
  pinIcon: { marginTop: 2, marginRight: 6 },
  address: { fontSize: 15, fontWeight: '500', lineHeight: 20 },
  removeBtn: { padding: 4 },
});