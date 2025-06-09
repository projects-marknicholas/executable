import React, { useEffect, useState } from "react";

// Components
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import TableProblem from "./components/tables/problem";

const Problem = () => {

  useEffect(() => {
    document.title = 'Report a Problem - RHU';
  }, []);

  return (
    <>
      <div className="main-section">
        <Sidebar active='problem' />

        <div className="setup-sect">
          <Navbar/>

          <div className="setup-header">
            Report a Problem
          </div>

          <TableProblem/>
        </div>
      </div>
    </>
  );
};

export default Problem;
