import React from 'react';
import { FaEdit, FaTrash, FaWarehouse, FaBoxes } from 'react-icons/fa';
import './PartsTable.css';

export const PartsTable = ({ parts, searchQuery, onEdit, onDelete }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  const filteredParts = parts.filter(part => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = (part.name || '').toLowerCase();
    const description = (part.description || '').toLowerCase();
    return name.includes(query) || description.includes(query);
  });

  if (filteredParts.length === 0) {
    return (
      <div className="parts-empty-state">
        <FaWarehouse size={48} />
        <h3>Không tìm thấy phụ tùng</h3>
        {searchQuery ? (
          <p>Không có phụ tùng nào khớp với "{searchQuery}"</p>
        ) : (
          <p>Chưa có phụ tùng nào trong hệ thống</p>
        )}
      </div>
    );
  }

  return (
    <div className="parts-table-wrapper">
      <div className="table-container">
        <table className="parts-table">
          <thead>
            <tr>
              <th>Mã PT</th>
              <th>Tên phụ tùng</th>
              <th>Mô tả</th>
              <th>Đơn giá</th>
              <th>Tồn tối thiểu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((part, index) => (
              <tr key={part.id || index}>
                <td className="text-center">
                  <span className="part-id">#{part.id}</span>
                </td>
                <td>
                  <div className="part-name-cell">
                    <div className="part-icon">
                      <FaBoxes />
                    </div>
                    <span className="part-name">{part.name}</span>
                  </div>
                </td>
                <td>
                  <span className="part-description">
                    {part.description || '-'}
                  </span>
                </td>
                <td className="text-center">
                  <span className="price-badge">
                    {formatCurrency(part.unitPrice)} ₫
                  </span>
                </td>
                <td className="text-center">
                  <span className="stock-badge">
                    {part.minStockLevel || 0}
                  </span>
                </td>
                <td className="text-center">
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit(part)}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDelete(part)}
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
      
      <div className="table-footer">
        <span className="result-count">
          Hiển thị <strong>{filteredParts.length}</strong> phụ tùng
          {searchQuery && parts.length !== filteredParts.length && (
            <> trong tổng số <strong>{parts.length}</strong></>
          )}
        </span>
      </div>
    </div>
  );
};

