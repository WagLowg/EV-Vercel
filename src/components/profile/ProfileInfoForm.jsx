import React from "react";

const ProfileInfoForm = ({
  profileData,
  isEditing,
  onToggleEdit,
  onChange,
  onSubmit,
  saving,
}) => (
  <div className="profile-section">
    <div className="section-header">
      <h2>Thông tin cá nhân</h2>
      {!isEditing && (
        <button className="edit-btn" onClick={onToggleEdit}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
          Chỉnh sửa
        </button>
      )}
    </div>

    <form onSubmit={onSubmit} className="profile-form">
      <div className="form-row">
        <div className="form-group">
          <label>Họ và tên</label>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={onChange}
              required
            />
          ) : (
            <p className="form-value">{profileData.fullName}</p>
          )}
        </div>

        <div className="form-group">
          <label>Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={onChange}
              required
            />
          ) : (
            <p className="form-value">{profileData.email}</p>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Số điện thoại</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={onChange}
              required
            />
          ) : (
            <p className="form-value">{profileData.phone}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onToggleEdit} disabled={saving}>
            Hủy
          </button>
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      )}
    </form>
  </div>
);

export default ProfileInfoForm;

