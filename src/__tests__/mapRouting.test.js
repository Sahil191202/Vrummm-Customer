import { mapService } from '../services/mapService';

describe('Map Service & Route Directions (Real Road Routing)', () => {
  const pickup = [72.8258, 19.0544]; // Bandra Hill Road
  const drop = [72.8687, 19.0657]; // BKC

  beforeEach(() => {
    process.env.EXPO_PUBLIC_LOCATIONIQ_API_KEY = 'mock_locationiq_key';
  });

  test('fetchRoute returns null if pickup or drop coordinates are missing', async () => {
    const res = await mapService.fetchRoute(null, drop);
    expect(res).toBeNull();
  });

  test('fetchRoute calls LocationIQ directions API and returns valid road geometry', async () => {
    const mockRouteData = {
      routes: [
        {
          distance: 6805.2,
          duration: 537.1,
          geometry: {
            type: 'LineString',
            coordinates: [
              [72.8258, 19.0544],
              [72.828, 19.056],
              [72.84, 19.06],
              [72.8687, 19.0657],
            ],
          },
        },
      ],
    };

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRouteData,
    });

    try {
      const result = await mapService.fetchRoute(pickup, drop);
      expect(result).toBeTruthy();
      expect(result.coordinates.length).toBe(4);
      expect(result.distanceMeters).toBe(6805.2);
      expect(result.durationSeconds).toBe(537.1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/directions/driving/'),
        expect.anything()
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  test('fetchRoute falls back cleanly to haversine distance on network failure', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    try {
      const result = await mapService.fetchRoute(pickup, drop);
      expect(result).toBeTruthy();
      expect(result.coordinates.length).toBe(2);
      expect(result.distanceMeters).toBeGreaterThan(0);
      expect(result.durationSeconds).toBeGreaterThan(0);
    } finally {
      global.fetch = originalFetch;
    }
  });
});