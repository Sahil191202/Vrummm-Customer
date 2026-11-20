import { tokenStorage } from './storage';
import { mockAuthAdapter } from './mockAuthAdapter';
import { generateIdempotencyKey } from '../utils/idempotency';

const DEFAULT_BASE_URL = 'http://localhost:4000/api/v1';

export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL) || DEFAULT_BASE_URL;

export const USE_MOCK_API =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_USE_MOCK_API === 'true') || false;

/**
 * Custom API client handling standard envelopes and auth tokens
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    requiresAuth = true,
    idempotencyKey,
  } = options;

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const requestId = generateIdempotencyKey('req');

  const requestHeaders = {
    'Content-Type': 'application/json',
    'x-request-id': requestId,
    ...headers,
  };

  if (idempotencyKey) {
    requestHeaders['idempotency-key'] = idempotencyKey;
  }

  if (requiresAuth) {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // Check if mock mode is explicitly requested or forced
  if (USE_MOCK_API) {
    return handleMockRequest(endpoint, method, body);
  }

  try {
    const res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = json?.error?.message || `HTTP ${res.status}: Request failed`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.code = json?.error?.code || 'API_ERROR';
      error.details = json?.error?.details;
      throw error;
    }

    return json;
  } catch (err) {
    // If backend is unreachable (Failed to fetch, fetch failed, Network request failed, ECONNREFUSED)
    const isNetworkError =
      !err.status ||
      err.name === 'TypeError' ||
      err.message?.includes('fetch failed') ||
      err.message?.includes('Network request failed') ||
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('ECONNREFUSED') ||
      err.cause?.code === 'ECONNREFUSED';

    if (isNetworkError) {
      return handleMockRequest(endpoint, method, body);
    }
    throw err;
  }
}

async function handleMockRequest(endpoint, method, body) {
  if (endpoint === '/auth/login' && method === 'POST') {
    return mockAuthAdapter.login(body);
  }
  if (endpoint === '/auth/register' && method === 'POST') {
    return mockAuthAdapter.register(body);
  }
  if (endpoint === '/auth/me' || endpoint === '/customers/me') {
    return mockAuthAdapter.getProfile('usr_mumbai_cust_001');
  }
  if (endpoint === '/auth/logout') {
    return { success: true, data: { message: 'Logged out' } };
  }
  throw new Error(`Endpoint ${endpoint} not implemented in mock adapter`);
}

export default apiRequest;
