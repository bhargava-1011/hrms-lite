# HRMS Lite - Deployment Guide

This guide covers how to deploy HRMS Lite to various cloud platforms.

## 📋 Prerequisites

- Git repository access
- Account on your chosen platform (Render, Heroku, Railway, or Vercel)
- Basic knowledge of command line

## 🏗️ Project Structure

```
hrms-lite/
├── src/                    # Frontend source files
│   ├── components/        # React components
│   ├── api/              # API client
│   ├── App.jsx           # Main App component
│   ├── App.css           # App styles
│   └── main.jsx          # Entry point
├── dist/                  # Production build (generated)
├── main.py               # FastAPI backend
├── models.py             # Database models
├── schemas.py            # Pydantic schemas
├── database.py           # Database configuration
├── requirements.txt      # Python dependencies
├── package.json          # Node dependencies
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── render.yaml           # Render deployment config
├── vercel.json           # Vercel deployment config
├── Procfile              # Heroku deployment config
└── .gitignore            # Git ignore rules
```

## 🚀 Deployment Options

### Option 1: Render.com (Recommended)

Render provides free hosting for both frontend and backend with automatic deployments from GitHub.

#### Backend Deployment on Render

1. **Sign up** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `hrms-lite-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Plan: `Free`

3. **Environment Variables** (if needed):
   - No specific env vars required for basic setup
   - Database will be created automatically (SQLite)

4. **Deploy**: Click "Create Web Service"
   - Render will automatically deploy your app
   - You'll get a URL like: `https://hrms-lite-backend.onrender.com`

#### Frontend Deployment on Render

1. **Create a new Static Site**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Name: `hrms-lite-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Environment Variables**:
   - Add `VITE_API_URL` with your backend URL
   - Example: `https://hrms-lite-backend.onrender.com`

3. **Deploy**: Click "Create Static Site"

#### Using render.yaml (Automatic)

Alternatively, you can use the included `render.yaml` file:

1. In Render dashboard, click "New +" → "Blueprint"
2. Connect your repository
3. Render will read `render.yaml` and set up services automatically

### Option 2: Heroku

#### Backend Deployment on Heroku

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku app**:
   ```bash
   heroku create hrms-lite-backend
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **Open app**:
   ```bash
   heroku open
   ```

The `Procfile` is already configured for Heroku.

#### Frontend on Heroku (Static)

For frontend, it's better to use Vercel or Netlify as they're optimized for static sites.

### Option 3: Railway

Railway offers simple deployment with good free tier.

#### Deploying to Railway

1. **Sign up** at [railway.app](https://railway.app)

2. **Create new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend Service**:
   - Railway auto-detects Python
   - Add start command if needed: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Set Python version in `runtime.txt`: `python-3.12.0`

4. **Configure Frontend Build**:
   - Add build command: `npm run build`
   - Set root directory if needed

### Option 4: Vercel (Frontend Only)

Perfect for frontend deployment with excellent performance.

1. **Sign up** at [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import from your Git repository
   - Framework Preset: Vite
   - Root Directory: `./` (or leave as is)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:
   - Add `VITE_API_URL` with your backend URL

4. **Deploy**: Vercel will auto-deploy on every push to main branch

The included `vercel.json` file configures the deployment.

### Option 5: Manual VPS Deployment

For deploying to your own server (Ubuntu/Debian):

#### Backend Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3 python3-pip python3-venv -y

# Clone repository
git clone <your-repo-url>
cd hrms-lite

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install and configure Nginx
sudo apt install nginx -y

# Install Supervisor for process management
sudo apt install supervisor -y
```

Create supervisor config `/etc/supervisor/conf.d/hrms-backend.conf`:

```ini
[program:hrms-backend]
directory=/path/to/hrms-lite
command=/path/to/hrms-lite/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8001
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/hrms-backend.err.log
stdout_logfile=/var/log/hrms-backend.out.log
```

Configure Nginx `/etc/nginx/sites-available/hrms`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and start:

```bash
sudo ln -s /etc/nginx/sites-available/hrms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start hrms-backend
```

#### Frontend Setup on VPS

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Build frontend
cd /path/to/hrms-lite
npm install
npm run build

# Configure Nginx to serve static files
```

Update Nginx config:

```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;

    root /path/to/hrms-lite/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 6: Docker Deployment

Create `Dockerfile` for backend:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py models.py schemas.py database.py ./

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8001:8001"
    volumes:
      - ./hrms.db:/app/hrms.db
    environment:
      - DATABASE_URL=sqlite:///./hrms.db

  frontend:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    command: sh -c "npm install && npm run dev"
    depends_on:
      - backend
```

Run with:

```bash
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables

#### Backend
- `DATABASE_URL` (optional): Database connection string
  - Default: `sqlite:///./hrms.db`
  
#### Frontend
- `VITE_API_URL`: Backend API URL
  - Development: `http://localhost:8001`
  - Production: Your deployed backend URL (e.g., `https://hrms-lite-backend.onrender.com`)

### Setting Environment Variables

**Render**: Settings → Environment → Environment Variables

**Heroku**:
```bash
heroku config:set VITE_API_URL=https://your-backend.herokuapp.com
```

**Vercel**: Settings → Environment Variables

**Railway**: Variables tab in your service

## 🧪 Testing Deployment

After deployment, test your application:

1. **Test Backend API**:
   ```bash
   curl https://your-backend-url.com/
   curl https://your-backend-url.com/api/dashboard/summary
   ```

2. **Test Frontend**:
   - Open your frontend URL in a browser
   - Check browser console for errors (F12 → Console)
   - Test creating an employee
   - Test marking attendance

3. **Check CORS**:
   - Make sure frontend can connect to backend
   - CORS is configured in `main.py` to allow all origins

## 🔒 Production Best Practices

1. **Security**:
   - Update CORS settings in `main.py` to only allow your frontend domain
   - Use HTTPS for both frontend and backend
   - Add authentication if needed
   - Use environment variables for sensitive data

2. **Database**:
   - For production, consider PostgreSQL instead of SQLite
   - Set up database backups
   - Use connection pooling

3. **Monitoring**:
   - Set up error logging (Sentry, LogRocket)
   - Monitor API performance
   - Set up uptime monitoring

4. **Performance**:
   - Enable caching
   - Use CDN for frontend assets
   - Optimize database queries
   - Add indexes to frequently queried fields

## 🐛 Troubleshooting

### Backend Issues

**"Application Error" or 503**:
- Check logs in your platform dashboard
- Verify `requirements.txt` is complete
- Check start command is correct
- Ensure port is using `$PORT` variable

**Database not persisting**:
- Most free tiers use ephemeral storage
- Upgrade to persistent storage or use external database

**CORS errors**:
- Update `allow_origins` in `main.py`
- Make sure frontend URL is allowed

### Frontend Issues

**API calls failing**:
- Check `VITE_API_URL` environment variable
- Verify backend is running and accessible
- Check browser console for errors
- Test backend endpoint directly with curl

**Build failures**:
- Check Node.js version (should be 16+)
- Clear cache: `rm -rf node_modules && npm install`
- Check for syntax errors in source files

**Blank page after deployment**:
- Check browser console for errors
- Verify `dist` folder was created during build
- Check if index.html exists in dist folder

## 📊 Monitoring

### Backend Health Check

Your backend has a health check endpoint:
```bash
curl https://your-backend-url.com/
```

Should return:
```json
{"message": "HRMS Lite API is running"}
```

### Dashboard Stats

```bash
curl https://your-backend-url.com/api/dashboard/summary
```

Returns employee and attendance counts.

## 🔄 Continuous Deployment

Most platforms support automatic deployments:

- **Render**: Auto-deploys on push to main branch
- **Vercel**: Auto-deploys on every push
- **Heroku**: Use `git push heroku main`
- **Railway**: Auto-deploys on push

## 📚 Additional Resources

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Render Documentation](https://render.com/docs)
- [Heroku Python Guide](https://devcenter.heroku.com/articles/getting-started-with-python)
- [Vercel Documentation](https://vercel.com/docs)

## 🆘 Support

If you encounter issues:

1. Check platform-specific logs
2. Review error messages in browser console
3. Test backend API directly with curl
4. Verify environment variables are set
5. Check CORS configuration

---

**Last Updated**: January 17, 2026  
**Version**: 1.0.0
