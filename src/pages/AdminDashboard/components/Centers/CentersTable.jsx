import React from 'react';
import { FaEdit, FaTrash, FaWarehouse, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import './CentersTable.css';

export const CentersTable = ({ centers, searchQuery, onEdit, onDelete }) => {
  const filteredCenters = centers.filter(center => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = (center.name || '').toLowerCase();
    const address = (center.address || '').toLowerCase();
    const email = (center.email || '').toLowerCase();
    const phone = (center.phone || '').toLowerCase();
    return name.includes(query) || address.includes(query) || email.includes(query) || phone.includes(query);
  });

  if (filteredCenters.length === 0) {
    return (
      <div className="centers-empty-state">
        <FaWarehouse size={48} />
        <h3>Không tìm thấy trung tâm</h3>
        {searchQuery ? (
          <p>Không có trung tâm nào khớp với "{searchQuery}"</p>
        ) : (
          <p>Chưa có trung tâm nào trong hệ thống</p>
        )}
      </div>
    );
  }

  return (
    <div className="centers-table-wrapper">
      <div className="table-container">
        <table className="centers-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên trung tâm</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCenters.map((center, index) => {
              const centerId = center.centerId || center.id;
              return (
                <tr key={centerId || index}>
                  <td className="text-center">{index + 1}</td>
                  <td>
                    <div className="center-name-cell">
                      <div className="center-icon">
                        <FaWarehouse />
                      </div>
                      <span className="center-name">{center.name}</span>
                    </div>
                  </td>
                  <td>
                    {center.address && (
                      <div className="info-cell">
                        <FaMapMarkerAlt className="info-icon" />
                        <span>{center.address}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {center.email && (
                      <div className="info-cell">
                        <FaEnvelope className="info-icon" />
                        <span>{center.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    {center.phone && (
                      <div className="info-cell">
                        <FaPhone className="info-icon" />
                        <span>{center.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => onEdit(center)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => onDelete(center)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <span className="result-count">
          Hiển thị <strong>{filteredCenters.length}</strong> trung tâm
          {searchQuery && centers.length !== filteredCenters.length && (
            <> trong tổng số <strong>{centers.length}</strong></>
          )}
        </span>
      </div>
    </div>
  );
};

