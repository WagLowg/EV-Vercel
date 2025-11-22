import React from "react";
import { FaCar, FaCalendarAlt, FaTools } from "react-icons/fa";

const MyCarList = ({ vehicles, loading, error, onRetry, onBook }) => {
  if (loading) {
    return (
      <div className="profile-main">
        <div className="form-section">
          <div className="profile-loading-content">
            <div className="profile-loading-spinner" />
            <p>Đang tải danh sách xe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-main">
        <div className="form-section">
          <div className="error-state">
            <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64" style={{color: '#ef4444'}}>
              <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            <h3>Không thể tải danh sách xe</h3>
            <p>{error}</p>
            <button onClick={onRetry} className="btn-primary">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="profile-main">
        <div className="form-section">
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80" style={{color: '#9ca3af'}}>
              <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
            </svg>
            <h3>Chưa có xe nào</h3>
            <p>Thêm xe của bạn để dễ dàng đặt lịch bảo dưỡng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-main">
      <div className="form-section">
        <h2 className="section-title">Danh sách xe ({vehicles.length})</h2>
        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              <div className="vehicle-header">
                <div className="vehicle-icon">
                  <FaCar />
                </div>
                <div className="vehicle-title">
                  <h3>{vehicle.model || 'Chưa có thông tin'}</h3>
                  <span className="vehicle-plate">{vehicle.licensePlate || vehicle.vin}</span>
                </div>
              </div>
              
              <div className="vehicle-details">
                <div className="detail-row">
                  <span className="detail-label">Biển số xe:</span>
                  <span className="detail-value">{vehicle.licensePlate || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Model:</span>
                  <span className="detail-value">{vehicle.model || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">VIN:</span>
                  <span className="detail-value">{vehicle.vin || 'N/A'}</span>
                </div>
                {vehicle.year && (
                  <div className="detail-row">
                    <span className="detail-label">Năm sản xuất:</span>
                    <span className="detail-value">{vehicle.year}</span>
                  </div>
                )}
              </div>

              <button
                className="btn-book-vehicle"
                onClick={() => onBook(vehicle)}
              >
                <FaCalendarAlt />
                Đặt lịch bảo dưỡng
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCarList;

