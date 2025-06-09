import React, { useEffect, useState } from "react";

// Components
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import TableOldSymptoms from "./components/tables/old-symptoms";

const OldSymptomsData = () => {

  useEffect(() => {
    document.title = 'Old Symptoms Data - RHU';
  }, []);

  return (
    <>
      <div className="main-section">
        <Sidebar active='symptoms' />

        <div className="setup-sect">
          <Navbar/>

          <div className="setup-header">
            Old Symptoms Data
          </div>

          <TableOldSymptoms/>
        </div>
      </div>
    </>
  );
};

export default OldSymptomsData;
