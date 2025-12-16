"""
Data models for the mood music player application.
"""
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

class MoodType(Enum):
    """Enumeration of supported mood types."""
    HAPPY = "happy"
    SAD = "sad"
    NEUTRAL = "neutral"
    ANGRY = "angry"
    SURPRISE = "surprise"
    FEAR = "fear"

@dataclass
class EmotionResult:
    """Data class for emotion detection results."""
    mood: MoodType
    confidence: float
    emotions: Dict[str, float]
    error: bool = False
    message: str = ""

@dataclass
class SpotifyTrack:
    """Data class for Spotify track information."""
    id: str
    name: str
    artist: str
    album: str
    duration_ms: int
    explicit: bool
    popularity: int
    preview_url: Optional[str]
    external_urls: Dict[str, str]
    uri: str
    image_url: Optional[str] = None

@dataclass
class PlaylistData:
    """Data class for playlist information."""
    mood: MoodType
    tracks: List[SpotifyTrack]
    total_tracks: int
    playlist_name: str
    description: str
    playlist_id: Optional[str] = None
    playlist_url: Optional[str] = None
    error: bool = False
    message: str = ""

@dataclass
class UserProfile:
    """Data class for Spotify user profile."""
    user_id: str
    display_name: Optional[str]
    email: str
    followers: int
    country: str
    product: str  # free, premium, etc.

class APIResponse:
    """Utility class for standardized API responses."""
    
    @staticmethod
    def success(data: Dict, message: str = "Success") -> Dict:
        """Create a success response."""
        return {
            "success": True,
            "message": message,
            "data": data,
            "error": None
        }
    
    @staticmethod
    def error(message: str, error_code: str = "UNKNOWN_ERROR", status_code: int = 400) -> Dict:
        """Create an error response."""
        return {
            "success": False,
            "message": message,
            "data": None,
            "error": {
                "code": error_code,
                "status_code": status_code
            }
        }