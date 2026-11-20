import { create } from 'zustand';
import { tokenStorage } from '../services/storage';
import { apiRequest } from '../services/apiClient';

export const useAuthStore = create((set, get) => ({
  user: null,
  customerProfile: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    set({ isInitializing: true });
    try {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        set({ user: null, customerProfile: null, isAuthenticated: false, isInitializing: false });
        return;
      }

      // Check current user
      const response = await apiRequest('/auth/me', { requiresAuth: true });
      if (response && response.success && response.data) {
        const user = response.data.user || response.data;
        const profile = response.data.profile || null;
        set({
          user,
          customerProfile: profile,
          isAuthenticated: true,
          isInitializing: false,
          error: null,
        });
      } else {
        await tokenStorage.clearTokens();
        set({ user: null, customerProfile: null, isAuthenticated: false, isInitializing: false });
      }
    } catch {
      await tokenStorage.clearTokens();
      set({ user: null, customerProfile: null, isAuthenticated: false, isInitializing: false });
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
        requiresAuth: false,
      });

      if (response && response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        await tokenStorage.setTokens({ accessToken, refreshToken });
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, user };
      }
      throw new Error(response?.error?.message || 'Login failed');
    } catch (err) {
      set({
        isLoading: false,
        error: err.message || 'Login failed',
      });
      return { success: false, error: err.message };
    }
  },

  register: async ({ email, password, displayName, phone }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: { email, password, displayName, phone },
        requiresAuth: false,
      });

      if (response && response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        await tokenStorage.setTokens({ accessToken, refreshToken });
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, user };
      }
      throw new Error(response?.error?.message || 'Registration failed');
    } catch (err) {
      set({
        isLoading: false,
        error: err.message || 'Registration failed',
      });
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiRequest('/auth/logout', { method: 'POST', requiresAuth: true }).catch(() => {});
    } finally {
      await tokenStorage.clearTokens();
      set({
        user: null,
        customerProfile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));

export default useAuthStore;
