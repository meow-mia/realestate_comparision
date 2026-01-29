import React from 'react';
import './NavigationTabs.css';

function NavigationTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'apartment', label: '아파트' },
    { id: 'officetel', label: '오피스텔' },
    { id: 'villa', label: '빌라' },
    { id: 'house', label: '단독/다가구' }
  ];

  return (
    <div className="navigation-tabs">
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default NavigationTabs;
