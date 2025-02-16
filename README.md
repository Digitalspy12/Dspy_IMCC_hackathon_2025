# Military Object Detection Web App

A web application that uses YOLOv11 to detect military objects in images and visualize them on a map.

## Features

- Drag-and-drop image upload
- Military object detection using custom-trained YOLOv11
- Interactive map visualization (when geolocation data is available)
- Detection results panel with confidence scores
- Annotated image display
## Interface 
![WhatsApp Image 2025-02-16 at 8 13 24 AM](https://github.com/user-attachments/assets/9564e255-afb5-4c1b-87d3-5bbc82e29159)
## Demo
![4f7cb1f6-8284-4207-8801-84a904dfb338](https://github.com/user-attachments/assets/9a9f74de-e7c5-4d65-9019-a130a1708e99)
![030482c5-75fe-4c8e-9173-4b26eb6d629a](https://github.com/user-attachments/assets/ef083c63-7f00-4982-a75e-ccf8a5a58255)
![88520de0-5945-4284-abd2-92a3f712faa6](https://github.com/user-attachments/assets/46e2fc01-fa91-43ce-8b1b-989caa435d48)
![ca2e579d-e588-4e0f-a815-2f9b904de5f6](https://github.com/user-attachments/assets/91948314-3208-4409-940e-16aa48e6e7c5)



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
