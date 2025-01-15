import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const webStorage = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }
};

// For SSR compatibility
const fallbackStorage = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null
};

export const storage = Platform.OS === 'web' 
  ? (typeof window !== 'undefined' ? webStorage : fallbackStorage)
  : AsyncStorage;