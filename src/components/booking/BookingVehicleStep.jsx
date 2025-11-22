import React from "react";

const BookingVehicleStep = ({
  formData,
  vehicleLoading,
  showVehicleDropdown,
  setShowVehicleDropdown,
  myVehicles,
  handleSelectVehicle,
  handleInputChange,
  selectedVehicleInfo,
}) => (
  <div className="booking-step-content">
    <div className="form-section">
      <h2>
        <span className="form-section-icon">🚗</span>
        Thông tin xe
      </h2>
      <div className="form-grid">
        <div
          className="form-group full-width"
          style={{ position: "relative" }}
        >
          <label>Số VIN / Biển số xe</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nhập hoặc chọn VIN/biển số xe"
            value={formData.licensePlate}
            onChange={(e) => handleInputChange("licensePlate", e.target.value)}
            onFocus={() => setShowVehicleDropdown(true)}
            onBlur={() => setTimeout(() => setShowVehicleDropdown(false), 200)}
          />
          {vehicleLoading && (
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                fontSize: "12px",
                color: "#999",
              }}
            >
              Đang tìm...
            </span>
          )}

          {showVehicleDropdown && myVehicles.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  padding: "8px",
                  fontSize: "12px",
                  color: "#666",
                  borderBottom: "1px solid #eee",
                }}
              >
                Chọn từ xe của tôi:
              </div>
              {myVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleSelectVehicle(vehicle)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                    {vehicle.model || "Xe"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {vehicle.licensePlate || vehicle.vin} • Năm {vehicle.year}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group full-width">
          <label>Số km đã chạy</label>
          <input
            type="number"
            className="form-input"
            placeholder="Nhập số km đã chạy (ví dụ: 5000)"
            value={formData.mileage}
            onChange={(e) => handleInputChange("mileage", e.target.value)}
            min="0"
            step="1000"
          />
        </div>
      </div>
    </div>

    {selectedVehicleInfo && (
      <div
        className="form-section"
        style={{
          background: "#f8f9fa",
          border: "1px solid #e9ecef",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h3
          style={{
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✅</span>
          <span>Thông tin xe</span>
        </h3>
        <div className="sidebar-item">
          <div className="sidebar-item-content">
            <h4 style={{ fontSize: "18px", marginBottom: "12px" }}>
              {selectedVehicleInfo.model || "Thông tin xe"}
            </h4>
            <div style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
              <p style={{ margin: 0 }}>
                <strong>Biển số:</strong>{" "}
                {selectedVehicleInfo.licensePlate || "N/A"}
              </p>
              {selectedVehicleInfo.vin && (
                <p style={{ margin: 0 }}>
                  <strong>VIN:</strong> {selectedVehicleInfo.vin}
                </p>
              )}
              <p style={{ margin: 0 }}>
                <strong>Năm sản xuất:</strong> {selectedVehicleInfo.year}
              </p>
              {selectedVehicleInfo.color && (
                <p style={{ margin: 0 }}>
                  <strong>Màu sắc:</strong> {selectedVehicleInfo.color}
                </p>
              )}
              {selectedVehicleInfo.mileage && (
                <p style={{ margin: 0 }}>
                  <strong>Số km đã đi:</strong>{" "}
                  {selectedVehicleInfo.mileage.toLocaleString()} km
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {formData.licensePlate &&
      !selectedVehicleInfo &&
      !vehicleLoading &&
      formData.licensePlate.length >= 3 && (
        <div
          className="form-section"
          style={{
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "8px",
            padding: "15px",
          }}
        >
          <p style={{ margin: 0, color: "#856404", fontSize: "14px" }}>
            ⚠️ Không tìm thấy thông tin xe với VIN/biển số này. Bạn có thể tiếp
            tục đặt lịch hoặc chọn xe khác.
          </p>
        </div>
      )}
  </div>
);

export default BookingVehicleStep;

