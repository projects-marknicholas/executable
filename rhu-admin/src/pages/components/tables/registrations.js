import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

// Assets
import ProfileImage from "../../../assets/svg/profile.svg";
import ViewSvg from "../../../assets/svg/view.svg";

// Components
import ViewRegistrationPopup from "../pop/view-registration";

// CSS
import '../../../assets/css/table.css';

// API
import { getRegisters } from "../../../api/data";

const TableRegistrations = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [registers, setRegisters] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRegistrations, setSelectedRegistrations] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRegisters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRegisters(page, 50, searchQuery);

        if (response.status === "success") {
          setRegisters(response.data || []);
          setTotalPages(response.total_pages || 1);
          setTotalRecords(response.total_records || 0);
        } else {
          setRegisters([]);
          setError(response.message || "Failed to fetch registers");
        }
      } catch (err) {
        setRegisters([]);
        setError("Error loading registers");
      } finally {
        setLoading(false);
      }
    };
    fetchRegisters();
  }, [page, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  const openModal = (register) => {
    setSelectedRegistrations(register);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRegistrations(null);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const exportToExcel = async () => {
    try {
      setLoading(true);
      // Fetch all registers without pagination
      const response = await getRegisters(1, totalRecords, searchQuery);
      
      if (response.status === "success" && response.data) {
        const registersData = response.data;
        
        // Prepare the worksheet
        const ws = XLSX.utils.json_to_sheet(
          registersData.map(register => ({
            "Registrator": register.full_name,
            "Patient": register.name,
            "Email": register.email,
            "Address": register.complete_address,
            "Category": register.category,
            // Add other fields as needed
          }))
        );
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registrations");
        
        // Export the file
        XLSX.writeFile(wb, `registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-holder">
      <div className="table-header">
        <div className="table-btns">
          <Link to="#" onClick={exportToExcel}>Export as Excel</Link>
        </div>
        <div className="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            id="search"
            name="search"
            autoComplete="off"
            placeholder="Search"
            value={searchQuery} 
            onChange={handleSearch} 
          />
        </div>
      </div>
      <div className="table-scrolling">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Registrator</th>
              <th>Patient</th>
              <th>Email</th>
              <th>Address</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && registers.length > 0 ? (
              registers.map((register, index) => (
                <tr key={index}>
                  <td>
                    <img src={register.profile || ProfileImage} alt="Profile" />
                  </td>
                  <td>{register.full_name}</td>
                  <td>{register.name}</td>
                  <td>{register.email}</td>
                  <td>{register.complete_address}</td>
                  <td>{register.category}</td>
                  <td className="action-field">
                    <button className="view" onClick={() => openModal(register)}>
                      <img src={ViewSvg} alt="View" /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  {loading ? "Loading..." : "No registers available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <div className="item">
          <p>Showing {registers.length} result(s)</p>
        </div>
        <div className="item center">
          <button
            className="load-more"
            onClick={handleLoadMore}
            disabled={loading || page >= totalPages}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
        <div className="item right">
          <p>Total of {totalRecords} result(s)</p>
        </div>
      </div>

      {isModalOpen && <ViewRegistrationPopup register={selectedRegistrations} onClose={closeModal} />}
    </div>
  );
};

export default TableRegistrations;