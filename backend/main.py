from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import numpy as np
import cv2
import uuid
from typing import List
from pydantic import BaseModel
import random

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

# Military objects for random detection
MILITARY_OBJECTS = [
    "Tank",
    "Military Drone",
    "Missile Launcher",
    "Military Aircraft",
    "Armored Vehicle",
    "Radar System",
    "Military Helicopter",
    "Artillery",
    "Combat Vehicle",
    "Military Truck"
]

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # Read and process the image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Run YOLOv8 inference
    results = model(img)
    
    # Process detections and add some random military objects
    detections = []
    
    # Add actual YOLO detections
    for r in results[0].boxes.data:
        x1, y1, x2, y2, conf, cls = r.tolist()
        
        # Calculate center point
        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2
        
        # Normalize coordinates to 0-1 range
        norm_x = center_x / img.shape[1]
        norm_y = center_y / img.shape[0]
        
        # Convert to latitude/longitude-like format
        lat = (norm_y * 180) - 90
        lon = (norm_x * 360) - 180
        
        detection = Detection(
            id=str(uuid.uuid4()),
            type=results[0].names[int(cls)],
            confidence=float(conf),
            coordinates=[lon, lat]
        )
        detections.append(detection)
    
    # Add random military objects (2-5 objects)
    num_random_objects = random.randint(2, 5)
    for _ in range(num_random_objects):
        # Generate random coordinates within the image bounds
        rand_x = random.uniform(-180, 180)
        rand_y = random.uniform(-90, 90)
        
        detection = Detection(
            id=str(uuid.uuid4()),
            type=random.choice(MILITARY_OBJECTS),
            confidence=random.uniform(0.75, 0.98),  # High confidence for demonstration
            coordinates=[rand_x, rand_y]
        )
        detections.append(detection)
    
    return {"detections": detections}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)