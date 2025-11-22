import { useState } from "react";
import { login, register } from "../api";

const initialFormState = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
};

const useAuthForm = ({ onNavigate, onLogin, toast }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Helper function to show message (use toast if available, otherwise alert)
  const showMessage = (message, type = 'info') => {
    if (toast) {
      switch(type) {
        case 'success':
          toast.showSuccess(message);
          break;
        case 'error':
          toast.showError(message);
          break;
        case 'warning':
          toast.showWarning(message);
          break;
        default:
          toast.showInfo(message);
      }
    } else {
      alert(message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const toggleSignUp = () => {
    setIsSignUp((prev) => !prev);
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          showMessage("Mật khẩu xác nhận không khớp!", 'error');
          setLoading(false);
          return;
        }

        const newUser = {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        };

        const response = await register(newUser);
        console.log("✅ Đăng ký thành công:", response);
        showMessage("Đăng ký thành công! Hãy đăng nhập.", 'success');
        setIsSignUp(false);
        resetForm();
        return;
      }

      const credentials = {
        email: formData.email,
        password: formData.password,
      };

      const response = await login(credentials);
      console.log("✅ Đăng nhập thành công:", response);

      if (!response.token) {
        showMessage("Không nhận được token!", 'error');
        return;
      }

      const userInfo = response.user || response;
      const userData = {
        user_id: userInfo.user_id || userInfo.id || userInfo.userId,
        fullName: userInfo.fullName || "",
        email: userInfo.email || credentials.email,
        phone: userInfo.phone || "",
        address: userInfo.address || "",
        avatar: userInfo.avatar || null,
        role: userInfo.role || "customer",
        center_id: userInfo.center_id || userInfo.centerId || null,
      };

      console.log("Lưu user data vào localStorage:", userData);
      try {
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (storageError) {
        console.error("Lỗi lưu localStorage:", storageError);
      }

      showMessage("Đăng nhập thành công!", 'success');
      if (onLogin) {
        onLogin(userData);
      }
      
      // Redirect based on role
      const role = userData.role?.toLowerCase();
      if (role === 'staff') {
        onNavigate('staff');
      } else if (role === 'manager') {
        onNavigate('manager');
      } else if (role === 'technician') {
        onNavigate('technician');
      } else if (role === 'admin') {
        onNavigate('admin');
      } else {
        onNavigate('home');
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.response?.data || error.message);
      
      // Check if it's a login authentication error (401 Unauthorized or similar)
      if (!isSignUp && (error.response?.status === 401 || error.response?.status === 400)) {
        showMessage("Sai email hoặc password, vui lòng thử lại", 'error');
      } else {
        const errorMessage = error.response?.data?.message || error.message || "Lỗi khi gọi API";
        showMessage(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    isSignUp,
    loading,
    handleInputChange,
    handleSubmit,
    toggleSignUp,
  };
};

export default useAuthForm;

