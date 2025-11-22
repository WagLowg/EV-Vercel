import React, { useState, useMemo } from 'react';
import { FaSearch, FaTools } from 'react-icons/fa';
import { useMaintenanceRecord } from '../../hooks/useMaintenanceRecord';
import { MaintenanceStats } from './MaintenanceStats';
import { MaintenanceTable } from './MaintenanceTable';
import './MaintenanceStats.css';

/**
 * MaintenanceRecord Tab Component
 * Displays maintenance records for current center
 */
export const MaintenanceRecordTab = () => {
  const { records, loading, error, fetchRecords } = useMaintenanceRecord();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const stats = useMemo(() => {
    const totalRecords = records.length;
    const completedRecords = records.filter(r => r.end_time || r.endTime || r.end_time_stamp || r.endTimestamp).length;
    const pendingRecords = totalRecords - completedRecords;
    const checklistItems = records.reduce((sum, r) => {
      if (r.checklist) {
        // Count comma-separated items or just count 1 if exists
        const items = r.checklist.split(',').filter(item => item.trim());
        return sum + items.length;
      }
      return sum;
    }, 0);
    
    return {
      totalRecords,
      completedRecords,
      pendingRecords,
      checklistItems
    };
  }, [records]);

  // Loading state
  if (loading) {
    return (
      <div className="maintenance-section">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải danh sách bảo dưỡng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="maintenance-section">
        <div className="error-state">
          <p>❌ Lỗi: {error}</p>
          <button onClick={fetchRecords} className="btn-retry">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="maintenance-section">
      {/* Statistics Cards */}
      <MaintenanceStats stats={stats} />

      {/* Toolbar: Search */}
      <div className="section-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm (xe, kiểm tra, ghi chú)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Maintenance Records Table */}
      {records.length === 0 ? (
        <div className="maintenance-empty-state">
          <FaTools size={60} />
          <h3>Chưa có quy trình bảo dưỡng nào</h3>
          <p>Không có dữ liệu bảo dưỡng để hiển thị</p>
        </div>
      ) : (
        <MaintenanceTable
          records={records}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};
