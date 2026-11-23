/**
 * Customer Current Location Service
 * Requests GPS / Network permission, detects live latitude/longitude on Web & Mobile,
 * and reverse-geocodes to an authentic street address via LocationIQ.
 * Includes fast IP-assisted geolocation fallback for desktop browsers without hardware GPS.
 */

import { Platform } from 'react-native';
import { mapService, MUMBAI_CENTER_COORDINATES } from './mapService';

let ExpoLocation = null;
try {
  ExpoLocation = require('expo-location');
} catch {
  // Tests or environments where expo-location is not installed
}

export const locationService = {
  /**
   * Request permission and fetch current customer location
   */
  async getCurrentLocation() {
    try {
      // 1. Web Platform Location Detection
      if (Platform.OS === 'web') {
        const gpsCoords = await new Promise((resolve) => {
          if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve([pos.coords.longitude, pos.coords.latitude]),
              () => resolve(null),
              { timeout: 3500, enableHighAccuracy: false, maximumAge: 60000 }
            );
          } else {
            resolve(null);
          }
        });

        if (gpsCoords) {
          return await mapService.reverseGeocode(gpsCoords);
        }

        // Fast IP-assisted network fallback for desktop browsers
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 2500);
          const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (res.ok) {
            const data = await res.json();
            if (data && data.latitude && data.longitude) {
              const netCoords = [parseFloat(data.longitude), parseFloat(data.latitude)];
              return await mapService.reverseGeocode(netCoords);
            }
          }
        } catch {
          // Network fallback failed
        }
      }

      // 2. Mobile Platform (Expo Location)
      if (ExpoLocation) {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy?.Balanced || 4,
          });
          const coords = [loc.coords.longitude, loc.coords.latitude];
          return await mapService.reverseGeocode(coords);
        }
      }
    } catch {
      // Graceful error recovery
    }

    // Default safe fallback to Mumbai City Center
    return await mapService.reverseGeocode(MUMBAI_CENTER_COORDINATES);
  },
};

export default locationService;
