/**
 * Booking & Fare Service
 * Thin client interacting with /api/v1/fares and /api/v1/bookings.
 * Single source of truth is always the backend.
 */

import { apiRequest } from './apiClient';
import { generateIdempotencyKey } from '../utils/idempotency';
import { isValidGeoCoordinates } from '../utils/formatters';

export const bookingService = {
  /**
   * Fetch authoritative server-calculated fare quote with transparent breakdown.
   * Client never computes fares!
   * @param {object} params
   * @returns {Promise<object>}
   */
  async getFareQuote({ vehicleType = 'BIKE', pickupCoordinates, dropCoordinates, zone = 'mumbai' }) {
    if (!isValidGeoCoordinates(pickupCoordinates) || !isValidGeoCoordinates(dropCoordinates)) {
      throw new Error('Valid GeoJSON pickup and drop coordinates [lng, lat] required');
    }

    const [pickupLng, pickupLat] = pickupCoordinates;
    const [dropLng, dropLat] = dropCoordinates;

    const query = `?vehicleType=${encodeURIComponent(vehicleType)}&pickupLng=${pickupLng}&pickupLat=${pickupLat}&dropLng=${dropLng}&dropLat=${dropLat}&zone=${encodeURIComponent(zone)}`;
    const res = await apiRequest(`/fares/quote${query}`, {
      method: 'GET',
      requiresAuth: false, // Fare quote is public before booking
    });

    return res.data;
  },

  /**
   * Create an instant or scheduled ride booking.
   * Sends idempotency key.
   * @param {object} params
   * @returns {Promise<object>}
   */
  async createBooking({
    vehicleType,
    mode = 'INSTANT',
    pickup,
    drop,
    zone = 'mumbai',
    scheduledFor,
    idempotencyKey,
  }) {
    if (!isValidGeoCoordinates(pickup?.coordinates) || !isValidGeoCoordinates(drop?.coordinates)) {
      throw new Error('Valid pickup and drop coordinates required');
    }

    const key = idempotencyKey || generateIdempotencyKey('bk');

    const body = {
      idempotencyKey: key,
      vehicleType,
      mode,
      pickup: {
        address: pickup.address || 'Mumbai Pickup',
        coordinates: pickup.coordinates,
      },
      drop: {
        address: drop.address || 'Mumbai Drop',
        coordinates: drop.coordinates,
      },
      zone,
      scheduledFor: mode === 'SCHEDULED' ? scheduledFor : undefined,
    };

    const res = await apiRequest('/bookings', {
      method: 'POST',
      body,
      requiresAuth: true,
      idempotencyKey: key,
    });

    return res.data;
  },

  /**
   * Get booking status by id
   */
  async getBooking(bookingId) {
    const res = await apiRequest(`/bookings/${bookingId}`, {
      method: 'GET',
      requiresAuth: true,
    });
    return res.data;
  },

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId, reason = 'User requested') {
    const res = await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: { reason },
      requiresAuth: true,
    });
    return res.data;
  },

  /**
   * List customer's active and past bookings
   */
  async listMyBookings(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiRequest(`/bookings/mine${query ? `?${query}` : ''}`, {
      method: 'GET',
      requiresAuth: true,
    });
    return res.data;
  },
};

export default bookingService;
