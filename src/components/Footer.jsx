import React from "react";
import "./Footer.css";

function Footer({ onNavigate }) {
  return (
    <footer className="modern-footer">
      <div className="footer-wrapper">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-title">Dịch Vụ</h4>
            <ul className="footer-list">
              <li><button onClick={() => onNavigate && onNavigate('home')}>Bảo dưỡng định kỳ</button></li>
              <li><button onClick={() => onNavigate && onNavigate('home')}>Sửa chữa động cơ</button></li>
              <li><button onClick={() => onNavigate && onNavigate('home')}>Hệ thống phanh & lốp</button></li>
              <li><button onClick={() => onNavigate && onNavigate('home')}>Điện & Điều hòa</button></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4 className="footer-title">Về CarCare</h4>
            <ul className="footer-list">
              <li><button onClick={() => onNavigate && onNavigate('home')}>Giới thiệu</button></li>
              <li><button onClick={() => onNavigate && onNavigate('home')}>Chi nhánh</button></li>
              <li><button onClick={() => onNavigate && onNavigate('home')}>Tuyển dụng</button></li>
              <li><button onClick={() => onNavigate && onNavigate('home')}>Tin tức</button></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-title">Hỗ Trợ</h4>
            <ul className="footer-list">
              <li><button onClick={() => onNavigate && onNavigate('booking')}>Đặt lịch hẹn</button></li>
              <li><a href="#faq">Câu hỏi thường gặp</a></li>
              <li><a href="#warranty">Chính sách bảo hành</a></li>
              <li><a href="#contact">Liên hệ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-title">Liên Hệ</h4>
            <ul className="footer-list">
              <li><a href="tel:1900636468">1900 636 468</a></li>
              <li><a href="mailto:hethongbaoduongev@gmail.com">hethongbaoduongev@gmail.com</a></li>
              <li>Thứ 2 - Thứ Chủ nhật: 8:00 - 16:30</li>
              <li>Các ngày lễ có thể nghỉ hoặc thay đổi giờ làm việc</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Footer Bottom */}
        <div className="footer-bottom-new">
          <div className="footer-bottom-left">
            <p className="footer-copyright">© 2025 CarCare. All rights reserved.</p>
          </div>

          <div className="footer-bottom-center">
            <a href="#privacy">Chính sách bảo mật</a>
            <span className="footer-dot">·</span>
            <a href="#terms">Điều khoản</a>
            <span className="footer-dot">·</span>
            <a href="#cookies">Cookie</a>
          </div>

          
            
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;