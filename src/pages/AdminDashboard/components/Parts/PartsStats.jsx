import React, { useMemo } from 'react';
import { FaWarehouse } from 'react-icons/fa';
import './PartsStats.css';

export const PartsStats = ({ parts }) => {
  const stats = useMemo(() => {
    const totalParts = parts.length;
    
    return [
      {
        icon: FaWarehouse,
        label: 'Tổng phụ tùng',
        value: totalParts,
        gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
      }
    ];
  }, [parts]);

  return (
    <div className="parts-stats-container">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="parts-stat-card">
            <div className="stat-icon" style={{ background: stat.gradient }}>
              <Icon />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

