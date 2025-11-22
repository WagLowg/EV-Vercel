import React from 'react';
import { FaUserTie } from 'react-icons/fa';
import './StaffTable.css';

/**
 * StaffTable Component (Read-Only)
 * Displays staff list in table format without action buttons
 */
export const StaffTable = ({ 
  staffList, 
  searchQuery
}) => {
  // Filter staff based on search query
  const filteredStaff = staffList.filter(staff => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const fullName = (staff.fullName || '').toLowerCase();
    const email = (staff.email || '').toLowerCase();
    const phone = (staff.phone || '');
    
    return fullName.includes(query) || 
           email.includes(query) || 
           phone.includes(query);
  });

  // Empty state
  if (filteredStaff.length === 0) {
    return (
      <div className="staff-empty-state">
        <FaUserTie size={60} />
        <h3>Không tìm thấy nhân viên nào</h3>
        {searchQuery && (
          <p>Thử tìm kiếm với từ khóa khác</p>
        )}
      </div>
    );
  }

  return (
    <div className="staff-table-wrapper">
      <table className="staff-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff, index) => (
            <tr key={staff.id}>
              <td>{index + 1}</td>
              
              <td>
                <div className="staff-name-cell">
                  <FaUserTie style={{
                    color: staff.role?.toUpperCase() === 'TECHNICIAN' ? '#10b981' : '#3b82f6'
                  }} />
                  <strong>{staff.fullName || staff.name || 'N/A'}</strong>
                </div>
              </td>
              
              <td>{staff.email || 'N/A'}</td>
              
              <td>{staff.phone || 'N/A'}</td>
              
              <td>
                <span className={`role-badge ${staff.role?.toUpperCase() === 'TECHNICIAN' ? 'technician' : 'staff'}`}>
                  {staff.role?.toUpperCase() === 'TECHNICIAN' ? 'Kỹ thuật viên' : 'Nhân viên'}
                </span>
              </td>
              
              <td>
                <span className={`status-badge ${(staff.status?.toUpperCase() === 'ACTIVE' || !staff.status) ? 'active' : 'inactive'}`}>
                  {staff.status?.toUpperCase() === 'ACTIVE' ? 'Active' : (staff.status?.toLowerCase() || 'Active')}
                </span>
              </td>
              
              <td>
                {staff.create_at 
                  ? new Date(staff.create_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })
                  : 'N/A'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="total-count">
        <strong>Tổng số: {filteredStaff.length} nhân viên</strong>
        {searchQuery && staffList.length !== filteredStaff.length && (
          <span>
            (từ {staffList.length} nhân viên)
          </span>
        )}
      </div>
    </div>
  );
};
