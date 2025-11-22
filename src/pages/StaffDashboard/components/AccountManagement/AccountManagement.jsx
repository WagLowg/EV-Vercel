import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaPhone, FaEnvelope, FaCar, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaBan, FaSpinner } from 'react-icons/fa';
import './AccountManagement.css';
import { getAllCustomers } from '../../../../api';

function AccountManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customers từ API
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Đang tải danh sách khách hàng...');
      
      const data = await getAllCustomers();
      console.log('📦 Dữ liệu khách hàng từ API:', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Data không phải array');
        setCustomers([]);
        return;
      }
      
      setCustomers(data);
      console.log('✅ Đã tải', data.length, 'khách hàng');
      
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách khách hàng:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách khách hàng');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Lọc khách hàng theo search query
  const filteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <div className="account-management">
      <div className="account-header">
        <h2>Quản lý tài khoản</h2>
        
        {/* Search Box */}
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng (tên, email, số điện thoại)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={fetchCustomers}>Thử lại</button>
        </div>
      )}

      <div className="account-content">
        {/* Danh sách khách hàng */}
        <div className="customer-list">
          <h3>Danh sách khách hàng ({filteredCustomers.length})</h3>
          <div className="customer-items">
            {loading ? (
              <div className="loading-state">
                <FaSpinner className="spinner" />
                <p>Đang tải danh sách khách hàng...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy khách hàng nào</p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`customer-item ${selectedCustomer?.id === customer.id ? 'active' : ''}`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="customer-avatar">
                    <FaUser />
                  </div>
                  <div className="customer-info">
                    <h4>{customer.fullName}</h4>
                    <p>{customer.email}</p>
                    <p className="customer-phone">{customer.phone}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chi tiết khách hàng */}
        <div className="customer-detail">
          {selectedCustomer ? (
            <>
              <div className="detail-header">
                <div className="detail-avatar-large">
                  <FaUser />
                </div>
                <div>
                  <h2>{selectedCustomer.fullName}</h2>
                  <p className="customer-id">ID: #{selectedCustomer.id}</p>
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin liên hệ</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaEnvelope />
                    <div>
                      <span className="label">Email</span>
                      <span className="value">{selectedCustomer.email}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaPhone />
                    <div>
                      <span className="label">Số điện thoại</span>
                      <span className="value">{selectedCustomer.phone}</span>
                    </div>
                  </div>
                        <div className="detail-item">
                          <FaCalendarAlt />
                          <div>
                            <span className="label">Ngày tham gia</span>
                            <span className="value">
                              {selectedCustomer.create_at 
                                ? new Date(selectedCustomer.create_at).toLocaleDateString('vi-VN')
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </div>
                  <div className="detail-item">
                    {selectedCustomer.status === 'active' ? <FaCheckCircle /> : selectedCustomer.status === 'inactive' ? <FaTimesCircle /> : <FaBan />}
                    <div>
                      <span className="label">Trạng thái</span>
                      <span className={`value status-${selectedCustomer.status}`}>
                        {selectedCustomer.status === 'active' ? 'Đang hoạt động' : selectedCustomer.status === 'inactive' ? 'Không hoạt động' : 'Bị khóa'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Danh sách xe ({selectedCustomer.vehicles.length})</h3>
                {selectedCustomer.vehicles.length === 0 ? (
                  <div className="empty-vehicles">
                    <FaCar size={40} />
                    <p>Khách hàng chưa có xe nào</p>
                  </div>
                ) : (
                  <div className="vehicles-grid">
                    {selectedCustomer.vehicles.map((vehicle) => (
                      <div key={vehicle.vehicleId} className="vehicle-card">
                        <div className="vehicle-icon">
                          <FaCar />
                        </div>
                        <div className="vehicle-info">
                          <h4>{vehicle.model}</h4>
                          <p className="vehicle-year">Năm {vehicle.year}</p>
                          <div className="vehicle-details">
                            <span>🚗 Biển số: {vehicle.licensePlate}</span>
                            <span>🔢 Số Vin: {vehicle.vin}</span>
                            <span>🎨 Màu sắc: {vehicle.color}</span>
                          </div>
                          {vehicle.maintenanceCount > 0 && (
                            <div className="vehicle-maintenance">
                              <span>🔧 Bảo dưỡng: {vehicle.maintenanceCount} lần</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-detail">
              <FaUser size={60} />
              <p>Chọn một khách hàng để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountManagement;

