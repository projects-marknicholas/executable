import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import ProfileImage from "../../../assets/svg/profile.svg";
import ViewSvg from "../../../assets/svg/view.svg";
import ProblemReportModal from "../pop/update-problem";
import { getReports } from "../../../api/data";
import "../../../assets/css/table.css";

const TableProblem = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getReports("all", page, 10, searchQuery);

      if (response.status === "success") {
        setReports(response.data || []);
        setTotalPages(response.total_pages || 1);
        setTotalRecords(response.total_records || 0);
      } else {
        setReports([]);
        setError(response.message || "Failed to fetch reports");
      }
    } catch (err) {
      setReports([]);
      setError("Error loading reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  const openProblemModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const exportToExcel = async () => {
    try {
      setLoading(true);
      // Fetch all reports without pagination
      const response = await getReports("all", 1, totalRecords, searchQuery);
      
      if (response.status === "success" && response.data) {
        const reportsData = response.data;
        
        // Prepare the worksheet
        const ws = XLSX.utils.json_to_sheet(
          reportsData.map(report => ({
            "Registrator": report.full_name,
            "Patient": report.name,
            "Email": report.email,
            "Address": report.address,
            "Symptoms": report.symptoms,
            "Problem": report.problem || '',
            "Status": report.status || ''
          }))
        );
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reports");
        
        // Export the file
        XLSX.writeFile(wb, `reports_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <input 
            type="text" 
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
              <th>Symptoms</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.symptoms_id}>
                  <td>
                    <img src={ProfileImage} alt="Profile" />
                  </td>
                  <td>{report.full_name}</td>
                  <td>{report.name}</td>
                  <td>{report.email}</td>
                  <td>{report.address.length > 50 ? `${report.address.slice(0, 50)}...` : report.address}</td>
                  <td>{report.symptoms.length > 50 ? `${report.symptoms.slice(0, 50)}...` : report.symptoms}</td>
                  <td><span className={`${report.status ? "decline-span" : ""}`}>{report.status || 'No issue'}</span></td>
                  <td className="action-field">
                    <button 
                      className={`decline ${report.status === 'problem' ? 'view' : 'decline'}`} 
                      onClick={() => openProblemModal(report)}
                    >
                      <img src={ViewSvg} alt="Report a Problem" /> 
                      {report.status === 'problem' ? 'Problem Reported' : 'Report a Problem'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  {loading ? "Loading..." : "No reports available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="item">
          <p>Showing {reports.length} result(s)</p>
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

      {isModalOpen && (
        <ProblemReportModal 
          isOpen={isModalOpen} 
          report={selectedReport} 
          onClose={closeModal}
          fetchReports={fetchReports}
        />
      )}
    </div>
  );
};

export default TableProblem;