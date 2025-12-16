# Mood-Based Music Player

A web application that uses webcam emotion detection to automatically play mood-matching Spotify playlists.

## Features

- 🎭 Real-time emotion detection using webcam
- 🎵 Automatic Spotify playlist recommendations based on detected mood
- 😊 Support for multiple emotions: happy, sad, neutral, angry, surprise, fear
- 🎪 Interactive UI with mood visualization
- 🔄 Real-time mood updates
- 🎮 Manual mood override option
- 🔐 Secure Spotify OAuth integration

## Project Structure

```
mood-music-player/
├── backend/                 # Flask backend API
│   ├── app/
│   │   ├── __init__.py     # Flask app factory
│   │   ├── routes.py       # API endpoints
│   │   ├── models/         # Data models
│   │   └── services/       # Business logic
│   │       ├── emotion_detector.py    # ML emotion detection
│   │       └── spotify_service.py     # Spotify API integration
│   ├── config/
│   │   └── settings.py     # Configuration management
│   ├── requirements.txt    # Python dependencies
│   └── run.py             # Application entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── package-lock.json  # Dependency lock file
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Spotify Developer Account

### 1. Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000` to Redirect URIs
4. Note your Client ID and Client Secret

### 2. Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Spotify credentials in `.env`:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   FLASK_SECRET_KEY=your_secret_key_here
   ```

### 3. Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask server:
   ```bash
   python run.py
   ```

Backend will be available at `http://localhost:5000`

### 4. Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

Frontend will be available at `http://localhost:3000`

## API Endpoints

### Backend Endpoints

- `POST /api/detect-mood`: Analyze image for emotion detection
- `GET /api/get-playlist/<mood>`: Get Spotify playlist for specific mood
- `GET /api/spotify/auth`: Initiate Spotify OAuth
- `POST /api/spotify/callback`: Handle Spotify OAuth callback

### Request/Response Examples

#### Detect Mood
```bash
POST /api/detect-mood
Content-Type: multipart/form-data

# Form data with 'image' file field
```

Response:
```json
{
  "mood": "happy",
  "confidence": 0.89,
  "emotions": {
    "happy": 0.89,
    "neutral": 0.08,
    "sad": 0.03
  }
}
```

#### Get Playlist
```bash
GET /api/get-playlist/happy
```

Response:
```json
{
  "playlist_url": "https://open.spotify.com/playlist/...",
  "tracks": [...],
  "mood": "happy"
}
```

## Security Notes

- Never commit `.env` files
- Spotify credentials are handled securely via environment variables
- OAuth tokens are stored temporarily in session
- Image data is processed in memory and not stored

## Development

### Adding New Emotions

1. Update the emotion detection model in `backend/app/services/emotion_detector.py`
2. Add corresponding playlists in `backend/app/services/spotify_service.py`
3. Update frontend UI to display new emotions

### Customizing Playlists

Edit the `MOOD_PLAYLISTS` dictionary in `backend/app/services/spotify_service.py` to customize playlist selections for each mood.

## Troubleshooting

### Common Issues

1. **Camera not working**: Ensure browser permissions are granted
2. **Spotify auth fails**: Check redirect URI configuration
3. **Emotion detection errors**: Verify webcam access and lighting
4. **CORS issues**: Ensure backend CORS is properly configured

### Dependencies Issues

- If `dlib` installation fails, install Visual Studio Build Tools
- For `opencv-python` issues, try installing `opencv-python-headless`
- Use `pip install --upgrade pip` if package installation fails

## License

This project is for educational purposes. Ensure compliance with Spotify's Terms of Service when using their API.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Happy coding! 🎵😊