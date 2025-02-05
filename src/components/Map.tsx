import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

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
  const [token, setToken] = useState("");
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: [0, 0],
        zoom: 2,
        projection: "mercator",
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      
      map.current.on('load', () => {
        setIsMapInitialized(true);
        toast({
          title: "Map initialized successfully",
          description: "The map is now ready to use",
        });
      });

    } catch (error) {
      console.error("Map initialization error:", error);
      toast({
        title: "Error initializing map",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !isMapInitialized) return;

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
  }, [detections, isMapInitialized]);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {!isMapInitialized && (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your Mapbox token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={initializeMap} disabled={!token}>
            Initialize Map
          </Button>
        </div>
      )}
      <div className="relative flex-1 min-h-[400px]">
        <div ref={mapContainer} className="absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-border/50" />
      </div>
    </div>
  );
};

export default Map;