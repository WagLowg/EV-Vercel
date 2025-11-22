import React, { useMemo } from 'react';
import { FaUsers, FaUserTie, FaUserCog, FaWrench, FaUser } from 'react-icons/fa';
import './UsersStats.css';

export const UsersStats = ({ users }) => {
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const customers = users.filter(u => u.role?.toUpperCase() === 'CUSTOMER').length;
    const managers = users.filter(u => u.role?.toUpperCase() === 'MANAGER').length;
    const staff = users.filter(u => u.role?.toUpperCase() === 'STAFF').length;
    const technicians = users.filter(u => u.role?.toUpperCase() === 'TECHNICIAN').length;
    
    return [
      {
        icon: FaUsers,
        label: 'Tổng người dùng',
        value: totalUsers,
        gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
      },
      {
        icon: FaUser,
        label: 'Khách hàng',
        value: customers,
        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
      },
      {
        icon: FaUserTie,
        label: 'Quản lý',
        value: managers,
        gradient: 'linear-gradient(135deg, #ec4899, #db2777)'
      },
      {
        icon: FaUserCog,
        label: 'Nhân viên',
        value: staff,
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
      },
      {
        icon: FaWrench,
        label: 'Kỹ thuật viên',
        value: technicians,
        gradient: 'linear-gradient(135deg, #10b981, #059669)'
      }
    ];
  }, [users]);

  return (
    <div className="users-stats-container">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="users-stat-card">
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

