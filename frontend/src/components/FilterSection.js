import React, { useState } from 'react';
import './FilterSection.css';

function FilterSection() {
  const [selectedFilter, setSelectedFilter] = useState('전체');

  const filters = ['전체', '매매', '전세', '월세', '단기임대'];

  return (
    <div className="filter-section">
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter}
            className={`filter-button ${selectedFilter === filter ? 'active' : ''}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <button className="filter-more">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

export default FilterSection;
