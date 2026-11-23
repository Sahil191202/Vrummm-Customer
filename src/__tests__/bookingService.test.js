import { bookingService } from '../services/bookingService';
import { mockBookingAdapter } from '../services/mockBookingAdapter';

describe('Booking Service & Fare Calculation (Phase B)', () => {
  const pickup = {
    name: 'Bandra Hill Road',
    address: 'Hill Road, Bandra West, Mumbai',
    coordinates: [72.8258, 19.0544],
  };

  const drop = {
    name: 'BKC',
    address: 'G Block, BKC, Mumbai',
    coordinates: [72.8687, 19.0657],
  };

  test('fetches server fare quote with full transparent breakdown in integer paise', async () => {
    const quote = await bookingService.getFareQuote({
      vehicleType: 'BIKE',
      pickupCoordinates: pickup.coordinates,
      dropCoordinates: drop.coordinates,
      zone: 'mumbai',
    });

    expect(quote).toBeTruthy();
    expect(quote.vehicleType).toBe('BIKE');
    expect(typeof quote.totalPaise).toBe('number');
    expect(Number.isInteger(quote.totalPaise)).toBe(true);

    // Verify breakdown fields required by contracts
    expect(quote.breakdown).toBeDefined();
    expect(quote.breakdown.baseFarePaise).toBeGreaterThan(0);
    expect(quote.breakdown.distanceCharge).toBeDefined();
    expect(quote.breakdown.taxes).toBeDefined();
    expect(Array.isArray(quote.breakdown.taxes)).toBe(true);
  });

  test('creates instant booking with idempotency key', async () => {
    const idempotencyKey = `bk_test_${Date.now()}`;
    const booking = await bookingService.createBooking({
      vehicleType: 'AUTO',
      mode: 'INSTANT',
      pickup,
      drop,
      zone: 'mumbai',
      idempotencyKey,
    });

    expect(booking).toBeTruthy();
    expect(booking.idempotencyKey).toBe(idempotencyKey);
    expect(booking.vehicleType).toBe('AUTO');
    expect(booking.mode).toBe('INSTANT');
    expect(booking.status).toBe('SEARCHING');
    expect(booking.tripPin).toBeTruthy();
    expect(typeof booking.totalPaise).toBe('number');
  });

  test('respects idempotency and returns identical booking on same key', async () => {
    const idempotencyKey = `bk_idem_${Date.now()}`;
    const firstAttempt = await bookingService.createBooking({
      vehicleType: 'CAB',
      mode: 'INSTANT',
      pickup,
      drop,
      zone: 'mumbai',
      idempotencyKey,
    });

    const secondAttempt = await bookingService.createBooking({
      vehicleType: 'CAB',
      mode: 'INSTANT',
      pickup,
      drop,
      zone: 'mumbai',
      idempotencyKey,
    });

    expect(secondAttempt._id).toBe(firstAttempt._id);
    expect(secondAttempt.totalPaise).toBe(firstAttempt.totalPaise);
  });
});
