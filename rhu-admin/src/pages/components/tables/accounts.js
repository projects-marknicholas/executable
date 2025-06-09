import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// Assets
import ProfileImage from "../../../assets/svg/profile.svg";
import AcceptSvg from "../../../assets/svg/accept.svg";
import DeclineSvg from "../../../assets/svg/decline.svg";

// CSS
import '../../../assets/css/table.css';

// API
import { getAccounts, updateAccountStatus, deleteAccount, updateStatus, getSystemStatus } from "../../../api/data";

const TableAccounts = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAccounts(page, 50, searchQuery);

        if (response.status === "success") {
          setAccounts(response.data || []);
          setTotalPages(response.pagination?.total_pages || 1);
          setTotalRecords(response.pagination?.total_records || 0);
        } else {
          setAccounts([]);
          setError(response.message || "Failed to fetch accounts");
        }
      } catch (err) {
        setAccounts([]);
        setError("Error loading accounts");
      } finally {
        setLoading(false);
      }
    };

    const fetchSystemStatus = async () => {
      try {
        const response = await getSystemStatus();
        if (response.status === "success") {
          setSystemStatus(response.systemStatus);
        }
      } catch (err) {
        console.error("Failed to fetch system status:", err);
      }
    };

    fetchAccounts();
    fetchSystemStatus();
  }, [page, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle account status update
  const handleUpdateStatus = async (email, newStatus) => {
    try {
      const response = await updateAccountStatus(email, newStatus);

      if (response.status === "success") {
        const updatedAccounts = accounts.map((account) =>
          account.email === email ? { ...account, status: newStatus } : account
        );
        setAccounts(updatedAccounts);

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message || 'Account status updated successfully.',
          timer: 2000, 
          showConfirmButton: false,
        });
      } else {
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message || 'Failed to update account status.',
        });
      }
    } catch (err) {
      // Show error message for exceptions
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating the account status. Please try again later.',
      });
    }
  };

  const handleDeleteAccount = async (userId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
  
    if (confirm.isConfirmed) {
      try {
        const response = await deleteAccount(userId);
  
        if (response.status === "success") {
          setAccounts(prev => prev.filter(account => account.user_id !== userId));
  
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: response.message || "Account has been deleted.",
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.message || "Failed to delete account."
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while deleting the account."
        });
      }
    }
  };

  const handleToggleSystemStatus = async () => {
    const newStatus = systemStatus === 'on' ? 'off' : 'on';
    
    setStatusLoading(true);
    try {
      const response = await updateStatus(newStatus);
      
      if (response.status === "success") {
        setSystemStatus(newStatus);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message || `System status changed to ${newStatus}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message || 'Failed to update system status',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating system status',
      });
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="table-holder">
      <div className="table-header">
        <div className="table-btns">
          <Link 
            to="#"
            onClick={handleToggleSystemStatus}
            disabled={statusLoading || systemStatus === null}
          >
            {statusLoading ? 'Processing...' : `Turn ${systemStatus === 'on' ? 'off' : 'on'} Email Verification`}
          </Link>
          <small
            style={{ marginLeft: '12px', opacity: '.5' }}
          >The email verification is {systemStatus === 'off' ? 'off' : 'on'}</small>
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
              <th>Full name</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && accounts.length > 0 ? (
              accounts.map((account, index) => (
                <tr key={index}>
                  <td>
                    <img src={account.profile} alt="Profile" />
                  </td>
                  <td>{account.first_name} {account.last_name}</td>
                  <td>{account.email}</td>
                  <td>{account.last_login}</td>
                  <td>{account.role}</td>
                  <td><span className={`${account.status}`}>{account.status}</span></td>
                  <td className="action-field">
                    {account.status === "verified" ? (
                      <button className="decline" onClick={() => handleUpdateStatus(account.email, "unverified")}>
                        <img src={DeclineSvg} alt="Deactivate" /> Deactivate
                      </button>
                    ) : (
                      <button className="accept" onClick={() => handleUpdateStatus(account.email, "verified")}>
                        <img src={AcceptSvg} alt="Activate" /> Activate
                      </button>
                    )}
                    <button className="decline" onClick={() => handleDeleteAccount(account.user_id)}>
                      <img src={DeclineSvg} alt="Delete Account" /> Delete Account
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  {loading ? "Loading..." : "No accounts available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <div className="item">
          <p>Showing {accounts.length} result(s)</p>
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
    </div>
  );
};

export default TableAccounts;
