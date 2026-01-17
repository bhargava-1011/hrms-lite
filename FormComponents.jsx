import { useState } from 'react';
import './FormComponents.css';

export function Modal({ isOpen, title, onClose, onSubmit, submitText = 'Submit', children }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {onSubmit && (
            <button className="btn btn-primary" onClick={onSubmit}>{submitText}</button>
          )}
        </div>
      </div>
    </>
  );
}

export function Form({ fields, onSubmit, submitButtonText = 'Submit' }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value || '' }), {})
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Invalid email format';
        }
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value || '' }), {}));
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {fields.map(field => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name} className="form-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`form-input ${errors[field.name] ? 'error' : ''}`}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`form-input ${errors[field.name] ? 'error' : ''}`}
              placeholder={field.placeholder}
            />
          )}
          {errors[field.name] && (
            <p className="form-error">{errors[field.name]}</p>
          )}
        </div>
      ))}
      <button type="submit" className="btn btn-primary btn-block">
        {submitButtonText}
      </button>
    </form>
  );
}

export function Alert({ type = 'info', message, onClose }) {
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {message}
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>×</button>
      )}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}

export function EmptyState({ message = 'No data available', icon = '📭' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}
