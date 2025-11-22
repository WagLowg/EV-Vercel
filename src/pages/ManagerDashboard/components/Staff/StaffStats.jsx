import React from 'react';
import { FaUserTie, FaUsers, FaUserCheck } from 'react-icons/fa';
import './StaffStats.css';

/**
 * StaffStats Component
 * Displays statistics cards for staff overview
 */
export const StaffStats = ({ stats }) => {
  return (
    <div className="staff-stats-grid">
      <div className="staff-stat-card technicians">
        <div className="stat-icon-wrapper">
          <FaUserTie />
        </div>
        <div className="stat-info">
          <h3>{stats.technicians}</h3>
          <p>Kỹ thuật viên</p>
        </div>
      </div>
      
      <div className="staff-stat-card staff-members">
        <div className="stat-icon-wrapper">
          <FaUsers />
        </div>
        <div className="stat-info">
          <h3>{stats.staff}</h3>
          <p>Nhân viên</p>
        </div>
      </div>
      
      <div className="staff-stat-card total">
        <div className="stat-icon-wrapper">
          <FaUserCheck />
        </div>
        <div className="stat-info">
          <h3>{stats.totalStaff}</h3>
          <p>Tổng nhân sự</p>
        </div>
      </div>
    </div>
  );
};
