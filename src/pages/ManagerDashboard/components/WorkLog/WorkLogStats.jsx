import React from 'react';
import { FaClipboardList, FaClock, FaCheckCircle } from 'react-icons/fa';
import './WorkLogStats.css';

/**
 * WorkLogStats Component
 * Displays statistics cards for worklog overview
 */
export const WorkLogStats = ({ stats }) => {
  return (
    <div className="worklog-stats-grid">
      <div className="worklog-stat-card total">
        <div className="stat-icon-wrapper">
          <FaClipboardList />
        </div>
        <div className="stat-info">
          <h3>{stats.totalLogs || 0}</h3>
          <p>Tổng WorkLog</p>
        </div>
      </div>
      
      <div className="worklog-stat-card hours">
        <div className="stat-icon-wrapper">
          <FaClock />
        </div>
        <div className="stat-info">
          <h3>{typeof stats.totalHours === 'number' ? stats.totalHours.toFixed(2) : (stats.totalHours || 0)}</h3>
          <p>Tổng giờ làm</p>
        </div>
      </div>
      
      <div className="worklog-stat-card completed">
        <div className="stat-icon-wrapper">
          <FaCheckCircle />
        </div>
        <div className="stat-info">
          <h3>{stats.completedTasks || 0}</h3>
          <p>Công việc hoàn thành</p>
        </div>
      </div>
    </div>
  );
};

