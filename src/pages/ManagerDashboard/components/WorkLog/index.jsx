import React, { useState, useMemo } from 'react';
import { FaSearch, FaClipboardList } from 'react-icons/fa';
import { useWorkLog } from '../../hooks/useWorkLog';
import { WorkLogStats } from './WorkLogStats';
import { WorkLogTable } from './WorkLogTable';
import './WorkLogStats.css';

/**
 * WorkLog Tab Component
 * Displays work logs for staff in current center
 */
export const WorkLogTab = () => {
  const { workLogs, loading, error, fetchWorkLogs } = useWorkLog();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const stats = useMemo(() => {
    const totalLogs = workLogs.length;
    const totalHours = workLogs.reduce((sum, log) => sum + (log.hoursSpent || 0), 0);
    const completedTasks = workLogs.filter(log => log.tasksDone).length;
    
    return {
      totalLogs,
      totalHours,
      completedTasks
    };
  }, [workLogs]);

  // Loading state
  if (loading) {
    return (
      <div className="worklog-section">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải danh sách WorkLog...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="worklog-section">
        <div className="error-state">
          <p>❌ Lỗi: {error}</p>
          <button onClick={fetchWorkLogs} className="btn-retry">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="worklog-section">
      {/* Statistics Cards */}
      <WorkLogStats stats={stats} />

      {/* Toolbar: Search */}
      <div className="section-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm WorkLog (tên nhân viên, công việc)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* WorkLog Table */}
      {workLogs.length === 0 ? (
        <div className="worklog-empty-state">
          <FaClipboardList size={60} />
          <h3>Chưa có WorkLog nào</h3>
          <p>Không có dữ liệu WorkLog để hiển thị</p>
        </div>
      ) : (
        <WorkLogTable
          workLogs={workLogs}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

