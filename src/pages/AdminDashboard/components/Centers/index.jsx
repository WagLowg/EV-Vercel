import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useCenters } from '../../hooks/useCenters';
import { CentersStats } from './CentersStats';
import { CentersTable } from './CentersTable';
import { CentersModal } from './CentersModal';
import { showSuccess, showError, showWarning } from '../../../../utils/toast';
import './Centers.css';

export const CentersTab = () => {
  const { centers, loading, error, fetchCenters, addCenter, updateCenter, deleteCenter } = useCenters();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  const handleAddCenter = () => {
    setModalMode('add');
    setSelectedCenter(null);
    setShowModal(true);
  };

  const handleEditCenter = (center) => {
    setModalMode('edit');
    setSelectedCenter(center);
    setShowModal(true);
  };

  const handleDeleteCenter = async (center) => {
    if (!window.confirm(`Bạn có chắc muốn xóa trung tâm "${center.name}"?`)) {
      return;
    }

    const centerId = center.centerId || center.id;
    if (!centerId) {
      showError('Không tìm thấy ID của trung tâm!');
      return;
    }

    const result = await deleteCenter(centerId);
    if (result.success) {
      showSuccess('Xóa trung tâm thành công!');
    } else {
      showError(`Lỗi: ${result.error}`);
    }
  };

  const handleSaveCenter = async (formData) => {
    if (!formData.name?.trim() || !formData.address?.trim() || !formData.email?.trim() || !formData.phone?.trim()) {
      showWarning('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    let result;
    if (modalMode === 'add') {
      result = await addCenter(formData);
    } else {
      const centerId = selectedCenter?.centerId || selectedCenter?.id;
      if (!centerId) {
        showError('Không tìm thấy ID của trung tâm!');
        return;
      }
      result = await updateCenter(centerId, formData);
    }

    if (result.success) {
      showSuccess(`${modalMode === 'add' ? 'Thêm' : 'Cập nhật'} trung tâm thành công!`);
      setShowModal(false);
      setSelectedCenter(null);
    } else {
      showError(`Lỗi: ${result.error}`);
    }
  };

  if (loading && centers.length === 0) {
    return (
      <div className="centers-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách trung tâm...</p>
      </div>
    );
  }

  return (
    <div className="centers-section">
      {/* Toolbar */}
      <div className="centers-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, địa chỉ, email, SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-center-btn" onClick={handleAddCenter}>
          <FaPlus />
          <span>Thêm trung tâm</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
        </div>
      )}

      {/* Stats Cards */}
      {centers.length > 0 && <CentersStats centers={centers} />}

      {/* Centers Table */}
      <CentersTable
        centers={centers}
        searchQuery={searchQuery}
        onEdit={handleEditCenter}
        onDelete={handleDeleteCenter}
      />

      {/* Modal */}
      {showModal && (
        <CentersModal
          mode={modalMode}
          center={selectedCenter}
          onSave={handleSaveCenter}
          onClose={() => {
            setShowModal(false);
            setSelectedCenter(null);
          }}
        />
      )}
    </div>
  );
};
