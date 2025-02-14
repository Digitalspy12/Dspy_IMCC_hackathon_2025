# Military Object Detection Web App

A web application that uses YOLOv11 to detect military objects in images and visualize them on a map.

## Features

- Drag-and-drop image upload
- Military object detection using custom-trained YOLOv11
- Interactive map visualization (when geolocation data is available)
- Detection results panel with confidence scores
- Annotated image display

## Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```
The backend will run on http://localhost:5000

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```
The frontend will run on http://localhost:5173

3. Open your browser and navigate to http://localhost:5173

## Usage

1. Drag and drop an image or click to select one from your computer
2. Wait for the detection process to complete
3. View the results in the side panel:
   - List of detected objects with confidence scores
   - Total number of detections
   - Annotated image with bounding boxes
4. If the image contains geolocation data, detected objects will be displayed on the map

## Tech Stack

- Backend: Python, Flask, YOLOv11, OpenCV
- Frontend: React, TypeScript, Tailwind CSS
- Map: Leaflet with React-Leaflet
