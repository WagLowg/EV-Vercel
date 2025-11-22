import React, { useState } from "react";

const branches = [
  {
    id: "01",
    name: "Chi Nhánh Quận 1",
    address: "123 Lê Lợi, Quận 1, Hồ Chí Minh",
    phone: "024-3456-7890",
    hours: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    distance: "5.2mi",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=123+Lê+Lợi+Quận+1+Hồ+Chí+Minh",
    position: { top: '35%', left: '40%' }
  },
  {
    id: "02",
    name: "Chi Nhánh Thủ Đức",
    address: "456 Võ Văn Ngân, Thủ Đức, Hồ Chí Minh",
    phone: "028-0876-5432",
    hours: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    distance: "10.7mi",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=456+Võ+Văn+Ngân+Thủ+Đức+Hồ+Chí+Minh",
    position: { top: '55%', left: '65%' }
  },
];

// Store Card in Sidebar
const StoreSidebarCard = ({ branch, isActive, onClick }) => (
  <div 
    className={`store-sidebar-card ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    <div className="store-card-header">
      <h3>{branch.name}</h3>
      <span className="store-distance">{branch.distance} away</span>
    </div>
    
    <div className="store-card-info">
      <div className="store-info-row">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
        </svg>
        <span>{branch.address}</span>
      </div>
      
      <div className="store-info-row">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
        </svg>
        <span>Mở cửa hôm nay: {branch.hours}</span>
      </div>
    </div>

    <a 
      href={branch.mapLink}
      target="_blank"
      rel="noopener noreferrer"
      className="store-details-link"
      onClick={(e) => e.stopPropagation()}
    >
      CHI TIẾT CỬA HÀNG
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
      </svg>
    </a>
  </div>
);

// Map Component with Real Google Maps
const StoreMap = ({ branches, activeStore }) => {
  // Create Google Maps URL with multiple locations
  // Using search query to show multiple locations
  const createMapUrl = () => {
    // Option 1: Center on HCM with search query
    const searchQuery = encodeURIComponent("Hồ Chí Minh, Vietnam");
    return `https://www.google.com/maps?q=${searchQuery}&output=embed`;
  };

  // Option 2: Show specific location when store is active
  const getActiveStoreUrl = () => {
    if (activeStore) {
      const activeBranch = branches.find(b => b.id === activeStore);
      if (activeBranch) {
        const query = encodeURIComponent(activeBranch.address);
        return `https://www.google.com/maps?q=${query}&output=embed`;
      }
    }
    return createMapUrl();
  };

  return (
    <div className="store-map-container">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={getActiveStoreUrl()}
        title="Store Locations Map"
      />
      
      {/* Overlay controls */}
      <div className="map-controls">
        <button 
          className="map-control-btn"
          onClick={() => {
            const query = activeStore 
              ? branches.find(b => b.id === activeStore)?.address
              : "Hồ Chí Minh, Vietnam";
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
          </svg>
          Mở trong Google Maps
        </button>
      </div>
    </div>
  );
};

const BranchesSection = ({ onNavigate }) => {
  const [activeStore, setActiveStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState("Hồ Chí Minh, Việt Nam");

  return (
    <section id="branches" className="find-store-section">
      <div className="find-store-container">
        {/* Sidebar */}
        <div className="find-store-sidebar">
          <div className="sidebar-header">
            <h2>Find a Store</h2>
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
              </svg>
              <input
                type="text"
                placeholder="Find a store near you"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="stores-count">
            Showing {branches.length} stores within 31.1mi
          </div>

          <div className="stores-list">
            {branches.map((branch) => (
              <StoreSidebarCard
                key={branch.id}
                branch={branch}
                isActive={activeStore === branch.id}
                onClick={() => setActiveStore(branch.id)}
              />
            ))}
          </div>
        </div>

        {/* Map */}
        <StoreMap branches={branches} activeStore={activeStore} />
      </div>
    </section>
  );
};

export default BranchesSection;

