
import { toast } from "@/components/ui/use-toast";

export interface Detection {
  id: string;
  type: string;
  confidence: number;
  coordinates: [number, number];
}

const DETECTED_OBJECTS = [
  "Military Building",
  "Tank",
  "Storage Container",
  "Military Tent",
  "Military Vehicle",
  "Military Truck",
  "Supply Depot",
  "Vehicle Track Marks",
  "Vegetation Area"
];

export const analyzeImage = async (image: File): Promise<Detection[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const detections: Detection[] = [];
  
  // Generate 88 detections with slight variations in coordinates and confidence
  for (let i = 0; i < 88; i++) {
    const randomObject = DETECTED_OBJECTS[Math.floor(Math.random() * DETECTED_OBJECTS.length)];
    const randomConfidence = 0.85 + (Math.random() * 0.14); // Between 0.85 and 0.99
    const baseLatitude = 30.5123;
    const baseLongitude = 50.4501;
    
    // Add small random offsets to coordinates to spread objects around
    const latOffset = (Math.random() - 0.5) * 0.02;
    const longOffset = (Math.random() - 0.5) * 0.02;
    
    detections.push({
      id: `${randomObject.toLowerCase().replace(' ', '')}_${i + 1}`,
      type: randomObject,
      confidence: Number(randomConfidence.toFixed(2)),
      coordinates: [baseLatitude + latOffset, baseLongitude + longOffset]
    });
  }

  return detections;
};
