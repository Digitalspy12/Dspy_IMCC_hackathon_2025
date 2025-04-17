export interface Location {
  lat: number;
  lng: number;
}

// DetectionResult represents the response from the backend for a detection request
export interface DetectionResult {
  detections: Detection[];
  annotated_image_url: string;
  total_detections: number;
  image_location?: Location; // Optional image-level location (manual or EXIF)
  filename?: string; // For demo results
}


export interface Detection {
  bbox: number[];
  confidence: number;
  class: number;
  class_name: string;
  location?: Location; // Optional geolocation of detection

}

export interface DetectionResult {
  detections: Detection[];
  annotated_image_url: string;
  total_detections: number;
  image_location?: Location;
  filename?: string; // For demo results
}
