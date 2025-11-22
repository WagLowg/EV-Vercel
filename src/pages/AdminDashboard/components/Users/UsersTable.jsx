import React from 'react';
import { FaTrash, FaUserTie, FaUserCog, FaWrench, FaUser, FaEye } from 'react-icons/fa';
import './UsersTable.css';

export const UsersTable = ({ users, searchQuery, onView, onDelete }) => {
  const getRoleIcon = (role) => {
    switch (role?.toUpperCase()) {
      case 'MANAGER': return <FaUserTie />;
      case 'STAFF': return <FaUserCog />;
      case 'TECHNICIAN': return <FaWrench />;
      case 'CUSTOMER': return <FaUser />;
      default: return <FaUser />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'MANAGER': return { bg: '#fce7f3', color: '#be185d' };
      case 'STAFF': return { bg: '#dbeafe', color: '#1e40af' };
      case 'TECHNICIAN': return { bg: '#d1fae5', color: '#065f46' };
      case 'CUSTOMER': return { bg: '#e0e7ff', color: '#3730a3' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const getRoleText = (role) => {
    switch (role?.toUpperCase()) {
      case 'MANAGER': return 'Quản lý';
      case 'STAFF': return 'Nhân viên';
      case 'TECHNICIAN': return 'Kỹ thuật viên';
      case 'CUSTOMER': return 'Khách hàng';
      default: return role || 'N/A';
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = (user.fullName || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const phone = (user.phone || user.phoneNumber || '').toLowerCase();
    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  if (filteredUsers.length === 0) {
    return (
      <div className="users-empty-state">
        <FaUser size={48} />
        <h3>Không tìm thấy người dùng</h3>
        {searchQuery ? (
          <p>Không có người dùng nào khớp với "{searchQuery}"</p>
        ) : (
          <p>Chưa có người dùng nào trong hệ thống</p>
        )}
      </div>
    );
  }

  return (
    <div className="users-table-wrapper">
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => {
              const roleColors = getRoleBadgeColor(user.role);
              return (
                <tr key={user.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>
                    <div className="user-name-cell">
                      <div className="user-icon">{getRoleIcon(user.role)}</div>
                      <span className="user-name">{user.fullName || 'N/A'}</span>
                    </div>
                  </td>
                  <td>{user.email || 'N/A'}</td>
                  <td className="text-center">{user.phone || user.phoneNumber || 'N/A'}</td>
                  <td className="text-center">
                    <span 
                      className="role-badge" 
                      style={{
                        background: roleColors.bg,
                        color: roleColors.color
                      }}
                    >
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="text-center">
                    <span 
                      className="status-badge"
                      style={{
                        background: user.status?.toLowerCase() === 'active' ? '#d1fae5' : '#fee2e2',
                        color: user.status?.toLowerCase() === 'active' ? '#065f46' : '#991b1b'
                      }}
                    >
                      {user.status?.toLowerCase() === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      {/* 👁️ Xem chi tiết (View only - không edit) */}
                      <button
                        className="btn-action btn-view"
                        onClick={() => onView(user)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      
                      {/* 🗑️ Xóa tài khoản */}
                      <button
                        className="btn-action btn-delete"
                        onClick={() => onDelete(user)}
                        title="Xóa tài khoản"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <span className="result-count">
          Hiển thị <strong>{filteredUsers.length}</strong> người dùng
          {searchQuery && users.length !== filteredUsers.length && (
            <> trong tổng số <strong>{users.length}</strong></>
          )}
        </span>
      </div>
    </div>
  );
};

