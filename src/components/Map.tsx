import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN"; // Replace with your token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [0, 0],
      zoom: 2,
      projection: "mercator",
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    detections.forEach((detection) => {
      const el = document.createElement("div");
      el.className = "w-4 h-4 rounded-full bg-primary animate-pulse";

      const marker = new mapboxgl.Marker(el)
        .setLngLat(detection.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <div class="font-bold">${detection.type}</div>
              <div class="text-sm">Confidence: ${(detection.confidence * 100).toFixed(
                2
              )}%</div>
            </div>
          `)
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [detections]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="map-container" />
      <div className="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-border/50" />
    </div>
  );
};

export default Map;