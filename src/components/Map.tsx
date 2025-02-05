import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  className?: string;
  detections?: Array<{
    id: string;
    type: string;
    confidence: number;
    coordinates: [number, number];
  }>;
}

const Map = ({ className, detections = [] }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    detections.forEach((detection) => {
      const marker = L.marker([detection.coordinates[1], detection.coordinates[0]])
        .bindPopup(`
          <div class="p-2">
            <div class="font-bold">${detection.type}</div>
            <div class="text-sm">Confidence: ${(detection.confidence * 100).toFixed(2)}%</div>
          </div>
        `)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [detections]);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="relative flex-1 min-h-[400px]">
        <div ref={mapContainer} className="absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-border/50" />
      </div>
    </div>
  );
};

export default Map;