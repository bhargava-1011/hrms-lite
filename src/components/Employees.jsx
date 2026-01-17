import { useState, useEffect } from 'react';
import { employeeAPI } from '../api/client';
import { Alert, LoadingSpinner, EmptyState, Modal, Form } from './FormComponents';
import './Employees.css';

export function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (formData) => {
    try {
      setError(null);
      await employeeAPI.create(formData);
      setSuccess('Employee added successfully!');
      setShowModal(false);
      fetchEmployees();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to add employee';
      setError(message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      setError(null);
      await employeeAPI.delete(id);
      setSuccess('Employee deleted successfully!');
      setDeleteConfirm(null);
      fetchEmployees();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="employees">
      <div className="employees-header">
        <h2 className="page-title">Employee Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Employee
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <Modal
        isOpen={showModal}
        title="Add New Employee"
        onClose={() => setShowModal(false)}
      >
        <Form
          fields={[
            { name: 'employee_id', label: 'Employee ID', type: 'text', required: true, placeholder: 'EMP001' },
            { name: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
            { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john@example.com' },
            { name: 'department', label: 'Department', type: 'text', required: true, placeholder: 'IT' }
          ]}
          onSubmit={handleAddEmployee}
          submitButtonText="Add Employee"
        />
      </Modal>

      {deleteConfirm && (
        <Modal
          isOpen={true}
          title="Confirm Delete"
          onClose={() => setDeleteConfirm(null)}
          onSubmit={() => handleDeleteEmployee(deleteConfirm.id)}
        >
          <div className="confirm-message">
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <p className="text-warning">This action cannot be undone.</p>
          </div>
        </Modal>
      )}

      {employees.length === 0 ? (
        <EmptyState message="No employees yet. Add one to get started!" icon="👥" />
      ) : (
        <div className="employees-table-container">
          <table className="table employees-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="employee-row">
                  <td className="emp-id">{emp.employee_id}</td>
                  <td className="emp-name">{emp.full_name}</td>
                  <td className="emp-email">{emp.email}</td>
                  <td className="emp-dept">{emp.department}</td>
                  <td className="emp-actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteConfirm({ id: emp.id, name: emp.full_name })}
                    >
                      Delete
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
