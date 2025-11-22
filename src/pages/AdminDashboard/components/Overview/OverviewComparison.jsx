import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './OverviewComparison.css';

export const OverviewComparison = ({ revenue }) => {
  if (!revenue || revenue.percentChange === 0) {
    return null;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value || 0);
  };

  const isPositive = revenue.percentChange > 0;

  return (
    <div className="overview-comparison-container">
      <div className="comparison-header">
        <h3>So sánh doanh thu</h3>
        <p>Thống kê doanh thu tháng hiện tại so với tháng trước</p>
      </div>

      <div className="comparison-content">
        <div className="comparison-item prev-month">
          <div className="comparison-label">Tháng trước</div>
          <div className="comparison-value">{formatCurrency(revenue.lastMonth)}</div>
        </div>

        <div className="comparison-arrow">
          <div className="arrow-icon">→</div>
        </div>

        <div className="comparison-item current-month">
          <div className="comparison-label">Tháng này</div>
          <div className="comparison-value current">{formatCurrency(revenue.thisMonth)}</div>
        </div>

        <div className={`comparison-change ${isPositive ? 'positive' : 'negative'}`}>
          <div className="change-icon">
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
          </div>
          <div className="change-value">{Math.abs(revenue.percentChange)}%</div>
          <div className="change-label">
            {isPositive ? 'Tăng trưởng' : 'Giảm'}
          </div>
        </div>
      </div>
    </div>
  );
};

