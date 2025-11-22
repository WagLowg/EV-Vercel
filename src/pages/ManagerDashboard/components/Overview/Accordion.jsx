import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './Accordion.css';

export const AccordionSection = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`accordion-section ${className} ${isOpen ? 'open' : 'closed'}`}>
      <div 
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="header-content">
          {icon && <span className="header-icon">{icon}</span>}
          <h3 className="header-title">{title}</h3>
        </div>
        <span className="toggle-icon">
          <FaChevronDown />
        </span>
      </div>
      
      {isOpen && (
        <div className="accordion-body">
          {children}
        </div>
      )}
    </div>
  );
};

