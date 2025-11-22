import React from "react";

const AuthForm = ({
  isSignUp,
  formData,
  loading,
  onChange,
  onSubmit,
  onToggleMode,
}) => (
  <form onSubmit={onSubmit} className="login-form">
    {isSignUp && (
      <>
        <div className="form-group">
          <label htmlFor="fullName">Họ và Tên</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            placeholder="Nhập họ và tên của bạn"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="Nhập số điện thoại của bạn"
            required
          />
        </div>
      </>
    )}

    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Nhập email của bạn"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="password">Mật khẩu</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        placeholder="Nhập mật khẩu"
        required
      />
    </div>

    {isSignUp && (
      <div className="form-group">
        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          placeholder="Nhập lại mật khẩu"
          required
        />
      </div>
    )}

    {!isSignUp && (
      <div className="form-options">
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={onChange}
          />
          <span className="checkmark"></span>
          Ghi nhớ đăng nhập
        </label>
      </div>
    )}

    <button type="submit" className="login-btn" disabled={loading}>
      {loading ? "Đang xử lý..." : isSignUp ? "Tạo Tài Khoản" : "Đăng Nhập"}
    </button>

    <div className="form-toggle">
      <p>
        {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
        <button type="button" onClick={onToggleMode} className="toggle-btn">
          {isSignUp ? "Đăng nhập ngay" : "Đăng ký ngay"}
        </button>
      </p>
    </div>
  </form>
);

export default AuthForm;

