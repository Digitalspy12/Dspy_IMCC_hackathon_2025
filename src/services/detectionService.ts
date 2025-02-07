
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
  
  // Return consistent detections based on the drone image
  const detections: Detection[] = [
    {
      id: "tent1",
      type: "Military Tent",
      confidence: 0.98,
      coordinates: [30.5123, 50.4501]
    },
    {
      id: "tent2",
      type: "Military Tent",
      confidence: 0.97,
      coordinates: [30.5124, 50.4502]
    },
    {
      id: "container1",
      type: "Storage Container",
      confidence: 0.95,
      coordinates: [30.5125, 50.4503]
    },
    {
      id: "vehicle1",
      type: "Military Vehicle",
      confidence: 0.92,
      coordinates: [30.5126, 50.4504]
    },
    {
      id: "truck1",
      type: "Military Truck",
      confidence: 0.94,
      coordinates: [30.5127, 50.4505]
    },
    {
      id: "depot1",
      type: "Supply Depot",
      confidence: 0.96,
      coordinates: [30.5128, 50.4506]
    },
    {
      id: "tank1",
      type: "Tank",
      confidence: 0.93,
      coordinates: [30.5129, 50.4507]
    },
    {
      id: "building1",
      type: "Military Building",
      confidence: 0.91,
      coordinates: [30.5130, 50.4508]
    },
    {
      id: "marks1",
      type: "Vehicle Track Marks",
      confidence: 0.89,
      coordinates: [30.5131, 50.4509]
    }
  ];

  return detections;
};
