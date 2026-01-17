import { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../api/client';
import { Alert, LoadingSpinner, EmptyState, Modal, Form } from './FormComponents';
import './Attendance.css';

export function Attendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterEmployeeId, setFilterEmployeeId] = useState(null);
  const [selectedEmployeeSummary, setSelectedEmployeeSummary] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [recordsRes, empRes] = await Promise.all([
        attendanceAPI.getAll(),
        employeeAPI.getAll()
      ]);
      setRecords(recordsRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setError('Failed to load attendance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (formData) => {
    try {
      setError(null);
      await attendanceAPI.create(formData);
      setSuccess('Attendance marked successfully!');
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to mark attendance';
      setError(message);
    }
  };

  const handleViewSummary = async (employeeId) => {
    try {
      const response = await attendanceAPI.getSummary(employeeId);
      setSelectedEmployeeSummary(response.data);
    } catch (err) {
      setError('Failed to load summary');
      console.error(err);
    }
  };

  const filteredRecords = filterEmployeeId
    ? records.filter(r => r.employee_id === parseInt(filterEmployeeId))
    : records;

  const getEmployeeName = (empId) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? emp.full_name : 'Unknown';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="attendance">
      <div className="attendance-header">
        <h2 className="page-title">Attendance Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Mark Attendance
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <Modal
        isOpen={showModal}
        title="Mark Attendance"
        onClose={() => setShowModal(false)}
      >
        <Form
          fields={[
            {
              name: 'employee_id',
              label: 'Employee',
              type: 'select',
              required: true,
              options: employees.map(emp => ({ value: emp.id, label: `${emp.full_name} (${emp.employee_id})` }))
            },
            { name: 'date', label: 'Date', type: 'date', required: true },
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              required: true,
              options: [
                { value: 'Present', label: 'Present' },
                { value: 'Absent', label: 'Absent' }
              ]
            }
          ]}
          onSubmit={handleMarkAttendance}
          submitButtonText="Mark Attendance"
        />
      </Modal>

      {selectedEmployeeSummary && (
        <Modal
          isOpen={true}
          title="Attendance Summary"
          onClose={() => setSelectedEmployeeSummary(null)}
          onSubmit={() => setSelectedEmployeeSummary(null)}
          submitText="Close"
        >
          <div className="summary-content">
            <div className="summary-row">
              <span className="summary-label">Employee:</span>
              <span className="summary-value">{selectedEmployeeSummary.employee_name}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Total Records:</span>
              <span className="summary-value">{selectedEmployeeSummary.total_records}</span>
            </div>
            <div className="summary-row highlight">
              <span className="summary-label">Present Days:</span>
              <span className="summary-value present">{selectedEmployeeSummary.present_days}</span>
            </div>
            <div className="summary-row highlight">
              <span className="summary-label">Absent Days:</span>
              <span className="summary-value absent">{selectedEmployeeSummary.absent_days}</span>
            </div>
          </div>
        </Modal>
      )}

      <div className="attendance-filters">
        <select
          value={filterEmployeeId || ''}
          onChange={(e) => setFilterEmployeeId(e.target.value ? parseInt(e.target.value) : null)}
          className="form-input"
        >
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name} ({emp.employee_id})
            </option>
          ))}
        </select>
      </div>

      {filteredRecords.length === 0 ? (
        <EmptyState message="No attendance records yet" icon="📋" />
      ) : (
        <div className="attendance-table-container">
          <table className="table attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="attendance-row">
                  <td className="emp-name">{getEmployeeName(record.employee_id)}</td>
                  <td className="date">{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status status-${record.status === 'Present' ? 'present' : 'absent'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="att-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewSummary(record.employee_id)}
                    >
                      Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
