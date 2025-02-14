from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import numpy as np
import cv2
import uuid
from typing import List
from pydantic import BaseModel
import random
from pathlib import Path
from PIL import Image
import io

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
UPLOAD_FOLDER = Path('uploads')
UPLOAD_FOLDER.mkdir(exist_ok=True)

# Initialize custom YOLOv11 model
try:
    model = YOLO('best.pt')  # Using your custom trained model
    print("Successfully loaded custom YOLOv11 model")
except Exception as e:
    print(f"Error loading model: {e}")
    raise

class Detection(BaseModel):
    id: str
    type: str
    confidence: float
    coordinates: List[float]

# Custom class mapping - matches your model's classes
MILITARY_CLASS_MAPPING = {
    0: "Military Vehicle",
    1: "Military Truck",
    2: "Tank",
    3: "Artillery",
    4: "Military Aircraft",
    5: "Military Building",
    6: "Military Personnel",
    7: "Military Equipment",
    8: "Storage Container",
    9: "Supply Depot"
}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # Read and process the image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    try:
        # Run custom model inference
        results = model(image, conf=0.35)  # Adjust confidence threshold as needed
        result = results[0]
        
        detections = []
        if result.boxes is not None:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                
                if class_id in MILITARY_CLASS_MAPPING:
                    # Calculate center point
                    center_x = (x1 + x2) / 2
                    center_y = (y1 + y2) / 2
                    
                    # Normalize coordinates to 0-1 range
                    norm_x = center_x / image.width
                    norm_y = center_y / image.height
                    
                    # Convert to latitude/longitude-like format
                    lat = (norm_y * 180) - 90
                    lon = (norm_x * 360) - 180
                    
                    detection = Detection(
                        id=str(uuid.uuid4()),
                        type=MILITARY_CLASS_MAPPING[class_id],
                        confidence=confidence,
                        coordinates=[lon, lat]
                    )
                    detections.append(detection)

        return {"detections": detections}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)