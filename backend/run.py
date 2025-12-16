"""
Flask application entry point.
Run this file to start the backend server.
"""
import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('BACKEND_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    
    print(f"🚀 Starting Mood Music Player Backend on port {port}")
    print(f"🔧 Debug mode: {debug}")
    print("📱 Make sure to start the React frontend on port 3000")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )