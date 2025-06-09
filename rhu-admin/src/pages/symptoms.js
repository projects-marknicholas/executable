import React, { useEffect, useState } from "react";

// Components
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import TableSymptoms from "./components/tables/symptoms";

const Symptoms = () => {

  useEffect(() => {
    document.title = 'Symptoms - RHU';
  }, []);

  return (
    <>
      <div className="main-section">
        <Sidebar active='symptoms' />

        <div className="setup-sect">
          <Navbar/>

          <div className="setup-header">
            Symptoms
          </div>

          <TableSymptoms/>
        </div>
      </div>
    </>
  );
};

export default Symptoms;
