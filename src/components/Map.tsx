import React, { useEffect, useState } from 'react';
import type { Detection } from '@/services/detectionService';
import { Card } from './ui/card';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Properly type the icon configuration
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

interface MapProps {
  detections: Detection[];
  className?: string;
}

export const Map = ({ detections, className }: MapProps): React.ReactElement => {
  const [isMounted, setIsMounted] = useState(false);
  const detectionsWithLocation = detections.filter((d: Detection) => d.location);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card className={`h-full flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Loading map...</p>
      </Card>
    );
  }

  if (detectionsWithLocation.length === 0) {
    return (
      <Card className={`h-full flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">No location data available</p>
      </Card>
    );
  }

  const center = detectionsWithLocation[0]?.location || { lat: 51.505, lng: -0.09 };

  return (
    <Card className={`h-full p-2 ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {detectionsWithLocation.map((detection: Detection, index: number) => (
          <Marker
            key={index}
            position={[detection.location!.lat, detection.location!.lng]}
          >
            <Popup>
              <div>
                <strong>{detection.class}</strong>
                <br />
                Confidence: {(detection.confidence * 100).toFixed(2)}%
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
};