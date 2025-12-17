# Complete Laptop Setup Guide - Mood-Based Music Player

## 🎯 Goal
Setup this project on your personal laptop from scratch in 15-20 minutes.

---

## ⚙️ Prerequisites (Install First)

### 1. **Python 3.8 or higher**
- Download: https://www.python.org/downloads/
- During installation: ✅ CHECK "Add Python to PATH"
- Verify installation:
```powershell
python --version
# Should show: Python 3.8.x or higher
```

### 2. **Node.js (v16 or higher)**
- Download: https://nodejs.org/ (LTS version)
- Verify installation:
```powershell
node --version
npm --version
# Should show: v16.x.x or higher
```

### 3. **Git**
- Download: https://git-scm.com/download/win
- Verify installation:
```powershell
git --version
# Should show: git version 2.x.x
```

### 4. **Visual Studio C++ Build Tools** (Required for some Python packages)
- Download: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Install "Desktop development with C++" workload
- OR: Install Visual Studio Code with C++ extension

---

## 📥 Step-by-Step Installation

### **Step 1: Clone the Repository**

Open PowerShell and run:

```powershell
# Navigate to where you want the project (e.g., Documents)
cd $HOME\Documents

# Clone the repository
git clone https://github.com/AbhaySharma0017/mood-based-music-player
cd mood-based-music-player
```

---

### **Step 2: Setup Backend (Python/Flask)**

```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run this first:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Upgrade pip
python -m pip install --upgrade pip

# Install all Python dependencies
pip install -r requirements.txt

# This will install:
# - Flask (web framework)
# - DeepFace (AI emotion detection)
# - TensorFlow (deep learning)
# - OpenCV (image processing)
# - Spotipy (Spotify API)
# - Flask-CORS (cross-origin requests)
# - python-dotenv (environment variables)
```

**Note:** This step takes 5-10 minutes (downloading AI models ~500MB)

---

### **Step 3: Setup Frontend (React)**

Open a **NEW PowerShell window** (keep backend one open):

```powershell
# Navigate to project
cd $HOME\Documents\mood-based-music-player

# Navigate to frontend folder
cd frontend

# Install all Node.js dependencies
npm install

# This will install:
# - React (UI framework)
# - Axios (HTTP client)
# - React-Webcam (camera access)
# - Testing libraries
```

**Note:** This takes 2-3 minutes

---

### **Step 4: Configure Spotify API**

#### A. Create Spotify Developer App

1. Go to: https://developer.spotify.com/dashboard
2. Login with your Spotify account (free account works)
3. Click **"Create App"**
4. Fill in:
   - **App Name:** Mood Music Player
   - **App Description:** AI-powered mood detection music player
   - **Redirect URI:** `http://127.0.0.1:3000/callback`
   - ✅ Check "Web API"
5. Click **"Save"**
6. Click **"Settings"**
7. Copy:
   - **Client ID** (looks like: `4b4a58a8d7c648dda491a79dc6a97a65`)
   - **Client Secret** (click "View client secret")

#### B. Create .env File

In the `backend` folder, create a file named `.env`:

```powershell
# Navigate to backend folder
cd $HOME\Documents\mood-based-music-player\backend

# Create .env file using notepad
notepad .env
```

Paste this content (replace with YOUR credentials):

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID_HERE
SPOTIFY_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback

# Flask Configuration
FLASK_SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_DEBUG=false
BACKEND_PORT=5001

# Frontend URL
FRONTEND_URL=http://127.0.0.1:3000
```

**Save and close** the file.

---

## 🚀 Running the Project

### **Terminal 1: Start Backend**

```powershell
# Navigate to backend folder
cd $HOME\Documents\mood-based-music-player\backend

# Activate virtual environment (if not already)
.\venv\Scripts\Activate.ps1

# Start Flask server
flask run --host=0.0.0.0 --port=5001
```

**Wait for this message:**
```
* Running on http://127.0.0.1:5001
```

Keep this terminal open!

---

### **Terminal 2: Start Frontend**

Open a **NEW PowerShell window**:

```powershell
# Navigate to frontend folder
cd $HOME\Documents\mood-based-music-player\frontend

# Start React development server
npm start
```

**Wait for:**
- "Compiled successfully!"
- Browser opens automatically at `http://localhost:3000`

Keep this terminal open too!

---

## 🎉 Testing the Application

1. Browser should open at `http://localhost:3000` or `http://127.0.0.1:3000`
2. Click **"Connect with Spotify"**
3. Login to Spotify (if prompted)
4. Click **"Agree"** to authorize the app
5. You'll be redirected back to the app
6. Allow camera access when prompted
7. Click **"📷 Capture Mood"** or enable **"🔄 Auto Capture"**
8. AI detects your emotion
9. Playlist recommendations appear
10. Click any song → Opens in Spotify

---

## 🛠️ Troubleshooting Common Issues

### **Issue 1: "Python not recognized"**
**Solution:**
- Reinstall Python with "Add to PATH" checked
- OR manually add Python to PATH:
  - Search "Environment Variables" in Windows
  - Edit "Path" variable
  - Add: `C:\Users\YourName\AppData\Local\Programs\Python\Python3X`

### **Issue 2: "Cannot activate virtual environment"**
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Issue 3: "pip install fails with Microsoft Visual C++ error"**
**Solution:**
- Install Visual Studio Build Tools
- OR install packages one by one:
```powershell
pip install flask flask-cors python-dotenv spotipy
pip install opencv-python
pip install deepface
```

### **Issue 4: "npm install fails"**
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### **Issue 5: "Port 3000/5001 already in use"**
**Solution:**
```powershell
# Kill process on port 3000
$proc = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if($proc) { Stop-Process -Id $proc -Force }

# Kill process on port 5001
$proc = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if($proc) { Stop-Process -Id $proc -Force }
```

### **Issue 6: "CORS error" or "Network error"**
**Solution:**
- Make sure both frontend and backend are running
- Use `http://127.0.0.1:3000` instead of `http://localhost:3000`
- Check `.env` file has correct redirect URI

### **Issue 7: "Spotify Invalid Redirect URI"**
**Solution:**
- In Spotify Dashboard → Settings → Redirect URIs
- Make sure it's EXACTLY: `http://127.0.0.1:3000/callback`
- NOT `localhost`, must be `127.0.0.1`
- Click "Save" after adding

### **Issue 8: "No module named 'app'"**
**Solution:**
```powershell
# Make sure you're in backend folder
cd backend

# Activate venv
.\venv\Scripts\Activate.ps1

# Reinstall requirements
pip install -r requirements.txt
```

---

## 📝 Quick Start Commands (For Future Use)

Save these for quick startup:

### **Start Both Servers (Quick Method)**

Create a file `start.ps1` in project root:

```powershell
# start.ps1
Write-Host "Starting Mood Music Player..." -ForegroundColor Green

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\venv\Scripts\Activate.ps1; flask run --host=0.0.0.0 --port=5001"

# Wait 5 seconds for backend to start
Start-Sleep -Seconds 5

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm start"

Write-Host "Both servers starting..." -ForegroundColor Green
Write-Host "Backend: http://127.0.0.1:5001" -ForegroundColor Cyan
Write-Host "Frontend: http://127.0.0.1:3000" -ForegroundColor Cyan
```

Then just run:
```powershell
.\start.ps1
```

---

## 🎓 For Your Friend's College Demo

### **Before Demo Day:**

1. **Test everything once:**
   ```powershell
   cd $HOME\Documents\mood-based-music-player
   .\start.ps1
   ```

2. **Prepare backup:**
   - Download your Spotify credentials screenshot
   - Have `.env` file ready to copy

3. **Check prerequisites:**
   - Python installed ✅
   - Node.js installed ✅
   - Git installed ✅
   - Internet connection available ✅
   - Camera working ✅

### **On Demo Day:**

**5 minutes before presentation:**

1. Open 2 PowerShell windows
2. Terminal 1:
   ```powershell
   cd $HOME\Documents\mood-based-music-player\backend
   .\venv\Scripts\Activate.ps1
   flask run --host=0.0.0.0 --port=5001
   ```
3. Terminal 2:
   ```powershell
   cd $HOME\Documents\mood-based-music-player\frontend
   npm start
   ```
4. Test quickly: Take one photo, get playlist

**During Presentation:**

- Show the emotion detection working
- Click different moods to show variety
- Open a song in Spotify
- Explain the technology (use PROJECT_EXPLANATION.md)

---

## 📦 Complete File Checklist

Make sure you have all these after setup:

```
mood-based-music-player/
├── backend/
│   ├── venv/                    ✅ (Created during setup)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── services/
│   ├── config/
│   ├── .env                     ✅ (YOU create this)
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── node_modules/            ✅ (Created during npm install)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
├── README.md
├── PROJECT_EXPLANATION.md
└── LAPTOP_SETUP_GUIDE.md (this file)
```

---

## 💾 Backup Plan (If Installation Fails)

If your friend can't install on their laptop:

### **Option A: Use Your Laptop**
- Bring your laptop with everything installed
- Hotspot from your phone if needed
- Run the demo yourself

### **Option B: USB Drive Method**
1. Copy entire project folder to USB
2. Copy Python portable version
3. Copy Node.js portable version
4. Install on college computer

### **Option C: Use College Computer with Internet**
- Follow this guide step-by-step
- Takes 20 minutes max
- Test before actual demo

---

## ✅ Final Verification Steps

Before closing setup, verify:

```powershell
# Check Python
python --version

# Check Node
node --version

# Check backend packages
cd backend
.\venv\Scripts\Activate.ps1
pip list | Select-String "flask|deepface|spotipy"

# Check frontend packages
cd ..\frontend
npm list --depth=0 | Select-String "react|axios"

# Check .env exists
cd ..\backend
Test-Path .env
# Should return: True
```

If all checks pass: ✅ **Setup Complete!**

---

## 🆘 Need Help?

**Common Commands:**

```powershell
# Stop all Python processes
Get-Process python | Stop-Process -Force

# Stop all Node processes
Get-Process node | Stop-Process -Force

# Check what's running on port
netstat -ano | findstr "3000 5001"

# Restart everything
cd backend
.\venv\Scripts\Activate.ps1
flask run --host=0.0.0.0 --port=5001
# (In new terminal)
cd frontend
npm start
```

---

**Good luck with the demo! 🎉**
