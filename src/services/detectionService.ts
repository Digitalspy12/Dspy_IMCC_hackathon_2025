import { toast } from "@/components/ui/use-toast";

export interface Detection {
  id: string;
  type: string;
  confidence: number;
  coordinates: [number, number];
}

export const analyzeImage = async (image: File): Promise<Detection[]> => {
  try {
    // First check if the backend is accessible
    try {
      await fetch('http://localhost:8000');
    } catch (error) {
      toast({
        title: "Backend Server Not Running",
        description: "Please ensure the Python backend server is running on localhost:8000. Run 'uvicorn main:app --reload' in the backend directory.",
        variant: "destructive",
      });
      throw new Error("Backend server is not running");
    }

    const formData = new FormData();
    formData.append('file', image);

    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.detections;
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    toast({
      title: "Analysis Failed",
      description: "Make sure to:\n1. Start the backend server\n2. Install all Python requirements\n3. Have the YOLOv8 model downloaded",
      variant: "destructive",
    });
    
    return [];
  }
}