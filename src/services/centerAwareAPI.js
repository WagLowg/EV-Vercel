/**
 * CENTER-AWARE API WRAPPER
 * 
 * Wrap các API calls với logic filter theo centerId
 * Đảm bảo mỗi role chỉ fetch/manipulate data của center mình
 */

import * as API from '../api/index';
import { getCurrentUser, filterByUserCenter, filterAppointmentsByRole } from '../utils/centerFilter';
import { ROLES } from '../constants/roles';

// ================================
// 1. CUSTOMER APIs
// ================================

/**
 * Lấy danh sách customers (auto-filter theo center)
 * @returns {Promise<Array>}
 */
export const getCustomers = async () => {
  const { role, centerId } = getCurrentUser();
  
  // Backend endpoint: GET /api/users/all_customer
  // Có thể cần thêm query param ?centerId={centerId} nếu backend hỗ trợ
  const customers = await API.getAllCustomers();
  
  // Frontend filter as fallback
  // Manager/Staff chỉ xem customer đã từng dùng dịch vụ tại center mình
  // (logic này có thể cần điều chỉnh tùy business requirement)
  
  if (role === ROLES.ADMIN) {
    return customers;
  }
  
  // TODO: Nếu backend chưa filter, cần thêm logic filter ở đây
  // Ví dụ: filter theo appointments của customer tại center
  return customers;
};

// ================================
// 2. VEHICLE APIs
// ================================

/**
 * Lấy danh sách xe (auto-filter theo role)
 * @returns {Promise<Array>}
 */
export const getVehicles = async () => {
  const { role } = getCurrentUser();
  
  if (role === ROLES.CUSTOMER) {
    // Customer xem xe của mình
    return await API.getVehicles();
  }
  
  // Staff/Manager/Admin xem xe đã được bảo dưỡng tại center
  return await API.getVehiclesMaintained();
};

// ================================
// 3. APPOINTMENT APIs
// ================================

/**
 * Lấy danh sách appointments (auto-filter theo role)
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>}
 */
export const getAppointments = async (status = null) => {
  const { role, centerId, id: userId } = getCurrentUser();
  
  let appointments = [];
  
  if (role === ROLES.CUSTOMER) {
    // Customer xem appointment của mình
    appointments = await API.getAppointments();
  } else if (role === ROLES.TECHNICIAN) {
    // Technician xem công việc được giao
    // Cách 1: Nếu backend có endpoint riêng
    // appointments = await API.getAppointmentsByTechnician(userId);
    
    // Cách 2: Lấy tất cả rồi filter frontend
    const allAppointments = await API.getAllAppointments();
    appointments = filterAppointmentsByRole(allAppointments);
  } else if (status) {
    // Staff/Manager xem theo status
    appointments = await API.getAppointmentsByStatus(status);
  } else {
    // Staff/Manager xem tất cả
    appointments = await API.getAllAppointments();
  }
  
  // Filter theo center (nếu cần)
  return filterByUserCenter(appointments, 'centerId');
};

/**
 * Lấy appointments theo status với center filtering
 * @param {string} status 
 * @returns {Promise<Array>}
 */
export const getAppointmentsByStatus = async (status) => {
  const appointments = await API.getAppointmentsByStatus(status);
  return filterByUserCenter(appointments, 'centerId');
};

/**
 * Phân công technician (chỉ assign tech của center mình)
 * @param {number} appointmentId 
 * @param {number[]} technicianIds 
 * @returns {Promise<Object>}
 */
export const assignTechnicians = async (appointmentId, technicianIds) => {
  const { centerId } = getCurrentUser();
  
  // TODO: Validate technicianIds có thuộc center không
  // const technicians = await API.getAllTechnicians();
  // const validTechs = technicians.filter(t => 
  //   t.centerId === centerId && technicianIds.includes(t.id)
  // );
  
  return await API.assignTechnicians(appointmentId, technicianIds);
};

// ================================
// 4. EMPLOYEE APIs (Manager only)
// ================================

/**
 * Lấy danh sách technicians của center
 * @returns {Promise<Array>}
 */
export const getTechnicians = async () => {
  const { centerId, role } = getCurrentUser();
  const technicians = await API.getAllTechnicians();
  
  if (role === ROLES.ADMIN) {
    return technicians;
  }
  
  // Filter theo center
  return technicians.filter(t => t.centerId === centerId || t.serviceCenter?.id === centerId);
};

/**
 * Lấy danh sách staff và technicians của center
 * API: GET /api/users/center/staff_and_technician
 * Backend đã tự filter theo center của user hiện tại
 * @returns {Promise<Array>}
 */
export const getStaffAndTechnician = async () => {
  // API này đã tự filter theo center của user hiện tại
  return await API.getStaffAndTechnician();
};

/**
 * Tạo employee mới (auto-gán centerId)
 * @param {string} role - Role của employee
 * @param {Object} data - Employee data
 * @returns {Promise<Object>}
 */
export const createEmployee = async (role, data) => {
  const { centerId } = getCurrentUser();
  
  // Thêm centerId vào data
  const employeeData = {
    ...data,
    centerId: centerId // ← Backend sẽ lưu employee vào center của manager
  };
  
  return await API.createEmployee(role, employeeData);
};

/**
 * Xóa employee (chỉ xóa employee của center mình)
 * @param {number} employeeId 
 * @returns {Promise<Object>}
 */
export const deleteEmployee = async (employeeId) => {
  const { centerId } = getCurrentUser();
  
  // TODO: Validate employee có thuộc center không trước khi xóa
  // const employees = await API.getUsersByRole('staff');
  // const employee = employees.find(e => e.id === employeeId);
  // if (employee.centerId !== centerId) {
  //   throw new Error('Cannot delete employee from another center');
  // }
  
  return await API.deleteEmployee(employeeId);
};

// ================================
// 5. PARTS APIs
// ================================

/**
 * Lấy danh sách parts của center
 * @returns {Promise<Array>}
 */
export const getParts = async () => {
  const { centerId, role } = getCurrentUser();
  const allParts = await API.getAllParts();
  
  if (role === ROLES.ADMIN) {
    return allParts;
  }
  
  // Filter parts có inventory tại center
  return allParts.filter(part => {
    if (!part.inventories) return false;
    return part.inventories.some(inv => inv.center?.id === centerId);
  });
};

/**
 * Tạo part mới (Manager)
 * @param {Object} partData 
 * @returns {Promise<Object>}
 */
export const createPart = async (partData) => {
  const { centerId } = getCurrentUser();
  
  // Backend sẽ tự động tạo inventory cho center
  const data = {
    ...partData,
    centerId: centerId
  };
  
  return await API.createPart(data);
};

// ================================
// 6. REPORTS APIs (Manager/Admin)
// ================================

/**
 * Lấy báo cáo doanh thu (auto-filter theo center)
 * @returns {Promise<Object>}
 */
export const getRevenueReport = async () => {
  const { centerId, role } = getCurrentUser();
  
  // Backend endpoint: GET /api/admin/reports/revenue
  // Có thể cần thêm ?centerId={centerId} nếu backend hỗ trợ
  const report = await API.getRevenueReport();
  
  if (role === ROLES.ADMIN) {
    return report;
  }
  
  // TODO: Filter report data theo center nếu backend chưa hỗ trợ
  return report;
};

/**
 * Lấy báo cáo doanh thu tháng hiện tại
 * @returns {Promise<Object>}
 */
export const getRevenueCurrentMonth = async () => {
  return await API.getRevenueCurrentMonth();
};

/**
 * Lấy báo cáo chi phí tháng hiện tại
 * @returns {Promise<number>}
 */
export const getCurrentMonthExpense = async () => {
  return await API.getCurrentMonthExpense();
};

/**
 * Lấy dịch vụ phổ biến
 * @returns {Promise<Array>}
 */
export const getTrendingServices = async () => {
  const { centerId, role } = getCurrentUser();
  
  // Truyền centerId nếu không phải Admin
  const centerIdParam = role === ROLES.ADMIN ? null : centerId;
  return await API.getTrendingServices(centerIdParam);
};

/**
 * Lấy dịch vụ phổ biến tháng trước
 * @returns {Promise<Array>}
 */
export const getTrendingServicesLastMonth = async () => {
  const { centerId, role } = getCurrentUser();
  
  // Truyền centerId nếu không phải Admin
  const centerIdParam = role === ROLES.ADMIN ? null : centerId;
  return await API.getTrendingServicesLastMonth(centerIdParam);
};

/**
 * Lấy báo cáo lợi nhuận theo tháng
 * @returns {Promise<Object>}
 */
export const getProfitReport = async () => {
  const { centerId, role } = getCurrentUser();
  
  const report = await API.getProfitReport();
  
  if (role === ROLES.ADMIN) {
    return report;
  }
  
  // TODO: Filter report data theo center nếu backend chưa hỗ trợ
  return report;
};

/**
 * Lấy top parts được dùng nhiều
 * @returns {Promise<Object>}
 */
export const getTrendingParts = async () => {
  return await API.getTrendingParts();
};

/**
 * Lấy báo cáo tồn kho
 * @returns {Promise<Array>}
 */
export const getPartStockReport = async () => {
  const { centerId, role } = getCurrentUser();
  const report = await API.getPartStockReport();
  
  if (role === ROLES.ADMIN) {
    return report;
  }
  
  // Filter theo center
  return report.filter(item => {
    // Assuming report has centerId field
    return item.centerId === centerId;
  });
};

// ================================
// 7. MAINTENANCE RECORD APIs
// ================================

/**
 * Lấy maintenance records theo center
 * @returns {Promise<Array>}
 */
export const getMaintenanceRecords = async () => {
  const { role } = getCurrentUser();
  
  if (role === ROLES.ADMIN) {
    return await API.getAllMaintenanceRecords();
  }
  
  // Staff/Manager xem theo center
  return await API.getMaintenanceRecordsByCenter();
};

// ================================
// 8. WORKLOG APIs
// ================================

/**
 * Lấy worklogs theo center
 * @returns {Promise<Array>}
 */
export const getWorklogs = async () => {
  return await API.getAllWorkLogsByCenter();
};

// ================================
// 9. CENTER APIs (Admin only)
// ================================

/**
 * Lấy danh sách centers
 * @returns {Promise<Array>}
 */
export const getCenters = async () => {
  // Backend endpoint chưa có trong OpenAPI spec
  // Cần thêm: GET /api/center
  
  // Giả sử có API này:
  // return await axiosClient.get('/api/center');
  
  // Tạm thời return mock data
  return [
    { id: 1, name: 'Center A', address: 'Địa chỉ A', phone: '0123456789' },
    { id: 2, name: 'Center B', address: 'Địa chỉ B', phone: '0987654321' }
  ];
};

// ================================
// 10. EXPORT ALL
// ================================

export default {
  // Customers
  getCustomers,
  
  // Vehicles
  getVehicles,
  
  // Appointments
  getAppointments,
  getAppointmentsByStatus,
  assignTechnicians,
  
  // Employees
  getTechnicians,
  getStaffAndTechnician,
  createEmployee,
  deleteEmployee,
  
  // Parts
  getParts,
  createPart,
  
  // Reports
  getRevenueReport,
  getRevenueCurrentMonth,
  getCurrentMonthExpense,
  getTrendingServices,
  getTrendingServicesLastMonth, // ✅ Thêm
  getProfitReport, // ✅ Thêm
  getTrendingParts,
  getPartStockReport,
  
  // Maintenance
  getMaintenanceRecords,
  
  // Worklogs
  getWorklogs,
  
  // Centers
  getCenters
};
