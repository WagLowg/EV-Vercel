import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import AccountManagement from './components/AccountManagement/AccountManagement';
import VehicleManagement from './components/VehicleManagement/VehicleManagement';
import AppointmentManagement from './components/AppointmentManagement/AppointmentManagement';
import Chat from './components/Chat/Chat';
import './StaffDashboard.css';

function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('accounts');

  const renderContent = () => {
    switch (activeTab) {
      case 'accounts':
        return <AccountManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'chat':
        return <Chat />;
      default:
        return <AccountManagement />;
    }
  };

  return (
    <div className="staff-dashboard">
      {/* Navbar */}
      <Navbar />

      {/* Body Layout */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default StaffDashboard;

