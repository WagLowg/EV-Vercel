import React from 'react';
import { 
  FaUsers, FaUserTie, FaUserCog, FaWrench, 
  FaCar, FaCalendarAlt, FaClock, FaCheckCircle,
  FaMoneyBillWave, FaChartLine
} from 'react-icons/fa';
import './OverviewStats.css';

export const OverviewStats = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  // Users stats
  const userStats = [
    { 
      icon: FaUsers, 
      label: 'Tổng người dùng', 
      value: data.totalUsers || 0,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    },
    { 
      icon: FaUserTie, 
      label: 'Quản lý', 
      value: data.totalManagers || 0,
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    },
    { 
      icon: FaUserCog, 
      label: 'Nhân viên', 
      value: data.totalStaff || 0,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    },
    { 
      icon: FaWrench, 
      label: 'Kỹ thuật viên', 
      value: data.totalTechnicians || 0,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    }
  ];

  // Business stats
  const businessStats = [
    { 
      icon: FaCar, 
      label: 'Tổng số xe', 
      value: data.totalVehicles || 0,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    { 
      icon: FaCalendarAlt, 
      label: 'Tổng lịch hẹn', 
      value: data.totalAppointments || 0,
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    },
    { 
      icon: FaClock, 
      label: 'Đang chờ', 
      value: data.pendingAppointments || 0,
      gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
    },
    { 
      icon: FaCheckCircle, 
      label: 'Hoàn thành', 
      value: data.completedAppointments || 0,
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    }
  ];

  // Finance stats
  const financeStats = [
    { 
      icon: FaMoneyBillWave, 
      label: 'Doanh thu tháng này', 
      value: `${formatCurrency(data.revenue?.thisMonth || 0)} ₫`,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    },
    { 
      icon: FaChartLine, 
      label: 'Lợi nhuận tháng này', 
      value: `${formatCurrency(data.profit?.thisMonth || 0)} ₫`,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    }
  ];

  const renderStatCard = (stat, index) => {
    const Icon = stat.icon;
    return (
      <div key={index} className="overview-stat-card">
        <div className="stat-icon" style={{ background: stat.gradient }}>
          <Icon />
        </div>
        <div className="stat-content">
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="overview-stats-container">
      {/* Users Section */}
      <div className="stats-section">
        <div className="section-header">
          <h3 className="section-title">Người dùng</h3>
          <FaUsers className="section-icon" />
        </div>
        <div className="stats-grid">
          {userStats.map((stat, index) => renderStatCard(stat, index))}
        </div>
      </div>

      {/* Business Section */}
      <div className="stats-section">
        <div className="section-header">
          <h3 className="section-title">Hoạt động kinh doanh</h3>
          <FaCar className="section-icon" />
        </div>
        <div className="stats-grid">
          {businessStats.map((stat, index) => renderStatCard(stat, index))}
        </div>
      </div>

      {/* Finance Section */}
      <div className="stats-section">
        <div className="section-header">
          <h3 className="section-title">Tài chính</h3>
          <FaMoneyBillWave className="section-icon" />
        </div>
        <div className="stats-grid finance-grid">
          {financeStats.map((stat, index) => renderStatCard(stat, index))}
        </div>
      </div>
    </div>
  );
};

