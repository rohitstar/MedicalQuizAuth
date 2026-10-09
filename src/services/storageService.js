import {createAsyncStorage} from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants/appConstants';

const AsyncStorage = createAsyncStorage('medicalQuizApp');

const storageService = {
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Unable to save ${key}:`, error);
      return false;
    }
  },

  async get(key, fallback = null) {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      return storedValue === null ? fallback : JSON.parse(storedValue);
    } catch (error) {
      console.error(`Unable to read ${key}:`, error);
      return fallback;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Unable to remove ${key}:`, error);
      return false;
    }
  },

  async removeMany(keys) {
    try {
      await AsyncStorage.removeMany(keys);
      return true;
    } catch (error) {
      console.error('Unable to remove stored values:', error);
      return false;
    }
  },

  clearQuizProgress() {
    return this.removeMany([
      STORAGE_KEYS.QUIZ_START_TIME,
      STORAGE_KEYS.QUIZ_ANSWERS,
    ]);
  },
};

export default storageService;
