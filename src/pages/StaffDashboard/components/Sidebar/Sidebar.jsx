import React from 'react';
import { FaUser, FaCar, FaCalendarAlt, FaComments } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: 'accounts', label: 'Quản lý tài khoản', icon: <FaUser /> },
    { id: 'vehicles', label: 'Quản lý xe', icon: <FaCar /> },
    { id: 'appointments', label: 'Quản lý lịch hẹn', icon: <FaCalendarAlt /> },
    { id: 'chat', label: 'Chat', icon: <FaComments /> },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

