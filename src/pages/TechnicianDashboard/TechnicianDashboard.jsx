import React, { useState, useEffect } from 'react';
import './TechnicianDashboard.css';
import { 
  FaClock, FaCheckCircle, FaTools, FaCheck, 
  FaCalendarAlt, FaUser, FaCar, FaPhone,
  FaSpinner, FaSearch, FaClipboardList, FaPlus, FaTimesCircle,
  FaSignOutAlt
} from 'react-icons/fa';
import { 
  getAppointmentsForStaff,
  startAppointment, 
  completeAppointment,
  createMaintenanceRecord,
  markAppointmentAsDone,
  getServiceTypes,
  updatePartUsage
} from '../../api';
import { showSuccess, showError, showWarning } from '../../utils/toast';
import { getCurrentCenterId } from '../../utils/centerFilter';
import MaintenanceChecklist from '../../components/maintenance/MaintenanceChecklist';

function TechnicianDashboard() {
  const [activeStatus, setActiveStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [allAppointmentsData, setAllAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditingCondition, setIsEditingCondition] = useState(false);
  const [vehicleCondition, setVehicleCondition] = useState({
    exterior: '',
    interior: '',
    battery: '',
    tires: ''
  });
  
  // Service Types State
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceDescription, setSelectedServiceDescription] = useState('');
  const [selectedServiceName, setSelectedServiceName] = useState('');
  
  // Maintenance Record State
  const [maintenanceRecord, setMaintenanceRecord] = useState({
    vehicleCondition: '',
    checklist: [],
    vehicleConditions: {},
    remarks: '',
    partsUsed: [],
    staffIds: []
  });
  
  // Maintenance Record ID (sau khi tạo record)
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [originalPartsUsed, setOriginalPartsUsed] = useState([]); // Lưu parts ban đầu để so sánh

  // Định nghĩa các trạng thái
  const statusTabs = [
    { 
      key: 'all', 
      label: 'Tất cả', 
      icon: <FaClipboardList />, 
      color: '#667eea',
      apiStatus: null
    },
    { 
      key: 'accepted', 
      label: 'Đã xác nhận', 
      icon: <FaCheckCircle />, 
      color: '#f6ad55',
      apiStatus: 'accepted'
    },
    { 
      key: 'in_progress', 
      label: 'Đang làm', 
      icon: <FaTools />, 
      color: '#9f7aea',
      apiStatus: 'in_progress'
    },
    { 
      key: 'completed', 
      label: 'Hoàn tất', 
      icon: <FaCheck />, 
      color: '#48bb78',
      apiStatus: 'completed'
    },
  ];

  useEffect(() => {
    fetchAppointments();
    loadServiceTypes();
  }, [activeStatus]);

  // Load service types
  const loadServiceTypes = async () => {
    try {
      const data = await getServiceTypes();
      setServiceTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Lỗi khi tải service types:', err);
      setServiceTypes([]);
    }
  };

  // Update service description when appointment changes
  useEffect(() => {
    if (selectedAppointment) {
      // Priority 1: Use description from appointment if available
      if (selectedAppointment.description) {
        setSelectedServiceDescription(selectedAppointment.description);
        setSelectedServiceName(selectedAppointment.services?.[0] || 'Dịch vụ bảo dưỡng');
        console.log('✅ Using description from appointment');
        return;
      }
      
      // Priority 2: Find matching service type by name
      if (selectedAppointment.services && serviceTypes.length > 0) {
        let matchedService = null;
        
        // Try to find matching service type by name
        for (const serviceName of selectedAppointment.services) {
          matchedService = serviceTypes.find(st => {
            const stName = (st.name || '').toLowerCase();
            const aptName = serviceName.toLowerCase();
            // Check if names match or contain each other
            return stName === aptName || 
                   stName.includes(aptName) || 
                   aptName.includes(stName) ||
                   // Also check for key words like "Cơ bản", "Tiêu chuẩn", "Cao cấp"
                   (stName.includes('cơ bản') && aptName.includes('cơ bản')) ||
                   (stName.includes('tiêu chuẩn') && aptName.includes('tiêu chuẩn')) ||
                   (stName.includes('cao cấp') && aptName.includes('cao cấp'));
          });
          
          if (matchedService) break;
        }
        
        if (matchedService) {
          setSelectedServiceDescription(matchedService.description || '');
          setSelectedServiceName(matchedService.name || '');
          console.log('✅ Matched service from service types:', matchedService.name);
        } else {
          // If no match found, use first service name
          const firstServiceName = selectedAppointment.services[0] || '';
          setSelectedServiceDescription('');
          setSelectedServiceName(firstServiceName);
          console.warn('⚠️ No matching service type found for:', selectedAppointment.services);
        }
      } else {
        setSelectedServiceDescription('');
        setSelectedServiceName(selectedAppointment.services?.[0] || '');
      }
    } else {
      setSelectedServiceDescription('');
      setSelectedServiceName('');
    }
  }, [selectedAppointment, serviceTypes]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [Technician] Đang tải danh sách phiếu dịch vụ...');
      
      // Debug: Kiểm tra user info
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          console.log('👤 [Technician] User data:', userData);
          console.log('👤 [Technician] User ID:', userData.user_id || userData.id || userData.userId);
          console.log('👤 [Technician] Role:', userData.role);
        } catch (e) {
          console.error('❌ Lỗi parse user data:', e);
        }
      } else {
        console.error('❌ Không tìm thấy user trong localStorage');
      }
      
      const data = await getAppointmentsForStaff();
      console.log('📦 [Technician] Dữ liệu từ API:', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Data không phải array');
        setAppointments([]);
        setAllAppointmentsData([]);
        return;
      }
      
      // Debug: Xem item đầu tiên
      if (data.length > 0) {
        console.log('🔍 Sample appointment:', data[0]);
        console.log('🔍 Available fields:', Object.keys(data[0]));
      }
      
      // Map data từ API mới
      const mappedData = data.map(item => ({
        id: item.appointmentId,
        customerId: item.customerId,
        customerName: item.customerName,
        phone: item.phone,
        email: item.email,
        vehicleId: item.vehicle?.id,
        vehicleModel: item.vehicleModel,
        vehicleVin: item.vehicle?.vin,
        licensePlate: item.vehicle?.licensePlate,
        appointmentDate: item.appointmentDate,
        status: (item.status || '').toLowerCase(),
        services: item.serviceNames || [],
        cost: item.total || 0,
        notes: item.note || '',
        checkList: item.checkList || [],
        serviceCenterName: item.serviceCenterName,
        assignedTechs: item.users || [],
        description: item.description || '' // Service description from appointment
      }));
      
      setAllAppointmentsData(mappedData);
      
      const filteredData = activeStatus === 'all' 
        ? mappedData 
        : mappedData.filter(apt => apt.status === activeStatus);
      
      console.log(`✅ Đã tải ${mappedData.length} phiếu, hiển thị ${filteredData.length}`);
      setAppointments(filteredData);
      setSelectedAppointment(null);
      
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách:', err);
      
      let errorMsg = 'Không thể tải danh sách phiếu dịch vụ';
      
      // Nếu là error từ validation user ID
      if (err.message && !err.response) {
        errorMsg = err.message;
      } else if (err.response?.status === 500) {
        errorMsg = 'Lỗi server (500). Vui lòng liên hệ admin.';
      } else if (err.response?.status === 401) {
        errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
      } else if (err.response?.status === 403) {
        errorMsg = 'Bạn không có quyền truy cập.';
      } else if (err.response?.status === 404) {
        errorMsg = 'Không tìm thấy thông tin technician này.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      setError(errorMsg);
      setAppointments([]);
      setAllAppointmentsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async (appointmentId) => {
    try {
      setActionLoading(true);
      console.log('🔧 [Technician] Bắt đầu làm phiếu #', appointmentId);
      
      await startAppointment(appointmentId);
      
      console.log('✅ Đã bắt đầu làm việc');
      showSuccess('Đã bắt đầu làm việc!');
      
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi bắt đầu:', err);
      showError(err.response?.data?.message || 'Không thể bắt đầu làm việc');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteWork = async (appointmentId) => {
    if (!window.confirm('Xác nhận hoàn thành công việc này?\n\n⚠️ Lưu ý: Hãy đảm bảo bạn đã lưu thông tin bảo dưỡng (bấm nút "Lưu thông tin bảo dưỡng") trước khi hoàn thành.')) {
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('✔️ [Technician] Hoàn thành appointment #', appointmentId);
      
      // Gọi API PUT /api/appointments/{id}/done với data rỗng
      await markAppointmentAsDone(appointmentId);
      
      console.log('✅ Appointment completed (done)');
      showSuccess('Công việc đã hoàn thành!');
      
      // Refresh list
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi hoàn thành:', err);
      console.error('❌ Error response:', err.response?.data);
      showError(err.response?.data?.message || 'Không thể hoàn thành công việc');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChecklistChange = (checklist) => {
    setMaintenanceRecord(prev => ({
      ...prev,
      checklist: checklist
    }));
  };

  const handleVehicleConditionChange = (index, value) => {
    setMaintenanceRecord(prev => ({
      ...prev,
      vehicleConditions: {
        ...prev.vehicleConditions,
        [index]: value
      }
    }));
  };

  const handleReplaceClick = (item) => {
    console.log('🔄 Item needs replacement:', item);
    // Could show a modal or additional UI here
  };

  const handlePartsChange = async (parts) => {
    const oldParts = maintenanceRecord.partsUsed;
    
    // Cập nhật state trước
    setMaintenanceRecord(prev => ({
      ...prev,
      partsUsed: parts
    }));
    
    // So sánh với parts ban đầu để cập nhật database (chỉ khi đã có recordId)
    // Chỉ update khi đã lưu record (có recordId) và có thay đổi
    if (currentRecordId && selectedAppointment) {
      // Chỉ update nếu có thay đổi thực sự
      const hasChanges = JSON.stringify(oldParts) !== JSON.stringify(parts);
      if (hasChanges) {
        // Nếu oldParts rỗng, tất cả parts mới là thêm mới (status = 1)
        // Nếu có oldParts, so sánh để biết thêm hay xóa
        await updatePartsUsage(currentRecordId, parts, oldParts);
      }
    }
  };

  // Hàm cập nhật parts usage vào database
  const updatePartsUsage = async (recordId, newParts, oldParts) => {
    if (!recordId || !selectedAppointment) {
      console.log('⚠️ Cannot update parts: missing recordId or appointment');
      return;
    }
    
    try {
      const centerId = getCurrentCenterId();
      if (!centerId) {
        console.warn('⚠️ No centerId found');
        showWarning('Không tìm thấy thông tin chi nhánh. Vui lòng đăng nhập lại.');
        return;
      }

      // Tạo map để so sánh
      const oldPartsMap = new Map();
      oldParts.forEach(part => {
        oldPartsMap.set(part.partId, part.quantityUsed);
      });

      const newPartsMap = new Map();
      newParts.forEach(part => {
        newPartsMap.set(part.partId, part.quantityUsed);
      });

      // Tìm các parts đã thay đổi
      const allPartIds = new Set([...oldPartsMap.keys(), ...newPartsMap.keys()]);
      const updates = [];

      for (const partId of allPartIds) {
        const oldQty = oldPartsMap.get(partId) || 0;
        const newQty = newPartsMap.get(partId) || 0;
        const diff = newQty - oldQty;

        if (diff !== 0) {
          // Status: 0 = xóa/trả lại kho (diff < 0), 1 = thêm/lấy từ kho (diff > 0)
          const status = diff > 0 ? 1 : 0;
          const quantityChange = Math.abs(diff);

          const updateData = {
            status: status,
            partId: parseInt(partId),
            centerId: centerId,
            recordId: parseInt(recordId),
            appointmentId: selectedAppointment.id,
            quantityUsed: quantityChange
          };

          updates.push(updateData);
        }
      }

      // Thực hiện tất cả updates
      if (updates.length > 0) {
        console.log(`🔧 Updating ${updates.length} part(s):`, updates);
        for (const updateData of updates) {
          await updatePartUsage(updateData);
        }
        console.log('✅ All parts updated successfully');
      } else {
        console.log('ℹ️ No parts changes detected');
      }
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật parts usage:', err);
      showError(err.response?.data?.message || 'Không thể cập nhật linh kiện. Vui lòng thử lại.');
    }
  };

  const handleRemarksChange = (remarks) => {
    setMaintenanceRecord(prev => ({
      ...prev,
      remarks: remarks
    }));
  };

  const handleSaveCondition = async () => {
    try {
      // Validate required fields
      if (!maintenanceRecord.checklist || maintenanceRecord.checklist.length === 0) {
        showWarning('Vui lòng hoàn thành checklist');
        return;
      }
      
      // Check if at least one item is completed
      const hasCompletedItem = maintenanceRecord.checklist.some(item => item.completed);
      if (!hasCompletedItem) {
        showWarning('Vui lòng đánh dấu ít nhất một công việc đã hoàn thành');
        return;
      }
      
      // Get current technician ID from localStorage
      let staffIds = [];
      
      // Cách 1: Lấy từ assigned technicians nếu có
      if (selectedAppointment.assignedTechs && selectedAppointment.assignedTechs.length > 0) {
        staffIds = selectedAppointment.assignedTechs.map(tech => tech.id);
        console.log('📋 Using assigned techs:', staffIds);
      } else {
        // Cách 2: Lấy ID technician đang đăng nhập
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            const userId = userData.user_id || userData.id || userData.userId;
            if (userId) {
              staffIds = [userId];
              console.log('👤 Using current technician ID:', userId);
            }
          } catch (e) {
            console.error('❌ Lỗi parse user data:', e);
          }
        }
      }
      
      if (staffIds.length === 0) {
        showWarning('Không tìm thấy thông tin technician. Vui lòng đăng nhập lại.');
        return;
      }
      
      // Format checklist as string (pipe-separated)
      const checklistString = maintenanceRecord.checklist
        .filter(item => item.completed)
        .map(item => `${item.section}: ${item.item}${item.needsReplacement ? ' (Cần thay thế)' : ''}`)
        .join('|');
      
      // Format vehicle conditions as string
      const vehicleConditionString = Object.entries(maintenanceRecord.vehicleConditions)
        .filter(([_, value]) => value && value.trim())
        .map(([index, value]) => {
          const item = maintenanceRecord.checklist[parseInt(index)];
          return item ? `${item.item}: ${value}` : value;
        })
        .join('|');
      
      // Map parts với giá tiền đã được tự động fill
      const partsUsedData = maintenanceRecord.partsUsed.map(part => {
        const unitCost = parseFloat(part.unitCost) || 0;
        console.log(`📦 Part ${part.partId}: quantity=${part.quantityUsed}, unitCost=${unitCost}`);
        return {
          partId: parseInt(part.partId),
          quantityUsed: parseInt(part.quantityUsed),
          unitCost: unitCost // Giá tiền đã được tự động fill khi thêm part
        };
      });
      
      const recordData = {
        vehicleCondition: vehicleConditionString || '',
        checklist: checklistString,
        remarks: maintenanceRecord.remarks || '',
        partsUsed: partsUsedData,
        staffIds: staffIds
      };
      
      console.log('💾 Saving maintenance record with parts:', partsUsedData);
      
      console.log('💾 Saving maintenance record:', recordData);
      console.log('👥 Staff IDs:', staffIds);
      
      setActionLoading(true);
      const response = await createMaintenanceRecord(selectedAppointment.id, recordData);
      
      console.log('✅ Maintenance record saved:', response);
      
      // Lưu recordId từ response
      const recordId = response?.id || response?.recordId || response?.maintenanceRecordId;
      if (recordId) {
        setCurrentRecordId(recordId);
        console.log('📝 Record ID saved:', recordId);
        
        // Lưu parts ban đầu để so sánh sau này
        setOriginalPartsUsed([...maintenanceRecord.partsUsed]);
      } else {
        console.warn('⚠️ No recordId in response:', response);
      }
      
      showSuccess('Đã lưu thông tin bảo dưỡng thành công!');
      setIsEditingCondition(false);
      
    } catch (err) {
      console.error('❌ Lỗi khi lưu maintenance record:', err);
      console.error('❌ Error response:', err.response?.data);
      showError(err.response?.data?.message || 'Không thể lưu thông tin bảo dưỡng');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEditCondition = () => {
    setIsEditingCondition(false);
    // Reset về giá trị ban đầu
    setMaintenanceRecord({
      vehicleCondition: '',
      checklist: [],
      vehicleConditions: {},
      remarks: '',
      partsUsed: [],
      staffIds: []
    });
  };

  // Lọc theo search
  const filteredAppointments = appointments.filter((apt) =>
    apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.phone.includes(searchQuery) ||
    apt.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(apt.id).includes(searchQuery)
  );

  const currentTab = statusTabs.find(tab => tab.key === activeStatus);
  
  const getStatusInfo = (status) => {
    return statusTabs.find(tab => tab.key === status) || statusTabs[0];
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="technician-dashboard">
      {/* Header */}
      <div className="tech-header">
        <div className="tech-header-top">
          <h1>Quy trình Bảo dưỡng - Kỹ Thuật Viên</h1>
          <button 
            className="tech-logout-btn"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
        
        {/* Search Box */}
        <div className="tech-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm phiếu dịch vụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="tech-stats-cards">
        {statusTabs.slice(1).map((tab) => {
          const count = allAppointmentsData.filter(apt => apt.status === tab.key).length;
          return (
            <div 
              key={tab.key} 
              className="tech-stat-card"
              style={{ borderLeftColor: tab.color }}
            >
              <div className="stat-icon" style={{ background: tab.color }}>
                {tab.icon}
              </div>
              <div className="stat-content">
                <h3>{count}</h3>
                <p>{tab.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Tabs */}
      <div className="tech-status-tabs">
        {statusTabs.map((tab) => {
          const count = tab.key === 'all' 
            ? allAppointmentsData.length 
            : allAppointmentsData.filter(apt => apt.status === tab.key).length;
          
          return (
            <button
              key={tab.key}
              className={`tech-status-tab ${activeStatus === tab.key ? 'active' : ''}`}
              onClick={() => setActiveStatus(tab.key)}
              style={{ '--tab-color': tab.color }}
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
        <div className="tech-error-message">
          <p>❌ {error}</p>
          <button onClick={fetchAppointments}>Thử lại</button>
        </div>
      )}

      {/* Main Content */}
      <div className="tech-content">
        {/* Left: Appointments List */}
        <div className="tech-appointments-list">
          <div className="list-header">
            <h3>Danh sách phiếu dịch vụ ({filteredAppointments.length})</h3>
          </div>

          <div className="appointments-items">
            {loading ? (
              <div className="tech-loading-state">
                <FaSpinner className="spinner" />
                <p>Đang tải...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="tech-empty-state">
                <FaClipboardList size={50} />
                <p>Không có phiếu dịch vụ nào</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const appointmentStatus = activeStatus === 'all' 
                  ? getStatusInfo(appointment.status) 
                  : currentTab;
                
                return (
                  <div
                    key={appointment.id}
                    className={`tech-appointment-item ${selectedAppointment?.id === appointment.id ? 'active' : ''}`}
                    onClick={() => {
                      console.log('🖱️ Selected:', appointment);
                      setSelectedAppointment(appointment);
                    }}
                  >
                    <div className="appointment-item-header">
                      <div className="appointment-number">
                        #{appointment.id}
                      </div>
                      <span 
                        className="appointment-status-badge" 
                        style={{ background: appointmentStatus.color }}
                      >
                        {appointmentStatus.label}
                      </span>
                    </div>
                    
                    <div className="appointment-item-body">
                      <h4>{appointment.customerName}</h4>
                      <div className="info-row">
                        <FaCar />
                        <span>{appointment.vehicleModel}</span>
                      </div>
                      <div className="info-row">
                        <span className="license-plate">{appointment.licensePlate}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Appointment Detail */}
        <div className="tech-appointment-detail">
          {selectedAppointment ? (
            <>
              <div className="detail-header">
                <h2>Phiếu dịch vụ #{selectedAppointment.id}</h2>
                <span 
                  className="detail-status-badge" 
                  style={{ 
                    background: getStatusInfo(selectedAppointment.status).color 
                  }}
                >
                  {getStatusInfo(selectedAppointment.status).label.toUpperCase()}
                </span>
              </div>

              {/* Thông tin chung */}
              <div className="detail-section">
                <h3>Thông tin chung</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaUser />
                    <div>
                      <span className="label">Khách hàng</span>
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
                    <FaCar />
                    <div>
                      <span className="label">Xe</span>
                      <span className="value">{selectedAppointment.vehicleModel}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <div>
                      <span className="label">Ngày hẹn</span>
                      <span className="value">
                        {selectedAppointment.appointmentDate ? 
                          new Date(selectedAppointment.appointmentDate).toLocaleString('vi-VN') 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dịch vụ yêu cầu */}
              {selectedAppointment.services && selectedAppointment.services.length > 0 && (
                <div className="detail-section">
                  <h3>Dịch vụ yêu cầu</h3>
                  <div className="services-list-tech">
                    {selectedAppointment.services.map((service, index) => (
                      <div key={index} className="service-item-tech">
                        <FaTools style={{ color: '#667eea' }} />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIN Number */}
              {selectedAppointment.vehicleVin && (
                <div className="detail-section">
                  <h3>VIN Number</h3>
                  <div className="vin-box">
                    {selectedAppointment.vehicleVin}
                  </div>
                </div>
              )}

              {/* Maintenance Checklist - Dynamic from Service Description */}
              {isEditingCondition && selectedServiceDescription && (
                <div className="detail-section maintenance-form">
                  <MaintenanceChecklist
                    serviceDescription={selectedServiceDescription}
                    serviceName={selectedServiceName}
                    checklist={maintenanceRecord.checklist}
                    vehicleConditions={maintenanceRecord.vehicleConditions}
                    onChecklistChange={handleChecklistChange}
                    onVehicleConditionChange={handleVehicleConditionChange}
                    onReplaceClick={handleReplaceClick}
                    partsUsed={maintenanceRecord.partsUsed}
                    onPartsChange={handlePartsChange}
                    remarks={maintenanceRecord.remarks}
                    onRemarksChange={handleRemarksChange}
                    vehicleModel={selectedAppointment?.vehicleModel}
                  />

                  {/* Staff Info (Read-only) */}
                  {selectedAppointment.assignedTechs && selectedAppointment.assignedTechs.length > 0 && (
                    <div className="form-group" style={{ marginTop: '24px' }}>
                      <label className="form-label">Kỹ thuật viên thực hiện:</label>
                      <div className="staff-chips">
                        {selectedAppointment.assignedTechs.map((tech) => (
                          <span key={tech.id} className="staff-chip">
                            {tech.fullName} (ID: {tech.id})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save/Cancel Buttons */}
                  <div className="condition-edit-actions">
                    <button 
                      className="btn-save-condition"
                      onClick={handleSaveCondition}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="spinner" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Lưu thông tin bảo dưỡng
                        </>
                      )}
                    </button>
                    <button 
                      className="btn-cancel-condition"
                      onClick={handleCancelEditCondition}
                      disabled={actionLoading}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Fallback: Show old checklist if no service description available */}
              {!isEditingCondition && selectedAppointment.checkList && selectedAppointment.checkList.length > 0 && (
                <div className="detail-section">
                  <h3>Checklist</h3>
                  <div className="checklist-items">
                    {selectedAppointment.checkList.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <FaCheckCircle style={{ color: '#48bb78' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ghi chú */}
              {selectedAppointment.notes && (
                <div className="detail-section">
                  <h3>Ghi chú:</h3>
                  <div className="notes-box">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}

              {/* Tổng chi phí */}
              {selectedAppointment.cost > 0 && (
                <div className="detail-section">
                  <div className="cost-box">
                    <span className="cost-label">Tổng chi phí:</span>
                    <span className="cost-value">{selectedAppointment.cost.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              )}

              {/* Nút Cập nhật tình trạng xe */}
              {selectedAppointment.status === 'in_progress' && !isEditingCondition && (
                <div className="detail-section">
                  <button 
                    className="btn-update-status"
                    onClick={() => setIsEditingCondition(true)}
                  >
                    <FaClipboardList />
                    Cập nhật tình trạng xe
                  </button>
                </div>
              )}

              {/* Action Buttons - BÊN TRÁI */}
              <div className="detail-actions-left">
                {selectedAppointment.status === 'accepted' && (
                  <button 
                    className="btn-start-work"
                    onClick={() => handleStartWork(selectedAppointment.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <FaSpinner className="spinner" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaTools />
                        Bắt đầu làm việc
                      </>
                    )}
                  </button>
                )}
                {selectedAppointment.status === 'in_progress' && (
                  <button 
                    className="btn-complete-work"
                    onClick={() => handleCompleteWork(selectedAppointment.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <FaSpinner className="spinner" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Hoàn thành công việc
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="tech-empty-detail">
              <FaClipboardList size={60} />
              <p>Chọn một phiếu dịch vụ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechnicianDashboard;

