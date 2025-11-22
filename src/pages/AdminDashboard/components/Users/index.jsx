import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useUsers } from '../../hooks/useUsers';
import { UserModal } from './UserModal';
import { UsersStats } from './UsersStats';
import { UsersTable } from './UsersTable';
import { showSuccess, showError } from '../../../../utils/toast';
import './Users.css';

export const UsersTab = () => {
  const { users, loading, error, fetchUsers, addEmployee, deleteUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // Always 'add' - no edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
    setShowModal(true);
  };

  // ✅ View user details (read-only)
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.fullName}"?`)) {
      return;
    }

    const result = await deleteUser(user.id);
    if (result.success) {
      showSuccess('Xóa người dùng thành công!');
    } else {
      showError(`Lỗi: ${result.error}`);
    }
  };

  const handleSaveUser = async (userData, file = null) => {
    // ✅ Admin chỉ có thể TẠO mới, không EDIT
    const result = await addEmployee(userData.role, userData, file);

    if (result.success) {
      showSuccess('✅ Thêm người dùng thành công!');
      setShowModal(false);
      setSelectedUser(null);
    } else {
      showError(`❌ Lỗi: ${result.error}`);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="users-section">
      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-user-btn" onClick={handleAddUser}>
          <FaPlus />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
        </div>
      )}

      {/* Stats Cards */}
      {users.length > 0 && <UsersStats users={users} />}

      {/* Users Table */}
      <UsersTable
        users={users}
        searchQuery={searchQuery}
        onView={handleViewUser}
        onDelete={handleDeleteUser}
      />

      {/* Add User Modal (Create only) */}
      {showModal && (
        <UserModal
          mode="add"
          user={null}
          onSave={handleSaveUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* View User Modal (Read-only) */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
            <div className="modal-header">
              <h2>👁️ Thông tin người dùng</h2>
              <button onClick={() => setShowViewModal(false)} className="close-button" style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'}}>
                ×
              </button>
            </div>
            <div className="modal-body" style={{padding: '24px'}}>
              <div style={{display: 'grid', gap: '16px'}}>
                <div>
                  <label style={{fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px'}}>Họ tên:</label>
                  <p style={{color: '#6b7280', margin: 0}}>{selectedUser.fullName || 'N/A'}</p>
                </div>
                <div>
                  <label style={{fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px'}}>Email:</label>
                  <p style={{color: '#6b7280', margin: 0}}>{selectedUser.email || 'N/A'}</p>
                </div>
                <div>
                  <label style={{fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px'}}>Số điện thoại:</label>
                  <p style={{color: '#6b7280', margin: 0}}>{selectedUser.phone || selectedUser.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <label style={{fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px'}}>Vai trò:</label>
                  <p style={{color: '#6b7280', margin: 0}}>{selectedUser.role || 'N/A'}</p>
                </div>
                <div>
                  <label style={{fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px'}}>Trạng thái:</label>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: selectedUser.status?.toLowerCase() === 'active' ? '#d1fae5' : '#fee2e2',
                    color: selectedUser.status?.toLowerCase() === 'active' ? '#065f46' : '#991b1b'
                  }}>
                    {selectedUser.status?.toLowerCase() === 'active' ? '✅ Hoạt động' : '❌ Không hoạt động'}
                  </span>
                </div>
                {selectedUser.serviceCenterId && (
                  <div>
                    <label style={{fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px'}}>Service Center ID:</label>
                    <p style={{color: '#6b7280', margin: 0}}>{selectedUser.serviceCenterId || selectedUser.centerId || 'N/A'}</p>
                  </div>
                )}
                {selectedUser.certificateLink && (
                  <div>
                    <label style={{fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px'}}>Chứng chỉ:</label>
                    <a href={selectedUser.certificateLink} target="_blank" rel="noopener noreferrer" style={{color: '#667eea', textDecoration: 'underline'}}>
                      📄 Xem chứng chỉ
                    </a>
                  </div>
                )}
              </div>
              <div style={{marginTop: '24px', padding: '12px', background: '#fef3c7', borderRadius: '8px'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#92400e'}}>
                  ⚠️ <strong>Lưu ý:</strong> Admin không có quyền chỉnh sửa thông tin người dùng. Chỉ có thể xem và xóa tài khoản.
                </p>
              </div>
            </div>
            <div className="modal-footer" style={{display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #e5e7eb'}}>
              <button
                onClick={() => setShowViewModal(false)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
