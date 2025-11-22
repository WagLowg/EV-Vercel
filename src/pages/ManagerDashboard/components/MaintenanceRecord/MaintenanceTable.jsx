import React, { useMemo } from 'react';
import { FaTools, FaCar } from 'react-icons/fa';
import './MaintenanceTable.css';

/**
 * MaintenanceTable Component
 * Displays maintenance records in table format
 */
export const MaintenanceTable = ({ 
  records, 
  searchQuery
}) => {
  // Helper function to format checklist - make it short and clear
  const formatChecklist = (checklist) => {
    if (!checklist) return { display: 'N/A', full: 'N/A', count: 0 };
    
    // Remove extra whitespace
    let cleaned = checklist.trim().replace(/\s+/g, ' ');
    
    // Handle pipe-separated items (most common format)
    if (cleaned.includes('|')) {
      const items = cleaned.split('|').filter(item => item.trim());
      const count = items.length;
      
      if (count === 0) {
        return { display: 'N/A', full: 'N/A', count: 0 };
      }
      
      // Show first 2-3 items, then count
      if (count <= 3) {
        const display = items.map(item => item.trim()).join(', ');
        return { display, full: cleaned, count };
      } else {
        const firstItems = items.slice(0, 2).map(item => item.trim()).join(', ');
        const display = `${firstItems} (+${count - 2} mục khác)`;
        return { display, full: cleaned, count };
      }
    }
    
    // Handle comma-separated items
    if (cleaned.includes(',')) {
      const items = cleaned.split(',').filter(item => item.trim());
      const count = items.length;
      
      if (count === 0) {
        return { display: 'N/A', full: 'N/A', count: 0 };
      }
      
      if (count <= 3) {
        const display = items.map(item => item.trim()).join(', ');
        return { display, full: cleaned, count };
      } else {
        const firstItems = items.slice(0, 2).map(item => item.trim()).join(', ');
        const display = `${firstItems} (+${count - 2} mục khác)`;
        return { display, full: cleaned, count };
      }
    }
    
    // Single item or plain text - truncate if too long
    const maxLength = 50;
    if (cleaned.length <= maxLength) {
      return { display: cleaned, full: cleaned, count: 1 };
    } else {
      return { 
        display: cleaned.substring(0, maxLength) + '...', 
        full: cleaned, 
        count: 1 
      };
    }
  };

  // Filter records based on search query
  const filteredRecords = useMemo(() => {
    if (!searchQuery) return records;
    
    const query = searchQuery.toLowerCase();
    return records.filter(record => {
      const vehicleModel = (record.appointment?.vehicle?.model || '').toLowerCase();
      const checkList = (record.checklist || '').toLowerCase();
      const remarks = (record.remarks || '').toLowerCase();
      const appointmentId = (record.appointmentId || '').toString().toLowerCase();
      
      return vehicleModel.includes(query) || 
             checkList.includes(query) || 
             remarks.includes(query) ||
             appointmentId.includes(query);
    });
  }, [records, searchQuery]);

  // Helper để format ngày giờ
  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'N/A';
    }
  };

  // Empty state
  if (filteredRecords.length === 0) {
    return (
      <div className="maintenance-empty-state">
        <FaTools size={60} />
        <h3>Không tìm thấy bảo dưỡng nào</h3>
        {searchQuery && (
          <p>Thử tìm kiếm với từ khóa khác</p>
        )}
      </div>
    );
  }

  return (
    <div className="maintenance-table-wrapper">
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Appointment ID</th>
            <th>Tình trạng xe</th>
            <th>Kiểm tra</th>
            <th>Ghi chú</th>
            <th>Thời gian bắt đầu</th>
            <th>Thời gian kết thúc</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => {
            // Lấy start_time từ các field có thể có
            const startTime = record.start_time || record.startTime || record.start_time_stamp || record.startTimestamp;
            // Lấy end_time từ các field có thể có
            const endTime = record.end_time || record.endTime || record.end_time_stamp || record.endTimestamp;

            return (
              <tr key={record.id || `maintenance-${index}`}>
                <td>{index + 1}</td>
                
                <td>
                  <div className="appointment-cell">
                    <FaCar style={{ color: '#8b5cf6' }} />
                    <strong>#{record.appointmentId || 'N/A'}</strong>
                  </div>
                </td>
                
                <td>
                  <span className="condition-badge">
                    {record.vehicleCondition || 'N/A'}
                  </span>
                </td>
                
                <td>
                  <div className="checklist-cell" title={record.checklist || 'N/A'}>
                    {formatChecklist(record.checklist).display}
                  </div>
                </td>
                
                <td>
                  <div className="remarks-cell" title={record.remarks || 'N/A'}>
                    {(() => {
                      if (!record.remarks) return 'N/A';
                      
                      // Nếu có pipe-separated, lấy phần cuối cùng
                      if (record.remarks.includes('|')) {
                        const parts = record.remarks.split('|').filter(p => p.trim());
                        return parts.length > 0 ? parts[parts.length - 1].trim() : 'N/A';
                      }
                      
                      // Nếu có comma-separated, lấy phần cuối cùng
                      if (record.remarks.includes(',')) {
                        const parts = record.remarks.split(',').filter(p => p.trim());
                        return parts.length > 0 ? parts[parts.length - 1].trim() : 'N/A';
                      }
                      
                      // Nếu là text dài, lấy 50 ký tự cuối cùng
                      const maxLength = 50;
                      if (record.remarks.length > maxLength) {
                        return '...' + record.remarks.substring(record.remarks.length - maxLength);
                      }
                      
                      return record.remarks;
                    })()}
                  </div>
                </td>
                
                <td>
                  <span className="time-badge start">
                    {formatDateTime(startTime)}
                  </span>
                </td>
                
                <td>
                  <span className="time-badge end">
                    {formatDateTime(endTime)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="total-count">
        <strong>Tổng số: {filteredRecords.length} bản ghi</strong>
        {searchQuery && records.length !== filteredRecords.length && (
          <span>
            (từ {records.length} bản ghi)
          </span>
        )}
      </div>
    </div>
  );
};

