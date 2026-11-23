/**
 * Booking Store (Zustand)
 * Manages ride drafting, parallel vehicle quotes (Bike, Auto, Cab), and scheduled ride timing.
 * Single source of truth for fares is always the backend.
 */

import { create } from 'zustand';
import { bookingService } from '../services/bookingService';
import { generateIdempotencyKey } from '../utils/idempotency';

const DEFAULT_PICKUP = {
  name: 'Bandra Hill Road',
  address: 'Hill Road, Bandra West, Mumbai, Maharashtra 400050',
  coordinates: [72.8258, 19.0544],
};

const DEFAULT_DROP = {
  name: 'Bandra Kurla Complex (BKC)',
  address: 'G Block, Bandra Kurla Complex, Bandra East, Mumbai 400051',
  coordinates: [72.8687, 19.0657],
};

export const useBookingStore = create((set, get) => ({
  pickup: DEFAULT_PICKUP,
  drop: null,
  vehicleType: 'BIKE', // 'BIKE' | 'AUTO' | 'CAB'
  mode: 'INSTANT', // 'INSTANT' | 'SCHEDULED'
  scheduledFor: null, // ISO string in Asia/Kolkata

  // Quotes dictionary for each vehicle type: prevents identical prices glitch
  quotes: {
    BIKE: null,
    AUTO: null,
    CAB: null,
  },
  quote: null, // Active selected vehicle quote
  isLoadingQuotes: false,
  quotesError: null,

  isCreatingBooking: false,
  bookingError: null,
  currentBooking: null,
  activeIdempotencyKey: null,

  setPickup: (pickup) => {
    set({ pickup, quotes: { BIKE: null, AUTO: null, CAB: null }, quote: null });
    get().fetchQuotes();
  },

  setDrop: (drop) => {
    set({ drop, quotes: { BIKE: null, AUTO: null, CAB: null }, quote: null });
    get().fetchQuotes();
  },

  swapPickupAndDrop: () => {
    const { pickup, drop } = get();
    if (!pickup || !drop) return;
    set({ pickup: drop, drop: pickup, quotes: { BIKE: null, AUTO: null, CAB: null }, quote: null });
    get().fetchQuotes();
  },

  setVehicleType: (vehicleType) => {
    const quotes = get().quotes;
    set({
      vehicleType,
      quote: quotes[vehicleType] || null,
    });
  },

  setMode: (mode) => set({ mode }),

  setScheduledFor: (scheduledFor) => set({ scheduledFor }),

  /**
   * Fetch quotes for all 3 vehicle types in parallel to give distinct, accurate pricing
   */
  fetchQuotes: async () => {
    const { pickup, drop, vehicleType } = get();
    if (!pickup?.coordinates || !drop?.coordinates) {
      return;
    }

    set({ isLoadingQuotes: true, quotesError: null });
    try {
      const [bikeQuote, autoQuote, cabQuote] = await Promise.all([
        bookingService.getFareQuote({ vehicleType: 'BIKE', pickupCoordinates: pickup.coordinates, dropCoordinates: drop.coordinates, zone: 'mumbai' }),
        bookingService.getFareQuote({ vehicleType: 'AUTO', pickupCoordinates: pickup.coordinates, dropCoordinates: drop.coordinates, zone: 'mumbai' }),
        bookingService.getFareQuote({ vehicleType: 'CAB', pickupCoordinates: pickup.coordinates, dropCoordinates: drop.coordinates, zone: 'mumbai' }),
      ]);

      const quotesMap = {
        BIKE: bikeQuote,
        AUTO: autoQuote,
        CAB: cabQuote,
      };

      set({
        quotes: quotesMap,
        quote: quotesMap[vehicleType] || bikeQuote,
        isLoadingQuotes: false,
      });
    } catch (err) {
      set({
        quotesError: err.message || 'Unable to fetch fare quotes',
        isLoadingQuotes: false,
      });
    }
  },

  // Alias for backward compatibility
  fetchQuote: () => get().fetchQuotes(),

  /**
   * Create instant or scheduled booking on server with idempotency key
   */
  createBooking: async () => {
    const { pickup, drop, vehicleType, mode, scheduledFor, activeIdempotencyKey } = get();
    if (!pickup?.coordinates || !drop?.coordinates) {
      set({ bookingError: 'Please select both pickup and drop locations' });
      return { success: false, error: 'Incomplete locations' };
    }

    if (mode === 'SCHEDULED' && !scheduledFor) {
      set({ bookingError: 'Please select scheduled time at least 30 minutes ahead' });
      return { success: false, error: 'Missing scheduled time' };
    }

    const key = activeIdempotencyKey || generateIdempotencyKey('bk');
    set({ isCreatingBooking: true, bookingError: null, activeIdempotencyKey: key });

    try {
      const res = await bookingService.createBooking({
        vehicleType,
        mode,
        pickup,
        drop,
        zone: 'mumbai',
        scheduledFor,
        idempotencyKey: key,
      });

      set({
        currentBooking: res,
        isCreatingBooking: false,
        activeIdempotencyKey: null,
      });
      return { success: true, booking: res };
    } catch (err) {
      set({
        bookingError: err.message || 'Booking failed. Please try again.',
        isCreatingBooking: false,
      });
      return { success: false, error: err.message };
    }
  },

  resetBooking: () =>
    set({
      drop: null,
      quotes: { BIKE: null, AUTO: null, CAB: null },
      quote: null,
      quotesError: null,
      bookingError: null,
      currentBooking: null,
      activeIdempotencyKey: null,
      mode: 'INSTANT',
      scheduledFor: null,
    }),
}));

export default useBookingStore;
