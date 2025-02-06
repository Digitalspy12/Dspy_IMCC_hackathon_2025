from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import numpy as np
import cv2
import uuid
from typing import List
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLOv8 model
model = YOLO('yolov8n.pt')  # Using the nano model for faster inference

class Detection(BaseModel):
    id: str
    type: str
    confidence: float
    coordinates: List[float]

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # Read and process the image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Run YOLOv8 inference
    results = model(img)
    
    # Process detections
    detections = []
    for r in results[0].boxes.data:
        x1, y1, x2, y2, conf, cls = r.tolist()
        
        # Calculate center point (we'll use this as coordinates)
        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2
        
        # Normalize coordinates to 0-1 range
        norm_x = center_x / img.shape[1]
        norm_y = center_y / img.shape[0]
        
        # Convert to latitude/longitude-like format (just for demonstration)
        # In a real application, you'd need proper geo-referencing
        lat = (norm_y * 180) - 90  # Convert to -90 to 90 range
        lon = (norm_x * 360) - 180  # Convert to -180 to 180 range
        
        detection = Detection(
            id=str(uuid.uuid4()),
            type=results[0].names[int(cls)],
            confidence=float(conf),
            coordinates=[lon, lat]
        )
        detections.append(detection)
    
    return {"detections": detections}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)