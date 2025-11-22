import React, { useMemo } from 'react';
import { FaClipboardList, FaUserTie } from 'react-icons/fa';
import './WorkLogTable.css';

/**
 * WorkLogTable Component
 * Displays work logs in table format
 */
export const WorkLogTable = ({ 
  workLogs, 
  searchQuery
}) => {
  // Helper function to truncate text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Helper function to format tasksDone - extract key information
  const formatTasksDone = (tasksDone) => {
    if (!tasksDone) return 'N/A';
    
    // Remove extra whitespace and newlines
    let cleaned = tasksDone.trim().replace(/\s+/g, ' ');
    
    // If it's pipe-separated, show first few items
    if (cleaned.includes('|')) {
      const items = cleaned.split('|').filter(item => item.trim());
      if (items.length <= 3) {
        return items.map(item => item.trim()).join(', ');
      } else {
        return items.slice(0, 2).map(item => item.trim()).join(', ') + ` (+${items.length - 2} công việc khác)`;
      }
    }
    
    return cleaned;
  };

  // Filter and group work logs to avoid duplicates
  const processedWorkLogs = useMemo(() => {
    // Group by staff and tasksDone to combine similar entries
    const grouped = new Map();
    
    workLogs.forEach(log => {
      const staffName = log.staff?.fullName || 'N/A';
      const tasksKey = (log.tasksDone || '').substring(0, 30); // Use first 30 chars as key
      const key = `${staffName}-${tasksKey}`;
      
      if (grouped.has(key)) {
        // Combine hours if same staff and similar tasks
        const existing = grouped.get(key);
        existing.hoursSpent = (existing.hoursSpent || 0) + (log.hoursSpent || 0);
        existing.count = (existing.count || 1) + 1;
      } else {
        grouped.set(key, {
          ...log,
          count: 1
        });
      }
    });
    
    return Array.from(grouped.values());
  }, [workLogs]);

  // Filter work logs based on search query
  const filteredWorkLogs = processedWorkLogs.filter(log => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const staffName = (log.staff?.fullName || '').toLowerCase();
    const tasksDone = (log.tasksDone || '').toLowerCase();
    
    return staffName.includes(query) || tasksDone.includes(query);
  });

  // Empty state
  if (filteredWorkLogs.length === 0) {
    return (
      <div className="worklog-empty-state">
        <FaClipboardList size={60} />
        <h3>Không tìm thấy WorkLog nào</h3>
        {searchQuery && (
          <p>Thử tìm kiếm với từ khóa khác</p>
        )}
      </div>
    );
  }

  return (
    <div className="worklog-table-wrapper">
      <table className="worklog-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Nhân viên</th>
            <th>Công việc</th>
            <th>Giờ làm việc</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorkLogs.map((log, index) => (
            <tr key={log.id || `worklog-${index}-${log.appointmentId}-${log.staffIds?.[0] || 'na'}`}>
              <td>{index + 1}</td>
              
              <td>
                <div className="staff-name-cell">
                  <FaUserTie style={{ color: '#3b82f6' }} />
                  <strong>{log.staff?.fullName || 'N/A'}</strong>
                </div>
              </td>
              
              <td>
                <div className="task-cell" title={log.tasksDone || 'N/A'}>
                  {truncateText(formatTasksDone(log.tasksDone), 60)}
                  {log.count > 1 && (
                    <span style={{ 
                      marginLeft: '8px', 
                      padding: '2px 6px', 
                      background: '#667eea', 
                      color: 'white', 
                      borderRadius: '4px', 
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      x{log.count}
                    </span>
                  )}
                </div>
              </td>
              
              <td>
                <span className="hours-badge">
                  {typeof log.hoursSpent === 'number' ? log.hoursSpent.toFixed(2) : (log.hoursSpent || 0)} giờ
                </span>
              </td>
              
              <td>
                {log.createdAt 
                  ? new Date(log.createdAt).toLocaleDateString('vi-VN', {
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
        <strong>Tổng số: {filteredWorkLogs.length} WorkLog</strong>
        {searchQuery && processedWorkLogs.length !== filteredWorkLogs.length && (
          <span>
            (từ {processedWorkLogs.length} WorkLog)
          </span>
        )}
      </div>
    </div>
  );
};

