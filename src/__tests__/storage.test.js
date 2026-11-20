import { tokenStorage } from '../services/storage';

describe('Secure Token Storage', () => {
  beforeEach(async () => {
    await tokenStorage.clearTokens();
  });

  test('stores and retrieves access and refresh tokens', async () => {
    await tokenStorage.setTokens({
      accessToken: 'test_access_jwt_123',
      refreshToken: 'test_refresh_jwt_456',
    });

    const access = await tokenStorage.getAccessToken();
    const refresh = await tokenStorage.getRefreshToken();

    expect(access).toBe('test_access_jwt_123');
    expect(refresh).toBe('test_refresh_jwt_456');
  });

  test('clears tokens properly on logout', async () => {
    await tokenStorage.setTokens({
      accessToken: 'access_to_delete',
      refreshToken: 'refresh_to_delete',
    });

    await tokenStorage.clearTokens();

    const access = await tokenStorage.getAccessToken();
    const refresh = await tokenStorage.getRefreshToken();

    expect(access).toBeNull();
    expect(refresh).toBeNull();
  });
});
