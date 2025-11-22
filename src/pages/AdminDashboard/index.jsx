import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { 
  FaChartLine, FaUsers, FaWarehouse, FaCog, FaSignOutAlt, 
  FaBars, FaTimes, FaHome, FaUserShield
} from 'react-icons/fa';
import { getCurrentUser } from '../../utils/centerFilter';
import { ROLES } from '../../constants/roles';
import { showWarning } from '../../utils/toast';

// Import components
import { OverviewTab } from './components/Overview';
import { UsersTab } from './components/Users';
import { CentersTab } from './components/Centers';
import { PartsTab } from './components/Parts';

/**
 * ADMIN DASHBOARD
 * 
 * Dashboard cho Administrator - quản lý toàn bộ hệ thống
 * Scope: Quản lý tất cả centers, users, parts, packages
 * 
 * Quyền hạn:
 * - Xem tổng quan toàn hệ thống (Overview)
 * - Quản lý người dùng (Users)
 * - Quản lý trung tâm dịch vụ (Centers)
 * - Quản lý phụ tùng & gói bảo dưỡng (Parts & Packages)
 */
function AdminDashboard({ onNavigate }) {
  console.log('AdminDashboard component loaded!', { onNavigate });
  
  // Get current user
  const currentUser = getCurrentUser();
  const { role, fullName } = currentUser;
  
  // Format display name
  const displayName = fullName || 'Administrator';
  
  // Check authentication & authorization
  useEffect(() => {
    let hasShownAlert = false;
    
    const token = localStorage.getItem('token');
    if (!token) {
      if (!hasShownAlert) {
        hasShownAlert = true;
        showWarning('Bạn cần đăng nhập để truy cập trang này!');
        onNavigate && onNavigate('login');
      }
      return;
    }
    
    // Only accept ADMIN role
    if (role !== ROLES.ADMIN && role?.toLowerCase() !== 'admin') {
      if (!hasShownAlert) {
        hasShownAlert = true;
        showWarning('Bạn không có quyền truy cập trang này! Trang này chỉ dành cho Administrator.');
        onNavigate && onNavigate('login');
      }
      return;
    }
    
    console.log('✅ Admin authorized:', { role, fullName });
  }, [role, fullName, onNavigate]);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const tab = parts[2] || 'overview'; // /admin/overview -> parts[2] = 'overview'
    console.log('📍 Initial tab from URL:', path, '→', tab);
    return tab;
  });
  
  // State for sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Listen to popstate để update activeTab khi back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const parts = path.split('/');
      const tab = parts[2] || 'overview';
      console.log('📍 Path changed:', path, '→', tab);
      setActiveTab(tab);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    console.log('🔄 Switching to tab:', tab);
    setActiveTab(tab);
    window.history.pushState({}, '', `/admin/${tab}`);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    onNavigate && onNavigate('login');
  };

  return (
    <div className="modern-dashboard">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaUserShield className="logo-icon" />
            {!sidebarCollapsed && <span className="logo-text">Admin Panel</span>}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        <div className="sidebar-center-info">
          {!sidebarCollapsed && (
            <>
              <p className="center-label">Administrator</p>
              <p className="center-id">CARCARE SYSTEM </p>
            </>
          )}
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
            title="Tổng quan"
          >
            <FaChartLine className="nav-icon" />
            {!sidebarCollapsed && <span>Tổng quan</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
            title="Quản lý người dùng"
          >
            <FaUsers className="nav-icon" />
            {!sidebarCollapsed && <span>Người dùng</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'centers' ? 'active' : ''}`}
            onClick={() => handleTabChange('centers')}
            title="Quản lý trung tâm"
          >
            <FaWarehouse className="nav-icon" />
            {!sidebarCollapsed && <span>Trung tâm</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'parts' ? 'active' : ''}`}
            onClick={() => handleTabChange('parts')}
            title="Phụ tùng & Gói bảo dưỡng"
          >
            <FaCog className="nav-icon" />
            {!sidebarCollapsed && <span>Phụ tùng & Gói</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="nav-item"
            onClick={() => onNavigate('home')}
            title="Quay về trang chủ"
          >
            <FaHome className="nav-icon" />
            {!sidebarCollapsed && <span>Trang chủ</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeTab === 'overview' && 'Tổng quan hệ thống'}
              {activeTab === 'users' && 'Quản lý Người dùng'}
              {activeTab === 'centers' && 'Quản lý Trung tâm'}
              {activeTab === 'parts' && 'Phụ tùng & Gói bảo dưỡng'}
            </h1>
          </div>

          <div className="header-right">
            <div className="user-menu">
              <div className="user-menu-trigger">
                <div className="user-avatar">
                  <FaUserShield />
                </div>
                <div className="user-info">
                  <p className="user-name">{displayName}</p>
                  <p className="user-role">Administrator</p>
                </div>
              </div>
            </div>

            <button 
              className="logout-btn" 
              onClick={handleLogout}
              title="Đăng xuất"
            >
              <FaSignOutAlt />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content" key={activeTab}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'centers' && <CentersTab />}
          {activeTab === 'parts' && <PartsTab />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
