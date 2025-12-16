"""
API routes for the mood music player backend.
"""
from flask import Blueprint, request, jsonify, session, redirect, url_for
from app.services.emotion_detector import EmotionDetector
from app.services.spotify_service import SpotifyService
import logging
import io
from PIL import Image
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
api_bp = Blueprint('api', __name__)

# Initialize services
emotion_detector = EmotionDetector()
spotify_service = SpotifyService()

@api_bp.route('/detect-mood', methods=['POST'])
def detect_mood():
    """
    Analyze uploaded image for emotion detection.
    
    Expected: multipart/form-data with 'image' field
    Returns: JSON with detected mood and confidence scores
    """
    try:
        # Check if image is in request
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image provided',
                'message': 'Please upload an image file'
            }), 400
        
        image_file = request.files['image']
        
        if image_file.filename == '':
            return jsonify({
                'error': 'Empty filename',
                'message': 'Please select a valid image file'
            }), 400
        
        # Convert image to numpy array
        image = Image.open(io.BytesIO(image_file.read()))
        image_array = np.array(image)
        
        # Detect emotion
        result = emotion_detector.detect_emotion(image_array)
        
        if result['error']:
            return jsonify({
                'error': 'Detection failed',
                'message': result['message'],
                'mood': 'neutral'  # Fallback to neutral
            }), 200
        
        logger.info(f"Detected mood: {result['mood']} (confidence: {result['confidence']:.2f})")
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in detect_mood: {str(e)}")
        return jsonify({
            'error': 'Processing failed',
            'message': 'Unable to process image',
            'mood': 'neutral'  # Fallback to neutral
        }), 500

@api_bp.route('/get-playlist/<mood>', methods=['GET'])
def get_playlist(mood):
    """
    Get Spotify playlist recommendations for a specific mood.
    
    Args:
        mood (str): The mood to get playlist for
    
    Returns: JSON with playlist information
    """
    try:
        # Validate mood
        valid_moods = ['happy', 'sad', 'neutral', 'angry', 'surprise', 'fear']
        if mood.lower() not in valid_moods:
            return jsonify({
                'error': 'Invalid mood',
                'message': f'Mood must be one of: {", ".join(valid_moods)}',
                'valid_moods': valid_moods
            }), 400
        
        # Check if user is authenticated with Spotify
        if 'spotify_token' not in session:
            return jsonify({
                'error': 'Not authenticated',
                'message': 'Please authenticate with Spotify first',
                'auth_url': '/api/spotify/auth'
            }), 401
        
        # Get playlist for mood
        playlist_data = spotify_service.get_mood_playlist(
            mood.lower(), 
            session['spotify_token']
        )
        
        if playlist_data['error']:
            return jsonify(playlist_data), 400
        
        logger.info(f"Retrieved playlist for mood: {mood}")
        return jsonify(playlist_data), 200
        
    except Exception as e:
        logger.error(f"Error in get_playlist: {str(e)}")
        return jsonify({
            'error': 'Playlist retrieval failed',
            'message': 'Unable to get playlist recommendations'
        }), 500

@api_bp.route('/spotify/auth', methods=['GET'])
def spotify_auth():
    """
    Initiate Spotify OAuth flow.
    
    Returns: Redirect to Spotify authorization URL
    """
    try:
        auth_url = spotify_service.get_auth_url()
        return jsonify({
            'auth_url': auth_url,
            'message': 'Visit the auth_url to authenticate with Spotify'
        }), 200
        
    except Exception as e:
        logger.error(f"Error in spotify_auth: {str(e)}")
        return jsonify({
            'error': 'Authentication setup failed',
            'message': 'Unable to initiate Spotify authentication'
        }), 500

@api_bp.route('/spotify/callback', methods=['POST'])
def spotify_callback():
    """
    Handle Spotify OAuth callback.
    
    Expected JSON: {'code': 'auth_code_from_spotify'}
    Returns: Success confirmation
    """
    try:
        data = request.get_json()
        
        if not data or 'code' not in data:
            return jsonify({
                'error': 'Missing authorization code',
                'message': 'Authorization code is required'
            }), 400
        
        # Exchange code for token
        token_info = spotify_service.get_access_token(data['code'])
        
        if token_info['error']:
            return jsonify(token_info), 400
        
        # Store token in session
        session['spotify_token'] = token_info['access_token']
        session['token_expires'] = token_info['expires_at']
        
        logger.info("Spotify authentication successful")
        return jsonify({
            'success': True,
            'message': 'Successfully authenticated with Spotify',
            'expires_in': token_info['expires_in']
        }), 200
        
    except Exception as e:
        logger.error(f"Error in spotify_callback: {str(e)}")
        return jsonify({
            'error': 'Authentication failed',
            'message': 'Unable to complete Spotify authentication'
        }), 500

@api_bp.route('/moods', methods=['GET'])
def get_supported_moods():
    """
    Get list of supported moods.
    
    Returns: JSON with available moods and their descriptions
    """
    moods = {
        'happy': {
            'emoji': '😊',
            'description': 'Joyful, upbeat, positive',
            'playlist_style': 'Upbeat pop, dance, feel-good hits'
        },
        'sad': {
            'emoji': '😢',
            'description': 'Melancholic, down, emotional',
            'playlist_style': 'Slow ballads, emotional songs, indie'
        },
        'neutral': {
            'emoji': '😐',
            'description': 'Calm, balanced, relaxed',
            'playlist_style': 'Chill, ambient, easy listening'
        },
        'angry': {
            'emoji': '😠',
            'description': 'Intense, aggressive, frustrated',
            'playlist_style': 'Rock, metal, high-energy'
        },
        'surprise': {
            'emoji': '😲',
            'description': 'Excited, amazed, energetic',
            'playlist_style': 'Eclectic, upbeat, varied genres'
        },
        'fear': {
            'emoji': '😨',
            'description': 'Anxious, tense, uncertain',
            'playlist_style': 'Calming, soothing, reassuring'
        }
    }
    
    return jsonify({
        'moods': moods,
        'count': len(moods),
        'default': 'neutral'
    }), 200

@api_bp.route('/session/status', methods=['GET'])
def session_status():
    """
    Check current session status.
    
    Returns: JSON with session information
    """
    return jsonify({
        'authenticated': 'spotify_token' in session,
        'has_token': 'spotify_token' in session,
        'session_keys': list(session.keys()) if session else []
    }), 200