import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Detection {
  id: string;
  type: string;
  confidence: number;
  coordinates: [number, number];
}

interface DetectionResultsProps {
  detections: Detection[];
  className?: string;
}

const DetectionResults = ({ detections, className }: DetectionResultsProps) => {
  return (
    <div className={`detection-card ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Detection Results</h3>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {detections.map((detection) => (
            <div
              key={detection.id}
              className="p-4 bg-accent rounded-md space-y-2"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10">
                  {detection.type}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {(detection.confidence * 100).toFixed(2)}% confidence
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Location: {detection.coordinates.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DetectionResults;