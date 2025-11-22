import React from 'react';
import { FaWarehouse } from 'react-icons/fa';
import './PartsStats.css';

export const PartsStats = ({ stats }) => {
  return (
    <div className="parts-stats-container">
      {/* Tổng phụ tùng - Single card với design đẹp hơn */}
      <div className="parts-stat-card total-parts single-card">
        <div className="stat-icon-large">
          <FaWarehouse />
        </div>
        <div className="stat-content-large">
          <div className="stat-value-large">{stats.totalParts || 0}</div>
          <div className="stat-label-large">Tổng số phụ tùng trong kho</div>
          <div className="stat-description">Quản lý tồn kho phụ tùng của trung tâm</div>
        </div>
      </div>
    </div>
  );
};

