import React, { useState } from 'react';
import { FaSearch, FaUserTie } from 'react-icons/fa';
import { useStaff } from '../../hooks/useStaff';
import { StaffStats } from './StaffStats';
import { StaffTable } from './StaffTable';

/**
 * StaffList Component (Read-Only)
 * Displays staff list for current manager's center
 * No CRUD operations - view only
 */
export const StaffList = () => {
  const { staffList, loading, error, stats, fetchStaff } = useStaff();
  const [searchQuery, setSearchQuery] = useState('');

  // Loading state
  if (loading) {
    return (
      <div className="staff-section">
        <div className="loading-state" style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#666'
        }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>⏳ Đang tải danh sách nhân viên...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="staff-section">
        <div className="error-state" style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#f44336'
        }}>
          <p>❌ Lỗi: {error}</p>
          <button 
            onClick={fetchStaff}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-section">
      {/* Statistics Cards */}
      <StaffStats stats={stats} />

      {/* Toolbar: Search */}
      <div className="section-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên (tên, email, SĐT)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Staff Table */}
      {staffList.length === 0 ? (
        <div className="staff-empty-state">
          <FaUserTie size={60} />
          <h3>Chưa có nhân viên nào</h3>
          <p>Hiện tại không có nhân viên nào được gán cho trung tâm này</p>
        </div>
      ) : (
        <StaffTable
          staffList={staffList}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};
