import React from "react";

const MyCarSidebar = ({ activeTab, onTabChange, vehicleCount }) => (
  <div className="profile-sidebar">
    <div className="profile-avatar-section">
      <div className="avatar-wrapper">
        <div className="avatar-placeholder" style={{ background: '#3b82f6' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80" style={{color: 'white'}}>
            <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
          </svg>
        </div>
      </div>
      <h2>Quản lý xe</h2>
      <p className="profile-email">
        {vehicleCount} {vehicleCount === 1 ? 'xe' : 'xe'}
      </p>
    </div>

    <nav className="profile-nav">
      <button
        className={`nav-item ${activeTab === "list" ? "active" : ""}`}
        onClick={() => onTabChange("list")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M3,3H21V5H3V3M3,7H15V9H3V7M3,11H21V13H3V11M3,15H15V17H3V15M3,19H21V21H3V19Z" />
        </svg>
        Danh sách xe
      </button>
      <button
        className={`nav-item ${activeTab === "add" ? "active" : ""}`}
        onClick={() => onTabChange("add")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
        </svg>
        Thêm xe mới
      </button>
    </nav>
  </div>
);

export default MyCarSidebar;

