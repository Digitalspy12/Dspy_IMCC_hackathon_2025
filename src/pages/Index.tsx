import React, { useState } from "react";
import Layout from "@/components/Layout";
import Map from "@/components/Map";
import ImageUpload from "@/components/ImageUpload";
import DetectionResults from "@/components/DetectionResults";
import { toast } from "@/components/ui/use-toast";

interface Detection {
  id: string;
  type: string;
  confidence: number;
  coordinates: [number, number];
}

const Index = () => {
  const [detections, setDetections] = useState<Detection[]>([]);

  const handleImageUpload = async (file: File) => {
    // Simulate detection process
    toast({
      title: "Processing image...",
      description: "This may take a few moments.",
    });

    // Mock detection results
    setTimeout(() => {
      const mockDetections: Detection[] = [
        {
          id: "1",
          type: "Vehicle",
          confidence: 0.95,
          coordinates: [30.5234, 50.4501],
        },
        {
          id: "2",
          type: "Building",
          confidence: 0.88,
          coordinates: [30.5134, 50.4401],
        },
      ];

      setDetections(mockDetections);
      toast({
        title: "Detection complete",
        description: `Found ${mockDetections.length} objects`,
      });
    }, 2000);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        <div className="lg:col-span-3 h-full">
          <Map detections={detections} />
        </div>
        <div className="space-y-4">
          <ImageUpload onUpload={handleImageUpload} />
          <DetectionResults detections={detections} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;