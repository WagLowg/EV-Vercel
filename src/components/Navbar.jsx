// Navbar.jsx - Tesla Style
import { useState, useEffect, useRef } from "react";
import { FaQuestionCircle, FaUserCircle, FaGlobe, FaCar, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { useToastContext } from "../contexts/ToastContext";

export default function Navbar({ onNavigate, isLoggedIn, onLogout, user }) {
  const toast = useToastContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      handleNavigate('login');
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsUserMenuOpen(false);
    toast.showSuccess('Đã đăng xuất thành công!');
    handleNavigate('home');
  };

  // Xác định dashboard dựa vào role
  const getDashboardInfo = () => {
    if (!user || !user.role) return null;
    
    const role = user.role.toLowerCase();
    
    switch(role) {
      case 'manager':
        return { page: 'manager', label: 'Manager Dashboard', icon: '👨‍💼' };
      case 'admin':
        return { page: 'admin', label: 'Admin Dashboard', icon: '👑' };
      case 'staff':
        return { page: 'staff', label: 'Staff Dashboard', icon: '👨‍💼' };
      case 'technician':
        return { page: 'technician', label: 'Technician Dashboard', icon: '🔧' };
      default:
        return null;
    }
  };

  const dashboardInfo = getDashboardInfo();

  return (
    <header className="w-full fixed top-0 z-50 bg-black/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo - Tesla Style */}
        <div className="flex items-center cursor-pointer" onClick={() => handleNavigate('home')}>
          <div className="text-2xl font-bold text-white tracking-tight">
            <span className="text-3xl">C</span>arCare
          </div>
        </div>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center space-x-8 text-white font-medium text-sm">
          <button 
            onClick={() => scrollToSection('home')}
            className="px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition-colors duration-200"
          >
            Trang Chủ
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition-colors duration-200"
          >
            Dịch Vụ
          </button>
          <button 
            onClick={() => scrollToSection('branches')}
            className="px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition-colors duration-200"
          >
            Chi Nhánh
          </button>
          <button 
            onClick={() => handleNavigate('booking')}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 font-semibold"
          >
            Đặt Lịch Hẹn
          </button>
        </nav>

        {/* Right Icons - Tesla Style */}
        <div className="flex items-center space-x-4">
          <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors duration-200">
            <FaQuestionCircle size={14} className="text-white" />
          </button>
          <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors duration-200">
            <FaGlobe size={14} className="text-white" />
          </button>
          
          {/* User Menu with Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={handleUserIconClick}
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
              title={isLoggedIn ? (user?.fullName || 'Menu người dùng') : "Đăng nhập"}
            >
              <FaUserCircle size={14} className="text-white" />
            </button>

            {/* Dropdown Menu - Only show when logged in */}
            {isLoggedIn && isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'Người dùng'}</p>
                  <p className="text-xs text-gray-500">{user?.email || '---'}</p>
                </div>
                
                <button 
                  onClick={() => handleNavigate('profile')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <FaUserCircle size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-800">Hồ sơ của tôi</span>
                </button>
                
                <button 
                  onClick={() => handleNavigate('mycar')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <FaCar size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-800">Xe của tôi</span>
                </button>
                
                {/* Dashboard Link - Only for staff/technician/manager/admin */}
                {dashboardInfo && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button 
                      onClick={() => handleNavigate(dashboardInfo.page)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-3 bg-blue-50/50"
                    >
                      <FaTachometerAlt size={16} className="text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">{dashboardInfo.label}</span>
                    </button>
                  </>
                )}
                
                <div className="border-t border-gray-200 mt-2"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3 text-red-600"
                >
                  <FaSignOutAlt size={16} />
                  <span className="text-sm font-medium">Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-6 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Trang Chủ
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Dịch Vụ
            </button>
            <button 
              onClick={() => scrollToSection('branches')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Chi Nhánh
            </button>
            <button 
              onClick={() => handleNavigate('booking')}
              className="block w-full text-left bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold p-3 rounded hover:from-blue-600 hover:to-emerald-600 transition-all"
            >
              Đặt Lịch Hẹn
            </button>
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => handleNavigate('profile')}
                  className="block w-full text-left text-blue-600 font-medium hover:text-blue-800 transition-colors border-t pt-4 flex items-center gap-2"
                >
                  <FaUserCircle size={16} />
                  Hồ sơ của tôi
                </button>
                <button 
                  onClick={() => handleNavigate('mycar')}
                  className="block w-full text-left text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-2"
                >
                  <FaCar size={16} />
                  Xe của tôi
                </button>
                
                {/* Dashboard Link Mobile - Only for staff/technician/manager/admin */}
                {dashboardInfo && (
                  <button 
                    onClick={() => handleNavigate(dashboardInfo.page)}
                    className="block w-full text-left bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2 p-3 rounded"
                  >
                    <FaTachometerAlt size={16} />
                    {dashboardInfo.label}
                  </button>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 font-medium hover:text-red-800 transition-colors flex items-center gap-2"
                >
                  <FaSignOutAlt size={16} />
                  Đăng xuất
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleNavigate('login')}
                className="block w-full text-left text-blue-600 font-medium hover:text-blue-800 transition-colors border-t pt-4"
              >
                Đăng Nhập
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
  //test commit
}
