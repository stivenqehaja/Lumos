# Ngrok Setup Guide for Lumos

## Quick Start

### 1. Install ngrok
Download from: https://ngrok.com/download
Or install via npm:
```bash
npm install -g ngrok
```

### 2. Authenticate
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```
Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken

### 3. Start Your Servers

**Terminal 1 - Backend API:**
```bash
node server.js
```
(Runs on port 3000)

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
(Runs on port 5174)

### 4. Expose with ngrok

**Terminal 3 - Expose Backend:**
```bash
ngrok http 3000
```
Copy the forwarding URL (e.g., https://abc123.ngrok-free.app)

**Terminal 4 - Expose Frontend:**
```bash
ngrok http 5174
```
Copy the forwarding URL (e.g., https://xyz789.ngrok-free.app)

### 5. Update Configuration

**Backend (.env):**
```env
BASE_URL=https://xyz789.ngrok-free.app
```
(Use the FRONTEND ngrok URL)

**Frontend (client/.env.local):**
Create this file if it doesn't exist:
```env
VITE_API_URL=https://abc123.ngrok-free.app/api
```
(Use the BACKEND ngrok URL)

### 6. Restart Both Servers
- Restart backend: `node server.js`
- Frontend will auto-reload

### 7. Access Your Site
Visit: https://xyz789.ngrok-free.app

## Alternative: Using ngrok with Config File

Create `ngrok.yml` in your project root:
```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN
tunnels:
  backend:
    proto: http
    addr: 3000
  frontend:
    proto: http
    addr: 5174
```

Then run:
```bash
ngrok start --all --config ngrok.yml
```

## Important Notes

1. **Free Tier Limitations:**
   - URLs change every time you restart ngrok
   - Limited to 1 online ngrok agent (need to upgrade for multiple tunnels simultaneously)
   - 40 connections/minute limit

2. **Paid Plans ($8/month):**
   - Static domain (e.g., lumos.ngrok.io)
   - Multiple simultaneous tunnels
   - No connection limits

3. **CORS Issues:**
   Your backend needs to allow the ngrok frontend URL. Update server.js:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:5174', 'https://xyz789.ngrok-free.app']
   }));
   ```

4. **Database Access:**
   Your PostgreSQL database needs to be accessible from your machine since the backend still runs locally.

## Production Alternative

For actual production deployment, consider:
- Frontend: Vercel, Netlify, or GitHub Pages
- Backend: Railway, Render, or Heroku
- Database: Hosted PostgreSQL (Railway, Supabase, Neon)

This is more stable than ngrok and often free for small projects.
