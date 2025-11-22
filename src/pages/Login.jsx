import React from "react";
import "./Login.css";
import AuthForm from "../components/login/AuthForm";
import useAuthForm from "../hooks/useAuthForm";
import { useToastContext } from "../contexts/ToastContext";

function Login({ onNavigate, onLogin }) {
  const toast = useToastContext();
  const {
    formData,
    isSignUp,
    loading,
    handleInputChange,
    handleSubmit,
    toggleSignUp,
  } = useAuthForm({ onNavigate, onLogin, toast });

  return (
    <div className="login-container">
      {/* Back to Home */}
      <button
        className="back-to-home-btn"
        onClick={() => onNavigate("home")}
        title="Quay về trang chủ"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
        </svg>
        <span>Trang chủ</span>
      </button>

      {/* Background */}
      <div className="login-background">
        <div className="login-bg-overlay"></div>
      </div>

      {/* Form Login */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-logo">
            <h1>CarCare</h1>
            <p>Dịch vụ xe hơi chuyên nghiệp</p>
          </div>

          <div className="login-form-box">
            <h2>{isSignUp ? "Tạo Tài Khoản" : "Đăng Nhập"}</h2>

            <AuthForm
              isSignUp={isSignUp}
              formData={formData}
              loading={loading}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onToggleMode={toggleSignUp}
            />
          </div>

          <div className="login-footer">
            <p>© 2025 CarCare.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
