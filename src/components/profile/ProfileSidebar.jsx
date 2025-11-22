import React from "react";

const ProfileSidebar = ({
  profileData,
  activeTab,
  onTabChange,
  onAvatarChange,
}) => (
  <div className="profile-sidebar">
    <div className="profile-avatar-section">
      <div className="avatar-wrapper">
        {profileData.avatar ? (
          <img
            src={profileData.avatar}
            alt="Avatar"
            className="profile-avatar"
          />
        ) : (
          <div className="avatar-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          </div>
        )}
      </div>
      <h2>{profileData.fullName}</h2>
      <p className="profile-email">{profileData.email}</p>
    </div>

    <nav className="profile-nav">
      <button
        className={`nav-item ${activeTab === "info" ? "active" : ""}`}
        onClick={() => onTabChange("info")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
        </svg>
        Thông tin cá nhân
      </button>
      <button
        className={`nav-item ${activeTab === "password" ? "active" : ""}`}
        onClick={() => onTabChange("password")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
        </svg>
        Đổi mật khẩu
      </button>
      <button
        className={`nav-item ${activeTab === "history" ? "active" : ""}`}
        onClick={() => onTabChange("history")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" />
        </svg>
        Lịch sử đặt lịch
      </button>
    </nav>
  </div>
);

export default ProfileSidebar;

