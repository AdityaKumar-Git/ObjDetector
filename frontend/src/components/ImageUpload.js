import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './styles.css';

const ImageUpload = () => {
  const webcamRef = useRef(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Capture image from webcam
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  };

  // Handle image detection
  const handleDetect = async () => {
    const imageSrc = captureImage();
    if (!imageSrc) return;

    setLoading(true);
    const base64Data = imageSrc.split(',')[1];
    const formData = new FormData();
    formData.append('image', base64ToBlob(base64Data, 'image/jpeg'));

    try {
      const response = await axios.post('http://localhost:5000/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDetections(response.data.objects);
    } catch (error) {
      console.error('Error uploading image!', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64, mime) => {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  };

  return (
    <div className="container">
      <h1>Object Detection with YOLOv8</h1>
      <div className="webcam-container">
        <Webcam
          audio={false}
          height={400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={500}
        />
      </div>
      <button onClick={handleDetect} disabled={loading}>
        {loading ? 'Detecting...' : 'Capture and Detect'}
      </button>

      <div className="results">
        {detections.length > 0 ? (
          detections.map((detection, index) => (
            <div key={index} className="detection">
              <h2>{detection.label}</h2>
              <p>Confidence: {(detection.confidence * 100).toFixed(2)}%</p>
              <p>Box: {detection.box.join(', ')}</p>
            </div>
          ))
        ) : (
          <p>No detections yet</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
