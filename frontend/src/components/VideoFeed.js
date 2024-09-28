import React from 'react';

const VideoFeed = ({ detecting }) => {
    return (
        <div>
            <h2>Live Object Detection Feed</h2>
            <img
                src={`http://localhost:5000/video_feed`}
                alt="Video Feed"
                style={{ width: '100%', maxWidth: '600px', borderRadius: '10px' }} // Rounded corners for the video feed
            />
            <div style={{ display: detecting ? 'block' : 'none' }}>
                <p>Detection is ON</p>
            </div>
        </div>
    );
};

export default VideoFeed;
