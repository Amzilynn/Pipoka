import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ title, icon, color, onClick, variant = 'v1' }) => {
  if (variant === 'v3') {
    return (
      <div 
        className="category-card-v3-premium" 
        onClick={onClick}
        style={{ '--category-color': color }}
      >
        <div className="card-inner-3d">
          <div className="illustration-container-3d">
            {typeof icon === 'string' && icon.startsWith('/') ? (
              <img src={icon} alt={title} className="clay-illustration-3d" />
            ) : (
              <div className={`icon-3d-fallback ${/[\u0600-\u06FF]/.test(icon) ? 'arabic-letters' : ''}`}>{icon}</div>
            )}
          </div>
          <div className="card-label-row">
            <h3 className="category-title-v3-bold">{title}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="category-card" 
      onClick={onClick}
      style={{ '--category-color': color }}
    >
      <div className="icon-wrap">
        {icon}
      </div>
      <h3 className="category-title">{title}</h3>
      <div className="arrow-icon">→</div>
    </div>
  );
};

export default CategoryCard;
