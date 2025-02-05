import { toast } from "@/components/ui/use-toast";

export interface Detection {
  id: string;
  type: string;
  confidence: number;
  coordinates: [number, number];
}

export const analyzeImage = async (image: File): Promise<Detection[]> => {
  try {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    return data.detections;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to analyze image. Please try again.",
      variant: "destructive",
    });
    console.error('Error analyzing image:', error);
    return [];
  }
}