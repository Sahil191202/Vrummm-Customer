import { useAuthStore } from '../store/authStore';
import { tokenStorage } from '../services/storage';

describe('Auth Store & State Machine', () => {
  beforeEach(async () => {
    await tokenStorage.clearTokens();
    useAuthStore.setState({
      user: null,
      customerProfile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  test('initial state has no authenticated user', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test('successful login sets user and authenticated state', async () => {
    const res = await useAuthStore.getState().login({
      email: 'customer@vrumm.local',
      password: 'password123',
    });

    expect(res.success).toBe(true);
    expect(res.user.email).toBe('customer@vrumm.local');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toBeTruthy();
    expect(state.error).toBeNull();

    // Verify token was stored
    const token = await tokenStorage.getAccessToken();
    expect(token).toBeTruthy();
  });

  test('login with invalid credentials sets error', async () => {
    const res = await useAuthStore.getState().login({
      email: 'wrong@vrumm.local',
      password: 'short',
    });

    expect(res.success).toBe(false);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeTruthy();
  });

  test('register adds user and sets authenticated', async () => {
    const res = await useAuthStore.getState().register({
      email: `test_${Date.now()}@vrumm.local`,
      password: 'password123',
      displayName: 'Mumbai Commuter',
      phone: '+919876543299',
    });

    expect(res.success).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  test('logout clears user, state, and tokens', async () => {
    await useAuthStore.getState().login({
      email: 'customer@vrumm.local',
      password: 'password123',
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);

    const token = await tokenStorage.getAccessToken();
    expect(token).toBeNull();
  });
});
