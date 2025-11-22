import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './CentersModal.css';

export const CentersModal = ({ mode, center, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (center) {
      setFormData({
        name: center.name || '',
        address: center.address || '',
        email: center.email || '',
        phone: center.phone || ''
      });
    }
  }, [center]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Thêm trung tâm mới' : 'Chỉnh sửa trung tâm'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Tên trung tâm <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nhập tên trung tâm"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Địa chỉ <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Nhập địa chỉ"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="center@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Số điện thoại <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="0123456789"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              {mode === 'add' ? 'Thêm trung tâm' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

