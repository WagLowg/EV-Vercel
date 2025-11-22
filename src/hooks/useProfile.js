import { useCallback, useEffect, useState, useRef } from "react";
import { getProfile, updateProfile } from "../api";

const initialProfile = {
  user_id: null,
  fullName: "Người dùng",
  email: "user@example.com",
  phone: "0123456789",
  address: "Chưa cập nhật",
  avatar: null,
};

const useProfile = (toast) => {
  const [profileData, setProfileData] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const hasLoadedRef = useRef(false);
  
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

  const loadProfile = useCallback(async () => {
    // Chỉ load 1 lần để tránh infinite loop
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      let initialData = { ...initialProfile };

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        initialData = {
          user_id: parsed.user_id || parsed.id || parsed.userId || null,
          fullName: parsed.fullName || initialProfile.fullName,
          email: parsed.email || initialProfile.email,
          phone: parsed.phone || initialProfile.phone,
          address: parsed.address || initialProfile.address,
          avatar: parsed.avatar || initialProfile.avatar,
        };
        setProfileData(initialData);
      }

      try {
        const data = await getProfile();
        const updatedData = {
          user_id:
            data.user_id ||
            data.id ||
            data.userId ||
            initialData.user_id ||
            null,
          fullName: data.fullName || initialData.fullName || initialProfile.fullName,
          email: data.email || initialData.email || initialProfile.email,
          phone: data.phone || initialData.phone || initialProfile.phone,
          address: data.address || initialData.address || initialProfile.address,
          avatar: data.avatar || initialData.avatar || initialProfile.avatar,
        };

        setProfileData(updatedData);
        localStorage.setItem("user", JSON.stringify(updatedData));
      } catch (apiError) {
        console.warn(
          "⚠️ Không thể load profile từ API, sử dụng dữ liệu localStorage:",
          apiError
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải thông tin profile:", error);
      hasLoadedRef.current = false; // Reset để có thể retry
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - chỉ tạo 1 lần

  useEffect(() => {
    loadProfile();
  }, []); // Chỉ chạy 1 lần khi mount

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        avatar: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!profileData.user_id) {
      console.error("❌ Không tìm thấy user_id trong profileData");
      showMessage("Không tìm thấy User ID. Vui lòng đăng nhập lại!", 'error');
      return;
    }

    try {
      setSaving(true);
      const response = await updateProfile(profileData.user_id, {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        avatar: profileData.avatar,
      });

      const updated = { ...profileData, ...response };
      localStorage.setItem("user", JSON.stringify(updated));
      setProfileData(updated);
      showMessage("Cập nhật thông tin thành công!", 'success');
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.statusText ||
        "Có lỗi xảy ra khi cập nhật thông tin!";

      showMessage(`Lỗi: ${errorMessage}`, 'error');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    profileData,
    loading,
    saving,
    handleProfileChange,
    handleAvatarChange,
    saveProfile,
  };
};

export default useProfile;

