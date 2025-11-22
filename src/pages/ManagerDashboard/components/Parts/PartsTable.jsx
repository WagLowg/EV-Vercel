import React, { useState } from 'react';
import { FaEdit, FaTrash, FaWarehouse, FaSave } from 'react-icons/fa';
import { showSuccess, showError } from '../../../../utils/toast';
import './PartsTable.css';

export const PartsTable = ({ parts, searchQuery, onEdit, onDelete, onUpdateInventory }) => {
  const [editingQuantities, setEditingQuantities] = useState({});
  const [tempQuantities, setTempQuantities] = useState({});
  const [savingQuantities, setSavingQuantities] = useState({});

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  // Filter parts
  const filteredParts = parts.filter(part =>
    searchQuery === '' ||
    part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.id?.toString().includes(searchQuery)
  );

  // Handle start editing quantity
  const handleStartEditQuantity = (partId) => {
    setEditingQuantities(prev => ({ ...prev, [partId]: true }));
    setTempQuantities(prev => ({ ...prev, [partId]: 0 }));
  };

  // Handle cancel editing
  const handleCancelEditQuantity = (partId) => {
    setEditingQuantities(prev => {
      const newState = { ...prev };
      delete newState[partId];
      return newState;
    });
    setTempQuantities(prev => {
      const newState = { ...prev };
      delete newState[partId];
      return newState;
    });
  };

  // Handle save quantity
  const handleSaveQuantity = async (partId) => {
    const newQuantity = parseInt(tempQuantities[partId]) || 0;
    
    if (newQuantity < 0) {
      showError('Số lượng không thể âm!');
      return;
    }

    setSavingQuantities(prev => ({ ...prev, [partId]: true }));
    
    try {
      const result = await onUpdateInventory(partId, newQuantity);
      if (result.success) {
        showSuccess('Cập nhật số lượng thành công!');
        handleCancelEditQuantity(partId);
      } else {
        showError(`Lỗi: ${result.error || 'Không thể cập nhật số lượng'}`);
      }
    } catch (err) {
      showError(`Lỗi: ${err.message || 'Có lỗi xảy ra'}`);
    } finally {
      setSavingQuantities(prev => {
        const newState = { ...prev };
        delete newState[partId];
        return newState;
      });
    }
  };

  // Empty state
  if (filteredParts.length === 0) {
    return (
      <div className="parts-empty-state">
        <FaWarehouse size={48} />
        <h3>Không tìm thấy phụ tùng</h3>
        {searchQuery ? (
          <p>Không có phụ tùng nào khớp với "{searchQuery}"</p>
        ) : (
          <p>Chưa có phụ tùng nào trong kho</p>
        )}
      </div>
    );
  }

  return (
    <div className="parts-table-container">
      <div className="table-wrapper">
        <table className="parts-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã</th>
              <th>Tên phụ tùng</th>
              <th>Mô tả</th>
              <th>Đơn giá</th>
              <th>Tồn tối thiểu</th>
              <th>Tổng phụ tùng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((part, index) => (
              <tr key={part.id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">
                  <span className="part-id">#{part.id}</span>
                </td>
                <td>
                  <span className="part-name">{part.name || 'N/A'}</span>
                </td>
                <td>
                  <span className="part-description">{part.description || '-'}</span>
                </td>
                <td className="text-center">
                  <span className="price-badge">{formatCurrency(part.unitPrice)} ₫</span>
                </td>
                <td className="text-center">
                  <span className="stock-badge">{part.minStockLevel || 0}</span>
                </td>
                <td className="text-center">
                  {editingQuantities[part.id] ? (
                    <div className="inventory-edit-container" style={{display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'}}>
                      <input
                        type="number"
                        min="0"
                        value={tempQuantities[part.id] || 0}
                        onChange={(e) => setTempQuantities(prev => ({ ...prev, [part.id]: parseInt(e.target.value) || 0 }))}
                        style={{
                          width: '80px',
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          textAlign: 'center'
                        }}
                        disabled={savingQuantities[part.id]}
                      />
                      <button
                        className="btn-action btn-save"
                        onClick={() => handleSaveQuantity(part.id)}
                        disabled={savingQuantities[part.id]}
                        title="Lưu"
                        style={{
                          padding: '4px 8px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: savingQuantities[part.id] ? 'not-allowed' : 'pointer',
                          opacity: savingQuantities[part.id] ? 0.6 : 1
                        }}
                      >
                        <FaSave size={12} />
                      </button>
                      <button
                        onClick={() => handleCancelEditQuantity(part.id)}
                        disabled={savingQuantities[part.id]}
                        title="Hủy"
                        style={{
                          padding: '4px 8px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: savingQuantities[part.id] ? 'not-allowed' : 'pointer',
                          opacity: savingQuantities[part.id] ? 0.6 : 1
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="inventory-display-container" style={{display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'}}>
                      <span className="inventory-badge" style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        background: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {part.inventoryQuantity || 0}
                      </span>
                      <button
                        onClick={() => handleStartEditQuantity(part.id)}
                        title="Cập nhật số lượng"
                        style={{
                          padding: '4px 8px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✎
                      </button>
                    </div>
                  )}
                </td>
                <td className="text-center">
                  <div className="action-btns">
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

