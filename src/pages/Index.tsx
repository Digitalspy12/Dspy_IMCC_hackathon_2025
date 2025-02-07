
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    // Create URL for image preview
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    
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
        {uploadedImage ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/95">
            <div className="relative max-w-[90vw] max-h-[80vh]">
              <img 
                src={uploadedImage} 
                alt="Uploaded satellite imagery"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/80 px-4 py-2 rounded-full border border-primary/30 backdrop-blur-sm">
                <span className="text-primary font-semibold">AI Analysis</span>
              </div>
              <div className="absolute inset-0 rounded-lg ring-1 ring-primary/30 pointer-events-none" />
            </div>
          </div>
        ) : (
          <Map detections={detections} className="w-full h-full" />
        )}
        
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

        {uploadedImage && (
          <button
            onClick={() => setUploadedImage(null)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/30 transition-colors z-[1000]"
          >
            Return to Map View
          </button>
        )}
      </div>
    </Layout>
  );
};

export default Index;
