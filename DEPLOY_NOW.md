# 🚀 Deploy HRMS Lite NOW - Step by Step Guide

This guide will help you deploy HRMS Lite to **Render**, **Railway**, or **Vercel/Netlify** in just a few minutes.

## ⚡ Quick Deploy Options

### Option 1: Render.com (Recommended - Easiest)

**Why Render?** Free tier, automatic HTTPS, auto-deploy from GitHub, hosts both backend and frontend.

#### Deploy Backend on Render

1. **Go to Render**: https://render.com/
2. **Sign up/Login** with your GitHub account
3. **Click "New +"** → Select **"Web Service"**
4. **Connect your repository**: `bhargava-1011/hrms-lite`
5. **Configure the service**:
   - **Name**: `hrms-lite-backend`
   - **Region**: Choose closest to you
   - **Branch**: `copilot/run-and-deploy-code` (or `main` after merge)
   - **Root Directory**: Leave blank (uses root)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Select **Free**

6. **Click "Create Web Service"**
7. **Wait for deployment** (2-3 minutes)
8. **Copy your backend URL** (e.g., `https://hrms-lite-backend.onrender.com`)

#### Deploy Frontend on Render

1. **Click "New +"** → Select **"Static Site"**
2. **Connect the same repository**: `bhargava-1011/hrms-lite`
3. **Configure the site**:
   - **Name**: `hrms-lite-frontend`
   - **Branch**: `copilot/run-and-deploy-code` (or `main` after merge)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable**:
   - Click "Environment" tab
   - Add variable:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://hrms-lite-backend.onrender.com` (your backend URL from step 8 above)

5. **Click "Create Static Site"**
6. **Wait for deployment** (2-3 minutes)
7. **Get your live URL!** (e.g., `https://hrms-lite-frontend.onrender.com`)

✅ **Done!** Your app is now live on the web!

---

### Option 2: Railway.app (Alternative - Very Easy)

**Why Railway?** Simple deployment, good free tier, automatic HTTPS.

#### Deploy on Railway

1. **Go to Railway**: https://railway.app/
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repository**: `bhargava-1011/hrms-lite`
5. **Railway will auto-detect Python/Node.js**

#### Configure Backend Service

1. **Click on the Python service** (backend)
2. **Go to "Settings"**:
   - **Start Command**: Add `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Custom Domain**: (Optional) Add a custom domain or use Railway's domain

3. **Click "Deploy"**
4. **Copy the backend URL** from the deployment

#### Configure Frontend Service

1. **Click "New"** → **"Empty Service"**
2. **Connect the same repo**
3. **Go to "Settings"**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx vite preview --host 0.0.0.0 --port $PORT`

4. **Go to "Variables"** tab:
   - Add: `VITE_API_URL` = (your backend URL from step 4)

5. **Click "Deploy"**
6. **Get your live URL!**

✅ **Done!** Your app is live on Railway!

---

### Option 3: Vercel (Frontend) + Render (Backend)

**Why this combo?** Best performance for frontend, reliable backend hosting.

#### Deploy Backend on Render (Same as Option 1)
Follow the "Deploy Backend on Render" steps from Option 1 above.

#### Deploy Frontend on Vercel

1. **Go to Vercel**: https://vercel.com/
2. **Sign up/Login** with your GitHub account
3. **Click "Add New..."** → **"Project"**
4. **Import your repository**: `bhargava-1011/hrms-lite`
5. **Configure**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Environment Variables**:
   - Add: `VITE_API_URL` = (your Render backend URL)

7. **Click "Deploy"**
8. **Wait 1-2 minutes**
9. **Get your live URL!** (e.g., `https://hrms-lite-xyz.vercel.app`)

✅ **Done!** Your app is live with Vercel + Render!

---

### Option 4: Netlify (Frontend) + Render (Backend)

**Similar to Vercel option above**

1. **Deploy backend on Render** (see Option 1)
2. **Go to Netlify**: https://www.netlify.com/
3. **Sign up/Login** with GitHub
4. **Click "Add new site"** → **"Import an existing project"**
5. **Choose GitHub** and select your repo
6. **Configure**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment Variables**: Add `VITE_API_URL` with your backend URL

7. **Deploy!**

✅ **Done!** Your app is live on Netlify!

---

## 🎯 Recommended Approach (Easiest)

**For beginners, we recommend Option 1 (Render for both)**:
1. Deploy backend on Render first
2. Copy the backend URL
3. Deploy frontend on Render with the backend URL as env variable
4. Done in ~10 minutes total!

## 📝 Post-Deployment Checklist

After deployment, verify:

- [ ] Backend is accessible: Visit `https://your-backend-url.com/` - should see `{"message":"HRMS Lite API is running"}`
- [ ] API docs work: Visit `https://your-backend-url.com/docs`
- [ ] Frontend loads: Open your frontend URL
- [ ] Test creating an employee
- [ ] Test marking attendance
- [ ] Check browser console for errors (F12)

## 🐛 Common Issues

**CORS Error**: If frontend can't connect to backend:
- Verify `VITE_API_URL` environment variable is set correctly
- Make sure you're using the HTTPS backend URL (not HTTP)
- Redeploy frontend after setting env var

**Build Failed on Frontend**:
- Check that `npm run build` works locally
- Verify all dependencies are in `package.json`

**Backend Not Starting**:
- Check logs in the platform dashboard
- Verify `requirements.txt` has all dependencies
- Make sure start command uses `$PORT` variable

## 🔗 Example URLs

After deployment, your URLs will look like:

**Render**:
- Backend: `https://hrms-lite-backend.onrender.com`
- Frontend: `https://hrms-lite-frontend.onrender.com`

**Railway**:
- Backend: `https://hrms-lite-backend.up.railway.app`
- Frontend: `https://hrms-lite-frontend.up.railway.app`

**Vercel + Render**:
- Backend: `https://hrms-lite-backend.onrender.com`
- Frontend: `https://hrms-lite-xyz.vercel.app`

## 💡 Tips

1. **Free tier limitations**:
   - Render: Services sleep after 15 min inactivity (first request takes ~30s)
   - Railway: 500 hours/month free
   - Vercel: Unlimited for non-commercial use

2. **Keep services awake**: Use a service like UptimeRobot to ping your backend every 10 minutes

3. **Custom domain**: All platforms support custom domains (usually in paid plans)

4. **Database**: SQLite works for demo, but consider PostgreSQL for production

---

## 🎉 You're Almost There!

Choose one of the options above, follow the steps, and your HRMS Lite will be live on the web in ~10 minutes!

**Need help?** Check the platform-specific documentation:
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)

---

**Last Updated**: January 17, 2026
