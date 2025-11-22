import React from "react";
import {
  FaUser,
  FaSearch,
  FaPlus,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaClock,
  FaCar,
} from "react-icons/fa";

const getCustomerJoinDate = (customer) => {
  if (!customer) {
    return null;
  }

  const candidateFields = [
    "joinDate",
    "joinedAt",
    "createdAt",
    "created_at",
    "createAt",
    "create_at",
    "createdDate",
    "created_date",
    "registerDate",
    "registeredAt",
  ];

  for (const field of candidateFields) {
    const value = customer[field];
    if (!value) continue;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

const StaffCustomersTab = ({
  filteredCustomers,
  loading,
  error,
  searchQuery,
  onSearchChange,
  onRetry,
  onAddCustomer,
  selectedCustomer,
  onSelectCustomer,
  selectedCar,
  onSelectCar,
}) => (
  <div className="customers-section">
    <div className="section-toolbar">
      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng (tên, email, SĐT)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button className="add-btn" onClick={onAddCustomer}>
        <FaPlus />
        Thêm khách hàng
      </button>
    </div>

    <div className="content-layout">
      <div className="customer-list">
        <h3>Danh sách khách hàng ({filteredCustomers.length})</h3>
        <div className="list-items">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tải danh sách khách hàng...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>❌ {error}</p>
              <button className="retry-btn" onClick={onRetry}>
                Thử lại
              </button>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <FaUser size={40} />
              <p>Không tìm thấy khách hàng nào</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`customer-item ${
                  selectedCustomer?.id === customer.id ? "active" : ""
                }`}
                onClick={() => onSelectCustomer(customer)}
              >
                <div className="customer-avatar">
                  <FaUser />
                </div>
                <div className="customer-info">
                  <h4>{customer.fullName || customer.name || "Không có tên"}</h4>
                  <p>{customer.email}</p>
                  <div className="customer-stats">
                    <span>
                      <FaPhone /> {customer.phone || "Chưa có"}
                    </span>
                    <span>
                      {customer.vehicles?.length ||
                        customer.cars?.length ||
                        0}{" "}
                      xe
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="customer-details">
        {selectedCustomer ? (
          <>
            <div className="details-header">
              <div className="customer-avatar-large">
                <FaUser />
              </div>
              <div>
                <h2>
                  {selectedCustomer.fullName ||
                    selectedCustomer.name ||
                    "Không có tên"}
                </h2>
                <p className="customer-id">ID: #{selectedCustomer.id}</p>
              </div>
            </div>

            <div className="details-section">
              <h3>Thông tin liên hệ</h3>
              <div className="info-grid">
                <div className="info-item">
                  <FaEnvelope />
                  <div>
                    <span className="label">Email</span>
                    <span className="value">{selectedCustomer.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaPhone />
                  <div>
                    <span className="label">Số điện thoại</span>
                    <span className="value">
                      {selectedCustomer.phone || "Chưa cập nhật"}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <FaCheckCircle />
                  <div>
                    <span className="label">Trạng thái</span>
                    <span className="value">
                      {selectedCustomer.status === "ACTIVE"
                        ? "✅ Hoạt động"
                        : selectedCustomer.status === "INACTIVE"
                        ? "❌ Không hoạt động"
                        : selectedCustomer.status || "Chưa xác định"}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <FaClock />
                  <div>
                    <span className="label">Ngày tham gia</span>
                    <span className="value">
                      {(() => {
                        const joinDate = getCustomerJoinDate(selectedCustomer);
                        return joinDate
                          ? joinDate.toLocaleDateString("vi-VN")
                          : "Chưa có thông tin";
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>
                Danh sách xe{" "}
                {(selectedCustomer.vehicles || selectedCustomer.cars)?.length ||
                  0}
              </h3>
              <div className="car-cards">
                {(selectedCustomer.vehicles || selectedCustomer.cars)?.length >
                0 ? (
                  (selectedCustomer.vehicles || selectedCustomer.cars).map(
                    (car) => (
                      <div
                        key={car.id || car.vehicleId}
                        className="car-card-mini"
                        onClick={() => onSelectCar(car)}
                      >
                        <div className="car-icon">
                          <FaCar />
                        </div>
                        <div className="car-info-mini">
                          <h4>{car.model || "Xe"}</h4>
                          <p>Năm: {car.year || "N/A"}</p>
                          <p>Biển số: {car.licensePlate || "Chưa có"}</p>
                          <p>VIN: {car.vin || "Chưa có"}</p>
                          {car.color && <p>Màu: {car.color}</p>}
                          {car.maintenanceCount !== undefined &&
                            car.maintenanceCount !== null && (
                              <p
                                className="maintenance-count"
                                style={{ color: "#667eea", fontWeight: 600 }}
                              >
                                ✓ Đã bảo trì: {car.maintenanceCount} lần
                              </p>
                            )}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p style={{ color: "#a0aec0", textAlign: "center", padding: 20 }}>
                    Khách hàng chưa có xe nào
                  </p>
                )}
              </div>
            </div>

            {selectedCar && (
              <div className="details-section">
                <h3>Lịch sử bảo trì - {selectedCar.model || "Xe"}</h3>
                <div className="service-history-table">
                  {(selectedCar.maintenanceServices || selectedCar.serviceHistory)?.length >
                  0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Dịch vụ</th>
                          <th>Thông tin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedCar.maintenanceServices ||
                          selectedCar.serviceHistory).map((service, index) => (
                          <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td>{service.serviceName || service.service || "Dịch vụ bảo trì"}</td>
                            <td>
                              {service.date && (
                                <div>
                                  Ngày:{" "}
                                  {new Date(service.date).toLocaleDateString("vi-VN")}
                                </div>
                              )}
                              {service.cost && (
                                <div>
                                  Chi phí:{" "}
                                  {typeof service.cost === "number"
                                    ? `${service.cost.toLocaleString("vi-VN")} VNĐ`
                                    : service.cost}
                                </div>
                              )}
                              {service.status && (
                                <span
                                  className="status-badge completed"
                                  style={{ marginTop: "5px" }}
                                >
                                  {service.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p
                      style={{
                        color: "#a0aec0",
                        textAlign: "center",
                        padding: 20,
                      }}
                    >
                      Xe chưa có lịch sử bảo trì
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <FaUser size={60} />
            <p>Chọn một khách hàng để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StaffCustomersTab;

