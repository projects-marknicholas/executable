import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Assets
import Logo from "../../assets/svg/favicon.png";
import LogoutSvg from "../../assets/svg/logout.svg";
import DashboardSvg from "../../assets/svg/dashboard.svg";
import DashboardActiveSvg from "../../assets/svg/dashboard-active.svg";
import RegistrationsSvg from "../../assets/svg/registrations.svg";
import ReportsSvg from "../../assets/svg/report.svg";
import AccountsSvg from "../../assets/svg/accounts.svg";
import AccountSettingsSvg from "../../assets/svg/account-settings.svg";
import SymptomsSvg from "../../assets/svg/symptoms.svg";
import MenuSvg from "../../assets/svg/menu.svg";

// CSS
import "../../assets/css/sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getIcon = (route, defaultIcon, activeIcon) => {
    return path === route ? activeIcon : defaultIcon;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="sidebar-set">
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <img src={MenuSvg} alt="Menu" />
      </button>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <Link to='/' className="side-logo">
          <img src={Logo} alt="logo" />
        </Link>

        {/* Navigation */}
        <div className="navigation">
          <ul>
            <li>
              <Link to="/admin" className={path === "/admin" ? "active" : ""} onClick={() => setSidebarOpen(false)}>
                <img src={getIcon("/admin", DashboardSvg, DashboardActiveSvg)} alt="Dashboard" />
                <p>Dashboard</p>
                {/* <span>Dashboard</span> */}
              </Link>
            </li>
            <li>
              <Link to="/admin/registrations" className={path === "/admin/registrations" ? "active" : ""} onClick={() => setSidebarOpen(false)}>
                <img src={getIcon("/admin/registrations", RegistrationsSvg, RegistrationsSvg)} alt="Registrations" />
                <p>Registrations</p>
                {/* <span>Registrations</span> */}
              </Link>
            </li>
            <li>
              <Link to="/admin/reports" className={path === "/admin/reports" ? "active" : ""} onClick={() => setSidebarOpen(false)}>
                <img src={getIcon("/admin/reports", ReportsSvg, ReportsSvg)} alt="Reports" />
                <p>Reports</p>
                {/* <span>Reports</span> */}
              </Link>
            </li>
            <li>
              <Link to="/admin/problem" className={path === "/admin/problem" ? "active" : ""} onClick={() => setSidebarOpen(false)}>
                <img src={getIcon("/admin/problem", ReportsSvg, ReportsSvg)} alt="Problem" />
                <p>Report a Problem</p>
                {/* <span>Reports</span> */}
              </Link>
            </li>
            <li>
              <Link to="/admin/symptoms" className={path === "/admin/symptoms" ? "active" : ""} onClick={() => setSidebarOpen(false)}>
                <img src={getIcon("/admin/symptoms", SymptomsSvg, SymptomsSvg)} alt="Symptoms" />
                <p>Symptoms</p>
                {/* <span>Symptoms</span> */}
              </Link>
            </li>
            <li>
              <Link to="/admin/old-symptoms" className={path === "/admin/old-symptoms" ? "active" : ""} onClick={() => setSidebarOpen(false)}>
                <img src={getIcon("/admin/old-symptoms", SymptomsSvg, SymptomsSvg)} alt="Symptoms" />
                <p>Old Symptoms Data</p>
                {/* <span>Symptoms</span> */}
              </Link>
            </li>
            <li>
              <Link to="/admin/accounts" className={path === "/admin/accounts" ? "active" : ""} onClick={() => setSidebarOpen(false)}>
                <img src={getIcon("/admin/accounts", AccountsSvg, AccountsSvg)} alt="Accounts" />
                <p>Accounts</p>
                {/* <span>Accounts</span> */}
              </Link>
            </li>
            <li>
              <Link to="/admin/account-settings" className={path === "/admin/account-settings" ? "active" : ""} onClick={() => setSidebarOpen(false)}>
                <img src={getIcon("/admin/account-settings", AccountSettingsSvg, AccountSettingsSvg)} alt="Account Settings" />
                <p>Account Settings</p>
                {/* <span>Account Settings</span> */}
              </Link>
            </li>
            <li className="logout" onClick={() => setSidebarOpen(false)}>
              <Link to="/">
                <img src={LogoutSvg} alt="Logout" />
                <p>Logout</p>
                {/* <span>Logout</span> */}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
