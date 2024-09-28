from flask import Flask, Response
from flask_cors import CORS
import cv2
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Load YOLOv8 model
model = YOLO('yolov8n.pt')

# Global variable to control detection
detecting = False

def generate_frames():
    cap = cv2.VideoCapture(0)  # Use 0 for the webcam

    while True:
        success, frame = cap.read()
        if not success:
            break

        if detecting:
            results = model(frame)
            if results:
                for result in results[0].boxes:
                    if result is not None:
                        x1, y1, x2, y2 = map(int, result.xyxy[0])
                        conf = float(result.conf[0])
                        cls = int(result.cls[0])
                        label = model.names[cls]
                        confidence = f'{conf:.2f}'

                        # Draw bounding box in black
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 2)
                        # Put label and confidence score above the bounding box in black
                        cv2.putText(frame, f'{label} {confidence}', (x1, y1 - 10), 
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)

        # Encode the frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # Yield the frame in the response
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/start_detection', methods=['POST'])
def start_detection():
    global detecting
    detecting = True
    return {"status": "Detection started"}

@app.route('/stop_detection', methods=['POST'])
def stop_detection():
    global detecting
    detecting = False
    return {"status": "Detection stopped"}

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
