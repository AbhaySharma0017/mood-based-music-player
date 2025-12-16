"""
Emotion detection service using DeepFace and OpenCV.
"""
import cv2
import numpy as np
from deepface import DeepFace
import logging
from typing import Dict, Any
import os

logger = logging.getLogger(__name__)

class EmotionDetector:
    """
    Emotion detection using pre-trained models.
    
    Uses DeepFace library which provides multiple emotion detection models.
    Falls back to OpenCV face detection if needed.
    """
    
    def __init__(self):
        """Initialize the emotion detector."""
        self.models = ['VGG-Face', 'Facenet', 'OpenFace', 'DeepFace']
        self.current_model = 'VGG-Face'
        
        # Emotion mapping from DeepFace to our simplified categories
        self.emotion_mapping = {
            'happy': 'happy',
            'sad': 'sad',
            'angry': 'angry',
            'surprise': 'surprise',
            'fear': 'fear',
            'disgust': 'angry',  # Map disgust to angry
            'neutral': 'neutral'
        }
        
        logger.info("Emotion detector initialized")
    
    def detect_emotion(self, image_array: np.ndarray) -> Dict[str, Any]:
        """
        Detect emotion from image array.
        
        Args:
            image_array: NumPy array representing the image
            
        Returns:
            Dictionary with mood, confidence, and emotion scores
        """
        try:
            # Ensure image is in correct format
            if len(image_array.shape) == 3 and image_array.shape[2] == 4:
                # Convert RGBA to RGB
                image_array = cv2.cvtColor(image_array, cv2.COLOR_RGBA2RGB)
            elif len(image_array.shape) == 3 and image_array.shape[2] == 3:
                # Already RGB
                pass
            else:
                # Convert grayscale to RGB if needed
                image_array = cv2.cvtColor(image_array, cv2.COLOR_GRAY2RGB)
            
            # Use DeepFace to analyze emotions
            result = DeepFace.analyze(
                img_path=image_array,
                actions=['emotion'],
                enforce_detection=False,
                silent=True
            )
            
            # Extract emotion data
            if isinstance(result, list):
                emotion_data = result[0]['emotion']
            else:
                emotion_data = result['emotion']
            
            # Map emotions to our categories and find dominant emotion
            mapped_emotions = {}
            for emotion, confidence in emotion_data.items():
                mapped_category = self.emotion_mapping.get(emotion.lower(), 'neutral')
                if mapped_category in mapped_emotions:
                    mapped_emotions[mapped_category] += confidence
                else:
                    mapped_emotions[mapped_category] = confidence
            
            # Find the mood with highest confidence
            dominant_mood = max(mapped_emotions.items(), key=lambda x: x[1])
            mood = dominant_mood[0]
            confidence = dominant_mood[1] / 100.0  # Convert percentage to decimal
            
            # Normalize all emotions to decimals
            normalized_emotions = {k: v / 100.0 for k, v in mapped_emotions.items()}
            
            logger.info(f"Emotion detection successful: {mood} ({confidence:.2f})")
            
            return {
                'mood': mood,
                'confidence': confidence,
                'emotions': normalized_emotions,
                'error': False,
                'message': 'Detection successful'
            }
            
        except Exception as e:
            logger.warning(f"DeepFace detection failed: {str(e)}")
            return self._fallback_detection(image_array)
    
    def _fallback_detection(self, image_array: np.ndarray) -> Dict[str, Any]:
        """
        Fallback emotion detection using face detection only.
        
        Args:
            image_array: NumPy array representing the image
            
        Returns:
            Dictionary with neutral mood as fallback
        """
        try:
            # Convert to grayscale for face detection
            if len(image_array.shape) == 3:
                gray = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)
            else:
                gray = image_array
            
            # Load OpenCV face cascade
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            
            # Detect faces
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) > 0:
                logger.info("Face detected, returning neutral mood as fallback")
                return {
                    'mood': 'neutral',
                    'confidence': 0.5,
                    'emotions': {
                        'neutral': 0.5,
                        'happy': 0.125,
                        'sad': 0.125,
                        'angry': 0.125,
                        'surprise': 0.125,
                        'fear': 0.0
                    },
                    'error': False,
                    'message': 'Face detected, emotion analysis unavailable - using neutral'
                }
            else:
                logger.warning("No face detected in image")
                return {
                    'mood': 'neutral',
                    'confidence': 0.3,
                    'emotions': {'neutral': 1.0},
                    'error': True,
                    'message': 'No face detected in image'
                }
                
        except Exception as e:
            logger.error(f"Fallback detection failed: {str(e)}")
            return {
                'mood': 'neutral',
                'confidence': 0.3,
                'emotions': {'neutral': 1.0},
                'error': True,
                'message': f'Detection failed: {str(e)}'
            }
    
    def get_supported_emotions(self) -> list:
        """Get list of supported emotions."""
        return list(self.emotion_mapping.values())
    
    def set_model(self, model_name: str) -> bool:
        """
        Set the emotion detection model.
        
        Args:
            model_name: Name of the model to use
            
        Returns:
            True if model was set successfully
        """
        if model_name in self.models:
            self.current_model = model_name
            logger.info(f"Emotion detection model set to: {model_name}")
            return True
        else:
            logger.warning(f"Invalid model name: {model_name}")
            return False