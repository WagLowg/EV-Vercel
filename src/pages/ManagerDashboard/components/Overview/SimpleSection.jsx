import React from 'react';
import './SimpleSection.css';

/**
 * SimpleSection - Thay thế AccordionSection
 * Hiển thị nội dung luôn, không có collapse
 */
export const SimpleSection = ({ 
  title, 
  icon, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`simple-section ${className}`}>
      <div className="simple-section-header">
        <div className="header-content">
          {icon && <span className="header-icon">{icon}</span>}
          <h3 className="header-title">{title}</h3>
        </div>
      </div>
      
      <div className="simple-section-body">
        {children}
      </div>
    </div>
  );
};

