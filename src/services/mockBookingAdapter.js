/**
 * Mock Booking & Fare Adapter
 * Used as a fallback when the backend API is unreachable or in tests.
 * Mirrors exact backend contracts from @vrumm/contracts and fare.service.js.
 */

import { haversineDistanceMeters } from '../utils/formatters';

const FARE_RATES = {
  BIKE: {
    baseFarePaise: 2000, // ₹20
    perKmPaise: 900, // ₹9/km
    perMinutePaise: 100, // ₹1/min
    minimumFarePaise: 2500, // ₹25
    gstBps: 500, // 5% GST
  },
  AUTO: {
    baseFarePaise: 2800, // ₹28
    perKmPaise: 1500, // ₹15/km
    perMinutePaise: 150, // ₹1.5/min
    minimumFarePaise: 3500, // ₹35
    gstBps: 500,
  },
  CAB: {
    baseFarePaise: 5000, // ₹50
    perKmPaise: 2200, // ₹22/km
    perMinutePaise: 200, // ₹2/min
    minimumFarePaise: 7500, // ₹75
    gstBps: 500,
  },
};

const mockBookingsDb = new Map();

export const mockBookingAdapter = {
  /**
   * Get server fare quote with full transparent breakdown
   */
  async getFareQuote({ vehicleType = 'BIKE', pickupLng, pickupLat, dropLng, dropLat, zone = 'mumbai' }) {
    const rates = FARE_RATES[vehicleType] || FARE_RATES.BIKE;
    const distanceMetres = haversineDistanceMeters([pickupLng, pickupLat], [dropLng, dropLat]);

    const billableDistanceKm = distanceMetres / 1000;
    const durationMinutes = Math.max(3, Math.round(distanceMetres / 366)); // ~22 km/h Mumbai speed

    const baseFare = rates.baseFarePaise;
    const distanceCharge = Math.round(billableDistanceKm * rates.perKmPaise);
    const timeCharge = Math.round(durationMinutes * rates.perMinutePaise);

    let subtotal = baseFare + distanceCharge + timeCharge;
    const minimumApplied = subtotal < rates.minimumFarePaise;
    if (minimumApplied) {
      subtotal = rates.minimumFarePaise;
    }

    const taxAmountPaise = Math.round((subtotal * rates.gstBps) / 10000);
    const totalPaise = subtotal + taxAmountPaise;

    return {
      success: true,
      data: {
        vehicleType,
        zone,
        distanceMetres,
        estimatedDurationMinutes: durationMinutes,
        breakdown: {
          baseFarePaise: baseFare,
          distanceCharge: {
            distanceMetres,
            ratePerKmPaise: rates.perKmPaise,
            amountPaise: distanceCharge,
          },
          timeCharge: {
            durationMinutes,
            ratePerMinutePaise: rates.perMinutePaise,
            amountPaise: timeCharge,
          },
          minimumApplied,
          subtotalPaise: subtotal,
          taxes: [
            {
              label: 'GST (5%)',
              basisPoints: rates.gstBps,
              amountPaise: taxAmountPaise,
            },
          ],
          totalTaxPaise: taxAmountPaise,
        },
        totalPaise,
        fareConfigVersion: 1,
        fareConfigId: `cfg_mock_${vehicleType.toLowerCase()}`,
        distanceMethod: 'haversine',
      },
    };
  },

  /**
   * Create an instant or scheduled booking
   */
  async createBooking(data) {
    const { idempotencyKey, vehicleType, mode, pickup, drop, zone = 'mumbai', scheduledFor } = data;

    // Idempotency check
    if (mockBookingsDb.has(idempotencyKey)) {
      return {
        success: true,
        data: mockBookingsDb.get(idempotencyKey),
        wasIdempotent: true,
      };
    }

    const quoteRes = await this.getFareQuote({
      vehicleType,
      pickupLng: pickup.coordinates[0],
      pickupLat: pickup.coordinates[1],
      dropLng: drop.coordinates[0],
      dropLat: drop.coordinates[1],
      zone,
    });

    const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newBooking = {
      _id: bookingId,
      bookingId,
      customerId: 'cust_mock_001',
      userId: 'usr_mock_001',
      idempotencyKey,
      vehicleType,
      mode: mode || 'INSTANT',
      status: mode === 'SCHEDULED' ? 'SCHEDULED_CONFIRMED' : 'SEARCHING',
      pickup: {
        address: pickup.address || 'Mumbai Pickup Location',
        coordinates: pickup.coordinates,
      },
      drop: {
        address: drop.address || 'Mumbai Drop Location',
        coordinates: drop.coordinates,
      },
      scheduledFor: scheduledFor || null,
      fareSnapshot: quoteRes.data,
      totalPaise: quoteRes.data.totalPaise,
      tripPin: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
    };

    mockBookingsDb.set(idempotencyKey, newBooking);
    mockBookingsDb.set(bookingId, newBooking);

    return {
      success: true,
      data: newBooking,
    };
  },

  async getBooking(bookingId) {
    const booking = mockBookingsDb.get(bookingId);
    if (!booking) {
      throw new Error(`Booking ${bookingId} not found`);
    }
    return { success: true, data: booking };
  },

  async cancelBooking(bookingId, reason = 'User requested') {
    const booking = mockBookingsDb.get(bookingId);
    if (!booking) {
      throw new Error(`Booking ${bookingId} not found`);
    }
    booking.status = 'CANCELLED';
    booking.cancelReason = reason;
    booking.cancellationFeePaise = 0; // Server-provided
    return { success: true, data: booking };
  },

  async listMyBookings() {
    const all = Array.from(mockBookingsDb.values());
    return { success: true, data: all };
  },
};

export default mockBookingAdapter;
