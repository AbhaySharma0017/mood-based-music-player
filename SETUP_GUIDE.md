# Quick Setup Guide

## Current Status
✅ Backend Running: http://localhost:5000
✅ Frontend Running: http://localhost:3000
✅ Environment Variables: Configured

## ⚠️ IMPORTANT: Spotify Configuration Required

Your application won't work properly until you configure the Spotify Developer Dashboard.

### Step 1: Configure Spotify Redirect URI

1. Go to **Spotify Developer Dashboard**: https://developer.spotify.com/dashboard
2. Click on your app: **Mood-Based Music Player** (or whatever you named it)
3. Click **Settings** button (top right)
4. Scroll down to **Redirect URIs**
5. Add this exact URI: `http://localhost:3000/callback`
6. Click **Add**
7. Scroll down and click **Save** button at the bottom

### Step 2: Verify Your Credentials

Your `.env` file contains:
- Client ID: `e07272b137ca43899588c6fa390edf1c`
- Client Secret: `8d86a64367c24c1bbd6bfa98c9aedb98`
- Redirect URI: `http://localhost:3000/callback`

Make sure these match your Spotify app settings!

### Step 3: Test the Application

1. Open http://localhost:3000 in your browser
2. Click **"Connect to Spotify"** button
3. You should be redirected to Spotify login
4. After login, you'll be redirected back to your app
5. Grant webcam permissions when prompted
6. Click **"📷 Capture Mood"** to detect your emotion
7. The app will automatically suggest a playlist based on your mood!

## Troubleshooting

### Problem: "INVALID_CLIENT: Invalid redirect URI"
**Solution**: The redirect URI in Spotify Dashboard doesn't match. Make sure you added `http://localhost:3000/callback` (exact match, no trailing slash)

### Problem: Webcam not working
**Solution**: 
- Grant browser camera permissions
- Check if another app is using the camera
- Try a different browser (Chrome/Edge recommended)

### Problem: "Connect to Spotify" doesn't work
**Solution**:
- Check that both servers are running
- Verify your Spotify Client ID and Secret are correct
- Make sure redirect URI is configured in Spotify Dashboard

### Problem: No playlist shows after mood detection
**Solution**:
- Make sure you clicked "Connect to Spotify" first
- Check if you have a Spotify account (free or premium)
- Look at the browser console (F12) for error messages

## How to Use

1. **Connect to Spotify**: Click the button and login
2. **Detect Mood**: 
   - Click "📷 Capture Mood" for one-time detection
   - Click "🔄 Auto Capture" for continuous detection every 5 seconds
3. **Manual Selection**: Use the mood buttons to manually select a mood
4. **Play Music**: Click the Spotify link to open the playlist

## Supported Moods

😊 **Happy** - Upbeat, dance, party music
😢 **Sad** - Melancholic, emotional ballads
😐 **Neutral** - Chill, ambient, relaxing
😠 **Angry** - Rock, metal, intense music
😲 **Surprise** - Eclectic, world music, fusion
😨 **Fear** - Calming, soothing, peaceful

## Tips for Best Results

- Look directly at the camera
- Ensure good lighting
- Express your emotion naturally
- Try different moods to explore various playlists!

---

**Need Help?** Check SPOTIFY_TROUBLESHOOTING.md for detailed debugging steps.
