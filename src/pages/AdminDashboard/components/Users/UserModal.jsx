import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './UserModal.css';

export const UserModal = ({ mode, user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    role: 'STAFF',
    password: '',
    confirmPassword: '',
    serviceCenterId: '',
    certificateFile: null
  });

  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        address: user.address || '',
        role: user.role || 'STAFF',
        password: '',
        confirmPassword: '',
        serviceCenterId: user.serviceCenterId || user.centerId || '',
        certificateFile: null
      });
      if (user.certificateLink) {
        setFilePreview(user.certificateLink);
      }
    }
  }, [mode, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (10-11 chữ số)';
    }

    // ✅ Validate Service Center ID (chỉ bắt buộc với employee roles)
    if (formData.role !== 'CUSTOMER') {
      if (!formData.serviceCenterId || formData.serviceCenterId === '') {
        newErrors.serviceCenterId = 'Service Center ID không được để trống';
      } else if (parseInt(formData.serviceCenterId) < 1) {
        newErrors.serviceCenterId = 'Service Center ID phải lớn hơn 0';
      }
    }

    if (mode === 'add') {
      if (!formData.password) {
        newErrors.password = 'Mật khẩu không được để trống';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Remove confirmPassword and certificateFile before sending
    const { confirmPassword, certificateFile, ...dataToSend } = formData;
    
    // Remove password if editing and password is empty
    if (mode === 'edit' && !formData.password) {
      delete dataToSend.password;
    }

    // ✅ Pass both data and file to parent
    onSave(dataToSend, certificateFile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (PDF, images)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          certificateFile: 'Chỉ chấp nhận file PDF hoặc ảnh (JPG, PNG)'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          certificateFile: 'File không được vượt quá 5MB'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        certificateFile: file
      }));
      
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors(prev => ({
        ...prev,
        certificateFile: ''
      }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}</h2>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Full Name */}
          <div className="form-group">
            <label>
              Họ tên <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              disabled={mode === 'edit'} // Email không được sửa
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label>
              Số điện thoại <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="0912345678"
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>

          

          {/* Role */}
          <div className="form-group">
            <label>
              Vai trò <span style={{color: 'red'}}>*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
            
              <option value="STAFF">Nhân viên (Staff)</option>
              <option value="MANAGER">Quản lý (Manager)</option>
              <option value="TECHNICIAN">Kỹ thuật viên (Technician)</option>
            </select>
          </div>

          {/* Service Center ID - only for employees (not customer) */}
          {formData.role !== 'CUSTOMER' && (
            <div className="form-group">
              <label>
                Service Center ID <span style={{color: 'red'}}>*</span>
              </label>
              <input
                type="number"
                name="serviceCenterId"
                value={formData.serviceCenterId}
                onChange={handleChange}
                placeholder="Nhập ID của Service Center (VD: 1)"
                min="1"
              />
              {errors.serviceCenterId && <span className="error-message">{errors.serviceCenterId}</span>}
              <small style={{color: '#6b7280', display: 'block', marginTop: '4px'}}>
                💡 Nhập ID của Service Center mà nhân viên này thuộc về
              </small>
            </div>
          )}

          {/* Certificate File Upload (for Technician) */}
          {formData.role === 'TECHNICIAN' && (
            <div className="form-group">
              <label>
                Chứng chỉ (Certificate)
              </label>
              <div style={{
                border: '2px dashed #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                background: '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.background = '#f0f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = '#f9fafb';
              }}
              onClick={() => document.getElementById('certificate-upload').click()}
              >
                <input
                  id="certificate-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {filePreview ? (
                  <div style={{marginTop: '8px'}}>
                    {formData.certificateFile?.type?.startsWith('image/') || filePreview?.startsWith('data:image') ? (
                      <div>
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', marginBottom: '8px'}}
                        />
                        <p style={{color: '#667eea', fontSize: '14px', margin: '8px 0'}}>
                          ✅ {formData.certificateFile?.name || 'Chứng chỉ đã tải lên'}
                        </p>
                        <p style={{color: '#6b7280', fontSize: '13px'}}>
                          Click để thay đổi
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div style={{fontSize: '48px', marginBottom: '8px'}}>📄</div>
                        <p style={{color: '#667eea', fontSize: '14px', margin: '8px 0'}}>
                          ✅ {formData.certificateFile?.name || 'File đã tải lên'}
                        </p>
                        <a href={filePreview} target="_blank" rel="noopener noreferrer" style={{color: '#667eea', fontSize: '13px'}}>
                          Xem file
                        </a>
                        <p style={{color: '#6b7280', fontSize: '13px', marginTop: '8px'}}>
                          Click để thay đổi
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div style={{fontSize: '48px', marginBottom: '8px'}}>📤</div>
                    <p style={{color: '#374151', fontSize: '16px', fontWeight: '600', margin: '8px 0'}}>
                      Click để tải lên chứng chỉ
                    </p>
                    <p style={{color: '#6b7280', fontSize: '13px'}}>
                      📎 PDF, JPG, PNG (tối đa 5MB)
                    </p>
                  </div>
                )}
              </div>
              {errors.certificateFile && <span className="error-message">{errors.certificateFile}</span>}
            </div>
          )}

          {/* Password (only for add mode) */}
          {mode === 'add' && (
            <>
              <div className="form-group">
                <label>
                  Mật khẩu <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tối thiểu 6 ký tự"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>
                  Xác nhận mật khẩu <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </>
          )}

          {mode === 'edit' && (
            <div style={{padding: '12px', background: '#fef3c7', borderRadius: '8px', marginBottom: '16px'}}>
              <p style={{margin: 0, fontSize: '14px', color: '#92400e'}}>
                💡 <strong>Lưu ý:</strong> Email không thể thay đổi. Để đổi mật khẩu, vui lòng sử dụng chức năng "Đổi mật khẩu" riêng.
              </p>
            </div>
          )}

          <div className="modal-footer" style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: '#e5e7eb',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {mode === 'add' ? '➕ Thêm' : '💾 Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
