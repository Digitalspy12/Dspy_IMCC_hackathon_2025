
import { toast } from "@/components/ui/use-toast";

export interface Detection {
  id: string;
  type: string;
  confidence: number;
  coordinates: [number, number];
}

const MILITARY_OBJECTS = [
  "Tank",
  "Military Aircraft",
  "Warship",
  "Missile Launcher",
  "Military Drone",
  "Radar Installation",
  "Artillery",
  "Armored Vehicle",
  "Military Helicopter",
  "Supply Truck"
];

export const analyzeImage = async (image: File): Promise<Detection[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate random number of detections (3-7 objects)
  const numDetections = Math.floor(Math.random() * 5) + 3;
  
  // Generate mock detections
  const detections: Detection[] = [];
  
  for (let i = 0; i < numDetections; i++) {
    detections.push({
      id: Math.random().toString(36).substr(2, 9),
      type: MILITARY_OBJECTS[Math.floor(Math.random() * MILITARY_OBJECTS.length)],
      confidence: 0.7 + Math.random() * 0.29, // Random confidence between 70% and 99%
      coordinates: [
        Math.random() * 360 - 180, // Random longitude (-180 to 180)
        Math.random() * 180 - 90,  // Random latitude (-90 to 90)
      ]
    });
  }

  return detections;
};
