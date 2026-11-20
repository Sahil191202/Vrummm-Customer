import * as SecureStore from 'expo-secure-store';

const memoryStore = new Map();

const KEYS = {
  ACCESS_TOKEN: 'vrumm_customer_access_token',
  REFRESH_TOKEN: 'vrumm_customer_refresh_token',
  USER_PROFILE: 'vrumm_customer_profile',
};

async function isSecureStoreAvailable() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export const tokenStorage = {
  async setTokens({ accessToken, refreshToken }) {
    try {
      const available = await isSecureStoreAvailable();
      if (available) {
        if (accessToken) {
          await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken);
        }
        if (refreshToken) {
          await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
        }
      } else {
        if (accessToken) memoryStore.set(KEYS.ACCESS_TOKEN, accessToken);
        if (refreshToken) memoryStore.set(KEYS.REFRESH_TOKEN, refreshToken);
      }
    } catch {
      if (accessToken) memoryStore.set(KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) memoryStore.set(KEYS.REFRESH_TOKEN, refreshToken);
    }
  },

  async getAccessToken() {
    try {
      const available = await isSecureStoreAvailable();
      if (available) {
        return (await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN)) || memoryStore.get(KEYS.ACCESS_TOKEN) || null;
      }
      return memoryStore.get(KEYS.ACCESS_TOKEN) || null;
    } catch {
      return memoryStore.get(KEYS.ACCESS_TOKEN) || null;
    }
  },

  async getRefreshToken() {
    try {
      const available = await isSecureStoreAvailable();
      if (available) {
        return (await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN)) || memoryStore.get(KEYS.REFRESH_TOKEN) || null;
      }
      return memoryStore.get(KEYS.REFRESH_TOKEN) || null;
    } catch {
      return memoryStore.get(KEYS.REFRESH_TOKEN) || null;
    }
  },

  async clearTokens() {
    try {
      const available = await isSecureStoreAvailable();
      if (available) {
        await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
      }
    } catch {
      // ignore
    }
    memoryStore.delete(KEYS.ACCESS_TOKEN);
    memoryStore.delete(KEYS.REFRESH_TOKEN);
  },
};

export default tokenStorage;
