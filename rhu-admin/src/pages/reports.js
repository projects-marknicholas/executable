import React, { useEffect, useState } from "react";

// Components
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import TableReports from "./components/tables/reports";

const Reports = () => {

  useEffect(() => {
    document.title = 'Registrations - RHU';
  }, []);

  return (
    <>
      <div className="main-section">
        <Sidebar active='reports' />

        <div className="setup-sect">
          <Navbar/>

          <div className="setup-header">
            Reports
          </div>

          <TableReports/>
        </div>
      </div>
    </>
  );
};

export default Reports;
