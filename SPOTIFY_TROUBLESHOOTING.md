# Alternative Spotify Setup - Implicit Grant Flow

If you're still having issues with redirect URIs, try this simplified approach:

## Method 1: Use Different Redirect URI

Try these in your Spotify app settings (one at a time):

1. `http://127.0.0.1:3000/callback`
2. `http://localhost:8888/callback` 
3. `http://localhost:3000/`

## Method 2: Implicit Grant (No Backend Auth)

This bypasses the redirect URI issues by using client-side only authentication:

### Spotify App Settings:
- **Redirect URI**: `http://localhost:3000/`
- **Only need**: Client ID (no Client Secret needed)

### Your .env file:
```
SPOTIFY_CLIENT_ID=e07272b137ca43899588c6fa390edf1c
SPOTIFY_CLIENT_SECRET=8d86a64367c24c1bbd6bfa98c9aedb98
SPOTIFY_REDIRECT_URI=http://localhost:3000/
```

## Method 3: Use HTTPS (Most Reliable)

If you want to eliminate the warning completely:

1. Install mkcert:
```bash
# Windows (with Chocolatey)
choco install mkcert

# Or download from: https://github.com/FiloSottile/mkcert/releases
```

2. Generate certificate:
```bash
mkcert -install
mkcert localhost 127.0.0.1
```

3. Use HTTPS redirect URI: `https://localhost:3000/callback`

## What to Try Now:

1. **First**: Try `http://127.0.0.1:3000/callback` in Spotify settings
2. **If that fails**: Try `http://localhost:8888/callback`
3. **Update your .env** file with the working redirect URI
4. **Test the app**

The key is finding a redirect URI that Spotify accepts for your specific account/region.