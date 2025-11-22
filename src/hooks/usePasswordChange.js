import { useState } from "react";
import { updateUserProfile } from "../api";

const initialPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const usePasswordChange = (toast) => {
  const [passwordData, setPasswordData] = useState(initialPassword);
  const [saving, setSaving] = useState(false);
  
  // Lấy userId từ localStorage
  const getUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        return userData.user_id || userData.id || userData.userId;
      }
    } catch (err) {
      console.error('❌ Lỗi khi lấy userId:', err);
    }
    return null;
  };
  
  const showMessage = (message, type = 'info') => {
    if (toast) {
      switch(type) {
        case 'success': toast.showSuccess(message); break;
        case 'error': toast.showError(message); break;
        case 'warning': toast.showWarning(message); break;
        default: toast.showInfo(message);
      }
    } else {
      alert(message);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetPasswordForm = () => {
    setPasswordData(initialPassword);
  };

  const submitPasswordChange = async (userInfo = null) => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("Mật khẩu xác nhận không khớp!", 'error');
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      showMessage("Mật khẩu mới phải có ít nhất 6 ký tự!", 'error');
      return;
    }

    try {
      setSaving(true);
      
      const userId = getUserId();
      if (!userId) {
        showMessage("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!", 'error');
        return;
      }

      // Lấy thông tin user hiện tại từ localStorage hoặc từ userInfo prop
      let currentUserInfo = userInfo;
      if (!currentUserInfo) {
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            currentUserInfo = JSON.parse(userStr);
          }
        } catch (err) {
          console.error('❌ Lỗi khi lấy thông tin user:', err);
        }
      }

      // Chuẩn bị data theo API spec: { fullName, email, phone, password }
      const updateData = {
        fullName: currentUserInfo?.fullName || currentUserInfo?.name || '',
        email: currentUserInfo?.email || '',
        phone: currentUserInfo?.phone || currentUserInfo?.phoneNumber || '',
        password: passwordData.newPassword // Chỉ gửi password mới
      };

      console.log('📤 Updating user profile with password:', { userId, updateData: { ...updateData, password: '***' } });
      
      const response = await updateUserProfile(userId, updateData);
      
      console.log('✅ Password updated successfully:', response);
      
      resetPasswordForm();
      showMessage("Đổi mật khẩu thành công!", 'success');
      
      return response;
    } catch (error) {
      console.error("❌ Lỗi khi đổi mật khẩu:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Có lỗi xảy ra khi đổi mật khẩu!";
      showMessage(`Lỗi: ${errorMessage}`, 'error');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    passwordData,
    saving,
    handlePasswordChange,
    submitPasswordChange,
  };
};

export default usePasswordChange;

