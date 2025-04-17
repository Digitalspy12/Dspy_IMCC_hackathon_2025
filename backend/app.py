from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
import torch
import cv2
import numpy as np
from PIL import Image, ImageDraw
import os
import io
import uuid
from pathlib import Path
import logging
from ultralytics import YOLO
import piexif
from fractions import Fraction

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static')
app.wsgi_app = ProxyFix(app.wsgi_app)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure folders
UPLOAD_FOLDER = Path('static/annotated')
DATA_FOLDER = Path('data')
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
DATA_FOLDER.mkdir(parents=True, exist_ok=True)

def extract_gps_from_image(image_path):
    """
    Extract GPS coordinates from image EXIF data.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        tuple: (latitude, longitude) if GPS data is found, (None, None) otherwise
    """
    try:
        # Load EXIF data
        exif_dict = piexif.load(str(image_path))
        
        # Check if GPS info exists
        if "GPS" not in exif_dict or not exif_dict["GPS"]:
            logger.info("No GPS data found in image EXIF")
            return None, None
        
        # Extract GPS data
        gps_info = exif_dict["GPS"]
        
        # Check if latitude and longitude references exist
        if not all(key in gps_info for key in [1, 2, 3, 4]):
            logger.info("Incomplete GPS data in EXIF")
            return None, None
        
        # Get latitude
        lat_ref = gps_info[1].decode('utf-8')
        lat_deg = _convert_to_degrees(gps_info[2])
        latitude = lat_deg if lat_ref == "N" else -lat_deg
        
        # Get longitude 
        lon_ref = gps_info[3].decode('utf-8')
        lon_deg = _convert_to_degrees(gps_info[4])
        longitude = lon_deg if lon_ref == "E" else -lon_deg
        
        logger.info(f"Extracted GPS coordinates: {latitude}, {longitude}")
        return latitude, longitude
    
    except Exception as e:
        logger.error(f"Error extracting GPS data: {e}")
        return None, None

def _convert_to_degrees(value):
    """
    Convert GPS coordinates from (degrees, minutes, seconds) format to decimal degrees
    """
    degrees = value[0][0] / value[0][1]
    minutes = value[1][0] / value[1][1] / 60
    seconds = value[2][0] / value[2][1] / 3600
    return degrees + minutes + seconds

class YOLOv11:
    def __init__(self, model_path):
        try:
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            # Load model using ultralytics YOLO
            self.model = YOLO(model_path)
            logger.info(f"Successfully loaded YOLOv11 model on {self.device}")
        except Exception as e:
            logger.error(f"Error loading YOLOv11 model: {e}")
            raise

    def preprocess_image(self, image):
        # Convert PIL image to numpy array
        img = np.array(image)
        # Convert RGB to BGR if needed
        if len(img.shape) == 3 and img.shape[2] == 3:
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        return img

    def detect(self, image):
        try:
            # Preprocess image
            img = self.preprocess_image(image)
            # Use YOLO predict method directly with preprocessed image
            results = self.model(img, stream=True)  # Enable streaming for better memory usage
            return self.process_predictions(results)
        except Exception as e:
            logger.error(f"Error during detection: {e}")
            raise

    def process_predictions(self, results):
        detections = []
        try:
            # Process each result
            for result in results:
                # Process each detection box
                for box in result.boxes:
                    try:
                        # Get box coordinates and ensure they are in the correct format
                        xyxy = box.xyxy[0].cpu().numpy().tolist()
                        # Get confidence
                        conf = float(box.conf[0].cpu().numpy())
                        # Get class
                        cls = int(box.cls[0].cpu().numpy())
                        
                        detection = {
                            'bbox': xyxy,
                            'confidence': conf,
                            'class': cls,
                            'class_name': MILITARY_CLASS_MAPPING.get(cls, 'Unknown')
                        }
                        detections.append(detection)
                    except Exception as e:
                        logger.error(f"Error processing detection box: {e}")
                        continue
        except Exception as e:
            logger.error(f"Error processing results: {e}")
            
        return detections

    def process_image(self, image_path):
        try:
            # Load and process image
            results = self.model(image_path, stream=True)
            detections = []
            
            for result in results:
                # Process each detection box
                for box in result.boxes:
                    try:
                        xyxy = box.xyxy[0].cpu().numpy().tolist()
                        conf = float(box.conf[0].cpu().numpy())
                        cls = int(box.cls[0].cpu().numpy())
                        
                        # Calculate center point for mock geolocation
                        center_x = (xyxy[0] + xyxy[2]) / 2
                        center_y = (xyxy[1] + xyxy[3]) / 2
                        
                        detection = {
                            'bbox': xyxy,
                            'confidence': conf,
                            'class': cls,
                            'class_name': MILITARY_CLASS_MAPPING.get(cls, 'Unknown'),
                            'location': {
                                'lat': 51.505 + (center_y / 1000),
                                'lng': -0.09 + (center_x / 1000)
                            }
                        }
                        detections.append(detection)
                    except Exception as e:
                        logger.error(f"Error processing detection box: {e}")
                        continue
            
            # Save annotated image
            filename = f"{uuid.uuid4()}.jpg"
            plot_path = UPLOAD_FOLDER / filename
            result.save(str(plot_path))
            
            return {
                'detections': detections,
                'annotated_image_url': f'/static/annotated/{filename}',
                'total_detections': len(detections)
            }
            
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            raise

# Initialize YOLOv11 model
try:
    model = YOLOv11('best.pt')
    logger.info("Model initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize model: {e}")
    model = None

# Military object classes for YOLOv11
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

@app.route('/detect', methods=['POST'])
def detect_objects():
    if model is None:
        return jsonify({'error': 'Model not initialized'}), 500

    if 'image' not in request.files:
        logger.error('No image file in request')
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        logger.error('Empty filename received')
        return jsonify({'error': 'No selected file'}), 400

    # Get manual coordinates if provided
    manual_lat = request.form.get('manual_lat')
    manual_lng = request.form.get('manual_lng')
    
    try:
        # Save uploaded file temporarily
        temp_path = UPLOAD_FOLDER / f"temp_{uuid.uuid4()}.jpg"
        file.save(temp_path)
        logger.info(f'Saved temporary file to {temp_path}')
        
        # Extract GPS from EXIF
        exif_lat, exif_lng = extract_gps_from_image(temp_path)
        
        # Determine final coordinates (prioritize manual input)
        latitude = float(manual_lat) if manual_lat else exif_lat
        longitude = float(manual_lng) if manual_lng else exif_lng
        
        # Open and process image
        image = Image.open(temp_path).convert('RGB')  # Ensure RGB format
        
        # Get detections
        detections = model.detect(image)
        
        # Save annotated image
        filename = f"{uuid.uuid4()}.jpg"
        annotated_path = UPLOAD_FOLDER / filename
        
        # Draw detections on the image
        img_draw = image.copy()
        draw = ImageDraw.Draw(img_draw)
        
        for detection in detections:
            bbox = detection['bbox']
            label = f"{detection['class_name']} {detection['confidence']:.2f}"
            
            # Add location to each detection if coordinates are available
            if latitude is not None and longitude is not None:
                # Calculate slight offset for each detection to spread them on map
                center_x = (bbox[0] + bbox[2]) / 2
                center_y = (bbox[1] + bbox[3]) / 2
                detection_lat = latitude + (center_y / 10000)  # Small offset
                detection_lng = longitude + (center_x / 10000)  # Small offset
                
                detection['location'] = {
                    'lat': detection_lat,
                    'lng': detection_lng
                }
            
            # Draw bounding box with thicker line
            draw.rectangle(bbox, outline='red', width=3)
            # Draw label with background
            text_bbox = draw.textbbox((bbox[0], bbox[1] - 10), label)
            draw.rectangle(text_bbox, fill='red')
            draw.text((bbox[0], bbox[1] - 10), label, fill='white')
        
        # Save the annotated image with high quality
        img_draw.save(str(annotated_path), 'JPEG', quality=95)
        
        # Clean up temp file
        temp_path.unlink()
        
        response_data = {
            'detections': detections,
            'annotated_image_url': f'/static/annotated/{filename}',
            'total_detections': len(detections),
            'image_location': {
                'lat': latitude,
                'lng': longitude
            } if latitude is not None and longitude is not None else None
        }
        
        logger.info(f"Successfully processed image with {len(detections)} detections")
        return jsonify(response_data)
    
    except Exception as e:
        logger.error(f'Error processing image: {str(e)}', exc_info=True)
        if temp_path.exists():
            temp_path.unlink()
        return jsonify({'error': str(e)}), 500

@app.route('/detect-demo', methods=['POST'])
def detect_demo():
    if model is None:
        return jsonify({'error': 'Model not initialized'}), 500
    
    try:
        results = []
        for img_path in DATA_FOLDER.glob('*'):
            if img_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                logger.info(f'Processing demo image: {img_path}')
                try:
                    result = model.process_image(img_path)
                    results.append({
                        'filename': img_path.name,
                        **result
                    })
                except Exception as e:
                    logger.error(f'Error processing {img_path}: {e}')
                    continue
        
        return jsonify({
            'results': results,
            'total_images': len(results)
        })
    
    except Exception as e:
        logger.error(f'Error in demo detection: {str(e)}', exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/static/annotated/<filename>')
def serve_annotated_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
