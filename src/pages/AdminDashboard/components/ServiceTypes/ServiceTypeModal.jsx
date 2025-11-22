import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import './ServiceTypeModal.css';

/**
 * Modal for Add/Edit Service Type (Admin)
 * @param {Object} props
 * @param {boolean} props.show - Show/hide modal
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback
 * @param {Object} props.serviceType - Service type data (for edit mode)
 * @param {string} props.mode - 'add' | 'edit'
 * @param {boolean} props.saving - Saving state
 */
export const ServiceTypeModal = ({ show, onClose, onSave, serviceType, mode = 'add', saving = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationEst: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && serviceType) {
      setFormData({
        name: serviceType.name || '',
        description: serviceType.description || '',
        price: serviceType.price || '',
        durationEst: serviceType.durationEst || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        durationEst: ''
      });
    }
    setErrors({});
  }, [mode, serviceType, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên gói bảo dưỡng là bắt buộc';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    if (!formData.durationEst || parseInt(formData.durationEst) <= 0) {
      newErrors.durationEst = 'Thời gian ước tính phải > 0 (phút)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate() || saving) {
      return;
    }

    const dataToSave = {
      ...(mode === 'edit' && serviceType && { id: serviceType.id }),
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      durationEst: parseInt(formData.durationEst)
    };

    onSave(dataToSave);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'add' ? '➕ Thêm gói bảo dưỡng mới' : '✏️ Chỉnh sửa gói bảo dưỡng'}</h2>
          <button className="close-btn" onClick={onClose} disabled={saving}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>
              Tên gói bảo dưỡng <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Bảo dưỡng định kỳ 10.000 km"
              className={errors.name ? 'error' : ''}
              disabled={saving}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về gói bảo dưỡng..."
              rows={3}
              disabled={saving}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Giá (VNĐ) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                step="1000"
                min="0"
                className={errors.price ? 'error' : ''}
                disabled={saving}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label>
                Thời gian ước tính (phút) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="durationEst"
                value={formData.durationEst}
                onChange={handleChange}
                placeholder="60"
                min="1"
                className={errors.durationEst ? 'error' : ''}
                disabled={saving}
              />
              {errors.durationEst && <span className="error-message">{errors.durationEst}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={saving}>
              Hủy
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              <FaSave />
              {saving ? 'Đang lưu...' : (mode === 'add' ? 'Thêm gói' : 'Lưu thay đổi')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

