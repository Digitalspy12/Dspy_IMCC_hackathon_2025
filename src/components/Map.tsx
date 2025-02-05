import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

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

    map.current = L.map(mapContainer.current, {
      zoomControl: false, // We'll add it manually in a better position
    }).setView([0, 0], 2);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map.current);

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
            <div class="font-bold text-primary">${detection.type}</div>
            <div class="text-sm text-muted-foreground">Confidence: ${(detection.confidence * 100).toFixed(2)}%</div>
            <div class="text-xs font-mono mt-2 text-primary/70">[${detection.coordinates.join(", ")}]</div>
          </div>
        `)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // If there are detections, fit the map to show all markers
    if (detections.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

    // Add coordinates overlay
    const updateCoordinates = (e: L.LeafletMouseEvent) => {
      const coordsOverlay = document.getElementById('coordinates-overlay');
      if (coordsOverlay) {
        coordsOverlay.textContent = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
      }
    };

    map.current.on('mousemove', updateCoordinates);

    return () => {
      if (map.current) {
        map.current.off('mousemove', updateCoordinates);
      }
    };
  }, [detections]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-border/50" />
      <div className="detection-overlay">
        <div className="text-xs font-mono text-primary mb-1">ACTIVE SCAN</div>
        <div className="text-sm">Detected Objects: {detections.length}</div>
      </div>
      <div id="coordinates-overlay" className="coordinates-overlay">
        0.000000, 0.000000
      </div>
    </div>
  );
};

export default Map;