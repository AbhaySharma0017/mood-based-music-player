import React, { useState, useEffect } from 'react';
import WebcamCapture from './components/WebcamCapture';
import MoodDisplay from './components/MoodDisplay';
import SpotifyAuth from './components/SpotifyAuth';
import PlaylistDisplay from './components/PlaylistDisplay';
import MoodSelector from './components/MoodSelector';
import { getMoodPlaylists, getSessionStatus } from './services/api';

function App() {
  const [currentMood, setCurrentMood] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoDetection, setAutoDetection] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await getSessionStatus();
      setIsAuthenticated(response.authenticated);
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setIsAuthenticated(false);
    }
  };

  const handleMoodDetected = (moodData) => {
    setCurrentMood(moodData);
    setError(null);
    
    // Auto-fetch playlist if authenticated and auto-detection is on
    if (isAuthenticated && autoDetection && moodData.mood) {
      fetchPlaylist(moodData.mood);
    }
  };

  const handleMoodSelected = (mood) => {
    const moodData = {
      mood: mood,
      confidence: 1.0,
      emotions: { [mood]: 1.0 }
    };
    setCurrentMood(moodData);
    
    // Fetch playlist for selected mood
    if (isAuthenticated) {
      fetchPlaylist(mood);
    }
  };

  const fetchPlaylist = async (mood) => {
    if (!mood) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const playlistData = await getMoodPlaylists(mood);
      setPlaylist(playlistData);
    } catch (error) {
      console.error('Failed to fetch playlist:', error);
      setError(error.message || 'Failed to fetch playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setError(null);
    
    // If we have a current mood, fetch playlist
    if (currentMood && currentMood.mood) {
      fetchPlaylist(currentMood.mood);
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <div className="card">
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '10px',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.5rem'
          }}>
            🎵 Mood Music Player
          </h1>
          <p style={{ 
            textAlign: 'center', 
            color: '#666', 
            marginBottom: '20px' 
          }}>
            AI-powered emotion detection meets personalized Spotify playlists
          </p>
          
          {/* Auto-detection toggle */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={autoDetection}
                onChange={(e) => setAutoDetection(e.target.checked)}
              />
              <span>Auto-detect mood from webcam</span>
            </label>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Spotify Authentication */}
        {!isAuthenticated && (
          <SpotifyAuth 
            onAuthSuccess={handleAuthSuccess}
            onError={handleError}
          />
        )}

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          
          {/* Webcam and Mood Detection */}
          <div className="card">
            <h2>🎭 Mood Detection</h2>
            
            {autoDetection ? (
              <WebcamCapture 
                onMoodDetected={handleMoodDetected}
                onError={handleError}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Auto-detection disabled. Select your mood manually below:</p>
              </div>
            )}
            
            <MoodSelector 
              onMoodSelected={handleMoodSelected}
              disabled={autoDetection}
            />
          </div>

          {/* Mood Display */}
          {currentMood && (
            <div className="card">
              <h2>🎯 Current Mood</h2>
              <MoodDisplay mood={currentMood} />
              
              {isAuthenticated && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    className="button"
                    onClick={() => fetchPlaylist(currentMood.mood)}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Get New Playlist'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Playlist Display */}
        {playlist && (
          <div className="card">
            <PlaylistDisplay 
              playlist={playlist}
              loading={loading}
            />
          </div>
        )}

        {/* Instructions */}
        <div className="card">
          <h2>📋 How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
              <h3>1. Authenticate</h3>
              <p>Connect with your Spotify account to access personalized playlists</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📷</div>
              <h3>2. Detect Mood</h3>
              <p>Let AI analyze your facial expression or manually select your mood</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎵</div>
              <h3>3. Enjoy Music</h3>
              <p>Get personalized Spotify recommendations matching your current mood</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
          <p>Made with ❤️ using React, Flask, DeepFace, and Spotify Web API</p>
        </div>
      </div>
    </div>
  );
}

export default App;