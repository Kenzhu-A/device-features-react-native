import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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