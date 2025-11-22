import React, { useEffect } from 'react';
import { 
  FaClock, FaCheckCircle, FaUserPlus, FaCar, 
  FaCalendarAlt, FaMapMarkerAlt, FaUser
} from 'react-icons/fa';
import { useRecentActivity } from '../../hooks/useRecentActivity';
import './OverviewActivity.css';

export const OverviewActivity = () => {
  const { recentAppointments, recentUsers, loading, fetchRecentActivity } = useRecentActivity();

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED':
      case 'DONE':
        return '#22c55e';
      case 'PENDING':
        return '#eab308';
      case 'PROCESSING':
      case 'IN_PROGRESS':
        return '#3b82f6';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Chờ xử lý';
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED':
      case 'DONE':
        return 'Hoàn thành';
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PROCESSING':
      case 'IN_PROGRESS':
        return 'Đang xử lý';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return 'Chờ xử lý';
    }
  };

  const getRoleBadgeColor = (role) => {
    const roleUpper = role?.toUpperCase();
    switch (roleUpper) {
      case 'CUSTOMER':
        return '#8b5cf6';
      case 'TECHNICIAN':
        return '#10b981';
      case 'STAFF':
        return '#3b82f6';
      case 'MANAGER':
        return '#ec4899';
      case 'ADMIN':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getRoleText = (role) => {
    if (!role) return '';
    const roleUpper = role?.toUpperCase();
    switch (roleUpper) {
      case 'CUSTOMER':
        return 'Khách hàng';
      case 'TECHNICIAN':
        return 'Kỹ thuật viên';
      case 'STAFF':
        return 'Nhân viên';
      case 'MANAGER':
        return 'Quản lý';
      case 'ADMIN':
        return 'Admin';
      default:
        return '';
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return '';
    }
  };

  const getUserAvatar = (role) => {
    const roleUpper = role?.toUpperCase();
    switch (roleUpper) {
      case 'CUSTOMER':
        return '👤';
      case 'TECHNICIAN':
        return '👨‍🔧';
      case 'STAFF':
        return '👨‍💼';
      case 'MANAGER':
        return '👩‍💼';
      case 'ADMIN':
        return '👑';
      default:
        return '👤';
    }
  };

  if (loading) {
    return (
      <div className="overview-activity-container">
        <div className="activity-card">
          <div className="activity-loading">
            <div className="loading-spinner-small"></div>
            <p>Đang tải hoạt động gần đây...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-activity-container">
      {/* Recent Appointments */}
      <div className="activity-card">
        <div className="activity-header">
          <div className="header-icon appointments">
            <FaCalendarAlt />
          </div>
          <div>
            <h3>Lịch hẹn gần đây</h3>
            <p>Các lịch hẹn mới nhất trong hệ thống</p>
          </div>
        </div>
        <div className="activity-list">
          {recentAppointments.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có lịch hẹn nào</p>
            </div>
          ) : (
            recentAppointments.map((appointment) => (
              <div key={appointment.id} className="activity-item appointment-item">
                <div className="item-icon" style={{ background: `${getStatusColor(appointment.status)}20` }}>
                  <FaClock style={{ color: getStatusColor(appointment.status) }} />
                </div>
                <div className="item-content">
                  <div className="item-header">
                    <span className="item-title">
                      {appointment.customerName || appointment.customer?.fullName || 'Khách hàng'}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ 
                        background: `${getStatusColor(appointment.status)}20`,
                        color: getStatusColor(appointment.status)
                      }}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  <div className="item-details">
                    {(appointment.vehiclePlate || appointment.vehicle?.licensePlate) && (
                      <span className="detail-item">
                        <FaCar /> {appointment.vehiclePlate || appointment.vehicle?.licensePlate}
                      </span>
                    )}
                    {(appointment.centerName || appointment.centerId) && (
                      <span className="detail-item">
                        <FaMapMarkerAlt /> {appointment.centerName || `Trung tâm #${appointment.centerId}`}
                      </span>
                    )}
                  </div>
                  <div className="item-meta">
                    {(appointment.serviceName || appointment.packageName) && (
                      <span className="service-name">
                        {appointment.serviceName || appointment.packageName}
                      </span>
                    )}
                    <span className="time-ago">
                      {getTimeAgo(appointment.appointmentDate || appointment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="activity-card">
        <div className="activity-header">
          <div className="header-icon users">
            <FaUserPlus />
          </div>
          <div>
            <h3>Người dùng mới</h3>
            <p>Tài khoản đăng ký gần đây</p>
          </div>
        </div>
        <div className="activity-list">
          {recentUsers.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có người dùng mới</p>
            </div>
          ) : (
            recentUsers.map((user) => (
              <div key={user.id} className="activity-item user-item">
                <div className="user-avatar">
                  {getUserAvatar(user.role)}
                </div>
                <div className="item-content">
                  <div className="item-header">
                    <span className="item-title">{user.fullName || user.username || 'User'}</span>
                    {user.role && (
                      <span 
                        className="role-badge"
                        style={{ 
                          background: `${getRoleBadgeColor(user.role)}20`,
                          color: getRoleBadgeColor(user.role)
                        }}
                      >
                        {getRoleText(user.role)}
                      </span>
                    )}
                  </div>
                  <div className="item-meta">
                    {(user.email || user.username) && (
                      <span className="email-text">
                        <FaUser /> {user.email || user.username}
                      </span>
                    )}
                    <span className="time-ago">{getTimeAgo(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
