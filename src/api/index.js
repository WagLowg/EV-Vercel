import axiosClient from "./axiosClient";

/* --------------------------------
   🧾 AUTHENTICATION
---------------------------------- */

// Đăng ký (❌ Không cần token)
export const register = async (data) => {
  const res = await axiosClient.post("/api/auth/register", data);
  return res.data;
};

// Đăng nhập (❌ Không cần token)
export const login = async (data) => {
  const res = await axiosClient.post("/api/auth/login", data);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

/* --------------------------------
   👤 USER PROFILE
---------------------------------- */

// Cập nhật hồ sơ (✅ Cần token)
export const updateProfile = async (userId, data) => {
  const res = await axiosClient.put(`/api/update/${userId}`, data);
  return res.data;
};

// Cập nhật thông tin user (✅ Cần token)
// ✅ Theo OpenAPI mới: PUT /api/auth/update/{id}
export const updateUser = async (id, data) => {
  console.log('📤 API Request: PUT /api/auth/update/' + id);
  console.log('📤 Request Data:', data);
  const res = await axiosClient.put(`/api/auth/update/${id}`, data);
  console.log('📥 API Response:', res.data);
  return res.data;
};
// Xem hồ sơ người dùng (✅ Cần token)
export const getProfile = async () => {
  const res = await axiosClient.get("/api/profile");
  return res.data;
};

// Đổi mật khẩu và cập nhật thông tin (✅ Cần token)
// API: PUT /api/update/{id}
// Request body: { fullName, email, phone, password }
// Response: { email, fullName, phone }
export const updateUserProfile = async (userId, data) => {
  console.log('📤 API Request: PUT /api/update/' + userId);
  console.log('📤 Request Data:', data);
  const res = await axiosClient.put(`/api/update/${userId}`, data);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// Alias cho tương thích ngược
export const changePassword = async (userId, data) => {
  return updateUserProfile(userId, data);
};

// Lấy danh sách users theo role (✅ Cần token)
export const getUsersByRole = async (role) => {
  const res = await axiosClient.get("/api/users", { params: { role } });
  return res.data;
};

// Lấy danh sách staff và technicians theo center (✅ Cần token)
// API: GET /api/users/center/staff_and_technician
// Response: Array of UserDto (có role TECHNICIAN hoặc STAFF)
export const getStaffAndTechnician = async () => {
  console.log('📤 API Request: GET /api/users/center/staff_and_technician');
  const res = await axiosClient.get("/api/users/center/staff_and_technician");
  console.log('📥 API Response:', res.data);
  console.log('📊 Total staff & technicians:', res.data?.length || 0);
  return res.data;
};

// Lấy tất cả customers (✅ Cần token - Admin/Staff)
// Staff: Lấy danh sách tất cả khách hàng (✅ Cần token)
export const getAllCustomers = async () => {
  const res = await axiosClient.get("/api/users/all_customer");
  console.log('📥 API Response:', res.data);
  console.log('📊 Total customers:', res.data?.length || 0);
  return res.data;
};

// Lấy danh sách technicians (✅ Cần token)
export const getAllTechnicians = async () => {
  const res = await axiosClient.get("/api/users/allTechnicians");
  return res.data;
};

// Lấy tất cả users theo role (✅ Cần token - Admin)
// API: GET /api/users/all/{role}
export const getAllUsersByRole = async (role) => {
  console.log('📤 API Request: GET /api/users/all/' + role);
  const res = await axiosClient.get(`/api/users/all/${role}`);
  console.log('📥 API Response:', res.data);
  console.log('📊 Total users with role', role + ':', res.data?.length || 0);
  return res.data || [];
};

// Tạo employee mới (Admin/Staff) (✅ Cần token)
// Backend expect multipart/form-data với 2 parts: user (JSON) + file (optional)
export const createEmployee = async (role, data, file = null) => {
  console.log('📤 [createEmployee] Creating employee with role:', role);
  console.log('📤 [createEmployee] Data:', data);
  console.log('📤 [createEmployee] File:', file);
  
  // ✅ Create FormData for multipart/form-data
  const formData = new FormData();
  
  // ✅ Add user data as JSON blob (part name: "user")
  const userDto = {
    fullName: data.fullName,
    email: data.email,
    phone: data.phoneNumber || data.phone,  // ✅ Transform phoneNumber → phone
    password: data.password,
    address: data.address || ''
  };
  
  // ✅ Add serviceCenterId only for employee roles (not customer)
  if (data.serviceCenterId && parseInt(data.serviceCenterId) > 0) {
    userDto.serviceCenterId = parseInt(data.serviceCenterId);
  }
  
  console.log('📤 [createEmployee] UserDto:', userDto);
  
  // Backend expect "user" part as JSON
  const userBlob = new Blob([JSON.stringify(userDto)], { type: 'application/json' });
  formData.append('user', userBlob);
  
  // ✅ Add file if provided (optional)
  if (file) {
    formData.append('file', file);
    console.log('📤 [createEmployee] File attached:', file.name);
  }
  
  console.log('📤 [createEmployee] Sending multipart/form-data to /api/users/employees?role=' + role);
  
  const res = await axiosClient.post("/api/users/employees", formData, {
    params: { role },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  console.log('✅ [createEmployee] Success:', res.data);
  return res.data;
};

// Xóa employee (✅ Cần token)
export const deleteEmployee = async (id) => {
  const res = await axiosClient.delete(`/api/users/${id}`);
  return res.data;
};

// Tạo customer mới - Dùng register endpoint (❌ Không cần token - public API)
export const createCustomer = async (data) => {
  console.log('📤 Creating customer via register:', data);
  const res = await axiosClient.post("/api/auth/register", data);
  return res.data;
};

/* --------------------------------
   🚗 VEHICLES
---------------------------------- */

// Lấy danh sách xe (✅)
export const getVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles");
  return res.data;
};

// Lấy danh sách xe đã được bảo dưỡng (✅ Cần token)
export const getServicedVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles/serviced");
  return res.data;
};

// Lấy lịch sử bảo dưỡng của xe (✅ Cần token - Staff)
export const getMaintainedVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles/maintained");
  return res.data;
};

// Tìm xe theo VIN (✅)
export const getVehicleByVin = async (vin) => {
  const res = await axiosClient.get(`/api/vehicles/vin/${vin}`);
  return res.data;
};

// Lấy thông tin xe theo ID (✅)
export const getVehicleById = async (id) => {
  const res = await axiosClient.get(`/api/vehicles/${id}`);
  return res.data;
};

// Thêm xe mới (✅)
export const addVehicle = async (data) => {
  const res = await axiosClient.post("/api/vehicles", data);
  return res.data;
};

// Cập nhật xe (✅)
export const updateVehicle = async (id, data) => {
  console.log('📤 API Request: PUT /api/vehicles/' + id);
  console.log('📤 Request Data:', data);
  const res = await axiosClient.put(`/api/vehicles/${id}`, data);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// Xóa xe (✅)
export const deleteVehicle = async (id) => {
  const res = await axiosClient.delete(`/api/vehicles/${id}`);
  return res.data;
};

// Lấy thời gian bảo dưỡng cuối cùng của xe (✅ Cần token)
export const getVehicleLatestMaintenanceTime = async (vehicleId) => {
  const res = await axiosClient.get(`/api/vehicles/${vehicleId}/appointments/latest_time`);
  return res.data; // Returns string (timestamp)
};

// Lấy tất cả vehicles (✅ Cần token - Admin)
// API: GET /api/vehicles/all
export const getAllVehicles = async () => {
  try {
    console.log('API Request: GET /api/vehicles/all');
    const res = await axiosClient.get("/api/vehicles/all");
    console.log('API Response:', res.data);
    console.log('Total vehicles:', res.data?.length || 0);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('[getAllVehicles] Error:', err);
    // If 500 error, try fallback to maintained vehicles
    if (err.response?.status === 500 || err.response?.status === 404) {
      console.log(`/api/vehicles/all returned ${err.response?.status}, trying /api/vehicles/maintained`);
      try {
        const res = await axiosClient.get("/api/vehicles/maintained");
        console.log('📥 API Response (maintained):', res.data);
        console.log('📊 Total vehicles:', res.data?.length || 0);
        return Array.isArray(res.data) ? res.data : [];
      } catch (fallbackErr) {
        console.error('❌ Fallback API also failed:', fallbackErr);
        // Return empty array instead of throwing
        return [];
      }
    }
    // For other errors, return empty array
    return [];
  }
};
/* --------------------------------
   🔧 PARTS APIs
---------------------------------- */

// Lấy tất cả parts (✅ Cần token)
export const getAllParts = async () => {
  const res = await axiosClient.get("/api/management2/parts");
  return res.data;
};

// Lấy part theo ID (✅ Cần token)
export const getPartById = async (id) => {
  const res = await axiosClient.get(`/api/management2/parts/${id}`);
  return res.data;
};

// Tạo part mới (✅ Cần token)
export const createPart = async (data) => {
  const res = await axiosClient.post("/api/management2/parts/create", data);
  return res.data;
};

// Cập nhật part (✅ Cần token)
export const updatePart = async (id, data) => {
  const res = await axiosClient.put(`/api/management2/parts/update/${id}`, data);
  return res.data;
};

// Xóa part (✅ Cần token)
export const deletePart = async (id) => {
  const res = await axiosClient.delete(`/api/management2/parts/delete/${id}`);
  return res.data;
};

// Lấy inventory của tất cả parts (✅ Cần token - Manager)
export const getInventoryParts = async () => {
  console.log('📦 [API] GET /api/management/inventory/parts');
  const res = await axiosClient.get("/api/management/inventory/parts");
  console.log('✅ [API] Inventory parts loaded:', res.data);
  return res.data;
};

// Cập nhật số lượng trong inventory (✅ Cần token - Manager)
// quantity là query parameter, không phải body
export const updateInventoryQuantity = async (partId, quantity) => {
  console.log(`📦 [API] PUT /api/management/inventory/${partId}?quantity=${quantity}`);
  const res = await axiosClient.put(`/api/management/inventory/${partId}?quantity=${quantity}`);
  console.log('✅ [API] Inventory updated:', res.data);
  return res.data;
};

// Sử dụng part (✅ Cần token)
export const usePart = async (data) => {
  const res = await axiosClient.post("/api/technician/part_usage", data);
  return res.data;
};
/* --------------------------------
   🕒 APPOINTMENTS
---------------------------------- */

// Customer: Xem lịch hẹn của khách hàng (✅)
export const getAppointments = async () => {
  const res = await axiosClient.get("/api/appointments");
  return res.data;
};

// Customer: Đặt lịch bảo dưỡng mới (✅)
export const createAppointment = async (data) => {
  const res = await axiosClient.post("/api/appointments", data);
  return res.data;
};

// Staff: Lấy tất cả appointments (✅ Cần token)
export const getAllAppointments = async () => {
  const res = await axiosClient.get("/api/appointments/all");
  return res.data;
};

// Staff: Chấp nhận lịch hẹn (✅ Cần token)
export const acceptAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/accept`);
  return res.data;
};

// Staff: Hủy lịch hẹn (✅ Cần token)
export const cancelAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/cancel`);
  return res.data;
};

// Staff: Bắt đầu thực hiện lịch hẹn (✅ Cần token)
export const startAppointmentProgress = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/inProgress`);
  return res.data;
};

// Technician: Lấy appointments được giao cho technician (✅ Cần token + technicianId)
export const getAppointmentsForStaff = async () => {
  // Lấy user ID từ localStorage
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.');
  }
  
  let userId;
  try {
    const userData = JSON.parse(userStr);
    userId = userData.user_id || userData.id || userData.userId;
    
    if (!userId) {
      console.error('❌ [API] User data:', userData);
      throw new Error('Không tìm thấy User ID. Vui lòng đăng nhập lại.');
    }
    
    console.log('👤 [API] Technician ID:', userId);
  } catch (e) {
    console.error('❌ [API] Lỗi parse user data:', e);
    throw new Error('Dữ liệu user không hợp lệ. Vui lòng đăng nhập lại.');
  }
  
  console.log(`🔗 [API] Calling: GET /api/appointments/staff/${userId}`);
  const res = await axiosClient.get(`/api/appointments/staff/${userId}`);
  console.log('✅ [API] Response status:', res.status);
  console.log('📦 [API] Response data:', res.data);
  return res.data;
};

// Technician: Lấy chi tiết appointment (✅ Cần token)
export const getAppointmentDetailWithTechs = async (appointmentId) => {
  const res = await axiosClient.get(`/api/appointments/${appointmentId}`);
  return res.data;
};

// Technician: Tạo Maintenance Record (✅ Cần token)
export const createMaintenanceRecord = async (appointmentId, recordData) => {
  console.log('📝 [API] Creating maintenance record for appointment:', appointmentId);
  console.log('📝 [API] Record data:', recordData);
  const res = await axiosClient.post(`/api/MaintainanceRecord/${appointmentId}`, recordData);
  console.log('✅ [API] Maintenance record created:', res.data);
  return res.data;
};

// Technician: Hoàn thành appointment (chuyển sang "done") (✅ Cần token)
export const markAppointmentAsDone = async (appointmentId) => {
  console.log('✔️ [API] Completing appointment (done):', appointmentId);
  // Gửi data rỗng theo yêu cầu backend
  const emptyData = {
    vehicleCondition: "",
    checklist: "",
    remarks: "",
    partsUsed: [],
    staffIds: []
  };
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/done`, emptyData);
  console.log('✅ [API] Appointment marked as done:', res.data);
  return res.data;
};

// Lấy maintenance records theo center (✅ Cần token)
// API: GET /api/MaintainanceRecord/all/serviceCenter/{centerId}
export const getMaintenanceRecordsByCenter = async (centerId = null) => {
  if (centerId) {
    console.log('📊 [getMaintenanceRecordsByCenter] GET /api/MaintainanceRecord/all/serviceCenter/' + centerId);
    const res = await axiosClient.get(`/api/MaintainanceRecord/all/serviceCenter/${centerId}`);
    console.log('✅ [getMaintenanceRecordsByCenter] Response:', res.data);
    console.log('📊 Total records:', res.data?.length || 0);
    return res.data;
  } else {
    // Fallback to old endpoint if no centerId provided
    console.log('📊 [getMaintenanceRecordsByCenter] GET /MaintainanceRecord/all/serviceCenter (no centerId)');
    const res = await axiosClient.get("/MaintainanceRecord/all/serviceCenter");
    return res.data;
  }
};
// Alias cho tương thích ngược (Staff Dashboard vẫn dùng tên này)
export const completeAppointmentDone = markAppointmentAsDone;

// Staff: Lấy chi tiết appointment với thông tin kỹ thuật viên (✅ Cần token)
export const getAppointmentStatus = async (status) => {
  const res = await axiosClient.get(`/api/appointments/status/${status}`);
  return res.data;
};

// Technician: Bắt đầu appointment (✅ Cần token)
export const startAppointment = async (appointmentId) => {
  const res = await axiosClient.post(`/api/technician/appointments/${appointmentId}/start`);
  return res.data;
};

// Technician: Hoàn thành appointment (✅ Cần token)
export const completeAppointment = async (appointmentId) => {
  const res = await axiosClient.post(`/api/technician/appointments/${appointmentId}/complete`);
  return res.data;
};

// Technician: Cập nhật sử dụng linh kiện (✅ Cần token)
// Status: 0 = xóa/trả lại kho, 1 = thêm/lấy từ kho
export const updatePartUsage = async (data) => {
  console.log('🔧 [API] Updating part usage:', data);
  const res = await axiosClient.put('/api/technician/part_usage/update', data);
  console.log('✅ [API] Part usage updated:', res.data);
  return res.data;
};

/* --------------------------------
   👨‍🔧 TECHNICIAN & STAFF ASSIGNMENT
---------------------------------- */

// Lấy tất cả worklogs theo centerId cụ thể (✅ Cần token)
// API: GET /api/worklogs/center/{centerId}
// Response format: [{ staffId: [number], appointmentId: number, hoursSpent: number, tasksDone: string }]
/* --------------------------------
   📝 WORKLOG APIs
---------------------------------- */

// Tạo worklog thủ công (✅ Cần token)
export const createWorkLog = async (data) => {
  const res = await axiosClient.post("/worklogs", data);
  return res.data;
};

// Tạo worklog tự động cho appointment (✅ Cần token)
export const createAutoWorkLog = async (appointmentId) => {
  const res = await axiosClient.post(`/worklogs/${appointmentId}`);
  return res.data;
};

// Lấy tất cả worklogs theo center (✅ Cần token)
export const getAllWorkLogsByCenter = async () => {
  const res = await axiosClient.get("/worklogs/center");
  return res.data;
};

// Lấy tất cả worklogs theo centerId cụ thể (✅ Cần token)
// API: GET /api/worklogs/center/{centerId}
// Response format: [{ staffId: [number], appointmentId: number, hoursSpent: number, tasksDone: string }]
export const getAllWorkLogsByCenterId = async (centerId) => {
  console.log('📊 [getAllWorkLogsByCenterId] GET /api/worklogs/center/' + centerId);
  const res = await axiosClient.get(`/api/worklogs/center/${centerId}`);
  console.log('✅ [getAllWorkLogsByCenterId] Response:', res.data);
  console.log('📊 Total worklogs:', res.data?.length || 0);
  
  // Validate response format
  if (Array.isArray(res.data)) {
    return res.data;
  }
  console.warn('⚠️ [getAllWorkLogsByCenterId] Invalid response format, expected array');
  return [];
};
/* --------------------------------
   📊 REPORT APIs (Admin)
---------------------------------- */
// Giao việc cho technicians (✅ Cần token)
export const assignTechniciansToAppointment = async (appointmentId, staffIds, notes = '') => {
  // Quick sanity check: ensure we have a token before calling protected endpoint
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('🔐 No auth token found in localStorage - aborting assignTechniciansToAppointment');
    try {
      window.dispatchEvent(new CustomEvent('app:logout', { detail: { reason: 'no_token', status: 0 } }));
    } catch (e) {}
    throw new Error('No authentication token');
  }

  console.log('🔧 assignTechniciansToAppointment called:', {
    appointmentId,
    staffIds,
    notes
  });
  try {
    const res = await axiosClient.put(`/api/assignments/${appointmentId}/staff`, {
      notes,
      staffIds
    });
    console.log('✅ Assignment successful:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Assignment error:');
    console.error('  📍 Status:', error.response?.status);
    console.error('  📝 Message:', error.response?.data?.message || error.message);
    console.error('  📦 Response:', error.response?.data);
    console.error('  🔗 URL:', error.config?.url);
    console.error('  📤 Request data:', error.config?.data);
    console.error('  🔁 Response headers:', error.response?.headers);
    throw error;
  }
};

// Báo cáo doanh thu theo tháng (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getRevenueReport = async () => {
  const res = await axiosClient.get("/api/management/reports/revenue");
  return res.data;
};

// Doanh thu tháng hiện tại (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getRevenueCurrentMonth = async () => {
  const res = await axiosClient.get("/api/management/reports/revenue/current-month");
  return res.data;
};

// Doanh thu theo dịch vụ (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getRevenueByService = async () => {
  const res = await axiosClient.get("/api/management/reports/revenue/service");
  return res.data;
};

// Báo cáo lợi nhuận theo tháng (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getProfitReport = async () => {
  const res = await axiosClient.get("/api/management/reports/profit");
  return res.data;
};

// Chi phí tháng hiện tại (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getCurrentMonthExpense = async () => {
  const res = await axiosClient.get("/api/management/reports/expense/current-month");
  return res.data;
};

// Top dịch vụ phổ biến (all time) (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
// Optional centerId parameter để filter theo center
// Response format từ backend: [{ "Tên dịch vụ": số }] hoặc [{ key: string, value: number }]
export const getTrendingServices = async (centerId = null) => {
  const params = centerId ? { centerId } : {};
  console.log('📊 [getTrendingServices] GET /api/management/reports/trending-services/alltime', params);
  const res = await axiosClient.get("/api/management/reports/trending-services/alltime", { params });
  console.log('✅ [getTrendingServices] Raw Response:', res.data);
  
  // Transform response format: [{ "service": count }] → [{ key: "service", value: count }]
  if (Array.isArray(res.data)) {
    const transformed = res.data.map(item => {
      // Nếu đã có format { key, value } thì giữ nguyên
      if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
        return { key: String(item.key), value: Number(item.value) };
      }
      
      // Nếu là format { "service name": count }, transform sang { key, value }
      if (item && typeof item === 'object') {
        const keys = Object.keys(item);
        if (keys.length > 0) {
          const serviceName = keys[0];
          const count = item[serviceName];
          return { key: String(serviceName), value: Number(count) || 0 };
        }
      }
      
      return null;
    }).filter(item => item !== null);
    
    console.log('✅ [getTrendingServices] Transformed:', transformed);
    return transformed;
  }
  
  console.warn('⚠️ [getTrendingServices] Invalid response format, expected array');
  return [];
};

// Top dịch vụ tháng trước (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
// Optional centerId parameter để filter theo center
// Response format từ backend: [{ "Tên dịch vụ": số }] hoặc [{ key: string, value: number }]
export const getTrendingServicesLastMonth = async (centerId = null) => {
  const params = centerId ? { centerId } : {};
  console.log('📊 [getTrendingServicesLastMonth] GET /api/management/reports/trending-services/last-month', params);
  const res = await axiosClient.get("/api/management/reports/trending-services/last-month", { params });
  console.log('✅ [getTrendingServicesLastMonth] Raw Response:', res.data);
  
  // Transform response format: [{ "service": count }] → [{ key: "service", value: count }]
  if (Array.isArray(res.data)) {
    const transformed = res.data.map(item => {
      // Nếu đã có format { key, value } thì giữ nguyên
      if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
        return { key: String(item.key), value: Number(item.value) };
      }
      
      // Nếu là format { "service name": count }, transform sang { key, value }
      if (item && typeof item === 'object') {
        const keys = Object.keys(item);
        if (keys.length > 0) {
          const serviceName = keys[0];
          const count = item[serviceName];
          return { key: String(serviceName), value: Number(count) || 0 };
        }
      }
      
      return null;
    }).filter(item => item !== null);
    
    console.log('✅ [getTrendingServicesLastMonth] Transformed:', transformed);
    return transformed;
  }
  
  console.warn('⚠️ [getTrendingServicesLastMonth] Invalid response format, expected array');
  return [];
};

// Top 5 parts được dùng nhiều nhất tháng trước (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getTrendingParts = async () => {
  const res = await axiosClient.get("/api/management/reports/trending-parts");
  return res.data;
};

// Báo cáo tồn kho phụ tùng (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getPartStockReport = async () => {
  const res = await axiosClient.get("/api/management/reports/parts/stock-report");
  return res.data;
};

// Thống kê phương thức thanh toán (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getPaymentMethods = async () => {
  const res = await axiosClient.get("/api/management/reports/payment-methods");
  return res.data;
};

/* --------------------------------
   🔔 REMINDER APIs (Test)
---------------------------------- */

// Chạy scheduler manually (test) (✅ Cần token)
export const runReminderScheduler = async () => {
  const res = await axiosClient.get("/api/auth/reminder/run");
  return res.data;
};



/* --------------------------------
   🧹 TIỆN ÍCH
---------------------------------- */

/* --------------------------------
   🏢 SERVICE CENTER APIs (Admin)
---------------------------------- */

// Lấy tất cả centers (✅ Cần token - Admin)
// API: GET /api/center
export const getAllCenters = async () => {
  console.log('📤 API Request: GET /api/center');
  const res = await axiosClient.get("/api/center");
  console.log('📥 API Response:', res.data);
  console.log('📊 Total centers:', res.data?.length || 0);
  return res.data || [];
};

// Tạo center mới (✅ Cần token - Admin)
// API: POST /api/center
// Body: CenterDTO { name, address, phone, email }
export const createCenter = async (centerData) => {
  console.log('📤 API Request: POST /api/center');
  console.log('📤 Request Data:', centerData);
  const res = await axiosClient.post("/api/center", centerData);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// Cập nhật center (✅ Cần token - Admin)
// API: PUT /api/center/{id}
// Body: CenterDTO { name, address, phone, email }
export const updateCenter = async (id, centerData) => {
  console.log('📤 API Request: PUT /api/center/' + id);
  console.log('📤 Request Data:', centerData);
  const res = await axiosClient.put(`/api/center/${id}`, centerData);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// Xóa center (✅ Cần token - Admin)
// API: DELETE /api/center/{id}
export const deleteCenter = async (id) => {
  console.log('📤 API Request: DELETE /api/center/' + id);
  const res = await axiosClient.delete(`/api/center/${id}`);
  console.log('📥 API Response:', res.data);
  return res.data;
};

/* --------------------------------
   📦 SERVICE TYPES (Gói bảo dưỡng)
---------------------------------- */

// Lấy tất cả gói bảo dưỡng (✅ Cần token)
// API: GET /api/service-types
export const getAllServiceTypes = async () => {
  console.log('📊 [API] GET /api/service-types');
  const res = await axiosClient.get('/api/service-types');
  console.log('✅ [API] Response:', res.data);
  return res.data;
};

// Lấy chi tiết gói bảo dưỡng (✅ Cần token)
// API: GET /api/service-types/{id}
export const getServiceTypeById = async (id) => {
  console.log(`📊 [API] GET /api/service-types/${id}`);
  const res = await axiosClient.get(`/api/service-types/${id}`);
  console.log('✅ [API] Response:', res.data);
  return res.data;
};

// Tạo gói bảo dưỡng mới (✅ Cần token)
// API: POST /api/service-types
// Body: { name, description, price, durationEst } hoặc snake_case
export const createServiceType = async (data) => {
  console.log('📤 [API] POST /api/service-types');
  console.log('📤 Request Data (original):', data);
  console.log('📤 Data type:', typeof data, 'Is Array?', Array.isArray(data));
  
  // Ensure data is an object, not an array
  if (Array.isArray(data)) {
    console.error('❌ ERROR: Data is an array! Expected object.');
    throw new Error('Invalid data format: expected object, got array');
  }
  
  // Try both camelCase and snake_case for backend compatibility
  const payload = {
    name: data.name,
    description: data.description,
    price: data.price,
    durationEst: data.durationEst // Try camelCase first
  };
  
  console.log('📤 Request Payload (camelCase):', payload);
  console.log('📤 Payload type:', typeof payload, 'Is Array?', Array.isArray(payload));
  console.log('📤 Stringified:', JSON.stringify(payload));
  
  const res = await axiosClient.post('/api/service-types', payload);
  console.log('✅ [API] Response:', res.data);
  return res.data;
};

// Cập nhật gói bảo dưỡng (✅ Cần token)
// API: PUT /api/service-types/{id}
// Body: { name, description, price, durationEst } hoặc snake_case
export const updateServiceType = async (id, data) => {
  console.log(`📤 [API] PUT /api/service-types/${id}`);
  console.log('📤 Request Data (original):', data);
  
  // Try snake_case format for backend compatibility
  const payload = {
    name: data.name,
    description: data.description,
    price: data.price,
    duration_est: data.durationEst // snake_case
  };
  
  console.log('📤 Request Data (snake_case):', payload);
  const res = await axiosClient.put(`/api/service-types/${id}`, payload);
  console.log('✅ [API] Response:', res.data);
  return res.data;
};

// Xóa gói bảo dưỡng (✅ Cần token)
// API: DELETE /api/service-types/{id}
export const deleteServiceType = async (id) => {
  console.log(`🗑️ [API] DELETE /api/service-types/${id}`);
  const res = await axiosClient.delete(`/api/service-types/${id}`);
  console.log('✅ [API] Response:', res.data);
  return res.data;
};

// Alias để tương thích ngược với code cũ (BookingPage)
export const getServiceTypes = getAllServiceTypes;

/* --------------------------------
   🧹 TIỆN ÍCH
---------------------------------- */

// Đăng xuất: xóa token local
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullName");
  localStorage.removeItem("userId");
  localStorage.removeItem("centerId");
};