import React from "react";

const ProfileHeader = ({ onBack }) => (
  <div className="profile-header">
    <button className="back-btn" onClick={onBack}>
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
      </svg>
      Quay lại
    </button>
    <h1>Thông tin cá nhân</h1>
  </div>
);

export default ProfileHeader;

