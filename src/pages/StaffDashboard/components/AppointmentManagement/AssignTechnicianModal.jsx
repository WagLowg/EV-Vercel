import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaUserPlus, FaSpinner, FaIdBadge, FaClipboardList, FaClock, FaStar } from 'react-icons/fa';
import './AssignTechnicianModal.css';
import { showSuccess, showError, showWarning } from '../../../../utils/toast';
import { getAllTechnicians, assignTechniciansToAppointment } from '../../../../api';

function AssignTechnicianModal({ isOpen, onClose, appointmentId, onAssign, existingTechnicians = [] }) {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechIds, setSelectedTechIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTechnicians();
      
      // Pre-select technicians đã được giao trước đó
      const existingIds = existingTechnicians.map(tech => tech.id);
      setSelectedTechIds(existingIds);
      
      if (existingIds.length > 0) {
        console.log('✅ Pre-selected technicians:', existingIds);
      }
    }
  }, [isOpen, existingTechnicians]);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      console.log('🔄 Đang tải danh sách tất cả technicians...');
      
      // Debug: Kiểm tra token
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      console.log('🔐 Token exists:', !!token);
      if (userStr) {
        const userData = JSON.parse(userStr);
        console.log('👤 User role:', userData.role);
        console.log('👤 User info:', userData);
      }
      
      // Gọi API lấy tất cả technicians
      const data = await getAllTechnicians();
      console.log('📦 Dữ liệu technicians từ API:', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Data không phải array');
        setTechnicians([]);
        return;
      }
      
      // Map data từ API sang format component
      // API response: { id, fullName, email, phone, appointmentId, working }
      const mappedTechnicians = data.map(tech => ({
        id: tech.id,
        fullName: tech.fullName,
        email: tech.email,
        phone: tech.phone,
        status: tech.working ? 'busy' : 'available', // working: true = đang bận
        currentAppointmentId: tech.appointmentId || null, // ID của appointment đang làm (nếu có)
        currentJobs: tech.working && tech.appointmentId ? [
          { 
            id: tech.appointmentId, 
            customerName: 'Đang thực hiện', 
            vehicleModel: 'Lịch hẹn #' + tech.appointmentId 
          }
        ] : [], // Hiển thị appointment đang làm nếu có
        expertise: 'Kỹ thuật viên', // API không có field này
        rating: 0, // API không có field này
        completedJobs: 0 // API không có field này
      }));
      
      console.log('✅ Đã map', mappedTechnicians.length, 'technicians');
      console.log('📊 Sẵn sàng:', mappedTechnicians.filter(t => t.status === 'available').length);
      console.log('📊 Đang bận:', mappedTechnicians.filter(t => t.status === 'busy').length);
      
      setTechnicians(mappedTechnicians);
      
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách kỹ thuật viên:', error);
      showError(error.response?.data?.message || 'Không thể tải danh sách kỹ thuật viên');
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTechnician = (techId) => {
    setSelectedTechIds(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  const handleAssign = async () => {
    if (selectedTechIds.length === 0) {
      showWarning('Vui lòng chọn ít nhất một kỹ thuật viên');
      return;
    }

    const isEditing = existingTechnicians.length > 0;

    try {
      setAssigning(true);
      console.log(`🔧 ${isEditing ? 'Đang cập nhật' : 'Đang giao việc cho'} technicians:`, selectedTechIds);
      console.log('📋 Appointment ID:', appointmentId);
      
      // Gọi API thực tế để giao việc
      await assignTechniciansToAppointment(appointmentId, selectedTechIds, '');
      
      console.log(`✅ Đã ${isEditing ? 'cập nhật' : 'giao việc'} thành công`);
      showSuccess(`Đã ${isEditing ? 'cập nhật' : 'giao việc cho'} ${selectedTechIds.length} kỹ thuật viên thành công!`);
      
      // Callback để reload data
      onAssign(selectedTechIds);
      handleClose();
      
    } catch (error) {
      console.error(`❌ Lỗi khi ${isEditing ? 'cập nhật' : 'giao việc'}:`, error);
      
      // Xử lý error messages chi tiết
      let errorMessage = `Không thể ${isEditing ? 'cập nhật' : 'giao việc'}. Vui lòng thử lại.`;
      
      if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền giao việc cho kỹ thuật viên.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showError(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedTechIds([]);
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = existingTechnicians.length > 0;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content assign-tech-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-title-icon">
              <FaUserPlus />
            </div>
            <div>
              <h2>{isEditing ? 'Chỉnh sửa Kỹ thuật viên' : 'Giao việc cho Kỹ thuật viên'}</h2>
              <p className="modal-subtitle">
                Lịch hẹn #{appointmentId}
                {isEditing && <span style={{ color: '#48bb78', marginLeft: '8px' }}>• Đã giao {existingTechnicians.length} người</span>}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <FaSpinner className="spinner" />
              <p>Đang tải danh sách kỹ thuật viên...</p>
            </div>
          ) : (
            <>
              <div className="technicians-grid-new">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className={`tech-card-new ${selectedTechIds.includes(tech.id) ? 'selected' : ''} ${tech.status === 'busy' ? 'busy' : ''}`}
                    onClick={() => handleToggleTechnician(tech.id)}
                  >
                    {/* Header */}
                    <div className="tech-card-header">
                      <div className="tech-avatar-new">
                        <FaUser />
                      </div>
                      <div className="tech-main-info">
                        <h3>{tech.fullName}</h3>
                        <div className="tech-id">
                          <FaIdBadge />
                          <span>ID: {tech.id}</span>
                        </div>
                      </div>
                      <div className={`tech-status-badge ${tech.status}`}>
                        {tech.status === 'available' ? (
                          <>
                            <span className="status-dot available"></span>
                            Sẵn sàng
                          </>
                        ) : (
                          <>
                            <span className="status-dot busy"></span>
                            Đang bận
                          </>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="tech-card-body">
                      <div className="tech-contact-info">
                        <div className="contact-item">
                          📧 {tech.email}
                        </div>
                        {tech.phone && (
                          <div className="contact-item">
                            📱 {tech.phone}
                          </div>
                        )}
                      </div>

                      {/* Current Jobs */}
                      {tech.currentJobs && tech.currentJobs.length > 0 && (
                        <div className="tech-current-jobs">
                          <div className="current-jobs-header">
                            <FaClipboardList />
                            <span>Đang làm {tech.currentJobs.length} đơn:</span>
                          </div>
                          <div className="jobs-list">
                            {tech.currentJobs.map((job) => (
                              <div key={job.id} className="job-item">
                                <FaClock />
                                <div className="job-info">
                                  <span className="job-id">#{job.id}</span>
                                  <span className="job-customer">{job.customerName}</span>
                                  <span className="job-vehicle">{job.vehicleModel}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {tech.currentJobs && tech.currentJobs.length === 0 && (
                        <div className="tech-no-jobs">
                          <FaClipboardList />
                          <span>Chưa có đơn nào</span>
                        </div>
                      )}
                    </div>

                    {/* Selection Check */}
                    {selectedTechIds.includes(tech.id) && (
                      <div className="tech-check-new">
                        <FaUserPlus />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {technicians.length === 0 && (
                <div className="empty-state">
                  <FaUser size={50} />
                  <p>Không có kỹ thuật viên nào</p>
                </div>
              )}

              {selectedTechIds.length > 0 && (
                <div className="selected-summary">
                  <FaUserPlus />
                  <span>Đã chọn <strong>{selectedTechIds.length}</strong> kỹ thuật viên</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose} disabled={assigning}>
            <FaTimes />
            Hủy
          </button>
          <button 
            className="btn-primary" 
            onClick={handleAssign} 
            disabled={loading || assigning || selectedTechIds.length === 0}
          >
            {assigning ? (
              <>
                <FaSpinner className="spinner" />
                {isEditing ? 'Đang cập nhật...' : 'Đang giao việc...'}
              </>
            ) : (
              <>
                <FaUserPlus />
                {isEditing ? `Cập nhật (${selectedTechIds.length})` : `Giao việc (${selectedTechIds.length})`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignTechnicianModal;
