"""
Flask application factory and configuration.
"""
from flask import Flask
from flask_cors import CORS
from config.settings import Config

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for React frontend
    CORS(app, origins=[app.config['FRONTEND_URL']])
    
    # Register blueprints/routes
    from app.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/health')
    def health_check():
        """Health check endpoint."""
        return {'status': 'healthy', 'service': 'mood-music-backend'}, 200
    
    @app.route('/')
    def root():
        """Root endpoint with service info."""
        return {
            'service': 'Mood-Based Music Player API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': [
                '/api/detect-mood',
                '/api/get-playlist/<mood>',
                '/api/spotify/auth',
                '/api/spotify/callback',
                '/health'
            ]
        }
    
    return app