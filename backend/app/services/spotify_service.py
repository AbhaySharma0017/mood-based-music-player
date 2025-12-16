"""
Spotify Web API integration service.
"""
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
import os
import logging
from typing import Dict, Any, List
import random

logger = logging.getLogger(__name__)

class SpotifyService:
    """
    Service for interacting with Spotify Web API.
    
    Handles OAuth authentication and playlist recommendations based on mood.
    """
    
    def __init__(self):
        """Initialize Spotify service with configuration."""
        self.client_id = os.environ.get('SPOTIFY_CLIENT_ID')
        self.client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
        self.redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')
        
        # Spotify OAuth scopes needed
        self.scope = "user-read-private user-read-email playlist-read-private playlist-read-collaborative"
        
        # Mood-based playlist queries and audio features
        self.mood_queries = {
            'happy': {
                'genres': ['pop', 'dance', 'funk', 'disco', 'soul'],
                'audio_features': {
                    'target_valence': 0.8,
                    'target_energy': 0.8,
                    'target_danceability': 0.7
                },
                'keywords': ['happy', 'upbeat', 'feel good', 'party', 'celebration']
            },
            'sad': {
                'genres': ['indie', 'alternative', 'folk', 'blues', 'country'],
                'audio_features': {
                    'target_valence': 0.2,
                    'target_energy': 0.3,
                    'target_acousticness': 0.7
                },
                'keywords': ['sad', 'melancholy', 'heartbreak', 'emotional', 'ballad']
            },
            'neutral': {
                'genres': ['chill', 'ambient', 'lo-fi', 'jazz', 'classical'],
                'audio_features': {
                    'target_valence': 0.5,
                    'target_energy': 0.4,
                    'target_acousticness': 0.5
                },
                'keywords': ['chill', 'relaxing', 'calm', 'peaceful', 'mellow']
            },
            'angry': {
                'genres': ['rock', 'metal', 'punk', 'hardcore', 'grunge'],
                'audio_features': {
                    'target_valence': 0.3,
                    'target_energy': 0.9,
                    'target_loudness': -5
                },
                'keywords': ['aggressive', 'intense', 'powerful', 'heavy', 'energetic']
            },
            'surprise': {
                'genres': ['electronic', 'experimental', 'world', 'reggae', 'latin'],
                'audio_features': {
                    'target_valence': 0.7,
                    'target_energy': 0.6,
                    'target_danceability': 0.8
                },
                'keywords': ['eclectic', 'unique', 'diverse', 'world music', 'fusion']
            },
            'fear': {
                'genres': ['ambient', 'new age', 'meditation', 'soft rock', 'acoustic'],
                'audio_features': {
                    'target_valence': 0.6,
                    'target_energy': 0.2,
                    'target_acousticness': 0.8
                },
                'keywords': ['calming', 'soothing', 'peaceful', 'healing', 'comfort']
            }
        }
        
        logger.info("Spotify service initialized")
    
    def get_auth_url(self) -> str:
        """
        Get Spotify OAuth authorization URL.
        
        Returns:
            Authorization URL string
        """
        try:
            sp_oauth = SpotifyOAuth(
                client_id=self.client_id,
                client_secret=self.client_secret,
                redirect_uri=self.redirect_uri,
                scope=self.scope
            )
            
            auth_url = sp_oauth.get_authorize_url()
            logger.info("Generated Spotify auth URL")
            return auth_url
            
        except Exception as e:
            logger.error(f"Failed to generate auth URL: {str(e)}")
            raise
    
    def get_access_token(self, authorization_code: str) -> Dict[str, Any]:
        """
        Exchange authorization code for access token.
        
        Args:
            authorization_code: Code received from Spotify callback
            
        Returns:
            Dictionary with token info or error
        """
        try:
            sp_oauth = SpotifyOAuth(
                client_id=self.client_id,
                client_secret=self.client_secret,
                redirect_uri=self.redirect_uri,
                scope=self.scope
            )
            
            token_info = sp_oauth.get_access_token(authorization_code)
            
            if token_info:
                logger.info("Successfully obtained Spotify access token")
                return {
                    'access_token': token_info['access_token'],
                    'refresh_token': token_info['refresh_token'],
                    'expires_at': token_info['expires_at'],
                    'expires_in': token_info['expires_in'],
                    'error': False
                }
            else:
                return {
                    'error': True,
                    'message': 'Failed to obtain access token'
                }
                
        except Exception as e:
            logger.error(f"Token exchange failed: {str(e)}")
            return {
                'error': True,
                'message': f'Token exchange failed: {str(e)}'
            }
    
    def get_mood_playlist(self, mood: str, access_token: str) -> Dict[str, Any]:
        """
        Get playlist recommendations for a specific mood.
        
        Args:
            mood: The mood to get recommendations for
            access_token: Spotify access token
            
        Returns:
            Dictionary with playlist data or error
        """
        try:
            # Initialize Spotify client with access token
            sp = spotipy.Spotify(auth=access_token)
            
            # Get mood configuration
            mood_config = self.mood_queries.get(mood, self.mood_queries['neutral'])
            
            # Search for tracks based on mood
            tracks = self._search_tracks_by_mood(sp, mood_config)
            
            if not tracks:
                return {
                    'error': True,
                    'message': f'No tracks found for mood: {mood}'
                }
            
            # Create playlist data
            playlist_data = {
                'mood': mood,
                'tracks': tracks,
                'total_tracks': len(tracks),
                'playlist_name': f"{mood.title()} Vibes",
                'description': f"AI-generated playlist for {mood} mood",
                'error': False
            }
            
            # If user has premium, we could create an actual playlist
            # For now, we return track data for frontend to display
            
            logger.info(f"Generated {len(tracks)} track recommendations for mood: {mood}")
            return playlist_data
            
        except Exception as e:
            logger.error(f"Playlist generation failed: {str(e)}")
            return {
                'error': True,
                'message': f'Failed to generate playlist: {str(e)}'
            }
    
    def _search_tracks_by_mood(self, sp: spotipy.Spotify, mood_config: Dict) -> List[Dict]:
        """
        Search for tracks matching mood configuration.
        
        Args:
            sp: Spotify client
            mood_config: Configuration for the mood
            
        Returns:
            List of track dictionaries
        """
        tracks = []
        
        try:
            # Use different search strategies
            
            # 1. Search by genres
            for genre in mood_config['genres'][:2]:  # Limit to 2 genres to avoid too many requests
                query = f'genre:"{genre}"'
                results = sp.search(q=query, type='track', limit=10)
                tracks.extend(self._format_tracks(results['tracks']['items']))
            
            # 2. Search by keywords
            for keyword in mood_config['keywords'][:2]:  # Limit keywords
                query = f'"{keyword}"'
                results = sp.search(q=query, type='track', limit=10)
                tracks.extend(self._format_tracks(results['tracks']['items']))
            
            # Remove duplicates and shuffle
            unique_tracks = []
            track_ids = set()
            
            for track in tracks:
                if track['id'] not in track_ids:
                    unique_tracks.append(track)
                    track_ids.add(track['id'])
            
            # Shuffle and limit to 20 tracks
            random.shuffle(unique_tracks)
            return unique_tracks[:20]
            
        except Exception as e:
            logger.error(f"Track search failed: {str(e)}")
            return []
    
    def _format_tracks(self, spotify_tracks: List[Dict]) -> List[Dict]:
        """
        Format Spotify track data for frontend consumption.
        
        Args:
            spotify_tracks: Raw track data from Spotify API
            
        Returns:
            List of formatted track dictionaries
        """
        formatted_tracks = []
        
        for track in spotify_tracks:
            try:
                formatted_track = {
                    'id': track['id'],
                    'name': track['name'],
                    'artist': ', '.join([artist['name'] for artist in track['artists']]),
                    'album': track['album']['name'],
                    'duration_ms': track['duration_ms'],
                    'explicit': track['explicit'],
                    'popularity': track['popularity'],
                    'preview_url': track['preview_url'],
                    'external_urls': track['external_urls'],
                    'uri': track['uri']
                }
                
                # Add album image if available
                if track['album']['images']:
                    formatted_track['image_url'] = track['album']['images'][0]['url']
                
                formatted_tracks.append(formatted_track)
                
            except KeyError as e:
                logger.warning(f"Missing track data field: {e}")
                continue
        
        return formatted_tracks
    
    def create_playlist(self, sp: spotipy.Spotify, user_id: str, mood: str, track_uris: List[str]) -> Dict[str, Any]:
        """
        Create an actual Spotify playlist (requires premium).
        
        Args:
            sp: Spotify client
            user_id: Spotify user ID
            mood: Mood for playlist name
            track_uris: List of Spotify track URIs
            
        Returns:
            Dictionary with playlist info or error
        """
        try:
            # Create playlist
            playlist_name = f"AI Mood: {mood.title()}"
            playlist_description = f"AI-generated playlist for {mood} mood - Created by Mood Music Player"
            
            playlist = sp.user_playlist_create(
                user=user_id,
                name=playlist_name,
                description=playlist_description,
                public=False
            )
            
            # Add tracks to playlist
            if track_uris:
                sp.playlist_add_items(playlist['id'], track_uris)
            
            logger.info(f"Created Spotify playlist: {playlist_name}")
            
            return {
                'playlist_id': playlist['id'],
                'playlist_url': playlist['external_urls']['spotify'],
                'playlist_name': playlist_name,
                'error': False
            }
            
        except Exception as e:
            logger.error(f"Playlist creation failed: {str(e)}")
            return {
                'error': True,
                'message': f'Failed to create playlist: {str(e)}'
            }
    
    def get_user_profile(self, access_token: str) -> Dict[str, Any]:
        """
        Get current user's Spotify profile.
        
        Args:
            access_token: Spotify access token
            
        Returns:
            User profile data or error
        """
        try:
            sp = spotipy.Spotify(auth=access_token)
            user = sp.current_user()
            
            return {
                'user_id': user['id'],
                'display_name': user['display_name'],
                'email': user['email'],
                'followers': user['followers']['total'],
                'country': user['country'],
                'product': user['product'],  # free, premium, etc.
                'error': False
            }
            
        except Exception as e:
            logger.error(f"Failed to get user profile: {str(e)}")
            return {
                'error': True,
                'message': f'Failed to get user profile: {str(e)}'
            }