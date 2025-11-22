import React, { useState, useEffect, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExchangeAlt, FaSpinner } from 'react-icons/fa';
import { getAllParts } from '../../api';
import './MaintenanceChecklist.css';

/**
 * Parse description từ service type thành structured checklist
 * Format: 
 * 1. Section Title
 *    Item 1 (no bullet)
 *    Item 2
 * 2. Another Section
 *    Item 3
 */
const parseDescription = (description) => {
  if (!description) return [];
  
  // Nếu là string, split theo newline
  const lines = typeof description === 'string' 
    ? description.split('\n').map(l => l.trim())
    : Array.isArray(description) 
      ? description.map(l => typeof l === 'string' ? l.trim() : String(l))
      : [];
  
  // Filter empty lines but keep structure
  const nonEmptyLines = lines.filter(l => l);
  
  const sections = [];
  let currentSection = null;
  
  nonEmptyLines.forEach((line) => {
    // Check if line is a section title (starts with number and dot)
    const sectionMatch = line.match(/^(\d+)\.\s*(.+)$/);
    
    if (sectionMatch) {
      // Save previous section if exists
      if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        number: parseInt(sectionMatch[1]),
        title: sectionMatch[2],
        items: []
      };
    } else if (currentSection) {
      // Any non-empty line after a section title is an item
      // Remove bullet points if present, but also accept plain text
      const trimmed = line.replace(/^[•\-\*]\s*/, '').trim();
      if (trimmed && !trimmed.match(/^\d+\./)) { // Don't treat numbered lines as items if they look like section headers
        currentSection.items.push(trimmed);
      }
    } else {
      // If no section yet, create a default one
      if (!currentSection) {
        currentSection = {
          number: 1,
          title: 'Công việc bảo dưỡng',
          items: []
        };
      }
      const trimmed = line.replace(/^[•\-\*]\s*/, '').trim();
      if (trimmed && !trimmed.match(/^\d+\./)) {
        currentSection.items.push(trimmed);
      }
    }
  });
  
  // Add last section
  if (currentSection && currentSection.items.length > 0) {
    sections.push(currentSection);
  }
  
  return sections;
};

// Extract model from vehicle model string (e.g., "Loin Model A" -> "Model A")
const extractModelFromVehicle = (vehicleModel) => {
  if (!vehicleModel) return null;
  // Tìm "Model A", "Model B", "Model C" trong tên xe
  const modelMatch = vehicleModel.match(/Model\s+[A-Z]/i);
  if (modelMatch) {
    return modelMatch[0].trim(); // "Model A", "Model B", "Model C"
  }
  return null;
};

const MaintenanceChecklist = ({
  serviceDescription,
  serviceName,
  checklist = [],
  vehicleConditions = {},
  onChecklistChange,
  onVehicleConditionChange,
  onReplaceClick,
  partsUsed = [],
  onPartsChange,
  remarks = '',
  onRemarksChange,
  vehicleModel = null // Thêm prop vehicleModel
}) => {
  const [parts, setParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);
  const [showPartsSelector, setShowPartsSelector] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partQuantity, setPartQuantity] = useState(1);

  // Parse description into sections
  const sections = useMemo(() => {
    return parseDescription(serviceDescription);
  }, [serviceDescription]);

  // Load parts list và filter theo vehicle model
  useEffect(() => {
    const loadParts = async () => {
      try {
        setPartsLoading(true);
        const data = await getAllParts();
        let allParts = Array.isArray(data) ? data : [];
        
        // Filter parts theo vehicle model nếu có
        if (vehicleModel) {
          const modelKey = extractModelFromVehicle(vehicleModel);
          if (modelKey) {
            console.log('🔍 Filtering parts by vehicle model:', modelKey);
            allParts = allParts.filter(part => {
              const partName = (part.name || '').toLowerCase();
              const partDesc = (part.description || '').toLowerCase();
              const modelLower = modelKey.toLowerCase();
              
              const matches = partName.includes(modelLower) || partDesc.includes(modelLower);
              
              if (matches) {
                console.log('✅ Part matches:', part.name);
              }
              
              return matches;
            });
            
            console.log(`🔍 Filtered parts: ${allParts.length} parts match ${modelKey}`);
            
            // Nếu không có part nào match, hiển thị tất cả (fallback)
            if (allParts.length === 0) {
              console.warn('⚠️ No parts match vehicle model, showing all parts');
              allParts = Array.isArray(data) ? data : [];
            }
          }
        }
        
        setParts(allParts);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh sách linh kiện:', err);
        setParts([]);
      } finally {
        setPartsLoading(false);
      }
    };
    
    loadParts();
  }, [vehicleModel]);

  // Initialize checklist state from sections
  useEffect(() => {
    if (sections.length > 0 && checklist.length === 0) {
      const initialChecklist = sections.flatMap(section => 
        section.items.map(item => ({
          section: section.title,
          item: item,
          completed: false,
          needsReplacement: false
        }))
      );
      onChecklistChange(initialChecklist);
    }
  }, [sections]);

  const handleToggleItem = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    onChecklistChange(newChecklist);
  };

  const handleToggleReplacement = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].needsReplacement = !newChecklist[index].needsReplacement;
    onChecklistChange(newChecklist);
    
    // Call onReplaceClick callback if provided
    if (onReplaceClick && newChecklist[index].needsReplacement) {
      onReplaceClick(newChecklist[index]);
    }
  };

  const handleVehicleConditionChange = (index, value) => {
    onVehicleConditionChange(index, value);
  };

  const handleAddPart = () => {
    if (!selectedPartId || partQuantity <= 0) {
      return;
    }
    
    const part = parts.find(p => p.id === parseInt(selectedPartId));
    if (!part) return;
    
    // Lấy giá tiền từ part data - sử dụng unitPrice (từ API)
    const partPrice = parseFloat(part.unitPrice) || parseFloat(part.unit_price) || parseFloat(part.price) || parseFloat(part.unitCost) || parseFloat(part.cost) || 0;
    
    const newPartsUsed = [...partsUsed];
    const existingIndex = newPartsUsed.findIndex(p => p.partId === parseInt(selectedPartId));
    
    if (existingIndex >= 0) {
      // Update quantity and ensure unitCost is set correctly
      newPartsUsed[existingIndex].quantityUsed = parseInt(partQuantity);
      // Đảm bảo unitCost được cập nhật từ part data nếu chưa có hoặc cần cập nhật
      if (!newPartsUsed[existingIndex].unitCost || newPartsUsed[existingIndex].unitCost === 0) {
        newPartsUsed[existingIndex].unitCost = partPrice;
      }
    } else {
      // Add new part với giá tiền tự động
      newPartsUsed.push({
        partId: parseInt(selectedPartId),
        partName: part.name || `Part ${selectedPartId}`,
        quantityUsed: parseInt(partQuantity),
        unitCost: partPrice // Tự động fill giá tiền từ part data
      });
    }
    
    console.log('✅ Added part with auto-filled price:', {
      partId: parseInt(selectedPartId),
      partName: part.name,
      quantity: parseInt(partQuantity),
      unitCost: partPrice
    });
    
    onPartsChange(newPartsUsed);
    setSelectedPartId('');
    setPartQuantity(1);
  };

  const handleRemovePart = (partId) => {
    const newPartsUsed = partsUsed.filter(p => p.partId !== partId);
    onPartsChange(newPartsUsed);
  };

  const handleUpdatePartQuantity = (partId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemovePart(partId);
      return;
    }
    
    const newPartsUsed = partsUsed.map(part => 
      part.partId === partId 
        ? { ...part, quantityUsed: parseInt(newQuantity) || 1 }
        : part
    );
    onPartsChange(newPartsUsed);
  };

  if (sections.length === 0) {
    return (
      <div className="maintenance-checklist-empty">
        <p>Không có checklist cho dịch vụ này</p>
      </div>
    );
  }

  return (
    <div className="maintenance-checklist">
      <div className="checklist-header">
        <h3>{serviceName || 'Checklist bảo dưỡng'}</h3>
      </div>

      {/* Checklist Sections */}
      <div className="checklist-sections">
        {sections.map((section, sectionIndex) => {
          const sectionItems = checklist.filter(item => item.section === section.title);
          
          return (
            <div key={sectionIndex} className="checklist-section">
              <h4 className="section-title">
                {section.number}. {section.title}
              </h4>
              
              <div className="checklist-items">
                {sectionItems.map((checklistItem, itemIndex) => {
                  const globalIndex = checklist.findIndex(
                    item => item.section === section.title && item.item === checklistItem.item
                  );
                  
                  return (
                    <div key={itemIndex} className="checklist-item-row">
                      {/* Checkbox */}
                      <div className="checklist-item-checkbox">
                        <button
                          type="button"
                          className={`checkbox-btn ${checklistItem.completed ? 'checked' : ''}`}
                          onClick={() => handleToggleItem(globalIndex)}
                        >
                          {checklistItem.completed ? (
                            <FaCheckCircle className="check-icon" />
                          ) : (
                            <FaTimesCircle className="uncheck-icon" />
                          )}
                        </button>
                      </div>

                      {/* Item Text */}
                      <div className="checklist-item-text">
                        {checklistItem.item}
                      </div>

                      {/* Vehicle Condition Input */}
                      <div className="checklist-item-condition">
                        <input
                          type="text"
                          placeholder="Tình trạng..."
                          value={vehicleConditions[globalIndex] || ''}
                          onChange={(e) => handleVehicleConditionChange(globalIndex, e.target.value)}
                          className="condition-input"
                        />
                      </div>

                      {/* Replace Button */}
                      <div className="checklist-item-replace">
                        <button
                          type="button"
                          className={`replace-btn ${checklistItem.needsReplacement ? 'active' : ''}`}
                          onClick={() => handleToggleReplacement(globalIndex)}
                          title="Cần thay thế"
                        >
                          <FaExchangeAlt />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Parts Selector */}
      <div className="parts-section">
        <div className="parts-section-header">
          <h4>Linh kiện đã sử dụng</h4>
          <button
            type="button"
            className="toggle-parts-btn"
            onClick={() => setShowPartsSelector(!showPartsSelector)}
          >
            {showPartsSelector ? 'Ẩn' : 'Hiển thị'} danh sách linh kiện
          </button>
        </div>

        {/* Selected Parts List */}
        {partsUsed.length > 0 && (
          <div className="selected-parts-list">
            {partsUsed.map((part, index) => (
              <div key={index} className="selected-part-item">
                <span className="part-name">
                  {part.partName || `Part ID: ${part.partId}`}
                </span>
                <div className="part-quantity-control">
                  <label className="part-quantity-label">SL:</label>
                  <input
                    type="number"
                    className="part-quantity-edit"
                    min="1"
                    value={part.quantityUsed}
                    onChange={(e) => handleUpdatePartQuantity(part.partId, e.target.value)}
                  />
                </div>
                <div className="part-price-display">
                  <span className="part-price-label">Giá:</span>
                  <span className="part-price-value">
                    {part.unitCost ? `${part.unitCost.toLocaleString('vi-VN')} VNĐ` : 'Chưa có giá'}
                  </span>
                </div>
                <button
                  type="button"
                  className="remove-part-btn"
                  onClick={() => handleRemovePart(part.partId)}
                  title="Xóa linh kiện"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Parts Selector Form */}
        {showPartsSelector && (
          <div className="parts-selector-form">
            {partsLoading ? (
              <div className="parts-loading">
                <FaSpinner className="spinner" />
                <span>Đang tải danh sách linh kiện...</span>
              </div>
            ) : (
              <>
                <div className="parts-selector-inputs">
                  <select
                    className="part-select"
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                  >
                    <option value="">Chọn linh kiện...</option>
                    {parts.map(part => {
                      // Lấy giá tiền từ unitPrice (từ API)
                      const partPrice = part.unitPrice || part.unit_price || part.price || part.unitCost || part.cost || 0;
                      return (
                        <option key={part.id} value={part.id}>
                          {part.name || `Part ${part.id}`} - {partPrice > 0 ? `${partPrice.toLocaleString('vi-VN')} VNĐ` : 'Chưa có giá'}
                        </option>
                      );
                    })}
                  </select>
                  
                  <input
                    type="number"
                    className="part-quantity-input"
                    placeholder="Số lượng"
                    min="1"
                    value={partQuantity}
                    onChange={(e) => setPartQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  
                  <button
                    type="button"
                    className="add-part-btn"
                    onClick={handleAddPart}
                    disabled={!selectedPartId || partQuantity <= 0}
                  >
                    Thêm
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Remarks */}
      <div className="remarks-section">
        <label className="remarks-label">Ghi chú / Tình trạng chung:</label>
        <textarea
          className="remarks-textarea"
          placeholder="Nhập tình trạng chung sau khi hoàn thành đơn..."
          rows="4"
          value={remarks}
          onChange={(e) => onRemarksChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default MaintenanceChecklist;

