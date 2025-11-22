import React, { useState } from "react";
import "./MyCar.css";
import "./Profile.css";
import useVehicles from "../hooks/useVehicles";
import MyCarHeader from "../components/mycar/MyCarHeader";
import MyCarSidebar from "../components/mycar/MyCarSidebar";
import MyCarList from "../components/mycar/MyCarList";
import MyCarAddForm from "../components/mycar/MyCarAddForm";
import { useToastContext } from "../contexts/ToastContext";
import { addVehicle } from "../api";

function MyCar({ onNavigate, onNavigateWithVehicle }) {
  const toast = useToastContext();
  const { vehicles, loading, error, refresh } = useVehicles();
  const [activeTab, setActiveTab] = useState("list");
  const [saving, setSaving] = useState(false);

  const handleBook = (vehicle) => {
    if (onNavigateWithVehicle) {
      onNavigateWithVehicle("booking", vehicle);
      return;
    }
    onNavigate("booking");
  };

  const handleAddVehicle = async (formData) => {
    try {
      setSaving(true);
      await addVehicle(formData);
      toast.showSuccess("Thêm xe thành công!");
      await refresh();
      setActiveTab("list");
    } catch (error) {
      console.error("Lỗi khi thêm xe:", error);
      toast.showError(error.response?.data?.message || "Không thể thêm xe");
    } finally {
      setSaving(false);
    }
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="profile-container">
        <MyCarHeader onBack={() => onNavigate("home")} />
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
      <MyCarHeader onBack={() => onNavigate("home")} />
      <div className="profile-content">
        <MyCarSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          vehicleCount={vehicles?.length || 0}
        />

        {activeTab === "list" && (
          <MyCarList
            vehicles={vehicles}
            loading={loading}
            error={error}
            onRetry={refresh}
            onBook={handleBook}
          />
        )}

        {activeTab === "add" && (
          <MyCarAddForm onAdd={handleAddVehicle} saving={saving} />
        )}
      </div>
    </div>
  );
}

export default MyCar;
