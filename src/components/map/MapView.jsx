/**
 * Real Map View (Leaflet + LocationIQ Road Routing)
 * Renders authentic street maps of Mumbai with real roads, highways, and landmarks.
 * Calculates & displays real road geometry (fastest route) between pickup & drop.
 * Supports tap-to-select location directly on the map.
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { Crosshair } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

let WebViewComponent = null;
if (Platform.OS !== 'web') {
  try {
    const RNWebView = require('react-native-webview');
    WebViewComponent = RNWebView?.default || RNWebView?.WebView || RNWebView;
  } catch {
    // Tests or environments without native webview
  }
}

const LOCATIONIQ_KEY = process.env.EXPO_PUBLIC_LOCATIONIQ_API_KEY || '';

export function MapView({
  pickupCoordinates,
  dropCoordinates,
  routeCoordinates,
  onCenterPress,
  onMapPress,
  onRouteInfo,
  selectionMode,
  style,
  testID = 'home-map-view',
}) {
  const { colors, radius, isDark } = useTheme();
  const webViewRef = useRef(null);

  const pickup = pickupCoordinates || [72.8258, 19.0544]; // Bandra Hill Road
  const drop = dropCoordinates || null;

  // Listen for iframe postMessage on Web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleWebMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.type === 'MAP_CLICK' && onMapPress) {
          onMapPress({ latitude: data.lat, longitude: data.lng });
        } else if (data && data.type === 'ROUTE_INFO' && onRouteInfo) {
          onRouteInfo({ distanceMeters: data.distanceMeters, durationSeconds: data.durationSeconds });
        }
      } catch {
        // Ignore non-json messages
      }
    };

    window.addEventListener('message', handleWebMessage);
    return () => window.removeEventListener('message', handleWebMessage);
  }, [onMapPress, onRouteInfo]);

  const mapHtml = useMemo(() => {
    const pLng = pickup[0];
    const pLat = pickup[1];
    const dLng = drop ? drop[0] : null;
    const dLat = drop ? drop[1] : null;
    const initialRoadCoords = (routeCoordinates && routeCoordinates.length > 1)
      ? JSON.stringify(routeCoordinates.map((c) => [c[1], c[0]]))
      : 'null';

    const tileUrl = LOCATIONIQ_KEY
      ? `https://tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_KEY}`
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmBackup = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
  <style>
    * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
    body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #F4FAF5; overflow: hidden; font-family: -apple-system, sans-serif; cursor: crosshair; }
    .leaflet-control-attribution { display: none !important; }
    .leaflet-bar { border: none !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
    .leaflet-bar a { background: #FFFFFF !important; color: #0B2B26 !important; border-bottom: 1px solid #E2E8F0 !important; width: 34px !important; height: 34px !important; line-height: 34px !important; font-weight: bold !important; }
    .custom-pin { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(0,0,0,0.4); font-weight: 900; font-size: 14px; color: #FFFFFF; }
    .pickup-pin { background: #059669; }
    .drop-pin { background: #D97706; }
    .pulse-ring { position: absolute; width: 56px; height: 56px; border-radius: 50%; background: rgba(5, 150, 105, 0.4); animation: pulse 1.8s infinite ease-out; top: -10px; left: -10px; pointer-events: none; }
    @keyframes pulse { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    function initMap() {
      if (typeof L === 'undefined') { setTimeout(initMap, 100); return; }
      try {
        var map = L.map('map', { zoomControl: true, attributionControl: false, dragging: true, touchZoom: true, scrollWheelZoom: true }).setView([${pLat}, ${pLng}], 13);
        var primaryLayer = L.tileLayer('${tileUrl}', { subdomains: 'abcd', maxZoom: 19, crossOrigin: true });
        primaryLayer.on('tileerror', function() { L.tileLayer('${osmBackup}', { maxZoom: 19 }).addTo(map); });
        primaryLayer.addTo(map);

        var pIcon = L.divIcon({ className: '', html: '<div style="position:relative;"><div class="pulse-ring"></div><div class="custom-pin pickup-pin">P</div></div>', iconSize: [36, 36], iconAnchor: [18, 18] });
        var pMarker = L.marker([${pLat}, ${pLng}], { icon: pIcon }).addTo(map);

        ${dLat && dLng ? `
          var dIcon = L.divIcon({ className: '', html: '<div class="custom-pin drop-pin">D</div>', iconSize: [36, 36], iconAnchor: [18, 18] });
          var dMarker = L.marker([${dLat}, ${dLng}], { icon: dIcon }).addTo(map);

          var routeCasing = null;
          var routeLine = null;

          function renderPolyline(latlngs, isRoad) {
            if (routeCasing) { map.removeLayer(routeCasing); routeCasing = null; }
            if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
            if (isRoad) {
              routeCasing = L.polyline(latlngs, { color: '#022C22', weight: 7, opacity: 0.85, lineJoin: 'round', lineCap: 'round' }).addTo(map);
              routeLine = L.polyline(latlngs, { color: '#059669', weight: 5, opacity: 1, lineJoin: 'round', lineCap: 'round' }).addTo(map);
            } else {
              routeLine = L.polyline(latlngs, { color: '#059669', weight: 4, opacity: 0.8, dashArray: '6, 8', lineJoin: 'round' }).addTo(map);
            }
            map.fitBounds(routeLine.getBounds(), { padding: [55, 55] });
          }

          var predefinedCoords = ${initialRoadCoords};
          if (predefinedCoords && predefinedCoords.length > 1) {
            renderPolyline(predefinedCoords, true);
          } else {
            renderPolyline([[${pLat}, ${pLng}], [${dLat}, ${dLng}]], false);
            var apiKey = '${LOCATIONIQ_KEY}';
            if (apiKey) {
              var dirUrl = 'https://us1.locationiq.com/v1/directions/driving/${pLng},${pLat};${dLng},${dLat}?key=' + apiKey + '&overview=full&geometries=geojson';
              fetch(dirUrl)
                .then(function(r) { return r.json(); })
                .then(function(data) {
                  if (data && data.routes && data.routes.length > 0) {
                    var r = data.routes[0];
                    if (r.geometry && r.geometry.coordinates && r.geometry.coordinates.length > 1) {
                      var roadCoords = r.geometry.coordinates.map(function(c) { return [c[1], c[0]]; });
                      renderPolyline(roadCoords, true);
                      var summary = JSON.stringify({ type: 'ROUTE_INFO', distanceMeters: r.distance, durationSeconds: r.duration });
                      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) { window.ReactNativeWebView.postMessage(summary); }
                      if (window.parent && window.parent.postMessage) { window.parent.postMessage(summary, '*'); }
                    }
                  }
                })
                .catch(function(err) { console.log('Directions error:', err); });
            }
          }
        ` : `
          map.setView([${pLat}, ${pLng}], 14);
        `}

        map.on('click', function(e) {
          var payload = JSON.stringify({ type: 'MAP_CLICK', lat: e.latlng.lat, lng: e.latlng.lng });
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) { window.ReactNativeWebView.postMessage(payload); }
          if (window.parent && window.parent.postMessage) { window.parent.postMessage(payload, '*'); }
        });

        setTimeout(function() { map.invalidateSize(); }, 250);
        setTimeout(function() { map.invalidateSize(); }, 600);
      } catch (e) {
        console.error('Leaflet error:', e);
      }
    }
    if (document.readyState === 'complete') { initMap(); }
    else { window.addEventListener('load', initMap); }
  </script>
</body>
</html>`;
  }, [pickup, drop, routeCoordinates, isDark]);

  return (
    <View testID={testID} style={[styles.container, style]}>
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={mapHtml}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', zIndex: 1 }}
          title="Mumbai Real Map"
        />
      ) : WebViewComponent ? (
        <WebViewComponent
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapHtml, baseUrl: 'https://localhost' }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode="always"
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          androidHardwareAccelerationDisabled={false}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data && data.type === 'MAP_CLICK' && onMapPress) {
                onMapPress({ latitude: data.lat, longitude: data.lng });
              } else if (data && data.type === 'ROUTE_INFO' && onRouteInfo) {
                onRouteInfo({ distanceMeters: data.distanceMeters, durationSeconds: data.durationSeconds });
              }
            } catch {
              // Ignore non-json
            }
          }}
        />
      ) : null}

      {/* Recenter Button */}
      <Pressable
        onPress={onCenterPress}
        accessibilityRole="button"
        accessibilityLabel="Re-center on current location"
        style={[styles.recenterButton, { backgroundColor: '#FFFFFF', borderColor: colors.border, borderRadius: radius.full }]}
      >
        <Crosshair size={22} color="#059669" strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#F4FAF5' },
  webView: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', flex: 1, zIndex: 1, backgroundColor: '#F4FAF5' },
  recenterButton: {
    position: 'absolute',
    right: 18,
    top: 76,
    width: 46,
    height: 46,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
});

export default MapView;