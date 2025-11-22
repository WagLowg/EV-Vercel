import React from 'react';
import { FaTools, FaCheckCircle, FaClock, FaClipboardCheck } from 'react-icons/fa';
import './MaintenanceStats.css';

/**
 * MaintenanceStats Component
 * Displays statistics cards for maintenance overview
 */
export const MaintenanceStats = ({ stats }) => {
  return (
    <div className="maintenance-stats-grid">
      <div className="maintenance-stat-card total">
        <div className="stat-icon-wrapper">
          <FaTools />
        </div>
        <div className="stat-info">
          <h3>{stats.totalRecords || 0}</h3>
          <p>Tổng bảo dưỡng</p>
        </div>
      </div>
      
      <div className="maintenance-stat-card completed">
        <div className="stat-icon-wrapper">
          <FaCheckCircle />
        </div>
        <div className="stat-info">
          <h3>{stats.completedRecords || 0}</h3>
          <p>Đã hoàn thành</p>
        </div>
      </div>
      
      <div className="maintenance-stat-card pending">
        <div className="stat-icon-wrapper">
          <FaClock />
        </div>
        <div className="stat-info">
          <h3>{stats.pendingRecords || 0}</h3>
          <p>Đang thực hiện</p>
        </div>
      </div>

      <div className="maintenance-stat-card checklist">
        <div className="stat-icon-wrapper">
          <FaClipboardCheck />
        </div>
        <div className="stat-info">
          <h3>{stats.checklistItems || 0}</h3>
          <p>Hạng mục kiểm tra</p>
        </div>
      </div>
    </div>
  );
};

