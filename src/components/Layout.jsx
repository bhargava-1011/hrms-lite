import './Layout.css';

export function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1 className="header-title">HRMS Lite</h1>
        <p className="header-subtitle">Human Resource Management System</p>
      </div>
    </header>
  );
}

export function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="navigation">
      <div className="container">
        <button 
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-button ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => onTabChange('employees')}
        >
          Employees
        </button>
        <button 
          className={`nav-button ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => onTabChange('attendance')}
        >
          Attendance
        </button>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2026 HRMS Lite. All rights reserved.</p>
      </div>
    </footer>
  );
}
