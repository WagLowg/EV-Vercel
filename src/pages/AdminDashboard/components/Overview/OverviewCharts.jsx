import React from 'react';
import { FaArrowUp, FaArrowDown, FaCircle } from 'react-icons/fa';
import './OverviewCharts.css';

export const OverviewCharts = ({ data }) => {
  // Appointments by status - Calculate real percentages
  const totalAppts = data.totalAppointments || 0;
  const completedCount = data.completedAppointments || 0;
  const pendingCount = data.pendingAppointments || 0;
  const processingCount = totalAppts - completedCount - pendingCount;
  
  const appointmentStats = [
    { 
      status: 'Hoàn thành', 
      count: completedCount, 
      color: '#22c55e', 
      percentage: totalAppts > 0 ? Math.round((completedCount / totalAppts) * 100) : 0
    },
    { 
      status: 'Đang chờ', 
      count: pendingCount, 
      color: '#eab308', 
      percentage: totalAppts > 0 ? Math.round((pendingCount / totalAppts) * 100) : 0
    },
    { 
      status: 'Đang xử lý', 
      count: Math.max(processingCount, 0), 
      color: '#3b82f6', 
      percentage: totalAppts > 0 ? Math.round((processingCount / totalAppts) * 100) : 0
    }
  ].filter(item => item.count > 0); // Only show categories with data

  // User distribution - Calculate real percentages
  const totalUsers = data.totalUsers || 0;
  const customersCount = data.totalCustomers || 0;
  const techniciansCount = data.totalTechnicians || 0;
  const staffCount = data.totalStaff || 0;
  const managersCount = data.totalManagers || 0;
  
  const userDistribution = [
    { 
      role: 'Khách hàng', 
      count: customersCount, 
      color: '#8b5cf6', 
      percentage: totalUsers > 0 ? Math.round((customersCount / totalUsers) * 100) : 0
    },
    { 
      role: 'Kỹ thuật viên', 
      count: techniciansCount, 
      color: '#10b981', 
      percentage: totalUsers > 0 ? Math.round((techniciansCount / totalUsers) * 100) : 0
    },
    { 
      role: 'Nhân viên', 
      count: staffCount, 
      color: '#3b82f6', 
      percentage: totalUsers > 0 ? Math.round((staffCount / totalUsers) * 100) : 0
    },
    { 
      role: 'Quản lý', 
      count: managersCount, 
      color: '#ec4899', 
      percentage: totalUsers > 0 ? Math.round((managersCount / totalUsers) * 100) : 0
    }
  ].filter(item => item.count > 0); // Only show roles with users

  return (
    <div className="overview-charts-container">
      {/* Appointments Status */}
      <div className="chart-card appointments-chart">
        <div className="chart-header">
          <div>
            <h3>Trạng thái lịch hẹn</h3>
            <p>Phân bố theo trạng thái</p>
          </div>
        </div>
        <div className="chart-content">
          <div className="horizontal-bars">
            {appointmentStats.map((item, index) => (
              <div key={index} className="h-bar-item">
                <div className="h-bar-info">
                  <span className="h-bar-label">{item.status}</span>
                  <span className="h-bar-value">{item.count} lịch</span>
                </div>
                <div className="h-bar-track">
                  <div 
                    className="h-bar-fill"
                    style={{ 
                      width: `${item.percentage}%`,
                      background: item.color
                    }}
                  >
                    <span className="h-bar-percentage">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Distribution */}
      <div className="chart-card users-chart">
        <div className="chart-header">
          <div>
            <h3>Phân bố người dùng</h3>
            <p>Theo vai trò trong hệ thống</p>
          </div>
        </div>
        <div className="chart-content">
          <div className="donut-chart-wrapper">
            <svg className="donut-chart" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" strokeWidth="40" />
              {userDistribution.reduce((acc, item, index) => {
                const previousPercentage = userDistribution.slice(0, index).reduce((sum, i) => sum + i.percentage, 0);
                const circumference = 2 * Math.PI * 80;
                const offset = circumference - (previousPercentage / 100) * circumference;
                const dashArray = `${(item.percentage / 100) * circumference} ${circumference}`;
                
                acc.push(
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="40"
                    strokeDasharray={dashArray}
                    strokeDashoffset={-offset}
                    transform="rotate(-90 100 100)"
                  />
                );
                return acc;
              }, [])}
              <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="700" fill="#1a1a2e">
                {data.totalUsers || 0}
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#64748b">
                Người dùng
              </text>
            </svg>
            <div className="donut-legend">
              {userDistribution.map((item, index) => (
                <div key={index} className="donut-legend-item">
                  <FaCircle style={{ color: item.color, fontSize: '10px' }} />
                  <span className="legend-label">{item.role}</span>
                  <span className="legend-value">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="chart-card insights-card">
        <div className="chart-header">
          <div>
            <h3>Thông tin nổi bật</h3>
            <p>Các chỉ số quan trọng</p>
          </div>
        </div>
        <div className="chart-content">
          <div className="insights-list">
            {data.revenue?.percentChange !== undefined && data.revenue.percentChange !== 0 && (
              <div className={`insight-item ${data.revenue.percentChange > 0 ? 'positive' : 'negative'}`}>
                <div className="insight-icon">
                  {data.revenue.percentChange > 0 ? <FaArrowUp /> : <FaArrowDown />}
                </div>
                <div className="insight-info">
                  <div className="insight-label">Doanh thu tháng này</div>
                  <div className="insight-value">
                    {data.revenue.percentChange > 0 ? '+' : ''}{Math.abs(data.revenue.percentChange)}% so với tháng trước
                  </div>
                </div>
              </div>
            )}

            {data.totalAppointments > 0 && (
              <div className="insight-item positive">
                <div className="insight-icon">
                  <FaArrowUp />
                </div>
                <div className="insight-info">
                  <div className="insight-label">Tỷ lệ hoàn thành</div>
                  <div className="insight-value">
                    {Math.round((data.completedAppointments / data.totalAppointments) * 100)}% lịch hẹn
                  </div>
                </div>
              </div>
            )}

            {data.totalCenters > 0 && (
              <div className="insight-item neutral">
                <div className="insight-icon">
                  <FaCircle />
                </div>
                <div className="insight-info">
                  <div className="insight-label">Trung tâm hoạt động</div>
                  <div className="insight-value">{data.totalCenters} trung tâm</div>
                </div>
              </div>
            )}

            {data.pendingAppointments > 0 && (
              <div className="insight-item warning">
                <div className="insight-icon">
                  <FaCircle />
                </div>
                <div className="insight-info">
                  <div className="insight-label">Lịch hẹn đang chờ</div>
                  <div className="insight-value">{data.pendingAppointments} cần xử lý</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

