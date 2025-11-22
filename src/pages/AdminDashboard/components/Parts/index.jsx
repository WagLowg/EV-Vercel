import React, { useState } from 'react';
import { FaSearch, FaPlus, FaBoxes, FaCog, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useParts } from '../../hooks/useParts';
import { useServiceTypes } from '../../hooks/useServiceTypes';
import { PartsStats } from './PartsStats';
import { PartsTable } from './PartsTable';
import { PartModal } from './PartModal';
import { ServiceTypesTable } from '../ServiceTypes/ServiceTypesTable';
import { ServiceTypeModal } from '../ServiceTypes/ServiceTypeModal';
import { showSuccess, showError } from '../../../../utils/toast';
import './Parts.css';

/**
 * Parts Tab Component for Admin Dashboard
 * Manages all parts and service types in the system
 */
export const PartsTab = () => {
  // Sub-tab state: 'parts' or 'service-types'
  const [activeSubTab, setActiveSubTab] = useState('parts');
  
  // Parts management
  const { parts, loading: partsLoading, error: partsError, fetchParts, addPart, handleUpdatePart, handleDeletePart } = useParts();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPart, setSelectedPart] = useState(null);
  const [saving, setSaving] = useState(false);
  const [partsSortOrder, setPartsSortOrder] = useState('asc'); // 'asc' | 'desc'
  
  // Service Types management
  const { serviceTypes, loading: serviceTypesLoading, error: serviceTypesError, fetchServiceTypes, addServiceType, handleUpdateServiceType, handleDeleteServiceType } = useServiceTypes();
  const [serviceTypeSearchQuery, setServiceTypeSearchQuery] = useState('');
  const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
  const [serviceTypeModalMode, setServiceTypeModalMode] = useState('add');
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [serviceTypeSaving, setServiceTypeSaving] = useState(false);
  const [serviceTypesSortOrder, setServiceTypesSortOrder] = useState('asc'); // 'asc' | 'desc'
  
  // Sort parts by price
  const sortedParts = [...parts].sort((a, b) => {
    const priceA = a.unitPrice || 0;
    const priceB = b.unitPrice || 0;
    return partsSortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });
  
  // Sort service types by price
  const sortedServiceTypes = [...serviceTypes].sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    return serviceTypesSortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });

  const handleAddPart = () => {
    setModalMode('add');
    setSelectedPart(null);
    setShowModal(true);
  };

  const handleEditPart = (part) => {
    setModalMode('edit');
    setSelectedPart(part);
    setShowModal(true);
  };

  const handleDeletePartConfirm = async (part) => {
    const confirmed = window.confirm(
      `⚠️ Xác nhận xóa phụ tùng?\n\n` +
      `Tên: ${part.name}\n` +
      `Giá: ${part.unitPrice?.toLocaleString('vi-VN')} VNĐ\n\n` +
      `Hành động này không thể hoàn tác!`
    );

    if (!confirmed) return;

    try {
      const result = await handleDeletePart(part.id);
      if (result.success) {
        showSuccess('Xóa phụ tùng thành công!');
      } else {
        showError(`Lỗi: ${result.error}`);
      }
    } catch (err) {
      showError(`Lỗi: ${err.message || 'Không thể xóa phụ tùng'}`);
    }
  };

  const handleSavePart = async (formData) => {
    setSaving(true);
    
    try {
      let result;
      if (modalMode === 'add') {
        result = await addPart(formData);
      } else {
        result = await handleUpdatePart(formData.id, formData);
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
  
  // Service Type handlers
  const handleAddServiceType = () => {
    setServiceTypeModalMode('add');
    setSelectedServiceType(null);
    setShowServiceTypeModal(true);
  };

  const handleEditServiceType = (serviceType) => {
    setServiceTypeModalMode('edit');
    setSelectedServiceType(serviceType);
    setShowServiceTypeModal(true);
  };

  const handleDeleteServiceTypeConfirm = async (serviceType) => {
    const confirmed = window.confirm(
      `⚠️ Xác nhận xóa gói bảo dưỡng?\n\n` +
      `Tên: ${serviceType.name}\n` +
      `Giá: ${serviceType.price?.toLocaleString('vi-VN')} VNĐ\n\n` +
      `Hành động này không thể hoàn tác!`
    );

    if (!confirmed) return;

    try {
      const result = await handleDeleteServiceType(serviceType.id);
      if (result.success) {
        showSuccess('Xóa gói bảo dưỡng thành công!');
      } else {
        showError(`Lỗi: ${result.error}`);
      }
    } catch (err) {
      showError(`Lỗi: ${err.message || 'Không thể xóa gói bảo dưỡng'}`);
    }
  };

  const handleSaveServiceType = async (formData) => {
    setServiceTypeSaving(true);
    
    try {
      let result;
      if (serviceTypeModalMode === 'add') {
        result = await addServiceType(formData);
      } else {
        result = await handleUpdateServiceType(formData.id, formData);
      }

      if (result.success) {
        showSuccess(serviceTypeModalMode === 'add' ? 'Thêm gói bảo dưỡng thành công!' : 'Cập nhật gói bảo dưỡng thành công!');
        setShowServiceTypeModal(false);
      } else {
        showError(`Lỗi: ${result.error || 'Không thể lưu gói bảo dưỡng'}`);
      }
    } catch (err) {
      showError(`Lỗi: ${err.message || 'Có lỗi xảy ra'}`);
    } finally {
      setServiceTypeSaving(false);
    }
  };

  const loading = activeSubTab === 'parts' ? partsLoading : serviceTypesLoading;
  const error = activeSubTab === 'parts' ? partsError : serviceTypesError;

  if (loading) {
    return (
      <div className="parts-loading">
        <div className="loading-spinner"></div>
        <p>{activeSubTab === 'parts' ? 'Đang tải danh sách phụ tùng...' : 'Đang tải danh sách gói bảo dưỡng...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="parts-error">
        <div className="error-icon">❌</div>
        <h3>Lỗi tải dữ liệu</h3>
        <p>{error}</p>
        <button onClick={activeSubTab === 'parts' ? fetchParts : fetchServiceTypes} className="retry-btn">
          🔄 Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="parts-section">
      {/* Sub-tabs */}
      <div className="parts-subtabs">
        <button 
          className={`subtab-btn ${activeSubTab === 'parts' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('parts')}
        >
          <FaBoxes />
          <span>Phụ tùng</span>
          <span className="subtab-count">{parts.length}</span>
        </button>
        <button 
          className={`subtab-btn ${activeSubTab === 'service-types' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('service-types')}
        >
          <FaCog />
          <span>Gói bảo dưỡng</span>
          <span className="subtab-count">{serviceTypes.length}</span>
        </button>
      </div>

      {/* Parts Content */}
      {activeSubTab === 'parts' && (
        <>
          {/* Toolbar */}
          <div className="parts-toolbar">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Tìm kiếm phụ tùng theo tên, mô tả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="toolbar-actions">
              <button 
                className="sort-btn" 
                onClick={() => setPartsSortOrder(partsSortOrder === 'asc' ? 'desc' : 'asc')}
                title={partsSortOrder === 'asc' ? 'Sắp xếp giá cao xuống thấp' : 'Sắp xếp giá thấp lên cao'}
              >
                {partsSortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                <span>{partsSortOrder === 'asc' ? 'Giá tăng dần' : 'Giá giảm dần'}</span>
              </button>
              <button className="add-part-btn" onClick={handleAddPart}>
                <FaPlus />
                <span>Thêm phụ tùng</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {parts.length > 0 && <PartsStats parts={parts} />}

          {/* Parts Table */}
          <PartsTable
            parts={sortedParts}
            searchQuery={searchQuery}
            onEdit={handleEditPart}
            onDelete={handleDeletePartConfirm}
          />

          {/* Modal */}
          <PartModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSavePart}
            part={selectedPart}
            mode={modalMode}
            saving={saving}
          />
        </>
      )}

      {/* Service Types Content */}
      {activeSubTab === 'service-types' && (
        <>
          {/* Toolbar */}
          <div className="parts-toolbar">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Tìm kiếm gói bảo dưỡng theo tên, mô tả..."
                value={serviceTypeSearchQuery}
                onChange={(e) => setServiceTypeSearchQuery(e.target.value)}
              />
            </div>
            <div className="toolbar-actions">
              <button 
                className="sort-btn" 
                onClick={() => setServiceTypesSortOrder(serviceTypesSortOrder === 'asc' ? 'desc' : 'asc')}
                title={serviceTypesSortOrder === 'asc' ? 'Sắp xếp giá cao xuống thấp' : 'Sắp xếp giá thấp lên cao'}
              >
                {serviceTypesSortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                <span>{serviceTypesSortOrder === 'asc' ? 'Giá tăng dần' : 'Giá giảm dần'}</span>
              </button>
              <button className="add-part-btn" onClick={handleAddServiceType}>
                <FaPlus />
                <span>Thêm gói bảo dưỡng</span>
              </button>
            </div>
          </div>

          {/* Service Types Table */}
          <ServiceTypesTable
            serviceTypes={sortedServiceTypes}
            searchQuery={serviceTypeSearchQuery}
            onEdit={handleEditServiceType}
            onDelete={handleDeleteServiceTypeConfirm}
          />

          {/* Modal */}
          <ServiceTypeModal
            show={showServiceTypeModal}
            onClose={() => setShowServiceTypeModal(false)}
            onSave={handleSaveServiceType}
            serviceType={selectedServiceType}
            mode={serviceTypeModalMode}
            saving={serviceTypeSaving}
          />
        </>
      )}
    </div>
  );
};
