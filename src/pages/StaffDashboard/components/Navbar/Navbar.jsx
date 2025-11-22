import React, { useState, useEffect } from 'react';
import { FaUser, FaHome, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUserInfo(userData);
      }
    } catch (error) {
      console.error('Lỗi khi đọc thông tin user:', error);
    }
  }, []);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-brand">EV Service Center</h1>
      </div>
      <div className="navbar-right">
        {/* Nút về trang chủ */}
        <button className="navbar-btn btn-home" onClick={handleGoHome} title="Về trang chủ">
          <FaHome />
          <span>Trang chủ</span>
        </button>

        {/* Nút đăng xuất */}
        <button className="navbar-btn btn-logout" onClick={handleLogout} title="Đăng xuất">
          <FaSignOutAlt />
          <span>Đăng xuất</span>
        </button>

        {/* Hiển thị thông tin người đăng nhập */}
        <div className="user-info">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-details">
            <p className="user-name">
              {userInfo?.fullName || userInfo?.name || 'Nhân viên'}
            </p>
            <p className="user-role">
              {userInfo?.role || 'Staff'}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

