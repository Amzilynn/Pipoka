import React from 'react';
import './BigButton.css';

const BigButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  icon = null
}) => {
  return (
    <button 
      className={`btn-big ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="btn-content">
        {icon && <span className="btn-icon">{icon}</span>}
        <span className="btn-text">{children}</span>
      </div>
    </button>
  );
};

export default BigButton;
