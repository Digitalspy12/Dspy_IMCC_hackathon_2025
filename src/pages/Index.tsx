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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    // Create form data for image upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      toast({
        title: "Processing image...",
        description: "Analyzing with YOLOv8. This may take a moment.",
      });

      // TODO: Replace with actual backend endpoint
      // const response = await fetch('your-backend-url/analyze', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      
      // Simulate backend response for now
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
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis complete",
          description: `Found ${mockDetections.length} objects`,
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout className="p-0">
      <div className="relative w-full h-screen">
        <Map detections={detections} className="w-full h-full" />
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] z-[1000]">
          <ImageUpload 
            onUpload={handleImageUpload} 
            className={`transition-opacity duration-300 ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
          />
        </div>
        
        <div className="absolute right-4 top-4 w-[400px] max-w-[90vw] z-[1000]">
          <DetectionResults 
            detections={detections} 
            className={`transition-opacity duration-300 ${isAnalyzing ? 'opacity-50' : ''}`}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;