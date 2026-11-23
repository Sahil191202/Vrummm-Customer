/**
 * Formatters and validators for money (paise), time (IST), and coordinates.
 * Rule: Money is always integer paise. Never floats.
 * Rule: Time from API is UTC, display is Asia/Kolkata.
 * Rule: Coordinates are [longitude, latitude].
 */

/**
 * Format integer paise into readable INR currency string.
 * e.g., 6825 paise -> "₹68.25", 2500 paise -> "₹25"
 * @param {number} paise - Non-negative integer paise
 * @returns {string} Formatted rupees string
 */
export function formatPaise(paise) {
  if (typeof paise !== 'number' || isNaN(paise) || paise < 0) {
    return '₹0';
  }
  const integerPaise = Math.round(paise);
  const rupees = Math.floor(integerPaise / 100);
  const remainderPaise = integerPaise % 100;

  if (remainderPaise === 0) {
    return `₹${rupees.toLocaleString('en-IN')}`;
  }
  const paddedPaise = remainderPaise < 10 ? `0${remainderPaise}` : `${remainderPaise}`;
  return `₹${rupees.toLocaleString('en-IN')}.${paddedPaise}`;
}

/**
 * Format UTC Date / ISO string into Asia/Kolkata (IST) display string.
 * @param {string|Date|number} utcDate
 * @param {object} options
 * @returns {string} Formatted IST date time
 */
export function formatToIST(utcDate, options = {}) {
  if (!utcDate) return '';
  const dateObj = typeof utcDate === 'string' || typeof utcDate === 'number' ? new Date(utcDate) : utcDate;
  if (isNaN(dateObj.getTime())) return '';

  const { timeOnly = false, dateOnly = false } = options;

  if (timeOnly) {
    return dateObj.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  if (dateOnly) {
    return dateObj.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return dateObj.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Validate GeoJSON Point coordinates: [longitude, latitude].
 * Longitude: -180 to 180, Latitude: -90 to 90.
 * @param {Array<number>} coordinates
 * @returns {boolean}
 */
export function isValidGeoCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }
  const [lng, lat] = coordinates;
  if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
    return false;
  }
  return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
}

/**
 * Calculate haversine distance in meters between two [lng, lat] coordinates.
 * @param {Array<number>} coord1 - [lng, lat]
 * @param {Array<number>} coord2 - [lng, lat]
 * @returns {number} Distance in meters (integer)
 */
export function haversineDistanceMeters(coord1, coord2) {
  if (!isValidGeoCoordinates(coord1) || !isValidGeoCoordinates(coord2)) {
    return 0;
  }
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Format distance in meters to a human readable km string.
 * @param {number} meters
 * @returns {string} e.g. "4.5 km" or "800 m"
 */
export function formatDistance(meters) {
  if (typeof meters !== 'number' || isNaN(meters) || meters < 0) return '0 m';
  if (meters < 1000) return `${Math.round(meters)} m`;
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}
