import React, { useEffect, useState } from "react";

// Components
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import TableAccounts from "./components/tables/accounts";

const Accounts = () => {

  useEffect(() => {
    document.title = 'Accounts - RHU';
  }, []);

  return (
    <>
      <div className="main-section">
        <Sidebar active='accounts' />

        <div className="setup-sect">
          <Navbar/>

          <div className="setup-header">
            Accounts
          </div>

          <TableAccounts/>
        </div>
      </div>
    </>
  );
};

export default Accounts;
