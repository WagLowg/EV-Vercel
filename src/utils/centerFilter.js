/**
 * CENTER FILTER UTILITIES
 * 
 * Các helper functions để filter data theo centerId
 * Đảm bảo mỗi role chỉ thấy data của center mình
 * 
 * 🎯 VERSION: 4 Roles (Customer, Technician, Staff, Manager)
 * 📝 NOTE: Có thể mở rộng thêm Admin role sau nếu cần
 */

import { ROLES } from '../constants/roles';

const parseNumber = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

// ================================
// 1. GET USER INFO FROM STORAGE
// ================================

/**
 * Lấy thông tin user hiện tại từ localStorage
 * @returns {Object} User info
 */
export const getCurrentUser = () => {
  let storedUser = null;
  try {
    const rawUser = localStorage.getItem('user');
    storedUser = rawUser ? JSON.parse(rawUser) : null;
  } catch (err) {
    console.warn('⚠️ [centerFilter] Failed to parse user from localStorage:', err);
  }

  const userIdValue =
    storedUser?.user_id ??
    storedUser?.id ??
    storedUser?.userId ??
    localStorage.getItem('userId');

  const centerIdValue =
    storedUser?.center_id ??
    storedUser?.centerId ??
    localStorage.getItem('centerId');

  const rawRole = (
    localStorage.getItem('role') ??
    storedUser?.role ??
    ''
  ).toString();

  const normalizedRole = rawRole
    ? rawRole.toLowerCase().replace(/^role_/, '')
    : null;

  return {
    id: parseNumber(userIdValue),
    role: normalizedRole,
    centerId: parseNumber(centerIdValue),
    fullName: storedUser?.fullName ?? localStorage.getItem('fullName') ?? '',
    token: localStorage.getItem('token') ?? storedUser?.token ?? null,
    rawUser: storedUser
  };
};

/**
 * Lấy centerId của user hiện tại
 * @returns {number|null}
 */
export const getCurrentCenterId = () => {
  return getCurrentUser().centerId;
};

/**
 * Lấy role của user hiện tại
 * @returns {string|null}
 */
export const getCurrentRole = () => {
  return getCurrentUser().role;
};

// ================================
// 2. CENTER ACCESS CHECKS
// ================================

/**
 * Kiểm tra user có quyền xem data của center không
 * @param {number} dataCenterId - Center ID của data
 * @returns {boolean}
 */
export const canAccessCenter = (dataCenterId) => {
  const { role, centerId } = getCurrentUser();
  
  // TODO: Khi có Admin role, uncomment dòng này
  // // TODO: Admin role - // TODO: Admin role - if (role === ROLES.ADMIN) return true;
  
  // Customer không có centerId, có thể access tất cả
  if (role === ROLES.CUSTOMER) return true;
  
  // Staff/Technician/Manager chỉ access center của mình
  if (!centerId) return false;
  return dataCenterId === centerId;
};

/**
 * Kiểm tra user có cần filter theo center không
 * @returns {boolean}
 */
export const shouldFilterByCenter = () => {
  const { role } = getCurrentUser();
  
  // TODO: Khi có Admin role, uncomment dòng này
  // // TODO: Admin role - if (role === ROLES.ADMIN) return false; // Admin xem tất cả
  
  // Customer không cần filter (chỉ xem data của mình)
  if (role === ROLES.CUSTOMER) return false;
  
  // Staff/Technician/Manager cần filter theo center
  return [ROLES.STAFF, ROLES.TECHNICIAN, ROLES.MANAGER].includes(role);
};

// ================================
// 3. DATA FILTERING
// ================================

/**
 * Filter array theo centerId của user
 * @param {Array} data - Mảng dữ liệu cần filter
 * @param {string} centerField - Tên field chứa centerId (default: 'centerId')
 * @returns {Array} Filtered data
 */
export const filterByUserCenter = (data, centerField = 'centerId') => {
  if (!Array.isArray(data)) return [];
  
  const { role, centerId } = getCurrentUser();
  
  // Admin xem tất cả
  // TODO: Admin role - if (role === ROLES.ADMIN) return data;
  
  // Customer xem theo customerId (không filter theo center)
  if (role === ROLES.CUSTOMER) return data;
  
  // Staff/Technician/Manager filter theo center
  if (!centerId) return [];
  
  return data.filter(item => {
    const itemCenterId = item[centerField];
    return itemCenterId === centerId;
  });
};

/**
 * Filter appointments theo user role
 * @param {Array} appointments 
 * @returns {Array}
 */
export const filterAppointmentsByRole = (appointments) => {
  if (!Array.isArray(appointments)) return [];
  
  const { role, centerId, id: userId } = getCurrentUser();
  
  // Admin xem tất cả
  // TODO: Admin role - if (role === ROLES.ADMIN) return appointments;
  
  // Customer chỉ xem appointment của mình
  if (role === ROLES.CUSTOMER) {
    return appointments.filter(apt => apt.customerId === userId);
  }
  
  // Technician chỉ xem appointment được giao
  if (role === ROLES.TECHNICIAN) {
    return appointments.filter(apt => {
      // Check nếu technician được assign (techIds có userId của mình)
      if (apt.techIds) {
        const techIds = apt.techIds.split(',').map(id => parseInt(id.trim()));
        return techIds.includes(userId);
      }
      return false;
    });
  }
  
  // Staff/Manager xem theo center
  return filterByUserCenter(appointments);
};

/**
 * Filter customers theo role (Staff/Manager chỉ xem customer của center mình)
 * @param {Array} customers 
 * @returns {Array}
 */
export const filterCustomersByRole = (customers) => {
  if (!Array.isArray(customers)) return [];
  
  const { role, centerId } = getCurrentUser();
  
  // Admin xem tất cả
  // TODO: Admin role - if (role === ROLES.ADMIN) return customers;
  
  // Customer chỉ xem mình
  if (role === ROLES.CUSTOMER) {
    const userId = getCurrentUser().id;
    return customers.filter(c => c.id === userId);
  }
  
  // Staff/Manager: Backend sẽ filter theo center
  // Frontend chỉ cần hiển thị data nhận được
  return customers;
};

/**
 * Filter employees theo role
 * @param {Array} employees 
 * @returns {Array}
 */
export const filterEmployeesByRole = (employees) => {
  if (!Array.isArray(employees)) return [];
  
  const { role, centerId } = getCurrentUser();
  
  // Admin xem tất cả
  // TODO: Admin role - if (role === ROLES.ADMIN) return employees;
  
  // Manager chỉ xem nhân viên của center mình
  if (role === ROLES.MANAGER) {
    return employees.filter(emp => emp.centerId === centerId);
  }
  
  // Staff/Technician/Customer không có quyền xem employees
  return [];
};

/**
 * Filter parts theo role
 * @param {Array} parts 
 * @returns {Array}
 */
export const filterPartsByRole = (parts) => {
  if (!Array.isArray(parts)) return [];
  
  const { role, centerId } = getCurrentUser();
  
  // Admin xem tất cả
  // TODO: Admin role - if (role === ROLES.ADMIN) return parts;
  
  // Staff/Technician/Manager xem parts của center
  if (!centerId) return [];
  
  // Filter parts có inventory tại center của user
  return parts.filter(part => {
    if (!part.inventories || !Array.isArray(part.inventories)) return false;
    return part.inventories.some(inv => inv.center?.id === centerId);
  });
};

// ================================
// 4. API QUERY PARAMS
// ================================

/**
 * Thêm centerId vào query params nếu cần
 * @param {Object} params - Existing params
 * @returns {Object} Updated params
 */
export const addCenterIdToParams = (params = {}) => {
  const { role, centerId } = getCurrentUser();
  
  // Admin không cần thêm centerId
  // TODO: Admin role - if (role === ROLES.ADMIN) return params;
  
  // Customer không có centerId
  if (role === ROLES.CUSTOMER) return params;
  
  // Staff/Technician/Manager thêm centerId
  if (centerId) {
    return { ...params, centerId };
  }
  
  return params;
};

/**
 * Tạo filter object cho API request
 * @returns {Object} Filter object
 */
export const getCenterFilter = () => {
  const { role, centerId } = getCurrentUser();
  
  // TODO: Admin role - if (role === ROLES.ADMIN || role === ROLES.CUSTOMER)
  if (role === ROLES.CUSTOMER) {
    return {};
  }
  
  return centerId ? { centerId } : {};
};

// ================================
// 5. UI HELPERS
// ================================

/**
 * Kiểm tra có nên hiển thị center selector không
 * @returns {boolean}
 */
export const shouldShowCenterSelector = () => {
  const { role } = getCurrentUser();
  // TODO: Khi có Admin role, return true cho Admin
  // return role === ROLES.ADMIN;
  return false; // Hiện tại chỉ có Manager, không có center selector
};

/**
 * Lấy center name từ centerId
 * @param {number} centerId 
 * @param {Array} centers - Danh sách centers
 * @returns {string}
 */
export const getCenterName = (centerId, centers = []) => {
  if (!centerId || !Array.isArray(centers)) return 'N/A';
  const center = centers.find(c => c.id === centerId || c.centerId === centerId);
  return center?.name || `Center #${centerId}`;
};

/**
 * Kiểm tra user có thuộc center cụ thể không
 * @param {number} targetCenterId 
 * @returns {boolean}
 */
export const isUserInCenter = (targetCenterId) => {
  const { centerId } = getCurrentUser();
  return centerId === targetCenterId;
};

// ================================
// 6. VALIDATION
// ================================

/**
 * Validate user có quyền thao tác với data không
 * @param {Object} data - Data object
 * @param {string} action - Action name (view/edit/delete)
 * @returns {Object} { allowed: boolean, reason: string }
 */
export const validateCenterAccess = (data, action = 'view') => {
  const { role, centerId } = getCurrentUser();
  
  // TODO: Khi có Admin role, uncomment dòng này
  // if (role === ROLES.ADMIN) {
  //   return { allowed: true, reason: 'Admin access' };
  // }
  
  // Customer chỉ thao tác với data của mình
  if (role === ROLES.CUSTOMER) {
    const userId = getCurrentUser().id;
    if (data.customerId === userId || data.userId === userId) {
      return { allowed: true, reason: 'Own data' };
    }
    return { allowed: false, reason: 'Not your data' };
  }
  
  // Staff/Technician/Manager kiểm tra centerId
  if (!centerId) {
    return { allowed: false, reason: 'No center assigned' };
  }
  
  const dataCenterId = data.centerId || data.serviceCenterId || data.center?.id;
  
  if (dataCenterId === centerId) {
    return { allowed: true, reason: 'Same center' };
  }
  
  return { allowed: false, reason: 'Different center' };
};

// ================================
// 7. EXPORT ALL
// ================================

export default {
  getCurrentUser,
  getCurrentCenterId,
  getCurrentRole,
  canAccessCenter,
  shouldFilterByCenter,
  filterByUserCenter,
  filterAppointmentsByRole,
  filterCustomersByRole,
  filterEmployeesByRole,
  filterPartsByRole,
  addCenterIdToParams,
  getCenterFilter,
  shouldShowCenterSelector,
  getCenterName,
  isUserInCenter,
  validateCenterAccess
};

