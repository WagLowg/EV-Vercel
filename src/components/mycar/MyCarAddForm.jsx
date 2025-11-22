import React, { useState } from "react";
import { FaCar, FaSave } from "react-icons/fa";

const MyCarAddForm = ({ onAdd, saving }) => {
  const [formData, setFormData] = useState({
    licensePlate: "",
    model: "",
    vin: "",
    year: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="profile-main">
      <div className="form-section">
        <h2 className="section-title">
          <FaCar style={{ marginRight: '10px' }} />
          Thêm xe mới
        </h2>
        <p className="section-subtitle">
          Điền thông tin xe của bạn để dễ dàng quản lý và đặt lịch bảo dưỡng
        </p>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="licensePlate">
                Biển số xe <span className="required">*</span>
              </label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                placeholder="Ví dụ: 51A-12345"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">
                Model xe <span className="required">*</span>
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Ví dụ: Honda Civic"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vin">
                Số VIN
              </label>
              <input
                type="text"
                id="vin"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="17 ký tự"
                maxLength="17"
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">
                Năm sản xuất
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Ví dụ: 2020"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="btn-spinner" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <FaSave />
                  Thêm xe
                </>
              )}
            </button>
          </div>
        </form>

        <div className="info-box">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
          <div>
            <strong>Lưu ý:</strong>
            <ul>
              <li>Biển số xe và Model là thông tin bắt buộc</li>
              <li>Số VIN giúp xác định chính xác xe của bạn</li>
              <li>Thông tin này sẽ được sử dụng khi đặt lịch bảo dưỡng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCarAddForm;

