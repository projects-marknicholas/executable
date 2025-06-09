import React, { useEffect } from "react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import DashboardData from "./components/dashboard";
import '../assets/css/dashboard.css';

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard - RHU";
  }, []);

  return (
    <div className="main-section">
      <Sidebar active="dashboard" />
      
      <div className="setup-sect">
        <Navbar />
        <div className="setup-header">Dashboard</div>
        <DashboardData />
      </div>
    </div>
  );
};

export default Dashboard;