import * as React from 'react';
import type { Detection, DetectionResult } from '@/types';
import { Layout } from "@/components/Layout";
import { Map } from "@/components/Map";
import { ImageUpload } from "@/components/ImageUpload";
import { DetectionResults } from "@/components/DetectionResults";
import { detectObjects, runDemoAnalysis } from "@/services/detectionService";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = (): JSX.Element => {
  const [detections, setDetections] = React.useState<Detection[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [annotatedImageUrl, setAnnotatedImageUrl] = React.useState<string | null>(null);
  const [totalDetections, setTotalDetections] = React.useState(0);
  const [demoResults, setDemoResults] = React.useState<DetectionResult[]>([]);
  const [isDemoMode, setIsDemoMode] = React.useState(false);
  const [imageLocation, setImageLocation] = React.useState<{lat: number, lng: number} | null>(null);

  const handleImageUpload = async (file: File, coords?: { lat: number; lng: number }) => {
    setIsAnalyzing(true);
    setIsDemoMode(false);
    setDemoResults([]);
    
    // Create URL for image preview
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    
    try {
      toast({
        title: "Processing image...",
        description: "Analyzing with YOLOv11. This may take a moment.",
      });

      // Create FormData with file
      const formData = new FormData();
      formData.append('image', file);
      
      // Add manual coordinates if provided
      if (coords) {
        formData.append('manual_lat', coords.lat.toString());
        formData.append('manual_lng', coords.lng.toString());
      }

      const response = await detectObjects(formData);
      setDetections(response.detections);
      setAnnotatedImageUrl(response.annotated_image_url);
      setTotalDetections(response.total_detections);
      setImageLocation(response.image_location || null);
      
      toast({
        title: "Analysis complete",
        description: `Found ${response.total_detections} military object${response.total_detections !== 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error('Error during image analysis:', error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDemoAnalysis = async () => {
    setIsAnalyzing(true);
    setIsDemoMode(true);
    setUploadedImage(null);
    setAnnotatedImageUrl(null);
    
    try {
      toast({
        title: "Processing demo images...",
        description: "Analyzing images from data folder. This may take a moment.",
      });

      const response = await runDemoAnalysis();
      setDemoResults(response.results);
      
      // Set the first result as active
      if (response.results.length > 0) {
        const firstResult = response.results[0];
        setDetections(firstResult.detections);
        setAnnotatedImageUrl(firstResult.annotated_image_url);
        setTotalDetections(firstResult.total_detections);
      }
      
      toast({
        title: "Demo analysis complete",
        description: `Processed ${response.total_images} images`,
      });
    } catch (error) {
      console.error('Error during demo analysis:', error);
      toast({
        title: "Error",
        description: "Failed to analyze demo images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const viewDemoResult = (result: typeof demoResults[0]) => {
    setDetections(result.detections);
    setAnnotatedImageUrl(result.annotated_image_url);
    setTotalDetections(result.total_detections);
    setImageLocation(result.image_location || null);
  };

  return (
    <Layout>
      <div className="relative w-full h-screen">
        {annotatedImageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/95">
            <div className="relative max-w-[90vw] max-h-[80vh]">
              <img 
                src={annotatedImageUrl}
                alt="Analyzed imagery"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/80 px-4 py-2 rounded-full border border-primary/30 backdrop-blur-sm">
                <span className="text-primary font-semibold">AI Analysis</span>
              </div>
              <div className="absolute inset-0 rounded-lg ring-1 ring-primary/30 pointer-events-none" />
            </div>
          </div>
        ) : (
          <Map detections={detections} className="w-full h-full" center={imageLocation || undefined} />
        )}
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] z-[1000] space-y-4">
          <ImageUpload 
            onUpload={handleImageUpload} 
            isLoading={isAnalyzing}
          />
          <Button
            onClick={handleDemoAnalysis}
            disabled={isAnalyzing}
            className="w-full"
            variant="secondary"
          >
            {isAnalyzing ? "Processing Demo Images..." : "Run Demo Analysis"}
          </Button>
        </div>
        
        <div className="absolute right-4 top-4 w-[400px] max-w-[90vw] z-[1000] space-y-4">
          <DetectionResults 
            detections={detections}
            annotatedImageUrl={annotatedImageUrl}
            totalDetections={totalDetections}
          />
          
          {isDemoMode && demoResults.length > 0 && (
            <ScrollArea className="h-[300px] rounded-lg border bg-card p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Demo Results</h3>
                {demoResults.map((result, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => viewDemoResult(result)}
                  >
                    {result.filename} ({result.total_detections} detections)
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {annotatedImageUrl && (
          <button
            onClick={() => {
              setUploadedImage(null);
              setAnnotatedImageUrl(null);
            }}
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
