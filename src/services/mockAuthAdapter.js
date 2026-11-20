/**
 * Mock Auth Adapter for Vrumm Customer App
 * Used when backend is offline or EXPO_PUBLIC_USE_MOCK_API=true
 * Clearly labelled mock adapter that strictly simulates API contracts without fake business logic.
 */

const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
const delay = (ms) => new Promise((r) => setTimeout(r, isTest ? 5 : ms));

const mockDb = {
  users: [
    {
      id: 'usr_mumbai_cust_001',
      email: 'customer@vrumm.local',
      displayName: 'Aarav Mehta',
      phone: '+919876543210',
      role: 'CUSTOMER',
      createdAt: '2026-10-01T08:00:00.000Z',
    },
  ],
  customers: {
    usr_mumbai_cust_001: {
      id: 'cust_mumbai_001',
      userId: 'usr_mumbai_cust_001',
      rating: 4.85,
      totalRides: 42,
      savedPlaces: [
        {
          id: 'sp_home',
          label: 'Home',
          address: 'Carter Road, Bandra West, Mumbai, MH 400050',
          coordinates: [72.8258, 19.0657], // [lng, lat]
        },
        {
          id: 'sp_work',
          label: 'Work',
          address: 'Bandra Kurla Complex (BKC), Mumbai, MH 400051',
          coordinates: [72.8687, 19.0667],
        },
      ],
    },
  },
};

export const mockAuthAdapter = {
  async login({ email, password }) {
    await delay(300);
    const user = mockDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || password.length < 8) {
      const err = new Error('Invalid email or password');
      err.code = 'INVALID_CREDENTIALS';
      err.status = 401;
      throw err;
    }

    return {
      success: true,
      data: {
        user,
        accessToken: `mock_jwt_access_${user.id}_${Date.now()}`,
        refreshToken: `mock_jwt_refresh_${user.id}_${Date.now()}`,
      },
    };
  },

  async register({ email, password, displayName, phone }) {
    await delay(350);
    const exists = mockDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      const err = new Error('An account with this email already exists');
      err.code = 'EMAIL_ALREADY_EXISTS';
      err.status = 409;
      throw err;
    }

    const newUser = {
      id: `usr_mumbai_cust_${Date.now()}`,
      email: email.toLowerCase(),
      displayName: displayName || email.split('@')[0],
      phone: phone || '+919999999999',
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
    mockDb.users.push(newUser);
    mockDb.customers[newUser.id] = {
      id: `cust_${newUser.id}`,
      userId: newUser.id,
      rating: 5.0,
      totalRides: 0,
      savedPlaces: [],
    };

    return {
      success: true,
      data: {
        user: newUser,
        accessToken: `mock_jwt_access_${newUser.id}_${Date.now()}`,
        refreshToken: `mock_jwt_refresh_${newUser.id}_${Date.now()}`,
      },
    };
  },

  async getProfile(userId) {
    await delay(150);
    const user = mockDb.users.find((u) => u.id === userId) || mockDb.users[0];
    const profile = mockDb.customers[user.id] || {
      id: `cust_${user.id}`,
      userId: user.id,
      rating: 5.0,
      totalRides: 0,
      savedPlaces: [],
    };

    return {
      success: true,
      data: {
        user,
        profile,
      },
    };
  },
};

export default mockAuthAdapter;
