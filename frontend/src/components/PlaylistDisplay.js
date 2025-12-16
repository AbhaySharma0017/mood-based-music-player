import React, { useState } from 'react';

const PlaylistDisplay = ({ playlist, loading }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playingPreview, setPlayingPreview] = useState(null);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading" style={{ justifyContent: 'center', fontSize: '18px' }}>
          <div className="spinner"></div>
          Finding the perfect tracks for your mood...
        </div>
      </div>
    );
  }

  if (!playlist) return null;

  if (playlist.error) {
    return (
      <div className="error">
        <strong>Playlist Error:</strong> {playlist.message}
      </div>
    );
  }

  const playPreview = (track) => {
    if (playingPreview) {
      playingPreview.pause();
      if (playingPreview.src === track.preview_url) {
        setPlayingPreview(null);
        return;
      }
    }

    if (track.preview_url) {
      const audio = new Audio(track.preview_url);
      audio.play();
      setPlayingPreview(audio);
      
      audio.onended = () => {
        setPlayingPreview(null);
      };
    }
  };

  const openInSpotify = (track) => {
    if (track.external_urls && track.external_urls.spotify) {
      window.open(track.external_urls.spotify, '_blank');
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Mood emoji mapping
  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    angry: '😠',
    surprise: '😲',
    fear: '😨'
  };

  return (
    <div>
      {/* Playlist header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>
          {moodEmojis[playlist.mood]} {playlist.playlist_name}
        </h2>
        <p style={{ margin: '0 0 10px 0', opacity: 0.9 }}>
          {playlist.description}
        </p>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          🎵 {playlist.total_tracks} tracks curated for your {playlist.mood} mood
        </div>
      </div>

      {/* Track count and controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          Recommended Tracks ({playlist.tracks.length})
        </h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {playingPreview && (
            <button
              className="button secondary"
              onClick={() => {
                playingPreview.pause();
                setPlayingPreview(null);
              }}
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              ⏹️ Stop Preview
            </button>
          )}
        </div>
      </div>

      {/* Track list */}
      {playlist.tracks.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎵</div>
          <h3>No tracks found</h3>
          <p>We couldn't find any tracks for your current mood. Please try again or select a different mood.</p>
        </div>
      ) : (
        <div className="track-list">
          {playlist.tracks.map((track, index) => (
            <div 
              key={track.id || index} 
              className="track-item"
              style={{
                border: currentTrack === track.id ? '2px solid #667eea' : 'none'
              }}
            >
              {/* Track image */}
              {track.image_url ? (
                <img 
                  src={track.image_url} 
                  alt={track.album}
                  className="track-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div 
                  className="track-image"
                  style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px'
                  }}
                >
                  🎵
                </div>
              )}

              {/* Track info */}
              <div className="track-info">
                <div className="track-name">
                  {track.name}
                  {track.explicit && (
                    <span style={{ 
                      background: '#666', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '3px', 
                      fontSize: '10px',
                      marginLeft: '8px'
                    }}>
                      E
                    </span>
                  )}
                </div>
                <div className="track-artist">
                  {track.artist} • {track.album}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#999',
                  marginTop: '4px',
                  display: 'flex',
                  gap: '15px'
                }}>
                  <span>⏱️ {formatDuration(track.duration_ms)}</span>
                  <span>📊 {track.popularity}% popular</span>
                </div>
              </div>

              {/* Track actions */}
              <div className="track-actions">
                {track.preview_url && (
                  <button
                    className="icon-button"
                    onClick={() => playPreview(track)}
                    title={playingPreview?.src === track.preview_url ? "Stop preview" : "Play preview"}
                    style={{
                      backgroundColor: playingPreview?.src === track.preview_url ? '#f0f0f0' : 'transparent'
                    }}
                  >
                    {playingPreview?.src === track.preview_url ? '⏸️' : '▶️'}
                  </button>
                )}
                
                <button
                  className="icon-button"
                  onClick={() => openInSpotify(track)}
                  title="Open in Spotify"
                >
                  🎵
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer info */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span>💡</span>
          <strong>Pro Tips:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: '25px' }}>
          <li>Click ▶️ to preview tracks (30-second clips)</li>
          <li>Click 🎵 to open the full track in Spotify</li>
          <li>Change your mood to get different recommendations</li>
          <li>Tracks are personalized based on your Spotify listening history</li>
        </ul>
      </div>
    </div>
  );
};

export default PlaylistDisplay;