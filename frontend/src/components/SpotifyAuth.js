import React, { useState, useEffect } from 'react';
import { getSpotifyAuthUrl, handleSpotifyCallback } from '../services/api';

const SpotifyAuth = ({ onAuthSuccess, onError }) => {
  const [authUrl, setAuthUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState('initial'); // initial, waiting, processing

  useEffect(() => {
    // Check if we're returning from Spotify with a code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      onError(`Spotify authentication failed: ${error}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code) {
      handleAuthCallback(code);
      return;
    }

    // Get auth URL on component mount
    fetchAuthUrl();
  }, []);

  const fetchAuthUrl = async () => {
    try {
      setIsLoading(true);
      const response = await getSpotifyAuthUrl();
      setAuthUrl(response.auth_url);
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      if (onError) {
        onError('Failed to initialize Spotify authentication');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code) => {
    setAuthStep('processing');
    setIsLoading(true);

    try {
      const response = await handleSpotifyCallback(code);
      
      if (response.success) {
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        onAuthSuccess();
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth callback failed:', error);
      onError(error.message || 'Failed to complete Spotify authentication');
      setAuthStep('initial');
    } finally {
      setIsLoading(false);
    }
  };

  const startAuth = () => {
    if (authUrl) {
      setAuthStep('waiting');
      window.location.href = authUrl;
    }
  };

  if (authStep === 'processing') {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading" style={{ justifyContent: 'center', fontSize: '18px' }}>
            <div className="spinner"></div>
            Completing Spotify authentication...
          </div>
          <p style={{ color: '#666', marginTop: '15px' }}>
            Please wait while we finalize your authentication.
          </p>
        </div>
      </div>
    );
  }

  if (authStep === 'waiting') {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ color: '#1DB954' }}>🎵 Redirecting to Spotify...</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            You should be redirected to Spotify for authentication.
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            If you're not redirected automatically, please click the button above again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#1DB954', marginBottom: '20px' }}>
          🎵 Connect with Spotify
        </h2>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #1DB954, #1ed760)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '25px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎧</div>
          <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
            Unlock Personalized Playlists
          </p>
          <p style={{ opacity: 0.9 }}>
            Connect your Spotify account to get mood-based music recommendations
          </p>
        </div>

        {/* Features list */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
            <h4 style={{ margin: '0 0 5px 0' }}>Mood Matching</h4>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              AI-curated playlists that match your detected emotion
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔄</div>
            <h4 style={{ margin: '0 0 5px 0' }}>Real-time Updates</h4>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              Fresh recommendations as your mood changes
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎨</div>
            <h4 style={{ margin: '0 0 5px 0' }}>Personalized</h4>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              Based on your Spotify listening history
            </p>
          </div>
        </div>

        {/* Auth button */}
        <button
          className="button"
          onClick={startAuth}
          disabled={isLoading || !authUrl}
          style={{
            background: 'linear-gradient(45deg, #1DB954, #1ed760)',
            fontSize: '18px',
            padding: '15px 30px',
            borderRadius: '25px'
          }}
        >
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              Loading...
            </div>
          ) : (
            '🎵 Connect with Spotify'
          )}
        </button>

        {/* Privacy note */}
        <div style={{ 
          marginTop: '20px', 
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '5px' }}>🔒 Privacy & Security</div>
          <ul style={{ textAlign: 'left', margin: '5px 0', paddingLeft: '20px' }}>
            <li>We only access your public playlists and profile</li>
            <li>No personal data is stored permanently</li>
            <li>You can revoke access anytime in your Spotify settings</li>
          </ul>
        </div>

        {/* Troubleshooting */}
        {!authUrl && !isLoading && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>⚠️ Connection Issue</div>
            <p style={{ margin: 0 }}>
              Unable to connect to Spotify. Please check that the backend is running 
              and your Spotify credentials are configured correctly.
            </p>
            <button
              className="button"
              onClick={fetchAuthUrl}
              style={{ 
                marginTop: '10px',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyAuth;