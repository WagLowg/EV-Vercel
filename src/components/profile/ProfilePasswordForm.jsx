import React from "react";

const ProfilePasswordForm = ({
  passwordData,
  onChange,
  onSubmit,
  saving,
}) => (
  <div className="profile-section">
    <div className="section-header">
      <h2>Đổi mật khẩu</h2>
    </div>

    <form onSubmit={onSubmit} className="profile-form">
      <div className="form-group">
        <label>Mật khẩu hiện tại</label>
        <input
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={onChange}
          placeholder="Nhập mật khẩu hiện tại"
          required
        />
      </div>

      <div className="form-group">
        <label>Mật khẩu mới</label>
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={onChange}
          placeholder="Nhập mật khẩu mới"
          required
          minLength={6}
        />
        <small className="form-hint">
          Mật khẩu phải có ít nhất 6 ký tự
        </small>
      </div>

      <div className="form-group">
        <label>Xác nhận mật khẩu mới</label>
        <input
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={onChange}
          placeholder="Nhập lại mật khẩu mới"
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </div>
    </form>
  </div>
);

export default ProfilePasswordForm;

