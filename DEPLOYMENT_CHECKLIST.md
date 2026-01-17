# HRMS Lite - Quick Deployment Checklist

Use this checklist when deploying HRMS Lite to production.

## ✅ Pre-Deployment Checklist

### Code Preparation
- [x] Code is organized in proper structure (`src/` for frontend, root for backend)
- [x] All dependencies are listed in `requirements.txt` and `package.json`
- [x] `.gitignore` is configured to exclude build artifacts
- [x] Frontend builds successfully (`npm run build`)
- [x] Backend runs without errors (`uvicorn main:app`)

### Configuration Files
- [x] `Procfile` - For Heroku deployment
- [x] `render.yaml` - For Render deployment
- [x] `vercel.json` - For Vercel frontend deployment
- [x] `vite.config.js` - Frontend build configuration
- [x] `start.sh` - Local development startup script

### Documentation
- [x] README.md - Overview and quick start
- [x] SETUP.md - Detailed setup guide
- [x] DEPLOYMENT.md - Comprehensive deployment guide

## 🚀 Deployment Steps

### Option 1: Render.com (Recommended)

#### Backend on Render
1. [ ] Sign up at render.com
2. [ ] Create new Web Service
3. [ ] Connect GitHub repository
4. [ ] Configure service:
   - Name: `hrms-lite-backend`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. [ ] Deploy and note the backend URL

#### Frontend on Render
1. [ ] Create new Static Site
2. [ ] Connect GitHub repository
3. [ ] Configure site:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. [ ] Add environment variable:
   - Key: `VITE_API_URL`
   - Value: (your backend URL from above)
5. [ ] Deploy

### Option 2: Heroku

#### Backend on Heroku
1. [ ] Install Heroku CLI
2. [ ] Login: `heroku login`
3. [ ] Create app: `heroku create hrms-lite-backend`
4. [ ] Deploy: `git push heroku main`
5. [ ] Open: `heroku open`

### Option 3: Vercel (Frontend) + Render (Backend)

#### Backend on Render
1. [ ] Follow Render backend steps above

#### Frontend on Vercel
1. [ ] Sign up at vercel.com
2. [ ] Import project from GitHub
3. [ ] Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. [ ] Add environment variable:
   - `VITE_API_URL`: (your backend URL)
5. [ ] Deploy

## 🔧 Post-Deployment

### Testing
1. [ ] Backend health check:
   ```bash
   curl https://your-backend-url.com/
   ```
   Should return: `{"message":"HRMS Lite API is running"}`

2. [ ] Test API endpoints:
   ```bash
   curl https://your-backend-url.com/api/dashboard/summary
   ```

3. [ ] Open frontend URL in browser
4. [ ] Test creating an employee
5. [ ] Test marking attendance
6. [ ] Check browser console for errors (F12)

### Configuration
1. [ ] Update CORS settings in `main.py` if needed
2. [ ] Verify environment variables are set correctly
3. [ ] Check that frontend can connect to backend

### Security
1. [ ] CORS configured to allow only your frontend domain
2. [ ] HTTPS enabled on both frontend and backend
3. [ ] No sensitive data in environment variables exposed publicly

### Monitoring
1. [ ] Set up error monitoring (optional)
2. [ ] Configure uptime monitoring (optional)
3. [ ] Check logs regularly for the first few days

## 📝 Environment Variables Reference

### Backend
No environment variables required for basic deployment. Optional:
- `DATABASE_URL` - For external database (default: SQLite)

### Frontend
Required:
- `VITE_API_URL` - Backend API URL
  - Development: `http://localhost:8001`
  - Production: Your deployed backend URL

## 🔗 Important URLs After Deployment

### Backend
- [ ] Production URL: ________________________________
- [ ] API Documentation: ______________________________/docs
- [ ] Health Check: ______________________________/

### Frontend
- [ ] Production URL: ________________________________

## 🐛 Common Issues & Solutions

### CORS Errors
**Problem**: Frontend can't connect to backend  
**Solution**: Update `allow_origins` in `main.py` to include frontend URL

### Build Failures
**Problem**: Frontend build fails  
**Solution**: 
- Check Node.js version (need 16+)
- Verify all imports are correct
- Check for syntax errors

### Database Issues
**Problem**: Data not persisting  
**Solution**: 
- Free tiers often use ephemeral storage
- Consider upgrading to persistent storage
- Or use external database service

### Port Issues
**Problem**: Application won't start  
**Solution**: Make sure start command uses `$PORT` environment variable

## 📞 Support Resources

- Documentation: See DEPLOYMENT.md for detailed guides
- Platform Docs:
  - [Render Documentation](https://render.com/docs)
  - [Heroku Documentation](https://devcenter.heroku.com/)
  - [Vercel Documentation](https://vercel.com/docs)
  
---

**Last Updated**: January 17, 2026
