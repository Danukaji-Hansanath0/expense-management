import { MMKV } from "react-native-mmkv";
import * as SecureStore from "expo-secure-store";

// MMKV for fast, non-sensitive cache
export const storage = new MMKV({
  id: "financeflow_cache",
});

// SecureStore for sensitive data (tokens, credentials)
export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },
  
  async get(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },
  
  async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

// Storage keys
export const STORAGE_KEYS = {
  // Theme
  THEME_MODE: "ff.theme.mode",
  
  // Currency
  RATES_CACHE: "ff.currency.rates",
  RATES_TIMESTAMP: "ff.currency.timestamp",
  BASE_CURRENCY: "ff.settings.baseCurrency",
  
  // Auth
  AUTH_TOKEN: "ff.auth.token",
  REFRESH_TOKEN: "ff.auth.refreshToken",
  USER_ID: "ff.auth.userId",
  
  // Email
  EMAIL_OAUTH_TOKEN: "ff.email.oauthToken",
  EMAIL_REFRESH_TOKEN: "ff.email.refreshToken",
  
  // App
  ONBOARDING_COMPLETE: "ff.onboarding.complete",
  LAST_SYNC: "ff.sync.lastSyncAt",
} as const;

// Helper functions for currency rate caching
export const cacheRates = (rates: Record<string, number>, base: string): void => {
  storage.set(STORAGE_KEYS.RATES_CACHE, JSON.stringify(rates));
  storage.set(STORAGE_KEYS.RATES_TIMESTAMP, Date.now().toString());
  storage.set(STORAGE_KEYS.BASE_CURRENCY, base);
};

export const getCachedRates = (): { rates: Record<string, number>; timestamp: number; base: string } | null => {
  const ratesJson = storage.getString(STORAGE_KEYS.RATES_CACHE);
  const timestamp = storage.getString(STORAGE_KEYS.RATES_TIMESTAMP);
  const base = storage.getString(STORAGE_KEYS.BASE_CURRENCY) ?? "USD";
  
  if (!ratesJson || !timestamp) {
    return null;
  }
  
  return {
    rates: JSON.parse(ratesJson),
    timestamp: parseInt(timestamp, 10),
    base,
  };
};

export const clearAllData = async (): Promise<void> => {
  // Clear MMKV
  storage.clearAll();
  
  // Clear SecureStore
  const keys = Object.values(STORAGE_KEYS);
  for (const key of keys) {
    try {
      await secureStorage.delete(key);
    } catch (e) {
      // Ignore errors during cleanup
    }
  }
};
