import React, { useEffect, useState } from "react";

// Components
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import TableRegistrations from "./components/tables/registrations";

const Registrations = () => {

  useEffect(() => {
    document.title = 'Registrations - RHU';
  }, []);

  return (
    <>
      <div className="main-section">
        <Sidebar active='registrations' />

        <div className="setup-sect">
          <Navbar/>

          <div className="setup-header">
            Registrations
          </div>

          <TableRegistrations/>
        </div>
      </div>
    </>
  );
};

export default Registrations;
