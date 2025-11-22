import React from "react";

const BookingSummarySidebar = ({
  getProgressPercentage,
  formData,
  selectedVehicleInfo,
  currentStep,
  setCurrentStep,
  services,
  serviceCenters,
  formatCurrency,
  formatDateLabel,
}) => {
  const progress = getProgressPercentage();
  const selectedServicesData = services.filter((service) =>
    formData.selectedServices.includes(service.id)
  );
  const totalPrice = selectedServicesData.reduce(
    (sum, service) => sum + (service.price || service.priceValue || 0),
    0
  );
  const selectedCenter = serviceCenters.find(
    (center) => center.id === formData.serviceCenterId
  );

  return (
    <div className="booking-right-sidebar">
      <div className="progress-percentage">
        Đã hoàn thành {Math.round(progress)}%
      </div>
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {formData.licensePlate && (
        <div className="sidebar-section">
          <h3>Xe</h3>
          <div className="sidebar-item">
            <div className="sidebar-item-content">
              <h4>
                {selectedVehicleInfo
                  ? selectedVehicleInfo.model || "Thông tin xe"
                  : formData.vehicleModel || "Thông tin xe"}
              </h4>
              <p>{formData.licensePlate}</p>
              {formData.mileage && (
                <p
                  style={{ fontSize: "14px", color: "#666", margin: "4px 0 0" }}
                >
                  Số km: {parseInt(formData.mileage, 10).toLocaleString()} km
                </p>
              )}
            </div>
            {currentStep > 1 && (
              <button
                className="sidebar-edit-btn"
                onClick={() => setCurrentStep(1)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {formData.serviceCenterId && currentStep >= 3 && selectedCenter && (
        <div className="sidebar-section">
          <h3>Chi nhánh dịch vụ</h3>
          <div className="sidebar-item">
            <div className="sidebar-item-content">
              <h4>{selectedCenter.name}</h4>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  margin: "4px 0 0 0",
                }}
              >
                {selectedCenter.city}
              </p>
            </div>
            {currentStep > 2 && (
              <button
                className="sidebar-edit-btn"
                onClick={() => setCurrentStep(2)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {selectedServicesData.length > 0 && (
        <div className="sidebar-section">
          <h3>Dịch vụ</h3>
          {selectedServicesData.map((service) => (
            <div key={service.id} className="sidebar-item">
              <div className="sidebar-item-content">
                <h4>{service.name}</h4>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "14px",
                    color: "#4b5563",
                  }}
                >
                  {formatCurrency(service.price || service.priceValue || 0)}
                </p>
              </div>
              {currentStep > 3 && (
                <button
                  className="sidebar-edit-btn"
                  onClick={() => setCurrentStep(3)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {formData.selectedDate && formData.selectedTime && (
        <div className="sidebar-section">
          <h3>Ngày và giờ</h3>
          <div className="sidebar-item">
            <div className="sidebar-item-content">
              <h4>{`${formatDateLabel(formData.selectedDate)}, ${formData.selectedTime}`}</h4>
            </div>
            {currentStep > 4 && (
              <button
                className="sidebar-edit-btn"
                onClick={() => setCurrentStep(4)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {formData.fullName && (
        <div className="sidebar-section">
          <h3>Chi tiết cá nhân</h3>
          <div className="sidebar-item">
            <div className="sidebar-item-content">
              <h4>{formData.fullName}</h4>
              {formData.email && <p style={{ fontSize: "14px", color: "#666", margin: "4px 0 0" }}>{formData.email}</p>}
              {formData.phone && <p style={{ fontSize: "14px", color: "#666", margin: "4px 0 0" }}>{formData.phone}</p>}
            </div>
            {currentStep > 5 && (
              <button
                className="sidebar-edit-btn"
                onClick={() => setCurrentStep(5)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {selectedServicesData.length > 0 && (
        <div className="sidebar-total">
          <h3>Tổng cộng</h3>
          <div className="sidebar-total-price">{formatCurrency(totalPrice)}</div>
          <p>
            Chi phí tạm tính dựa trên các gói dịch vụ đã chọn. Các chi phí bổ
            sung (nếu có) sẽ được thông báo trước khi thanh toán.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingSummarySidebar;

