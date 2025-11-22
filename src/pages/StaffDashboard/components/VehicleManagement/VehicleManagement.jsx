import React, { useState, useEffect, useMemo } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { getMaintainedVehicles } from '../../../../api';
import './VehicleManagement.css';

function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [sortBy, setSortBy] = useState('closetTime'); // closetTime, maintenanceCount, model
  const [filterModel, setFilterModel] = useState(''); // Filter theo model
  const [filterColor, setFilterColor] = useState(''); // Filter theo màu sắc

  // Load dữ liệu xe khi component mount
  useEffect(() => {
    loadVehicles();
  }, []);

  // Filter và search khi searchTerm hoặc vehicles thay đổi
  useEffect(() => {
    filterAndSortVehicles();
  }, [searchTerm, vehicles, sortBy, filterModel, filterColor]);

  // Lấy danh sách unique models
  const uniqueModels = useMemo(() => {
    const models = vehicles.map(v => v.model).filter(Boolean);
    return [...new Set(models)].sort();
  }, [vehicles]);

  // Lấy danh sách unique colors
  const uniqueColors = useMemo(() => {
    const colors = vehicles.map(v => v.color).filter(Boolean);
    return [...new Set(colors)].sort();
  }, [vehicles]);

  const loadVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMaintainedVehicles();
      setVehicles(data || []);
    } catch (err) {
      console.error('Error loading maintained vehicles:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortVehicles = () => {
    let filtered = [...vehicles];

    // Tìm kiếm
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(v => 
        v.model?.toLowerCase().includes(term) ||
        v.vin?.toLowerCase().includes(term) ||
        v.licensePlate?.toLowerCase().includes(term) ||
        v.ownerName?.toLowerCase().includes(term)
      );
    }

    // Filter theo model
    if (filterModel) {
      filtered = filtered.filter(v => v.model === filterModel);
    }

    // Filter theo màu sắc
    if (filterColor) {
      filtered = filtered.filter(v => v.color === filterColor);
    }

    // Sắp xếp
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'maintenanceCount':
          return b.maintenanceCount - a.maintenanceCount;
        case 'model':
          return (a.model || '').localeCompare(b.model || '');
        case 'closetTime':
        default:
          return new Date(b.closetTime) - new Date(a.closetTime);
      }
    });

    setFilteredVehicles(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
  };

  if (loading) {
    return (
      <div className="vehicle-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải danh sách xe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vehicle-management">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button onClick={loadVehicles} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-management">
      {/* Header */}
      <div className="vm-header">
        <div className="vm-title">
          <h2>🚗 Quản lý xe đã bảo dưỡng</h2>
          <span className="vehicle-count">{filteredVehicles.length} xe</span>
        </div>
        <button onClick={loadVehicles} className="refresh-btn" title="Làm mới">
          <FaSyncAlt />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="vm-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên xe, VIN, biển số, chủ xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <label>Model:</label>
            <select value={filterModel} onChange={(e) => setFilterModel(e.target.value)}>
              <option value="">Tất cả</option>
              {uniqueModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Màu sắc:</label>
            <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
              <option value="">Tất cả</option>
              {uniqueColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Sắp xếp:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="closetTime">Mới nhất</option>
              <option value="maintenanceCount">Số lần bảo dưỡng</option>
              <option value="model">Tên xe (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      {filteredVehicles.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🚙</span>
          <h3>Không tìm thấy xe nào</h3>
          <p>
            {searchTerm 
              ? `Không có kết quả cho "${searchTerm}"`
              : 'Chưa có xe nào được bảo dưỡng'}
          </p>
        </div>
      ) : (
        <div className="vehicles-grid">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.vehicleId} className="vehicle-card">
              <div className="vehicle-card-header">
                <div className="vehicle-model">
                  <h3>{vehicle.model}</h3>
                  <span className="vehicle-year">{vehicle.year}</span>
                </div>
                <div className="maintenance-badge">
                  {vehicle.maintenanceCount} lần
                </div>
              </div>

              <div className="vehicle-details">
                <div className="detail-row">
                  <span className="label">Biển số:</span>
                  <span className="value">{vehicle.licensePlate || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">VIN:</span>
                  <span className="value vin">{vehicle.vin || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Màu sắc:</span>
                  <span className="value">
                    <span className="color-dot" style={{ backgroundColor: vehicle.color || '#ccc' }}></span>
                    {vehicle.color || 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Chủ xe:</span>
                  <span className="value">{vehicle.ownerName || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Lần cuối:</span>
                  <span className="value">{formatDate(vehicle.closetTime)}</span>
                </div>
              </div>

              <div className="vehicle-services">
                <p className="services-label">Dịch vụ đã thực hiện:</p>
                <div className="services-tags">
                  {vehicle.maintenanceServices && vehicle.maintenanceServices.length > 0 ? (
                    vehicle.maintenanceServices.slice(0, 3).map((service, idx) => (
                      <span key={idx} className="service-tag">{service}</span>
                    ))
                  ) : (
                    <span className="no-services">Chưa có dịch vụ</span>
                  )}
                  {vehicle.maintenanceServices && vehicle.maintenanceServices.length > 3 && (
                    <span className="more-services">
                      +{vehicle.maintenanceServices.length - 3} khác
                    </span>
                  )}
                </div>
              </div>

              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(vehicle)}
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết xe */}
      {selectedVehicle && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết xe: {selectedVehicle.model}</h2>
              <button className="close-modal-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>Thông tin xe</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Mẫu xe:</span>
                    <span className="info-value">{selectedVehicle.model}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Năm sản xuất:</span>
                    <span className="info-value">{selectedVehicle.year}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">VIN:</span>
                    <span className="info-value">{selectedVehicle.vin || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Biển số:</span>
                    <span className="info-value">{selectedVehicle.licensePlate || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Màu sắc:</span>
                    <span className="info-value">
                      <span className="color-dot" style={{ backgroundColor: selectedVehicle.color || '#ccc' }}></span>
                      {selectedVehicle.color || 'N/A'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Chủ xe:</span>
                    <span className="info-value">{selectedVehicle.ownerName || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>Lịch sử bảo dưỡng</h4>
                <div className="maintenance-info">
                  <div className="maintenance-stat">
                    <span className="stat-value">{selectedVehicle.maintenanceCount}</span>
                    <span className="stat-label">Tổng số lần bảo dưỡng</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>Các dịch vụ đã thực hiện</h4>
                <div className="all-services-list">
                  {selectedVehicle.maintenanceServices && selectedVehicle.maintenanceServices.length > 0 ? (
                    selectedVehicle.maintenanceServices.map((service, idx) => (
                      <div key={idx} className="service-item">
                        <span className="service-number">{idx + 1}</span>
                        <span className="service-name">{service}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">Chưa có dịch vụ nào được thực hiện</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={closeModal} className="close-btn">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleManagement;

