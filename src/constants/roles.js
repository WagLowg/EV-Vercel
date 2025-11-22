/**
 * ROLE DEFINITIONS - EV Service Center System
 * 
 * System có 2 Service Centers, mỗi center độc lập.
 * Mỗi Manager quản lý 1 center cụ thể.
 * 
 * 🎯 4 ROLES CHÍNH:
 * - CUSTOMER: Khách hàng (scope: self)
 * - TECHNICIAN: Kỹ thuật viên (scope: center + tasks)
 * - STAFF: Nhân viên tiếp nhận (scope: center)
 * - MANAGER: Quản lý trung tâm (scope: center full) ← Admin cũ đổi thành Manager
 */

// ================================
// 1. ROLE CONSTANTS
// ================================

export const ROLES = {
  CUSTOMER: 'customer',      // Khách hàng
  TECHNICIAN: 'technician',  // Kỹ thuật viên
  STAFF: 'staff',           // Nhân viên tiếp nhận
  MANAGER: 'manager'        // Quản lý trung tâm (Admin cũ → Manager)
};

// ================================
// 2. ROLE DISPLAY NAMES
// ================================

export const ROLE_LABELS = {
  [ROLES.CUSTOMER]: 'Khách hàng',
  [ROLES.TECHNICIAN]: 'Kỹ thuật viên',
  [ROLES.STAFF]: 'Nhân viên tiếp nhận',
  [ROLES.MANAGER]: 'Quản lý trung tâm'
};

// ================================
// 3. ROLE SCOPES
// ================================

export const ROLE_SCOPES = {
  [ROLES.CUSTOMER]: 'self',           // Chỉ data của mình
  [ROLES.TECHNICIAN]: 'center_tasks', // Center + công việc được giao
  [ROLES.STAFF]: 'center',            // Toàn bộ center
  [ROLES.MANAGER]: 'center_full'      // Toàn bộ center + quản lý đầy đủ
};

// ================================
// 4. PERMISSION MATRIX
// ================================

export const PERMISSIONS = {
  // Quản lý khách hàng
  VIEW_CUSTOMERS: [ROLES.STAFF, ROLES.MANAGER],
  EDIT_CUSTOMERS: [ROLES.STAFF, ROLES.MANAGER],
  DELETE_CUSTOMERS: [ROLES.MANAGER],
  
  // Quản lý xe
  VIEW_VEHICLES: [ROLES.CUSTOMER, ROLES.TECHNICIAN, ROLES.STAFF, ROLES.MANAGER],
  ADD_VEHICLES: [ROLES.CUSTOMER, ROLES.STAFF, ROLES.MANAGER],
  EDIT_VEHICLES: [ROLES.STAFF, ROLES.MANAGER],
  DELETE_VEHICLES: [ROLES.CUSTOMER, ROLES.STAFF, ROLES.MANAGER],
  
  // Quản lý lịch hẹn
  CREATE_APPOINTMENT: [ROLES.CUSTOMER],
  VIEW_APPOINTMENTS: [ROLES.CUSTOMER, ROLES.TECHNICIAN, ROLES.STAFF, ROLES.MANAGER],
  ACCEPT_APPOINTMENT: [ROLES.STAFF, ROLES.MANAGER],
  ASSIGN_TECHNICIAN: [ROLES.STAFF, ROLES.MANAGER],
  UPDATE_PROGRESS: [ROLES.TECHNICIAN, ROLES.STAFF, ROLES.MANAGER],
  CANCEL_APPOINTMENT: [ROLES.CUSTOMER, ROLES.STAFF, ROLES.MANAGER],
  
  // Quản lý phụ tùng
  VIEW_PARTS: [ROLES.TECHNICIAN, ROLES.STAFF, ROLES.MANAGER],
  USE_PARTS: [ROLES.TECHNICIAN],
  MANAGE_PARTS: [ROLES.MANAGER], // Thêm/xóa/sửa/tồn kho (chỉ Manager)
  VIEW_PARTS_AI: [ROLES.MANAGER],
  
  // Quản lý nhân sự
  VIEW_EMPLOYEES: [ROLES.MANAGER],
  ADD_EMPLOYEES: [ROLES.MANAGER],
  EDIT_EMPLOYEES: [ROLES.MANAGER],
  DELETE_EMPLOYEES: [ROLES.MANAGER],
  ASSIGN_SHIFTS: [ROLES.MANAGER],
  VIEW_PERFORMANCE: [ROLES.MANAGER],
  
  // Tài chính & Báo cáo
  CREATE_QUOTE: [ROLES.STAFF, ROLES.MANAGER],
  CREATE_INVOICE: [ROLES.STAFF, ROLES.MANAGER],
  MAKE_PAYMENT: [ROLES.CUSTOMER, ROLES.STAFF, ROLES.MANAGER],
  VIEW_REPORTS: [ROLES.MANAGER],
  VIEW_REVENUE: [ROLES.MANAGER],
  EXPORT_REPORTS: [ROLES.MANAGER],
  
  // Chat
  CHAT: [ROLES.CUSTOMER, ROLES.TECHNICIAN, ROLES.STAFF, ROLES.MANAGER]
};

// ================================
// 5. HELPER FUNCTIONS
// ================================

/**
 * Kiểm tra user có quyền thực hiện action không
 * @param {string} userRole - Role của user
 * @param {string} permission - Permission key từ PERMISSIONS
 * @returns {boolean}
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
};

/**
 * Kiểm tra user có phải là staff/manager không (center-level access)
 * @param {string} role 
 * @returns {boolean}
 */
export const isCenterStaff = (role) => {
  return [ROLES.STAFF, ROLES.MANAGER].includes(role);
};

/**
 * Kiểm tra user có phải là technician không
 * @param {string} role 
 * @returns {boolean}
 */
export const isTechnician = (role) => {
  return role === ROLES.TECHNICIAN;
};

/**
 * Kiểm tra user có phải là manager không (management access)
 * @param {string} role 
 * @returns {boolean}
 */
export const isManager = (role) => {
  return role === ROLES.MANAGER;
};

/**
 * Kiểm tra user có phải là customer không
 * @param {string} role 
 * @returns {boolean}
 */
export const isCustomer = (role) => {
  return role === ROLES.CUSTOMER;
};

/**
 * Lấy tất cả permissions của một role
 * @param {string} role 
 * @returns {string[]} Array of permission keys
 */
export const getRolePermissions = (role) => {
  if (!role) return [];
  
  return Object.keys(PERMISSIONS).filter(permission => {
    return hasPermission(role, permission);
  });
};

/**
 * Kiểm tra data có thuộc center của user không
 * @param {number} dataCenterId - Center ID của data
 * @param {number} userCenterId - Center ID của user
 * @param {string} userRole - Role của user
 * @returns {boolean}
 */
export const canAccessCenterData = (dataCenterId, userCenterId, userRole) => {
  // Customer không có centerId, có thể access data của mình
  if (userRole === ROLES.CUSTOMER) return true;
  
  // Staff/Technician/Manager chỉ access center của mình
  if (!userCenterId) return false;
  return dataCenterId === userCenterId;
};

// ================================
// 6. DASHBOARD ROUTES
// ================================

export const DASHBOARD_ROUTES = {
  [ROLES.CUSTOMER]: '/customer-dashboard',
  [ROLES.TECHNICIAN]: '/technician-dashboard',
  [ROLES.STAFF]: '/staff-dashboard',
  [ROLES.MANAGER]: '/manager-dashboard'  // ← Manager dashboard (Admin cũ → Manager)
};

/**
 * Lấy dashboard route theo role
 * @param {string} role 
 * @returns {string}
 */
export const getDashboardRoute = (role) => {
  return DASHBOARD_ROUTES[role] || '/';
};
