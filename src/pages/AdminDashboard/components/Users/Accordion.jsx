import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './Accordion.css';

/**
 * Accordion Section Component for Users by Role
 * @param {Object} props
 * @param {string} props.title - Title of the accordion section
 * @param {ReactNode} props.icon - Icon to display
 * @param {ReactNode} props.children - Content to display when expanded
 * @param {boolean} props.defaultOpen - Whether section is open by default
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.role - Role type (for color styling)
 * @param {number} props.count - Number of users in this role
 */
export const AccordionSection = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = true,
  className = '',
  role = '',
  count = 0
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`accordion-section ${className} ${isOpen ? 'open' : 'closed'} role-${role.toLowerCase()}`}>
      <div 
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="header-content">
          {icon && <span className="header-icon">{icon}</span>}
          <h3 className="header-title">
            {title}
            {count > 0 && (
              <span className="count-badge">({count})</span>
            )}
          </h3>
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

