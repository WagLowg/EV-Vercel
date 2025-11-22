import React from 'react';
import { FaTools, FaCalendarWeek, FaWarehouse } from 'react-icons/fa';
import { SimpleSection } from './SimpleSection';
import './OverviewTrending.css';

export const OverviewTrending = ({ stats }) => {
  const renderTrendingServiceTable = (services, label) => {
    return (
      <SimpleSection 
        title={label} 
        icon={<FaTools />}
        className="trending-section-item compact"
      >
        {services.length > 0 ? (
          <div className="table-wrapper">
            <table className="trending-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Dịch vụ</th>
                  <th>Số lần</th>
                </tr>
              </thead>
              <tbody>
                {services.slice(0, 5).map((item, index) => {
                  let serviceName = 'N/A';
                  let count = 0;
                  
                  if (Array.isArray(item)) {
                    serviceName = item[0] || 'N/A';
                    count = item[1] || 0;
                  } else if (typeof item === 'object') {
                    serviceName = item.key || item.serviceType || item.name || 'N/A';
                    count = item.value || item.count || 0;
                  }
                  
                  return (
                    <tr key={index}>
                      <td className="rank">
                        <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                      </td>
                      <td className="service-name">{serviceName}</td>
                      <td className="count-badge">{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Chưa có dữ liệu</p>
          </div>
        )}
      </SimpleSection>
    );
  };

  return (
    <div className="trending-section">
      {renderTrendingServiceTable(stats.trendingServices, 'Dịch vụ phổ biến (ALL TIME)')}
      {renderTrendingServiceTable(stats.trendingServicesLastMonth, 'Dịch vụ phổ biến (THÁNG NÀY)')}
      
      <SimpleSection 
        title="Phụ tùng trong kho" 
        icon={<FaWarehouse />}
        className="trending-section-item compact"
      >
        {Array.isArray(stats.trendingParts) && stats.trendingParts.length > 0 ? (
          <div className="table-wrapper">
            <table className="trending-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Phụ tùng</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {stats.trendingParts.slice(0, 5).map((part, index) => (
                  <tr key={part.id || index}>
                    <td className="rank">
                      <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                    </td>
                    <td className="part-name">{part.name || part.partName || 'N/A'}</td>
                    <td className="count-badge">{part.quantityInStock || part.quantity || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Chưa có dữ liệu</p>
          </div>
        )}
      </SimpleSection>
    </div>
  );
};
