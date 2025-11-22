import React from "react";

const BookingBranchStep = ({ formData, handleInputChange, serviceCenters }) => (
  <div className="booking-step-content">
    <div className="form-section">
      <h2>
        <span className="form-section-icon">📍</span>
        Chọn chi nhánh dịch vụ
      </h2>
      <div
        className="selection-grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {serviceCenters.map((center) => (
          <div
            key={center.id}
            className={`selection-card ${
              formData.serviceCenterId === center.id ? "selected" : ""
            }`}
            onClick={() => handleInputChange("serviceCenterId", center.id)}
            style={{
              padding: "24px",
              cursor: "pointer",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              className="selection-card-header"
              style={{ justifyContent: "space-between" }}
            >
              <span
                className="selection-card-icon"
                style={{ fontSize: "32px" }}
              >
                {center.icon}
              </span>
              <input
                type="radio"
                name="serviceCenter"
                className="selection-checkbox"
                checked={formData.serviceCenterId === center.id}
                onChange={() => {}}
                style={{ width: "20px", height: "20px" }}
              />
            </div>
            <h3
              style={{
                fontSize: "18px",
                margin: "8px 0",
                fontWeight: "600",
              }}
            >
              {center.name}
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              <p
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <span>📍</span>
                <span>
                  {center.address}, {center.city}
                </span>
              </p>
              <p
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📞</span>
                <span>{center.phone}</span>
              </p>
              <p
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>🕒</span>
                <span>{center.workingHours}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BookingBranchStep;

