import React, { useState } from 'react';
import VideoFeed from './components/VideoFeed';
import './App.css';  // Import the CSS file for styles

const App = () => {
    const [detecting, setDetecting] = useState(false);

    const toggleDetection = async () => {
        const response = detecting 
            ? await fetch('http://localhost:5000/stop_detection', { method: 'POST' }) 
            : await fetch('http://localhost:5000/start_detection', { method: 'POST' });

        if (response.ok) {
            setDetecting(!detecting);
        }
    };

    return (
        <div className="app-container">
            <h1>Object Detection with YOLOv8</h1>
            <button onClick={toggleDetection} className="toggle-button">
                {detecting ? 'Stop Detection' : 'Start Detection'}
            </button>
            <VideoFeed detecting={detecting} />
        </div>
    );
};

export default App;
