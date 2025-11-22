import React, { useState, useMemo } from 'react';
import { FaSearch, FaPlus, FaWarehouse } from 'react-icons/fa';
import { useParts } from '../../hooks/useParts';
import { PartModal } from './PartModal';
import { PartsStats } from './PartsStats';
import { PartsTable } from './PartsTable';
import { showSuccess, showError } from '../../../../utils/toast';
import './Parts.css';

export const PartsTab = () => {
  const { parts, loading, addPart, updatePart, deletePart, updateInventoryQuantity } = useParts();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedPart, setSelectedPart] = useState(null);
  const [saving, setSaving] = useState(false);

  /**
   * Handle add new part
   */
  const handleAddPart = () => {
    setModalMode('add');
    setSelectedPart(null);
    setShowModal(true);
  };

  /**
   * Handle edit part
   */
  const handleEditPart = (part) => {
    setModalMode('edit');
    setSelectedPart(part);
    setShowModal(true);
  };

  /**
   * Handle delete part
   */
  const handleDeletePart = async (part) => {
    const confirmed = window.confirm(
      `⚠️ Xác nhận xóa phụ tùng?\n\n` +
      `Tên: ${part.name}\n` +
      `Giá: ${part.unitPrice?.toLocaleString()} VNĐ\n\n` +
      `Hành động này không thể hoàn tác!`
    );

    if (confirmed) {
      try {
        const result = await deletePart(part.id);
        if (result.success) {
          showSuccess('Xóa phụ tùng thành công!');
        } else {
          showError(`Lỗi: ${result.error}`);
        }
      } catch (err) {
        showError(`Lỗi: ${err.message || 'Không thể xóa phụ tùng'}`);
      }
    }
  };

  /**
   * Handle save part (add or edit)
   */
  const handleSavePart = async (formData) => {
    setSaving(true);
    
    try {
      let result;
      if (modalMode === 'add') {
        result = await addPart(formData);
      } else {
        result = await updatePart(formData.id, formData);
      }

      if (result.success) {
        showSuccess(modalMode === 'add' ? 'Thêm phụ tùng thành công!' : 'Cập nhật phụ tùng thành công!');
        setShowModal(false);
      } else {
        showError(`Lỗi: ${result.error || 'Không thể lưu phụ tùng'}`);
      }
    } catch (err) {
      showError(`Lỗi: ${err.message || 'Có lỗi xảy ra'}`);
    } finally {
      setSaving(false);
    }
  };

  // Calculate stats (chỉ tính tổng phụ tùng)
  const stats = useMemo(() => {
    const totalParts = parts.length;
    
    return {
      totalParts
    };
  }, [parts]);

  // Loading state
  if (loading) {
    return (
      <div className="parts-section">
        <div className="parts-loading">
          <p>⏳ Đang tải dữ liệu phụ tùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parts-section">
      {/* Statistics Cards */}
      {parts.length > 0 && <PartsStats stats={stats} />}

      {/* Toolbar: Search and Add */}
      <div className="parts-toolbar">
        <div className="parts-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm phụ tùng theo tên, mô tả hoặc mã..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="parts-add-btn" onClick={handleAddPart}>
          <FaPlus />
          <span>Thêm phụ tùng</span>
        </button>
      </div>

      {/* Parts Table or Empty State */}
      <PartsTable
        parts={parts}
        searchQuery={searchQuery}
        onEdit={handleEditPart}
        onDelete={handleDeletePart}
        onUpdateInventory={updateInventoryQuantity}
      />

      {/* Modal for Add/Edit */}
      <PartModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePart}
        part={selectedPart}
        mode={modalMode}
      />
    </div>
  );
};
