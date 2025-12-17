import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for emotion detection
  withCredentials: true, // Include cookies for session management
});

// Request interceptor for debugging
apiClient.interceptors.request.use((config) => {
  console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login with Spotify.');
    }
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw error;
  }
);

/**
 * Detect mood from image file
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} Mood detection result
 */
export const detectMood = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await apiClient.post('/detect-mood', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Mood detection failed:', error);
    throw error;
  }
};

/**
 * Get Spotify playlist for a mood
 * @param {string} mood - The mood to get playlist for
 * @returns {Promise<Object>} Playlist data
 */
export const getMoodPlaylists = async (mood) => {
  try {
    const response = await apiClient.get(`/get-playlist/${mood}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get playlist:', error);
    throw error;
  }
};

/**
 * Get Spotify authentication URL
 * @returns {Promise<Object>} Auth URL
 */
export const getSpotifyAuthUrl = async () => {
  try {
    const response = await apiClient.get('/spotify/auth');
    return response.data;
  } catch (error) {
    console.error('Failed to get auth URL:', error);
    throw error;
  }
};

/**
 * Handle Spotify OAuth callback
 * @param {string} code - Authorization code from Spotify
 * @returns {Promise<Object>} Token exchange result
 */
export const handleSpotifyCallback = async (code) => {
  try {
    console.log('Sending callback with code:', code.substring(0, 20) + '...');
    const response = await apiClient.post('/spotify/callback', { code });
    console.log('Callback response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Spotify callback failed:', error);
    throw error;
  }
};

/**
 * Get supported moods
 * @returns {Promise<Object>} Available moods
 */
export const getSupportedMoods = async () => {
  try {
    const response = await apiClient.get('/moods');
    return response.data;
  } catch (error) {
    console.error('Failed to get supported moods:', error);
    throw error;
  }
};

/**
 * Check session status
 * @returns {Promise<Object>} Session status
 */
export const getSessionStatus = async () => {
  try {
    const response = await apiClient.get('/session/status');
    return response.data;
  } catch (error) {
    console.error('Failed to check session status:', error);
    throw error;
  }
};

/**
 * Health check
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health', {
      baseURL: 'http://localhost:5000' // Direct health endpoint
    });
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default apiClient;