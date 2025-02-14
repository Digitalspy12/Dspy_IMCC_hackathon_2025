import { toast } from "@/components/ui/use-toast";
import { API_URL } from '@/lib/config';

export interface Detection {
  bbox: number[];
  confidence: number;
  class: number;
  class_name: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface DetectionResult {
  detections: Detection[];
  annotated_image_url: string;
  total_detections: number;
  filename?: string;
}

export interface DemoResponse {
  results: DetectionResult[];
  total_images: number;
}

export const DETECTED_OBJECTS = [
  "Military Vehicle",
  "Military Truck",
  "Tank",
  "Artillery", 
  "Military Aircraft",
  "Military Building",
  "Military Personnel",
  "Military Equipment",
  "Storage Container",
  "Supply Depot"
];

export const detectObjects = async (image: File): Promise<DetectionResult> => {
  const formData = new FormData();
  formData.append('image', image);

  try {
    console.log('Sending request to:', `${API_URL}/detect`);
    
    const response = await fetch(`${API_URL}/detect`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || 'Detection request failed');
      } catch (e) {
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('Detection response:', data);
    
    if (!data.detections || !Array.isArray(data.detections)) {
      throw new Error('Invalid detection response format');
    }

    return {
      ...data,
      annotated_image_url: data.annotated_image_url.startsWith('http') 
        ? data.annotated_image_url 
        : `${API_URL}${data.annotated_image_url}`
    };
  } catch (error) {
    console.error('Detection error:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Detection request failed",
      variant: "destructive"
    });
    throw error;
  }
};

export const runDemoAnalysis = async (): Promise<DemoResponse> => {
  try {
    const response = await fetch(`${API_URL}/detect-demo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Demo analysis response:', response.status, errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || 'Demo analysis failed');
      } catch (e) {
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('Demo analysis response:', data);

    return {
      ...data,
      results: data.results.map((result: DetectionResult) => ({
        ...result,
        annotated_image_url: result.annotated_image_url.startsWith('http')
          ? result.annotated_image_url
          : `${API_URL}${result.annotated_image_url}`
      }))
    };
  } catch (error) {
    console.error('Demo analysis error:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Demo analysis failed",
      variant: "destructive"
    });
    throw error;
  }
};
