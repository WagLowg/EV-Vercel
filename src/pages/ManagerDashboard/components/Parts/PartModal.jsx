import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import './PartModal.css';

/**
 * Modal for Add/Edit Part
 * @param {Object} props
 * @param {boolean} props.show - Show/hide modal
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback
 * @param {Object} props.part - Part data (for edit mode)
 * @param {string} props.mode - 'add' | 'edit'
 */
export const PartModal = ({ show, onClose, onSave, part, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitPrice: '',
    minStockLevel: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && part) {
      setFormData({
        name: part.name || '',
        description: part.description || '',
        unitPrice: part.unitPrice || '',
        minStockLevel: part.minStockLevel || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        unitPrice: '',
        minStockLevel: ''
      });
    }
    setErrors({});
  }, [mode, part, show]);

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
      newErrors.name = 'Tên phụ tùng là bắt buộc';
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Giá phải lớn hơn 0';
    }

    if (!formData.minStockLevel || parseInt(formData.minStockLevel) < 0) {
      newErrors.minStockLevel = 'Tồn kho tối thiểu phải >= 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const dataToSave = {
      ...(mode === 'edit' && part && { id: part.id }),
      name: formData.name.trim(),
      description: formData.description.trim(),
      unitPrice: parseFloat(formData.unitPrice),
      minStockLevel: parseInt(formData.minStockLevel)
    };

    onSave(dataToSave);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'add' ? '➕ Thêm phụ tùng mới' : '✏️ Chỉnh sửa phụ tùng'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>
              Tên phụ tùng <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Lốp xe Michelin 205/55R16"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về phụ tùng..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Giá (VNĐ) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="0"
                step="1000"
                min="0"
                className={errors.unitPrice ? 'error' : ''}
              />
              {errors.unitPrice && <span className="error-message">{errors.unitPrice}</span>}
            </div>

            <div className="form-group">
              <label>
                Tồn kho tối thiểu <span className="required">*</span>
              </label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={errors.minStockLevel ? 'error' : ''}
              />
              {errors.minStockLevel && <span className="error-message">{errors.minStockLevel}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="save-btn">
              <FaSave />
              {mode === 'add' ? 'Thêm phụ tùng' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
