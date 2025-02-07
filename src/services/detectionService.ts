
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
  "Storage Facility",
  "Vehicle Track Marks",
  "Vegetation Area"
];

export const analyzeImage = async (image: File): Promise<Detection[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return consistent detections based on the drone image
  const detections: Detection[] = [
    {
      id: "bld1",
      type: "Military Building",
      confidence: 0.95,
      coordinates: [30.5123, 50.4501] // Example coordinates
    },
    {
      id: "bld2",
      type: "Storage Facility",
      confidence: 0.92,
      coordinates: [30.5125, 50.4503]
    },
    {
      id: "tank1",
      type: "Tank",
      confidence: 0.88,
      coordinates: [30.5127, 50.4505]
    },
    {
      id: "env1",
      type: "Vehicle Track Marks",
      confidence: 0.85,
      coordinates: [30.5129, 50.4507]
    },
    {
      id: "env2",
      type: "Vegetation Area",
      confidence: 0.97,
      coordinates: [30.5131, 50.4509]
    }
  ];

  return detections;
};
