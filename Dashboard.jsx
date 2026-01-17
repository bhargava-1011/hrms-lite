import { useState, useEffect } from 'react';
import { employeeAPI, dashboardAPI } from '../api/client';
import { Alert, LoadingSpinner } from './FormComponents';
import './Dashboard.css';

export function Dashboard() {
  // Fix: Initialize stats with default values to prevent "vanishing" UI
  const [stats, setStats] = useState({ total_employees: 0, total_attendance_records: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setError(null);
        
        const [statsRes, empRes] = await Promise.all([
          dashboardAPI.getSummary(),
          employeeAPI.getAll()
        ]);
        
        if (isMounted) {
          if (statsRes.data) setStats(statsRes.data);
          if (empRes.data) setEmployees(empRes.data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Connection Error: Is the backend running on port 8001?');
          console.error("Dashboard fetch error:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      <h2 className="page-title">HRMS Overview</h2>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.total_employees || 0}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.total_attendance_records || 0}</div>
          <div className="stat-label">Attendance Records</div>
        </div>
      </div>

      <div className="employees-summary">
        <h3>Recent Employee Records</h3>
        {employees.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">No employee records found. Add an employee to get started.</p>
        )}
      </div>
    </div>
  );
}
