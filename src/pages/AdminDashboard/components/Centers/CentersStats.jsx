import React, { useMemo } from 'react';
import { FaWarehouse, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import './CentersStats.css';

export const CentersStats = ({ centers }) => {
  const stats = useMemo(() => {
    const totalCenters = centers.length;
    const withEmail = centers.filter(c => c.email).length;
    const withPhone = centers.filter(c => c.phone).length;
    const withAddress = centers.filter(c => c.address).length;
    
    return [
      {
        icon: FaWarehouse,
        label: 'Tổng trung tâm',
        value: totalCenters,
        gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
      },
      {
        icon: FaMapMarkerAlt,
        label: 'Có địa chỉ',
        value: withAddress,
        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
      },
      {
        icon: FaEnvelope,
        label: 'Có email',
        value: withEmail,
        gradient: 'linear-gradient(135deg, #10b981, #059669)'
      },
      {
        icon: FaPhone,
        label: 'Có số điện thoại',
        value: withPhone,
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
      }
    ];
  }, [centers]);

  return (
    <div className="centers-stats-container">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="centers-stat-card">
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

