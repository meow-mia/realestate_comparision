import React from 'react';
import './PropertyCard.css';

function PropertyCard({ property }) {
  return (
    <div className="property-card">
      {property.tag && (
        <span className={`property-tag ${property.tag === '급매' ? 'urgent' : property.tag === '추천' ? 'recommend' : 'popular'}`}>
          {property.tag}
        </span>
      )}

      <div className="property-image">
        <img src={property.image} alt={property.name} />
        <button className="favorite-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="property-info">
        <div className="property-header">
          <h3 className="property-name">{property.name}</h3>
          <span className="property-type">{property.type}</span>
        </div>

        <p className="property-location">{property.location}</p>

        <div className="property-details">
          <span className="detail-item">{property.size}</span>
          <span className="detail-divider">·</span>
          <span className="detail-item">{property.floor}</span>
        </div>

        <div className="property-footer">
          <div className="property-price">
            <span className="price">{property.price}</span>
            <span className={`price-change ${property.priceChange.includes('+') ? 'up' : 'down'}`}>
              {property.priceChange}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
