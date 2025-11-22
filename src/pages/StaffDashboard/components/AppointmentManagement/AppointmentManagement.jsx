import React, { useState, useEffect } from 'react';
import './AppointmentManagement.css';
import { 
  FaClock, FaCheckCircle, FaTools, FaCheck, FaTimes, 
  FaCalendarAlt, FaUser, FaCar, FaPhone, FaEnvelope,
  FaSpinner, FaSearch, FaUserPlus
} from 'react-icons/fa';
import { 
  getAllAppointments, 
  acceptAppointment, 
  cancelAppointment,
  startAppointmentProgress,
  completeAppointmentDone,
  getAppointmentStatus
} from '../../../../api';
import AssignTechnicianModal from './AssignTechnicianModal';
import { showSuccess, showError, showWarning } from '../../../../utils/toast';

function AppointmentManagement() {
  const [activeStatus, setActiveStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [allAppointmentsData, setAllAppointmentsData] = useState([]); // Store all data for counting
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest (ID lớn) hoặc oldest (ID bé)
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentDetail, setAppointmentDetail] = useState(null); // Chi tiết appointment với thông tin kỹ thuật viên
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Định nghĩa các tab trạng thái
  const statusTabs = [
    { 
      key: 'all', 
      label: 'Tất cả', 
      icon: <FaCalendarAlt />, 
      color: '#3b82f6',
      apiStatus: null
    },
    { 
      key: 'pending', 
      label: 'Chờ xác nhận', 
      icon: <FaClock />, 
      color: '#f6ad55',
      apiStatus: 'pending'
    },
    { 
      key: 'accepted', 
      label: 'Đã xác nhận', 
      icon: <FaCheckCircle />, 
      color: '#4299e1',
      apiStatus: 'accepted'
    },
    { 
      key: 'in_progress', 
      label: 'Đang thực hiện', 
      icon: <FaTools />, 
      color: '#9f7aea',
      apiStatus: 'in_progress'
    },
    { 
      key: 'completed', 
      label: 'Đã hoàn thành', 
      icon: <FaCheck />, 
      color: '#48bb78',
      apiStatus: 'completed'
    },
    { 
      key: 'cancelled', 
      label: 'Đã hủy', 
      icon: <FaTimes />, 
      color: '#f56565',
      apiStatus: 'cancelled'
    },
  ];

  // Load data khi component mount
  useEffect(() => {
    fetchAppointments();
  }, [activeStatus]);

  // Fetch chi tiết appointment khi chọn appointment (để lấy thông tin kỹ thuật viên)
  useEffect(() => {
    if (selectedAppointment && ['accepted', 'in_progress', 'completed'].includes(selectedAppointment.status)) {
      fetchAppointmentDetail(selectedAppointment.id);
    } else {
      setAppointmentDetail(null);
    }
  }, [selectedAppointment]);

  const fetchAppointmentDetail = async (appointmentId) => {
    try {
      setDetailLoading(true);
      console.log('🔍 Đang tải chi tiết appointment #', appointmentId);
      
      const data = await getAppointmentStatus(appointmentId);
      console.log('📦 Chi tiết appointment:', data);
      
      setAppointmentDetail(data);
      
    } catch (err) {
      console.error('❌ Lỗi khi tải chi tiết appointment:', err);
      // Không hiển thị error cho user vì đây là tính năng bổ sung
      setAppointmentDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Đang tải danh sách lịch hẹn...');
      
      // Lấy centerId của staff từ localStorage
      let staffCenterId = null;
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          staffCenterId = userData.centerId || userData.center_id;
          console.log('🏢 Staff Center ID:', staffCenterId);
        }
      } catch (e) {
        console.error('❌ Lỗi khi đọc thông tin user:', e);
      }
      
      // Gọi API thực tế
      const data = await getAllAppointments();
      console.log('📦 Dữ liệu từ API:', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Data không phải array');
        setAppointments([]);
        return;
      }
      
      // Debug: Xem item đầu tiên để biết API trả về field gì
      if (data.length > 0) {
        console.log('🔍 Sample appointment data:', data[0]);
        console.log('🔍 Available fields:', Object.keys(data[0]));
      }
      
      // Map data từ API sang format component
      let mappedData = data.map(item => {
        const mappedId = item.appointmentId || item.id || item.appointment_id;
        
        if (!mappedId) {
          console.warn('⚠️ Appointment without ID found:', item);
        }
        
        return {
          id: mappedId,
          customerId: item.customerId,
          customerName: item.fullName,
          phone: item.phone,
          email: item.email,
          vehicleId: item.vehicleId,
          vehicleModel: item.vehicleName,
          vehicleVin: item.vehicleVin,
          licensePlate: item.vehicleLicensePlate,
          appointmentDate: item.appoimentDate, // Note: API có typo "appoimentDate"
          status: item.status.toLowerCase(), // Normalize status to lowercase
          services: item.serviceType ? item.serviceType.split(',').map(s => s.trim()) : [],
          cost: item.cost,
          createAt: item.createAt,
          centerId: item.centerId,
          notes: '' // API không có field này
        };
      });
      
      // ✅ FILTER theo centerId của staff
      if (staffCenterId !== null && staffCenterId !== undefined) {
        const beforeFilter = mappedData.length;
        mappedData = mappedData.filter(apt => apt.centerId === staffCenterId);
        console.log(`✅ Đã lọc theo chi nhánh ${staffCenterId}: ${beforeFilter} → ${mappedData.length} lịch hẹn`);
      } else {
        console.warn('⚠️ Không tìm thấy centerId của staff, hiển thị tất cả lịch hẹn');
      }
      
      // Lưu tất cả data để tính count
      setAllAppointmentsData(mappedData);
      
      // Filter theo status nếu không phải "all"
      const filteredData = activeStatus === 'all' 
        ? mappedData 
        : mappedData.filter(apt => apt.status === activeStatus);
      
      console.log(`✅ Đã tải ${mappedData.length} lịch hẹn, hiển thị ${filteredData.length}`);
      setAppointments(filteredData);
      setSelectedAppointment(null);
      
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách lịch hẹn:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách lịch hẹn');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Chấp nhận lịch hẹn
  const handleAcceptAppointment = async (appointmentId) => {
    try {
      setActionLoading(true);
      console.log('✅ Đang chấp nhận lịch hẹn #', appointmentId);
      
      await acceptAppointment(appointmentId);
      
      console.log('✅ Đã chấp nhận lịch hẹn thành công');
      showSuccess('Đã chấp nhận lịch hẹn thành công!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi chấp nhận lịch hẹn:', err);
      showError(err.response?.data?.message || 'Không thể chấp nhận lịch hẹn');
    } finally{
      setActionLoading(false);
    }
  };

  // Handler: Từ chối/Hủy lịch hẹn
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('❌ Đang hủy lịch hẹn #', appointmentId);
      
      await cancelAppointment(appointmentId);
      
      console.log('✅ Đã hủy lịch hẹn thành công');
      showSuccess('Đã hủy lịch hẹn thành công!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi hủy lịch hẹn:', err);
      showError(err.response?.data?.message || 'Không thể hủy lịch hẹn');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Bắt đầu thực hiện lịch hẹn
  const handleStartAppointment = async (appointmentId) => {
    try {
      setActionLoading(true);
      console.log('🔧 Đang bắt đầu thực hiện lịch hẹn #', appointmentId);
      
      await startAppointmentProgress(appointmentId);
      
      console.log('✅ Đã bắt đầu thực hiện lịch hẹn');
      showSuccess('Đã bắt đầu thực hiện lịch hẹn!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi bắt đầu lịch hẹn:', err);
      showError(err.response?.data?.message || 'Không thể bắt đầu lịch hẹn');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Hoàn thành lịch hẹn
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      setActionLoading(true);
      console.log('✔️ Đang hoàn thành lịch hẹn #', appointmentId);
      
      await completeAppointmentDone(appointmentId);
      
      console.log('✅ Đã hoàn thành lịch hẹn');
      showSuccess('Đã hoàn thành lịch hẹn!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi hoàn thành lịch hẹn:', err);
      showError(err.response?.data?.message || 'Không thể hoàn thành lịch hẹn');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Giao việc cho technician
  const handleAssignTechnicians = async (technicianIds) => {
    console.log('✅ Đã giao việc cho technicians:', technicianIds);
    // Reload data sau khi giao việc
    await fetchAppointments();
  };

  // Lọc appointments theo search query
  let filteredAppointments = appointments.filter((apt) =>
    apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.phone.includes(searchQuery) ||
    apt.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sắp xếp theo ID
  filteredAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.id - a.id; // ID lớn trước
    } else {
      return a.id - b.id; // ID bé trước
    }
  });

  // Get current tab info
  const currentTab = statusTabs.find(tab => tab.key === activeStatus);
  
  // Helper function để lấy thông tin status
  const getStatusInfo = (status) => {
    return statusTabs.find(tab => tab.key === status) || statusTabs[0];
  };

  return (
    <div className="appointment-management">
      {/* Header */}
      <div className="appointment-header">
        <h2>Quản lý lịch hẹn</h2>
        
        <div className="header-actions">
          {/* Sort Dropdown */}
          <div className="sort-dropdown">
            <label>Sắp xếp:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">ID mới nhất</option>
              <option value="oldest">ID cũ nhất</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, số điện thoại, biển số xe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        {statusTabs.map((tab) => {
          const count = tab.key === 'all' 
            ? allAppointmentsData.length 
            : allAppointmentsData.filter(apt => apt.status === tab.key).length;
          
          return (
            <button
              key={tab.key}
              className={`status-tab ${activeStatus === tab.key ? 'active' : ''}`}
              onClick={() => setActiveStatus(tab.key)}
              style={{
                '--tab-color': tab.color
              }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={fetchAppointments}>Thử lại</button>
        </div>
      )}

      {/* Content */}
      <div className="appointment-content">
        {/* Appointments List */}
        <div className="appointments-list">
          <div className="list-header">
            <h3>
              Danh sách ({filteredAppointments.length})
            </h3>
          </div>

          <div className="appointments-items">
            {loading ? (
              <div className="loading-state">
                <FaSpinner className="spinner" />
                <p>Đang tải danh sách...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="empty-state">
                <FaClock size={50} />
                <p>Không có lịch hẹn nào</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const appointmentStatus = activeStatus === 'all' 
                  ? getStatusInfo(appointment.status) 
                  : currentTab;
                
                return (
                  <div
                    key={appointment.id}
                    className={`appointment-item ${selectedAppointment?.id === appointment.id ? 'active' : ''}`}
                    onClick={() => {
                      console.log('🖱️ Selected appointment:', appointment);
                      console.log('📋 Appointment ID:', appointment.id);
                      setSelectedAppointment(appointment);
                    }}
                  >
                    <div className="appointment-item-header">
                      <div className="appointment-icon" style={{ background: appointmentStatus.color }}>
                        {appointmentStatus.icon}
                      </div>
                      <div className="appointment-basic-info">
                        <div className="appointment-name-id">
                          <h4>{appointment.customerName}</h4>
                          <span className="appointment-id">#{appointment.id}</span>
                        </div>
                      </div>
                      {activeStatus === 'all' && (
                        <span 
                          className="appointment-status-badge" 
                          style={{ background: appointmentStatus.color }}
                        >
                          {appointmentStatus.label}
                        </span>
                      )}
                    </div>
                    
                    <div className="appointment-item-body">
                      <div className="info-row">
                        <FaCar />
                        <span>{appointment.vehicleModel} - {appointment.licensePlate}</span>
                      </div>
                      <div className="info-row">
                        <FaCalendarAlt />
                        <span>{new Date(appointment.appointmentDate).toLocaleString('vi-VN')}</span>
                      </div>
                      <div className="info-row">
                        <FaPhone />
                        <span>{appointment.phone}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Appointment Detail */}
        <div className="appointment-detail">
          {selectedAppointment ? (
            (() => {
              const detailStatus = activeStatus === 'all' 
                ? getStatusInfo(selectedAppointment.status) 
                : currentTab;
              
              return (
                <>
                  <div className="detail-header">
                    <div className="detail-icon-large" style={{ background: detailStatus.color }}>
                      {detailStatus.icon}
                    </div>
                    <div>
                      <h2>Chi tiết lịch hẹn #{selectedAppointment.id}</h2>
                      <span 
                        className="status-badge" 
                        style={{ background: detailStatus.color }}
                      >
                        {detailStatus.label}
                      </span>
                    </div>
                  </div>

              <div className="detail-section">
                <h3>Thông tin khách hàng</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaUser />
                    <div>
                      <span className="label">Tên khách hàng</span>
                      <span className="value">{selectedAppointment.customerName}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaPhone />
                    <div>
                      <span className="label">Số điện thoại</span>
                      <span className="value">{selectedAppointment.phone}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaEnvelope />
                    <div>
                      <span className="label">Email</span>
                      <span className="value">{selectedAppointment.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin xe</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaCar />
                    <div>
                      <span className="label">Model</span>
                      <span className="value">{selectedAppointment.vehicleModel}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaCar />
                    <div>
                      <span className="label">Biển số xe</span>
                      <span className="value">{selectedAppointment.licensePlate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin dịch vụ</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <div>
                      <span className="label">Thời gian hẹn</span>
                      <span className="value">
                        {new Date(selectedAppointment.appointmentDate).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  {selectedAppointment.cost > 0 && (
                    <div className="detail-item">
                      <FaCheck />
                      <div>
                        <span className="label">Chi phí</span>
                        <span className="value highlight">
                          {selectedAppointment.cost.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="services-list">
                  <h4>Dịch vụ yêu cầu:</h4>
                  <ul>
                    {selectedAppointment.services.length > 0 ? (
                      selectedAppointment.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))
                    ) : (
                      <li style={{ borderBottom: 'none', color: '#a0aec0' }}>Chưa có dịch vụ nào</li>
                    )}
                  </ul>
                </div>

                {selectedAppointment.notes && (
                  <div className="notes-section">
                    <h4>Ghi chú:</h4>
                    <p>{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Thông tin kỹ thuật viên - chỉ hiển thị cho accepted, in_progress, completed */}
              {['accepted', 'in_progress', 'completed'].includes(selectedAppointment.status) && (
                <div className="detail-section">
                  <h3>Kỹ thuật viên được giao</h3>
                  {detailLoading ? (
                    <div className="technicians-loading">
                      <FaSpinner className="spinner" />
                      <p>Đang tải thông tin kỹ thuật viên...</p>
                    </div>
                  ) : appointmentDetail && appointmentDetail.users && appointmentDetail.users.length > 0 ? (
                    <div className="technicians-list">
                      {appointmentDetail.users.map((tech, index) => (
                        <div key={tech.id || index} className="technician-card">
                          <div className="technician-avatar">
                            <FaUser />
                          </div>
                          <div className="technician-info">
                            <h4>{tech.fullName}</h4>
                            <div className="tech-detail-row">
                              <FaPhone />
                              <span>{tech.phone || 'Chưa có số điện thoại'}</span>
                            </div>
                            {tech.email && (
                              <div className="tech-detail-row">
                                <FaEnvelope />
                                <span>{tech.email}</span>
                              </div>
                            )}
                            {tech.role && (
                              <div className="tech-role-badge">
                                {tech.role}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-technicians">
                      <FaUserPlus size={40} />
                      <p>Chưa có kỹ thuật viên được giao</p>
                    </div>
                  )}
                </div>
              )}

              {activeStatus !== 'all' && (
                <div className="detail-actions">
                  {activeStatus === 'pending' && (
                    <>
                      <button 
                        className="btn-accept"
                        onClick={() => handleAcceptAppointment(selectedAppointment.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <FaSpinner className="spinner" /> : <FaCheckCircle />}
                        {actionLoading ? 'Đang xử lý...' : 'Xác nhận'}
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => handleCancelAppointment(selectedAppointment.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <FaSpinner className="spinner" /> : <FaTimes />}
                        {actionLoading ? 'Đang xử lý...' : 'Từ chối'}
                      </button>
                    </>
                  )}
                  {activeStatus === 'accepted' && (
                    <>
                      <button 
                        className="btn-assign"
                        onClick={() => {
                          if (!selectedAppointment?.id) {
                            showError('Không tìm thấy ID lịch hẹn. Vui lòng chọn lại lịch hẹn.');
                            return;
                          }
                          console.log('🔍 Opening modal for appointment ID:', selectedAppointment.id);
                          setShowAssignModal(true);
                        }}
                        disabled={actionLoading}
                      >
                        <FaUserPlus />
                        Giao việc cho Technician
                      </button>
                      <button 
                        className="btn-start"
                        onClick={() => handleStartAppointment(selectedAppointment.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <FaSpinner className="spinner" /> : <FaTools />}
                        {actionLoading ? 'Đang xử lý...' : 'Bắt đầu thực hiện'}
                      </button>
                    </>
                  )}
                  {activeStatus === 'in_progress' && (
                    <>
                      <button 
                        className="btn-assign"
                        onClick={() => {
                          if (!selectedAppointment?.id) {
                            showError('Không tìm thấy ID lịch hẹn. Vui lòng chọn lại lịch hẹn.');
                            return;
                          }
                          console.log('🔍 Opening edit modal for appointment ID:', selectedAppointment.id);
                          setShowAssignModal(true);
                        }}
                        disabled={actionLoading}
                      >
                        <FaUserPlus />
                        Chỉnh sửa Technician
                      </button>
                      <button 
                        className="btn-complete"
                        onClick={() => handleCompleteAppointment(selectedAppointment.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <FaSpinner className="spinner" /> : <FaCheck />}
                        {actionLoading ? 'Đang xử lý...' : 'Hoàn thành'}
                      </button>
                    </>
                  )}
                </div>
              )}
                </>
              );
            })()
          ) : (
            <div className="empty-detail">
              <FaClock size={60} />
              <p>Chọn một lịch hẹn để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Technician Modal */}
      <AssignTechnicianModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        appointmentId={selectedAppointment?.id}
        onAssign={handleAssignTechnicians}
        existingTechnicians={appointmentDetail?.users || []}
      />
    </div>
  );
}

export default AppointmentManagement;
