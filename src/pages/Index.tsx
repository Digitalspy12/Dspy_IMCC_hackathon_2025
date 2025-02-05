import React, { useState } from "react";
import Layout from "@/components/Layout";
import Map from "@/components/Map";
import ImageUpload from "@/components/ImageUpload";
import DetectionResults from "@/components/DetectionResults";
import { analyzeImage, type Detection } from "@/services/detectionService";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Processing image...",
        description: "Analyzing with YOLOv8. This may take a moment.",
      });

      const results = await analyzeImage(file);
      setDetections(results);
      
      toast({
        title: "Analysis complete",
        description: `Found ${results.length} objects`,
      });
    } catch (error) {
      console.error('Error during image analysis:', error);
    } finally {
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