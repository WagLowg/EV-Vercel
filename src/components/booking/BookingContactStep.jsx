import React from "react";

const BookingContactStep = ({ formData, handleInputChange }) => (
  <div className="booking-step-content">
    <div className="form-section">
      <h2>Thông tin liên hệ</h2>
      <div className="contact-form">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Họ và tên</label>
            <input
              type="text"
              className="form-input form-input-readonly"
              placeholder="Nhập họ và tên đầy đủ"
              value={formData.fullName}
              readOnly
              disabled
            />
            <span className="readonly-badge">Tự động điền từ tài khoản</span>
          </div>

          <div className="form-group full-width">
            <label>Email</label>
            <input
              type="email"
              className="form-input form-input-readonly"
              placeholder="Email"
              value={formData.email}
              readOnly
              disabled
            />
            <span className="readonly-badge">Tự động điền từ tài khoản</span>
          </div>

          <div className="form-group full-width">
            <label>Số điện thoại</label>
            <div className="phone-input-group">
              <select className="country-code-select" disabled>
                <option>VN (+84)</option>
              </select>
              <input
                type="tel"
                className="form-input form-input-readonly"
                placeholder="Số điện thoại"
                value={formData.phone}
                readOnly
                disabled
              />
            </div>
            <span className="readonly-badge">Tự động điền từ tài khoản</span>
          </div>
        </div>
      </div>
    </div>

    <div className="privacy-notice">
      <h4>Quyền riêng tư của bạn là ưu tiên của chúng tôi</h4>
      <p>
        Bạn có thể tham khảo Chính sách bảo mật <a href="#">tại đây</a>.
      </p>
    </div>

    <div className="checkbox-item">
      <input
        type="checkbox"
        id="terms"
        checked={formData.agreeToTerms}
        onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
      />
      <label htmlFor="terms" className="checkbox-label">
        Tôi hiểu rằng Dữ liệu liên quan sau khi khách hàng và phương tiện được
        thu thập trong quá trình đặt chỗ sẽ được chuyển tiếp đến Xưởng dịch vụ
        ủy quyền. Tôi đã đọc và đồng ý với tất cả các điều khoản và điều kiện
        về bảo mật dữ liệu cá nhân.
      </label>
    </div>
  </div>
);

export default BookingContactStep;

