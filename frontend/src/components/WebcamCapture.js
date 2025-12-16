import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { detectMood } from '../services/api';

const WebcamCapture = ({ onMoodDetected, onError }) => {
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCaptureTime, setLastCaptureTime] = useState(0);
  const [autoCapture, setAutoCapture] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(null);

  // Webcam configuration
  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: 'user',
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current || isCapturing) {
      return;
    }

    // Throttle captures to prevent spam
    const now = Date.now();
    if (now - lastCaptureTime < 2000) {
      return;
    }

    setIsCapturing(true);
    setLastCaptureTime(now);

    try {
      // Capture image from webcam
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        throw new Error('Failed to capture image from webcam');
      }

      // Convert base64 to blob
      const blob = await fetch(imageSrc).then(r => r.blob());
      
      // Create file from blob
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

      // Detect mood
      const moodData = await detectMood(file);
      
      if (onMoodDetected) {
        onMoodDetected(moodData);
      }

    } catch (error) {
      console.error('Capture or mood detection failed:', error);
      if (onError) {
        onError(error.message || 'Failed to detect mood from webcam');
      }
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, lastCaptureTime, onMoodDetected, onError]);

  const toggleAutoCapture = () => {
    if (autoCapture) {
      // Stop auto capture
      if (captureInterval) {
        clearInterval(captureInterval);
        setCaptureInterval(null);
      }
      setAutoCapture(false);
    } else {
      // Start auto capture
      const interval = setInterval(() => {
        capture();
      }, 5000); // Capture every 5 seconds
      
      setCaptureInterval(interval);
      setAutoCapture(true);
      
      // Also capture immediately
      capture();
    }
  };

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (captureInterval) {
        clearInterval(captureInterval);
      }
    };
  }, [captureInterval]);

  const handleWebcamError = (error) => {
    console.error('Webcam error:', error);
    if (onError) {
      onError('Unable to access webcam. Please check permissions and try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Webcam */}
      <div className="webcam-container" style={{ marginBottom: '20px' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMediaError={handleWebcamError}
          style={{
            width: '100%',
            maxWidth: '400px',
            height: 'auto',
            borderRadius: '15px'
          }}
        />
        
        {/* Status overlay */}
        {(isCapturing || autoCapture) && (
          <div className="webcam-overlay">
            {isCapturing ? (
              <div className="loading">
                <div className="spinner"></div>
                Analyzing...
              </div>
            ) : autoCapture ? (
              '🔄 Auto-detection ON'
            ) : null}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="button"
          onClick={capture}
          disabled={isCapturing}
        >
          {isCapturing ? (
            <div className="loading">
              <div className="spinner"></div>
              Detecting...
            </div>
          ) : (
            '📷 Capture Mood'
          )}
        </button>

        <button
          className={`button ${autoCapture ? 'secondary' : ''}`}
          onClick={toggleAutoCapture}
          disabled={isCapturing}
        >
          {autoCapture ? '⏹️ Stop Auto' : '🔄 Auto Capture'}
        </button>
      </div>

      {/* Help text */}
      <div style={{ 
        marginTop: '15px', 
        fontSize: '14px', 
        color: '#666',
        maxWidth: '400px',
        margin: '15px auto 0'
      }}>
        <p>
          📱 <strong>Tips:</strong>
        </p>
        <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
          <li>Look directly at the camera</li>
          <li>Ensure good lighting</li>
          <li>Express your current mood naturally</li>
          <li>Use auto-capture for continuous detection</li>
        </ul>
      </div>

      {/* Last capture time */}
      {lastCaptureTime > 0 && (
        <div style={{ 
          marginTop: '10px', 
          fontSize: '12px', 
          color: '#888' 
        }}>
          Last captured: {new Date(lastCaptureTime).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;