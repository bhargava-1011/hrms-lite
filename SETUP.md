# HRMS Lite Setup & Development Guide

## 📦 Installation

### Prerequisites
- Node.js v16+ and npm
- Python 3.8+
- Git (optional, for version control)

### Clone Repository
```bash
git clone <your-repo-url>
cd hrms-lite
```

## 🏗️ Backend Setup

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Start Backend Server
```bash
uvicorn main:app --reload --port 8001
```

Backend will be available at: **http://localhost:8001**

API Documentation: **http://localhost:8001/docs**

## 🎨 Frontend Setup

### 1. Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## 🧪 Testing the Application

### Create Employee
```bash
curl -X POST http://localhost:8001/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "IT"
  }'
```

### Get All Employees
```bash
curl http://localhost:8001/api/employees
```

### Mark Attendance
```bash
curl -X POST http://localhost:8001/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "date": "2026-01-17",
    "status": "Present"
  }'
```

### Get Dashboard Stats
```bash
curl http://localhost:8001/api/dashboard/summary
```

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── venv/                 # Python virtual environment
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic validation
│   ├── database.py          # DB configuration
│   ├── requirements.txt     # Python dependencies
│   ├── hrms.db              # SQLite database (auto-created)
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── node_modules/        # npm packages
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── api/            # API client
│   │   ├── App.jsx         # Main component
│   │   ├── main.jsx        # Entry point
│   │   └── *.css           # Styles
│   ├── dist/               # Production build
│   ├── package.json        # npm dependencies
│   ├── vite.config.js      # Vite configuration
│   └── .env                # Environment variables
│
├── README.md               # Main documentation
├── DEPLOYMENT.md           # Deployment instructions
├── SETUP.md               # This file
├── start.sh               # Quick start script
└── .gitignore
```

## 🔄 Development Workflow

### Adding New Features

#### Backend
1. Add models in `backend/models.py`
2. Add validation schemas in `backend/schemas.py`
3. Add endpoints in `backend/main.py`
4. Test with curl or Postman

#### Frontend
1. Create component in `frontend/src/components/`
2. Import API methods from `frontend/src/api/client.js`
3. Add styling in corresponding `.css` file
4. Import component in `App.jsx`

### Running Tests

Backend API test with sample data:
```bash
# Terminal 1: Start backend
cd backend && uvicorn main:app --reload --port 8001

# Terminal 2: Test endpoints
cd hrms-lite
bash test-api.sh  # if available, or use curl commands
```

## 🐛 Troubleshooting

### Backend Issues

**Error: `command not found: uvicorn`**
- Ensure virtual environment is activated
- Run: `pip install -r requirements.txt`

**Error: `Port 8001 already in use`**
- Check if another app is using port 8001
- Kill process: `lsof -i :8001` and then `kill -9 <PID>`
- Or change port: `uvicorn main:app --port 8002`

**Database errors**
- Delete `hrms.db` file
- Restart backend (it will recreate database)

### Frontend Issues

**Error: `npm: command not found`**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart terminal after installation

**Error: `Cannot find module`**
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

**Frontend can't connect to backend**
- Check `.env` file has `VITE_API_URL=http://localhost:8001`
- Ensure backend is running on port 8001
- Check browser console for errors (F12 → Console tab)
- Check CORS settings in `backend/main.py` (should allow all origins)

## 📊 API Reference

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Create employee |
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/{id}` | Get single employee |
| DELETE | `/api/employees/{id}` | Delete employee |

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/attendance` | List all attendance |
| GET | `/api/attendance/{emp_id}` | Get employee attendance |
| GET | `/api/attendance/{emp_id}/summary` | Get attendance summary |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Get statistics |

## 🚀 Building for Production

### Frontend
```bash
cd frontend
npm run build
# Creates `dist/` folder with optimized build
```

### Backend
- No build needed, deployment-ready
- Use the `Procfile` or `render.yaml` for platform deployment

## 📝 Environment Variables

### Backend (`.env`)
```
DATABASE_URL=sqlite:///./hrms.db
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8001
```

For production, update `VITE_API_URL` to deployed backend URL.

## 🔐 Security Notes

- No authentication required (single admin)
- CORS enabled for all origins (configure in production)
- Email validation enabled
- SQL injection prevention via ORM
- Input sanitization on all fields

## 📈 Performance Tips

- Use React DevTools to check for unnecessary re-renders
- Monitor network requests in DevTools (Network tab)
- Check API response times with curl `-w` option
- Database is indexed for common queries

## 🆘 Getting Help

1. **Check logs**: Look at terminal output for errors
2. **Browser console**: Press F12, check Console tab for frontend errors
3. **API docs**: Visit `http://localhost:8001/docs` for interactive API docs
4. **Restart everything**: Kill all processes and start fresh

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

## 💡 Quick Tips

- Use `curl` with `-v` flag for verbose output: `curl -v http://localhost:8001/`
- Use `curl` with `-w` flag for timing: `curl -w "@curl-format.txt" http://localhost:8001/`
- In frontend, check network tab (F12 → Network) to see API calls
- Use API docs at `http://localhost:8001/docs` to test endpoints directly

---

**Last Updated**: January 17, 2026  
**Version**: 1.0.0
