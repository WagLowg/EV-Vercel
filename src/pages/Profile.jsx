import React, { useState } from "react";
import "./Profile.css";
import useProfile from "../hooks/useProfile";
import usePasswordChange from "../hooks/usePasswordChange";
import useBookingHistory from "../hooks/useBookingHistory";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ProfilePasswordForm from "../components/profile/ProfilePasswordForm";
import ProfileHistory from "../components/profile/ProfileHistory";
import { useToastContext } from "../contexts/ToastContext";

function Profile({ onNavigate }) {
  const toast = useToastContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const {
    profileData,
    loading,
    saving: savingProfile,
    handleProfileChange,
    handleAvatarChange,
    saveProfile,
  } = useProfile(toast);
  const {
    passwordData,
    saving: savingPassword,
    handlePasswordChange,
    submitPasswordChange,
  } = usePasswordChange(toast);
  const {
    bookingHistory,
    loading: loadingHistory,
    error: historyError,
    retry: retryHistory,
  } = useBookingHistory();

  const handleSubmitProfile = async (event) => {
    event.preventDefault();
    try {
      await saveProfile();
      setIsEditing(false);
    } catch (error) {
      // Errors are surfaced inside the hook via alert/logging
    }
  };

  const handleSubmitPassword = async (event) => {
    event.preventDefault();
    try {
      // Truyền profileData để hook có thể lấy fullName, email, phone
      await submitPasswordChange(profileData);
    } catch (error) {
      // Errors are surfaced inside the hook via alert/logging
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <ProfileHeader onBack={() => onNavigate("home")} />
        <div className="profile-content profile-loading-container">
          <div className="profile-loading-content">
            <div className="profile-loading-spinner" />
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ProfileHeader onBack={() => onNavigate("home")} />
      <div className="profile-content">
        <ProfileSidebar
          profileData={profileData}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAvatarChange={handleAvatarChange}
        />

        <div className="profile-main">
          {activeTab === "info" && (
            <ProfileInfoForm
              profileData={profileData}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing((prev) => !prev)}
              onChange={handleProfileChange}
              onSubmit={handleSubmitProfile}
              saving={savingProfile}
            />
          )}

          {activeTab === "password" && (
            <ProfilePasswordForm
              passwordData={passwordData}
              onChange={handlePasswordChange}
              onSubmit={handleSubmitPassword}
              saving={savingPassword}
            />
          )}

          {activeTab === "history" && (
            <ProfileHistory
              bookingHistory={bookingHistory}
              loading={loadingHistory}
              error={historyError}
              onRetry={retryHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

