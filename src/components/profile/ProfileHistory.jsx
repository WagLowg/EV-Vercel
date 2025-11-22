import React from "react";
import {
  FaCalendarAlt,
  FaCar,
  FaMapMarkerAlt,
  FaTools,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCheck,
} from "react-icons/fa";

const getStatusIcon = (status) => {
  switch (status) {
    case "Hoàn thành":
      return <FaCheckCircle />;
    case "Đã xác nhận":
      return <FaCheck />;
    case "Đang thực hiện":
      return <FaTools />;
    case "Đang xử lý":
      return <FaClock />;
    case "Chờ xác nhận":
      return <FaClock />;
    case "Đã hủy":
      return <FaTimesCircle />;
    default:
      return <FaClock />;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Hoàn thành":
      return "booking-card-completed";
    case "Đã xác nhận":
      return "booking-card-accepted";
    case "Đang thực hiện":
      return "booking-card-in-progress";
    case "Đang xử lý":
      return "booking-card-processing";
    case "Chờ xác nhận":
      return "booking-card-pending";
    case "Đã hủy":
      return "booking-card-cancelled";
    default:
      return "booking-card-processing";
  }
};

const ProfileHistory = ({ bookingHistory, loading, error, onRetry }) => {
  // Loading state
  if (loading) {
    return (
      <div className="profile-section">
        <div className="section-header">
          <h2>Lịch sử đặt lịch</h2>
        </div>
        <div className="booking-history-new">
          <div className="history-loading-state">
            <div className="history-loading-spinner" />
            <p>Đang tải lịch sử đặt lịch...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-section">
        <div className="section-header">
          <h2>Lịch sử đặt lịch</h2>
        </div>
        <div className="booking-history-new">
          <div className="history-error-state">
            <FaTimesCircle size={48} />
            <p className="history-error-message">❌ {error}</p>
            {onRetry && (
              <button onClick={onRetry} className="retry-btn">
                Thử lại
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success state with data
  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Lịch sử đặt lịch</h2>
        <div className="history-stats">
          <span className="stat-item">
            Tổng: <strong>{bookingHistory.length}</strong>
          </span>
        </div>
      </div>

      <div className="booking-history-new">
        {bookingHistory.length > 0 ? (
          <div className="booking-cards-grid">
            {bookingHistory.map((booking) => (
              <div
                key={booking.id}
                className={`booking-card ${getStatusClass(booking.status)}`}
              >
                {/* Status Badge */}
                <div className="booking-card-status">
                  {getStatusIcon(booking.status)}
                  <span>{booking.status}</span>
                </div>

                {/* Date Badge */}
                <div className="booking-card-date">
                  <FaCalendarAlt />
                  <span>{booking.date}</span>
                </div>

                {/* Service Info */}
                <div className="booking-card-section">
                  <div className="booking-card-icon">
                    <FaTools />
                  </div>
                  <div className="booking-card-content">
                    <label>Dịch vụ</label>
                    <p>{booking.service}</p>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="booking-card-section">
                  <div className="booking-card-icon">
                    <FaCar />
                  </div>
                  <div className="booking-card-content">
                    <label>Xe</label>
                    <p>{booking.vehicleModel}</p>
                  </div>
                </div>

                {/* Branch Info */}
                <div className="booking-card-section">
                  <div className="booking-card-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="booking-card-content">
                    <label>Chi nhánh</label>
                    <p>{booking.serviceCenterName}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="booking-card-footer">
                  <span className="booking-card-price">{booking.price}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-history">
            <FaCalendarAlt size={60} />
            <p>Chưa có lịch sử đặt lịch</p>
            <span className="empty-history-subtitle">
              Các lịch đặt của bạn sẽ xuất hiện ở đây
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHistory;

