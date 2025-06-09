import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeclineSvg from "../../../assets/svg/decline.svg";
import AddSymptomPopup from "../pop/add-symptom";
import EditSymptomPopup from "../pop/edit-symptom";
import { getSymptom, deleteSymptom } from "../../../api/data";
import Swal from "sweetalert2";
import "../../../assets/css/table.css";

const TableSymptoms = () => {
  const [showAddSymptomPopup, setShowAddSymptomPopup] = useState(false);
  const [showEditSymptomPopup, setShowEditSymptomPopup] = useState(false);
  const [symptomToEdit, setSymptomToEdit] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total_pages: 1,
    total_records: 0
  });

  // Fetch symptoms data
  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const result = await getSymptom(
        pagination.page.toString(), 
        pagination.limit.toString(), 
        searchQuery
      );
      
      if (result.status === 'success') {
        setSymptoms(prev => pagination.page === 1 ? result.data : [...prev, ...result.data]);
        setPagination(prev => ({
          ...prev,
          total_pages: result.total_pages,
          total_records: result.total_records
        }));
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when search/pagination changes
  useEffect(() => {
    fetchSymptoms();
  }, [pagination.page, searchQuery]);

  const handleAddSymptomClick = (e) => {
    e.preventDefault();
    setShowAddSymptomPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddSymptomPopup(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.total_pages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const refreshSymptomsList = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchSymptoms();
  };

  const handleEditSymptomClick = (symptom) => {
    setSymptomToEdit(symptom);
    setShowEditSymptomPopup(true);
  };
  
  const handleDeleteSymptom = (symptomId, symptomName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the symptom "${symptomName}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteSymptom(symptomId);
          
          if (response.status === 'success') {
            Swal.fire({
              title: 'Deleted!',
              text: response.message || 'Symptom has been deleted successfully.',
              icon: 'success',
              timer: 2000
            });
            
            // Refresh the symptoms list
            if (symptoms.length === 1 && pagination.page > 1) {
              setPagination(prev => ({ ...prev, page: prev.page - 1 }));
            } else {
              fetchSymptoms();
            }
          } else {
            Swal.fire({
              title: 'Error!',
              text: response.message || 'Failed to delete symptom.',
              icon: 'error'
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'An unexpected error occurred. Please try again.',
            icon: 'error'
          });
        }
      }
    });
  };

  return (
    <div className="table-holder">
      <div className="table-header">
        <div className="table-btns">
          <Link to="#" onClick={handleAddSymptomClick}>
            Add New Symptom
          </Link>
        </div>
        <div className="search-bar">
          <input 
            type="search" 
            placeholder="Search" 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="table-scrolling">
        {loading && pagination.page === 1 ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Symptom</th>
                <th>Tagalog</th>
                <th>Description</th>
                <th>Threshold</th>
                <th>Allow Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {symptoms.length > 0 ? (
                symptoms.map((symptom) => (
                  <tr key={symptom.symptom_list_id}>
                    <td>{symptom.symptom}</td>
                    <td>{symptom.symptom_tagalog}</td>
                    <td>{symptom.symptom_description}</td>
                    <td>{symptom.threshold}</td>
                    <td>
                      <span className={`symptom-${symptom.allow_image}`}>{symptom.allow_image}</span>
                    </td>
                    <td className="action-field">
                      <button 
                        className="accept"
                        onClick={() => handleEditSymptomClick(symptom)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="decline"
                        onClick={() => handleDeleteSymptom(symptom.symptom_list_id, symptom.symptom)}
                      >
                        <img src={DeclineSvg} alt="Delete" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No symptoms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="table-footer">
        <div className="item">
          <p>Showing {symptoms.length} of {pagination.total_records} result(s)</p>
        </div>
        {pagination.page < pagination.total_pages && (
          <div className="item center">
            <button 
              className="load-more" 
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {showAddSymptomPopup && (
        <AddSymptomPopup 
          onClose={handleClosePopup} 
          onSuccess={() => {
            setPagination(prev => ({ ...prev, page: 1 }));
            fetchSymptoms();
          }} 
        />
      )}

      {showEditSymptomPopup && symptomToEdit && (
        <EditSymptomPopup
          symptom={symptomToEdit}
          onClose={() => setShowEditSymptomPopup(false)}
          onSuccess={refreshSymptomsList}
        />
      )}
    </div>
  );
};

export default TableSymptoms;