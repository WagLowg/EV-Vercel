import React, { useState, useEffect } from 'react';
import './ManagerDashboard.css';
import { 
  FaUserTie, FaWarehouse, FaMoneyBillWave, FaChartLine, FaClipboardList, FaTools,
  FaSearch, FaSignOutAlt, FaBars, FaTimes, FaHome
} from 'react-icons/fa';
import { getCurrentUser, getCurrentCenterId } from '../../utils/centerFilter';
import { ROLES } from '../../constants/roles';
import { showWarning } from '../../utils/toast';

// ✅ Import Refactored Components
import { StaffList } from './components/Staff';
import { OverviewTab } from './components/Overview';
import { PartsTab } from './components/Parts';
import { FinanceTab } from './components/Finance';
import { WorkLogTab } from './components/WorkLog';
import { MaintenanceRecordTab } from './components/MaintenanceRecord';

/**
 * MANAGER DASHBOARD
 * 
 * Dashboard cho Manager - quản lý trung tâm dịch vụ
 * Scope: Chỉ xem & quản lý data của 1 center cụ thể
 * 
 * Quyền hạn:
 * - Xem tổng quan trung tâm (Overview)
 * - Xem danh sách nhân sự (Staff)
 * - Quản lý phụ tùng & tồn kho (Parts)
 * - Quản lý quy trình bảo dưỡng (Maintenance Record)
 * - Quản lý WorkLog nhân viên (WorkLog)
 * - Xem báo cáo tài chính & thống kê (Finance)
 */
function ManagerDashboard({ onNavigate }) {
  console.log('ManagerDashboard component loaded!', { onNavigate });
  
  // Lấy thông tin user & center
  const currentUser = getCurrentUser();
  const { role, centerId, fullName } = currentUser;
  
  // Format display name - nếu có "Admin" trong tên thì đổi thành "Manager"
  const displayName = fullName 
    ? fullName.replace(/Admin/gi, 'Manager')
    : 'Manager User';
  
  // Kiểm tra đăng nhập & quyền truy cập
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
    
    // Kiểm tra role phải là MANAGER
    if (role !== ROLES.MANAGER) {
      if (!hasShownAlert) {
        hasShownAlert = true;
        showWarning('Bạn không có quyền truy cập trang này! Trang này chỉ dành cho Manager.');
        onNavigate && onNavigate('login');
      }
      return;
    }
    
    // Kiểm tra có centerId không
    if (!centerId) {
      if (!hasShownAlert) {
        hasShownAlert = true;
        showWarning('Tài khoản chưa được gán vào trung tâm nào!');
        onNavigate && onNavigate('login');
      }
      return;
    }
    
    // Đảm bảo URL đúng khi reload - nếu đang ở /manager hoặc /manager/* thì giữ nguyên
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/manager')) {
        // Nếu URL không đúng, cập nhật lại về /manager hoặc /manager/overview
        const defaultPath = currentPath === '/manager' ? '/manager' : '/manager/overview';
        window.history.replaceState({}, '', defaultPath);
      }
    }
    
    console.log('✅ Manager authorized:', { role, centerId, fullName });
  }, [role, centerId, fullName, onNavigate]);
  
  // Đồng bộ activeTab với URL
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const tab = parts[2] || 'overview'; // /manager/overview -> parts[2] = 'overview'
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
    window.history.pushState({}, '', `/manager/${tab}`);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="modern-dashboard">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaChartLine className="logo-icon" />
            {!sidebarCollapsed && <span className="logo-text">CarCare Manager</span>}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        <div className="sidebar-center-info">
          {!sidebarCollapsed && (
            <>
              <p className="center-label">Trung tâm</p>
              <p className="center-id">#{centerId}</p>
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
            className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => handleTabChange('staff')}
            title="Nhân sự"
          >
            <FaUserTie className="nav-icon" />
            {!sidebarCollapsed && <span>Nhân sự</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'worklog' ? 'active' : ''}`}
            onClick={() => handleTabChange('worklog')}
            title="WorkLog"
          >
            <FaClipboardList className="nav-icon" />
            {!sidebarCollapsed && <span>WorkLog</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => handleTabChange('maintenance')}
            title="Bảo dưỡng"
          >
            <FaTools className="nav-icon" />
            {!sidebarCollapsed && <span>Bảo dưỡng</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'parts' ? 'active' : ''}`}
            onClick={() => handleTabChange('parts')}
            title="Phụ tùng"
          >
            <FaWarehouse className="nav-icon" />
            {!sidebarCollapsed && <span>Phụ tùng</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'finance' ? 'active' : ''}`}
            onClick={() => handleTabChange('finance')}
            title="Tài chính & Báo cáo"
          >
            <FaMoneyBillWave className="nav-icon" />
            {!sidebarCollapsed && <span>Tài chính</span>}
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
              {activeTab === 'overview' && 'Tổng quan'}
              {activeTab === 'staff' && 'Quản lý Nhân sự'}
              {activeTab === 'worklog' && 'Nhật ký Công việc'}
              {activeTab === 'maintenance' && 'Quy trình Bảo dưỡng'}
              {activeTab === 'parts' && 'Quản lý Phụ tùng'}
              {activeTab === 'finance' && 'Tài chính & Báo cáo'}
            </h1>
          </div>

          <div className="header-right">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="header-search"
              />
            </div>

            <div className="user-menu">
              <div className="user-menu-trigger">
                <div className="user-avatar">
                  <FaUserTie />
                </div>
                <div className="user-info">
                  <p className="user-name">{displayName}</p>
                  <p className="user-role">Manager</p>
                </div>
              </div>
            </div>

            <button 
              className="logout-btn" 
              onClick={() => {
                localStorage.clear();
                onNavigate('login');
              }}
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
          {activeTab === 'staff' && <StaffList />}
          {activeTab === 'worklog' && <WorkLogTab />}
          {activeTab === 'maintenance' && <MaintenanceRecordTab />}
          {activeTab === 'parts' && <PartsTab />}
          {activeTab === 'finance' && <FinanceTab />}
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;

