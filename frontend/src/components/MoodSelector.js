import React, { useState, useEffect } from 'react';
import { getSupportedMoods } from '../services/api';

const MoodSelector = ({ onMoodSelected, disabled = false }) => {
  const [moods, setMoods] = useState({});
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupportedMoods();
  }, []);

  const loadSupportedMoods = async () => {
    try {
      const response = await getSupportedMoods();
      setMoods(response.moods || {});
    } catch (error) {
      console.error('Failed to load supported moods:', error);
      // Fallback to default moods
      setMoods({
        happy: { emoji: '😊', description: 'Joyful, upbeat, positive' },
        sad: { emoji: '😢', description: 'Melancholic, down, emotional' },
        neutral: { emoji: '😐', description: 'Calm, balanced, relaxed' },
        angry: { emoji: '😠', description: 'Intense, aggressive, frustrated' },
        surprise: { emoji: '😲', description: 'Excited, amazed, energetic' },
        fear: { emoji: '😨', description: 'Anxious, tense, uncertain' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (moodKey) => {
    setSelectedMood(moodKey);
    if (onMoodSelected) {
      onMoodSelected(moodKey);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div className="loading" style={{ justifyContent: 'center' }}>
          <div className="spinner"></div>
          Loading moods...
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: disabled ? '#999' : '#333'
      }}>
        {disabled ? '🔄 Auto-detection enabled' : '🎭 Or select your mood manually:'}
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '15px',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'opacity 0.3s ease'
      }}>
        {Object.entries(moods).map(([moodKey, moodData]) => (
          <button
            key={moodKey}
            onClick={() => handleMoodSelect(moodKey)}
            disabled={disabled}
            style={{
              background: selectedMood === moodKey 
                ? 'linear-gradient(45deg, #667eea, #764ba2)'
                : 'white',
              color: selectedMood === moodKey ? 'white' : '#333',
              border: selectedMood === moodKey 
                ? '2px solid #667eea'
                : '2px solid #e0e0e0',
              borderRadius: '12px',
              padding: '15px 10px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: selectedMood === moodKey ? '600' : '400',
              boxShadow: selectedMood === moodKey 
                ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                : '0 2px 5px rgba(0, 0, 0, 0.05)',
              transform: selectedMood === moodKey ? 'translateY(-2px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!disabled && selectedMood !== moodKey) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled && selectedMood !== moodKey) {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';
              }
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {moodData.emoji}
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              textTransform: 'capitalize',
              marginBottom: '4px'
            }}>
              {moodKey}
            </div>
            <div style={{ 
              fontSize: '10px', 
              opacity: 0.8,
              lineHeight: 1.2,
              maxHeight: '24px',
              overflow: 'hidden'
            }}>
              {moodData.description}
            </div>
          </button>
        ))}
      </div>

      {/* Selected mood feedback */}
      {selectedMood && !disabled && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '10px',
          textAlign: 'center',
          border: '2px solid #667eea'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>
            {moods[selectedMood]?.emoji} Selected: <strong style={{ textTransform: 'capitalize' }}>{selectedMood}</strong>
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {moods[selectedMood]?.playlist_style || 'Finding the perfect tracks for your mood...'}
          </div>
        </div>
      )}

      {/* Help text */}
      <div style={{
        marginTop: '15px',
        fontSize: '12px',
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        {disabled 
          ? 'Turn off auto-detection above to manually select your mood'
          : 'Click on any mood to override the auto-detection'
        }
      </div>
    </div>
  );
};

export default MoodSelector;