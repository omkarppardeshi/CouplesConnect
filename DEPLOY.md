# Deployment Guide - Couples Connect

## Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Render account (free)
- Vercel account (free)

---

## Step 1: Push Code to GitHub

If not already on GitHub:
```bash
cd /home/admin/Dev/CouplesConnect
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/couples-connect.git
git push -u origin main
```

---

## Step 2: Create MongoDB Atlas Database

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. **Build a Database** → **Free Tier (M0)**
4. Choose region closest to you
5. Create Cluster (takes ~2 minutes)

6. **Create Database User:**
   - Security → Database Access → Add New User
   - Username: `couplesconnect`
   - Password: (generate secure password - SAVE THIS!)
   - Role: "Read and write to any database"

7. **Network Access:**
   - Security → Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)

8. **Get Connection String:**
   - Clusters → Connect → Connect your application
   - Copy the connection string:
   ```
   mongodb+srv://couplesconnect:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/couplesconnect
   ```
   - Replace `YOUR_PASSWORD` with the password you created

---

## Step 3: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Dashboard → **New** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name:** `couples-connect-api`
   - **Region:** Choose closest to you
   - **Root Directory:** `server`
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

6. **Environment Variables** (add these):
   - `MONGODB_URI` = `mongodb+srv://couplesconnect:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/couplesconnect`
   - `CLIENT_URL` = `https://your-app.vercel.app` (you'll update this after Vercel deploy)
   - `OPENAI_API_KEY` = `your_openai_api_key`
   - `NODE_ENV` = `production`

7. Click **Create Web Service**
8. Wait for deployment (3-5 min)
9. You'll see a URL like: `https://couples-connect-api.onrender.com`
10. Copy this URL (without trailing slash)

---

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Import your GitHub repo (`couples-connect`)
5. Click **Continue**
6. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

7. **Environment Variables** (expand):
   - `VITE_API_URL` = `https://couples-connect-api.onrender.com` (your Render URL from Step 3)

8. Click **Deploy**
9. Wait for deployment (1-2 min)
10. You'll get a URL like: `https://couples-connect.vercel.app`
11. Copy this URL

---

## Step 5: Update Render with Vercel URL

1. Go back to Render → Your Web Service
2. **Environment** → Add or update:
   - `CLIENT_URL` = `https://couples-connect.vercel.app` (your Vercel URL)
3. Click **Save Changes**
4. Redeploy (optional - Render often picks up automatically)

---

## Step 6: Test Your Deployment

1. Open your Vercel URL: `https://couples-connect.vercel.app`
2. Register device and get pairing code
3. Open in another browser/incognito
4. Pair devices and test:
   - Send a message
   - Try Fight Mode
   - Send a hug
   - Complete a mood check-in
   - Try Daily Question

---

## Troubleshooting

### "Socket.io connection error"
- Ensure Render is awake (visit the backend URL first)
- Check that CLIENT_URL in Render matches your Vercel URL exactly
- Verify CORS settings in server/index.js

### "Cannot connect to MongoDB"
- Verify MONGODB_URI is correct
- Check Database User password
- Ensure Network Access allows 0.0.0.0/0

### Cold Boot on Render
- First visit after 15 min inactivity takes ~30 seconds
- This is normal for free tier

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Vercel | 100GB bandwidth/month |
| Render | 750 hours/month (sleeps after 15min idle) |
| MongoDB Atlas | 512MB storage |

For personal use with a partner, these limits are plenty.
