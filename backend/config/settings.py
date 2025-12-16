"""
Configuration settings for the Flask application.
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration class for Flask app."""
    
    # Flask settings
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    
    # CORS settings
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    
    # Spotify API settings
    SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID')
    SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET')
    SPOTIFY_REDIRECT_URI = os.environ.get('SPOTIFY_REDIRECT_URI', 'http://localhost:3000/callback')
    
    # ML Model settings
    EMOTION_MODEL_PATH = os.environ.get('EMOTION_MODEL_PATH', 'models/')
    EMOTION_CONFIDENCE_THRESHOLD = float(os.environ.get('EMOTION_CONFIDENCE_THRESHOLD', 0.6))
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    
    @staticmethod
    def validate_config():
        """Validate that required configuration is present."""
        required_vars = [
            'SPOTIFY_CLIENT_ID',
            'SPOTIFY_CLIENT_SECRET'
        ]
        
        missing_vars = []
        for var in required_vars:
            if not os.environ.get(var):
                missing_vars.append(var)
        
        if missing_vars:
            print("⚠️  WARNING: Missing required environment variables:")
            for var in missing_vars:
                print(f"   - {var}")
            print("   Please check your .env file configuration.")
            return False
        
        print("✅ Configuration validation passed")
        return True

# Validate configuration on import
Config.validate_config()