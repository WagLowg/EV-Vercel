import React from 'react';
import { 
  FaMoneyBillWave, 
  FaUser, 
  FaCar, 
  FaCalendarAlt, 
  FaClock, 
  FaTools, 
  FaTimes, 
  FaCheckCircle, 
  FaUsers,
  FaChartPie
} from 'react-icons/fa';
import { SimpleSection } from './SimpleSection';
import './OverviewStats.css';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0);
};

export const OverviewStats = ({ stats }) => {
  return (
    <SimpleSection 
      title="Thống kê nhanh" 
      icon={<FaChartPie />}
    >
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Tổng doanh thu</p>
            <span className="stat-trend positive">↑ Real-time</span>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingAppointments}</h3>
            <p>Chờ xử lý</p>
            <span className="stat-detail status-pending">Cần xác nhận</span>
          </div>
        </div>
        
        <div className="stat-card in-progress">
          <div className="stat-icon">
            <FaTools />
          </div>
          <div className="stat-info">
            <h3>{stats.inProgressAppointments}</h3>
            <p>Đang bảo dưỡng</p>
            <span className="stat-detail status-progress">Đang làm việc</span>
          </div>
        </div>
        
        <div className="stat-card completed">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.completedAppointments}</h3>
            <p>Thành công</p>
            <span className="stat-detail status-done">Hoàn thành</span>
          </div>
        </div>
        
        <div className="stat-card cancelled">
          <div className="stat-icon">
            <FaTimes />
          </div>
          <div className="stat-info">
            <h3>{stats.cancelledAppointments}</h3>
            <p>Đã hủy</p>
            <span className="stat-detail status-cancelled">Không thực hiện</span>
          </div>
        </div>
        
        <div className="stat-card technician">
          <div className="stat-icon">
            <FaTools />
          </div>
          <div className="stat-info">
            <h3>{stats.activeTechnicians}</h3>
            <p>Kỹ thuật viên</p>
            <span className="stat-detail">Đang hoạt động</span>
          </div>
        </div>
        
        <div className="stat-card staff">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{stats.activeStaff}</h3>
            <p>Nhân viên</p>
            <span className="stat-detail">Đang hoạt động</span>
          </div>
        </div>
      </div>
    </SimpleSection>
  );
};
