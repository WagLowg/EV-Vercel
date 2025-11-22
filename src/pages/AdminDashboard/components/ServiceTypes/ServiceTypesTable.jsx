import React from 'react';
import { FaEdit, FaTrash, FaCog, FaClock } from 'react-icons/fa';
import './ServiceTypesTable.css';

export const ServiceTypesTable = ({ serviceTypes, searchQuery, onEdit, onDelete }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const filteredServiceTypes = serviceTypes.filter(serviceType => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = (serviceType.name || '').toLowerCase();
    const description = (serviceType.description || '').toLowerCase();
    return name.includes(query) || description.includes(query);
  });

  if (filteredServiceTypes.length === 0) {
    return (
      <div className="service-types-empty-state">
        <FaCog size={48} />
        <h3>Không tìm thấy gói bảo dưỡng</h3>
        {searchQuery ? (
          <p>Không có gói bảo dưỡng nào khớp với "{searchQuery}"</p>
        ) : (
          <p>Chưa có gói bảo dưỡng nào trong hệ thống</p>
        )}
      </div>
    );
  }

  return (
    <div className="service-types-table-wrapper">
      <div className="table-container">
        <table className="service-types-table">
          <thead>
            <tr>
              <th>Mã gói</th>
              <th>Tên gói bảo dưỡng</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Thời gian ước tính</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredServiceTypes.map((serviceType, index) => (
              <tr key={serviceType.id || index}>
                <td className="text-center">
                  <span className="service-type-id">#{serviceType.id}</span>
                </td>
                <td>
                  <div className="service-type-name-cell">
                    <div className="service-type-icon">
                      <FaCog />
                    </div>
                    <span className="service-type-name">{serviceType.name}</span>
                  </div>
                </td>
                <td>
                  <span className="service-type-description">
                    {serviceType.description || '-'}
                  </span>
                </td>
                <td className="text-center">
                  <span className="price-badge">
                    {formatCurrency(serviceType.price)} ₫
                  </span>
                </td>
                <td className="text-center">
                  <span className="duration-badge">
                    <FaClock size={12} style={{ marginRight: '4px' }} />
                    {formatDuration(serviceType.durationEst)}
                  </span>
                </td>
                <td className="text-center">
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit(serviceType)}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDelete(serviceType)}
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

