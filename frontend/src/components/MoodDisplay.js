import React from 'react';

const MoodDisplay = ({ mood }) => {
  if (!mood) return null;

  // Mood emoji mapping
  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    angry: '😠',
    surprise: '😲',
    fear: '😨'
  };

  // Mood color mapping
  const moodColors = {
    happy: '#4CAF50',
    sad: '#2196F3',
    neutral: '#9E9E9E',
    angry: '#F44336',
    surprise: '#FF9800',
    fear: '#9C27B0'
  };

  // Get confidence level text
  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.8) return 'Very Confident';
    if (confidence >= 0.6) return 'Confident';
    if (confidence >= 0.4) return 'Moderate';
    return 'Low Confidence';
  };

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#8BC34A';
    if (confidence >= 0.4) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="mood-display">
      {/* Main mood */}
      <div className="mood-emoji">
        {moodEmojis[mood.mood] || '❓'}
      </div>
      
      <div 
        className="mood-name"
        style={{ color: moodColors[mood.mood] || '#666' }}
      >
        {mood.mood}
      </div>
      
      <div className="mood-confidence">
        <span 
          style={{ 
            color: getConfidenceColor(mood.confidence),
            fontWeight: 'bold'
          }}
        >
          {getConfidenceLevel(mood.confidence)}
        </span>
        {' '}({Math.round(mood.confidence * 100)}%)
      </div>

      {/* Emotion breakdown */}
      {mood.emotions && Object.keys(mood.emotions).length > 1 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '15px', color: '#333' }}>
            Emotion Breakdown
          </h4>
          <div style={{ 
            display: 'grid', 
            gap: '8px',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            {Object.entries(mood.emotions)
              .sort(([, a], [, b]) => b - a) // Sort by confidence desc
              .map(([emotion, confidence]) => (
                <div 
                  key={emotion}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{moodEmojis[emotion] || '❓'}</span>
                    <span style={{ textTransform: 'capitalize' }}>{emotion}</span>
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Progress bar */}
                    <div style={{
                      width: '60px',
                      height: '6px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${confidence * 100}%`,
                        height: '100%',
                        backgroundColor: moodColors[emotion] || '#666',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    
                    <span style={{ 
                      minWidth: '35px', 
                      textAlign: 'right',
                      color: '#666',
                      fontSize: '12px'
                    }}>
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Error message if any */}
      {mood.error && mood.message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#856404'
        }}>
          ⚠️ {mood.message}
        </div>
      )}

      {/* Mood description */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.4'
      }}>
        {getMoodDescription(mood.mood)}
      </div>
    </div>
  );
};

// Helper function to get mood descriptions
const getMoodDescription = (mood) => {
  const descriptions = {
    happy: "You're feeling joyful and upbeat! Time for some energetic, feel-good music to match your positive vibes. 🎉",
    sad: "You seem to be feeling down or reflective. Let's find some soothing, emotional music that resonates with your current state. 💙",
    neutral: "You're in a balanced, calm state. Perfect for some chill, relaxing music that won't overwhelm your mood. ✨",
    angry: "You're feeling intense or frustrated. How about some powerful, high-energy music to help channel that energy? 🔥",
    surprise: "You seem excited or amazed! Let's explore some diverse, uplifting music that matches your energetic state. ⚡",
    fear: "You might be feeling anxious or uncertain. Let's find some calming, reassuring music to help you feel more at ease. 🌸"
  };
  
  return descriptions[mood] || "Let's find some music that matches your current vibe! 🎵";
};

export default MoodDisplay;