# backend/app.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from typing import Dict, List
import torch
from PIL import Image
import io

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your YOLOv11 model
model = torch.hub.load('path/to/yolov11', 'custom', path='path/to/your/weights.pt')
model.eval()

async def process_image(image_bytes: bytes) -> Dict:
    """Process a single image and return detections."""
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert BGR to RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Get predictions
    results = model(img_rgb)
    
    # Extract detection results
    detections = []
    class_counts = {}
    
    # Process each detection
    for *xyxy, conf, cls in results.xyxy[0].cpu().numpy():
        class_id = int(cls)
        class_name = model.names[class_id]
        
        # Update class counts
        class_counts[class_name] = class_counts.get(class_name, 0) + 1
        
        # Calculate relative coordinates (0-1 range)
        height, width = img.shape[:2]
        x1, y1, x2, y2 = xyxy
        bbox_relative = [
            float(x1/width),
            float(y1/height),
            float(x2/width),
            float(y2/height)
        ]
        
        detection = {
            'bbox': bbox_relative,  # Normalized coordinates
            'bbox_pixels': [float(x) for x in xyxy],  # Original pixel coordinates
            'confidence': float(conf),
            'class_id': class_id,
            'class_name': class_name
        }
        detections.append(detection)
    
    # Get image dimensions
    height, width = img.shape[:2]
    
    return {
        'detections': detections,
        'counts': class_counts,
        'image_info': {
            'width': width,
            'height': height
        }
    }

@app.post("/detect")
async def detect_objects(file: UploadFile = File(...)):
    """Endpoint to process uploaded images and return detections."""
    # Validate file type
    if not file.content_type.startswith('image/'):
        return {"error": "File must be an image"}
    
    try:
        # Read image file
        contents = await file.read()
        
        # Process image
        results = await process_image(contents)
        
        return {
            'filename': file.filename,
            'content_type': file.content_type,
            **results
        }
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
