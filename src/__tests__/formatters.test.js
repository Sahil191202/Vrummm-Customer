import { formatPaise, formatToIST, isValidGeoCoordinates, haversineDistanceMeters, formatDistance } from '../utils/formatters';

describe('Formatters and Coordinate Validators', () => {
  describe('formatPaise', () => {
    test('formats integer paise to INR rupees correctly', () => {
      expect(formatPaise(2500)).toBe('₹25');
      expect(formatPaise(6825)).toBe('₹68.25');
      expect(formatPaise(10050)).toBe('₹100.50');
      expect(formatPaise(0)).toBe('₹0');
    });

    test('handles invalid or non-numeric values safely', () => {
      expect(formatPaise(null)).toBe('₹0');
      expect(formatPaise(undefined)).toBe('₹0');
      expect(formatPaise(-100)).toBe('₹0');
    });
  });

  describe('isValidGeoCoordinates', () => {
    test('validates [longitude, latitude] properly', () => {
      expect(isValidGeoCoordinates([72.8258, 19.0544])).toBe(true); // Mumbai Bandra
      expect(isValidGeoCoordinates([72.8687, 19.0657])).toBe(true); // BKC
      expect(isValidGeoCoordinates([185, 20])).toBe(false); // Lng > 180
      expect(isValidGeoCoordinates([72, 95])).toBe(false); // Lat > 90
      expect(isValidGeoCoordinates([72])).toBe(false); // Incomplete
      expect(isValidGeoCoordinates(null)).toBe(false);
    });
  });

  describe('haversineDistanceMeters', () => {
    test('calculates accurate distance between Mumbai points', () => {
      // Bandra Hill Rd [72.8258, 19.0544] to BKC [72.8687, 19.0657] ~ 4.7 km
      const distance = haversineDistanceMeters([72.8258, 19.0544], [72.8687, 19.0657]);
      expect(distance).toBeGreaterThan(4000);
      expect(distance).toBeLessThan(6000);
    });
  });

  describe('formatDistance', () => {
    test('formats meters and kilometers', () => {
      expect(formatDistance(500)).toBe('500 m');
      expect(formatDistance(4500)).toBe('4.5 km');
      expect(formatDistance(12300)).toBe('12.3 km');
    });
  });

  describe('formatToIST', () => {
    test('formats UTC timestamp into readable IST display', () => {
      const utcDate = '2026-11-23T06:30:00.000Z'; // 12:00 PM IST (+5:30)
      const formatted = formatToIST(utcDate);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });
});
