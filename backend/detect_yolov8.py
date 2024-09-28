import cv2
import torch
from ultralytics import YOLO

# Load the YOLOv8 model
model = YOLO('models/yolov8n.pt')

# Open video stream
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open video stream.")
    exit()

while True:
    ret, frame = cap.read()
    
    if not ret:
        print("Error: Failed to grab frame.")
        break

    # Run YOLOv8 detection on the frame
    results = model(frame)

    # Draw bounding boxes and labels
    for result in results:
        for box in result.boxes:
            cls = box.cls.item()
            conf = box.conf.item()
            x1, y1, x2, y2 = box.xyxy.cpu().numpy()[0]
            label = model.names[int(cls)]
            confidence = f'{conf:.2f}'

            # Draw bounding box and label
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            cv2.putText(frame, f'{label} {confidence}', (int(x1), int(y1)-10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Try displaying the frame using matplotlib if cv2.imshow does not work
    # try:
    cv2.imshow('YOLOv8 Detection', frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
