import React from 'react';
import type { Detection } from '@/services/detectionService';
import { Card } from './ui/card';

interface DetectionResultsProps {
  detections: Detection[];
  annotatedImageUrl: string | null;
  totalDetections: number;
}

export const DetectionResults = ({
  detections,
  annotatedImageUrl,
  totalDetections,
}: DetectionResultsProps): React.ReactElement => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          Military Object Detection Results ({totalDetections})
        </h3>
        <div className="space-y-2">
          {detections.map((detection, index) => (
            <div
              key={index}
              className="p-2 border rounded-md bg-background hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">{detection.class_name}</p>
              <p className="text-sm text-muted-foreground">
                Confidence: {(detection.confidence * 100).toFixed(2)}%
              </p>
              {detection.location && (
                <p className="text-sm text-muted-foreground">
                  Location: {detection.location.lat.toFixed(6)}, {detection.location.lng.toFixed(6)}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {detections.length === 0 && (
        <Card className="p-4 text-center text-muted-foreground">
          Upload an image to detect military objects using YOLOv11
        </Card>
      )}
    </div>
  );
};