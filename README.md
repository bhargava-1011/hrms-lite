# HRMS Lite

A lightweight Human Resource Management System built with FastAPI and React.

## 🚀 Deploy Now

Deploy HRMS Lite to the cloud in minutes:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/new)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bhargava-1011/hrms-lite)

**👉 [See detailed deployment guide](DEPLOY_NOW.md)** - Step-by-step instructions for Render, Railway, Vercel, and Netlify.

## 🎯 Features

- **Employee Management**: Add, view, and delete employee records
- **Attendance Tracking**: Mark and monitor employee attendance
- **Dashboard**: View summary statistics at a glance
- **Modern UI**: Clean and responsive interface
- **REST API**: Well-documented API endpoints

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd hrms-lite
   ```

2. **Install dependencies**:
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Install Node dependencies
   npm install
   ```

3. **Run the application**:
   ```bash
   # Option 1: Use the start script (Unix/Linux/Mac)
   bash start.sh
   
   # Option 2: Start manually
   # Terminal 1 - Backend
   uvicorn main:app --reload --port 8001
   
   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001
   - API Docs: http://localhost:8001/docs

## 📁 Project Structure

```
hrms-lite/
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── api/              # API client
│   └── ...
├── main.py               # FastAPI backend
├── models.py             # Database models
├── schemas.py            # API schemas
├── database.py           # DB configuration
├── requirements.txt      # Python dependencies
├── package.json          # Node dependencies
└── vite.config.js        # Vite config
```

## 🌐 Deployment

This application is ready to deploy on various platforms:

- **Render** (Recommended) - See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Heroku** - Uses included `Procfile`
- **Vercel** (Frontend) - Uses included `vercel.json`
- **Railway** - Auto-detected
- **Docker** - Instructions in deployment guide

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📖 Documentation

- [Setup Guide](SETUP.md) - Detailed setup and development guide
- [Deployment Guide](DEPLOYMENT.md) - Deploy to production
- [API Documentation](http://localhost:8001/docs) - Interactive API docs (when running)

## 🛠️ Development

### Build Frontend for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### API Endpoints

**Employees**:
- `POST /api/employees` - Create employee
- `GET /api/employees` - List all employees
- `GET /api/employees/{id}` - Get employee details
- `DELETE /api/employees/{id}` - Delete employee

**Attendance**:
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - List attendance records
- `GET /api/attendance/{emp_id}` - Get employee attendance
- `GET /api/attendance/{emp_id}/summary` - Get attendance summary

**Dashboard**:
- `GET /api/dashboard/summary` - Get statistics

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env` or platform settings):
```
VITE_API_URL=http://localhost:8001
```

**Backend**:
```
DATABASE_URL=sqlite:///./hrms.db
```

## 🧪 Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:8001/

# Get dashboard stats
curl http://localhost:8001/api/dashboard/summary

# Create employee
curl -X POST http://localhost:8001/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "IT"
  }'
```

## 📝 License

This project is open source and available for use.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Version**: 1.0.0  
**Last Updated**: January 17, 2026