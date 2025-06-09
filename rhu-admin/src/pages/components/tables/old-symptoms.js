import React, { useState, useEffect } from "react";
import { getOldSymptom } from "../../../api/data";
import "../../../assets/css/table.css";

const TableOldSymptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total_pages: 1,
    total_records: 0,
    current_page: 1
  });

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const result = await getOldSymptom(
        pagination.page.toString(), 
        pagination.limit.toString(), 
        searchQuery
      );
      
      if (result.status === 'success') {
        setSymptoms(prev => {
          // For page 1, replace the data, otherwise append
          return pagination.page === 1 ? result.data : [...prev, ...result.data];
        });
        
        // Update pagination from the API response
        if (result.pagination) {
          setPagination(prev => ({
            ...prev,
            total_pages: result.pagination.total_pages,
            total_records: result.pagination.total_records,
            current_page: result.pagination.current_page
          }));
        }
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, [pagination.page, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleLoadMore = () => {
    if (pagination.current_page < pagination.total_pages && !loading) {
      setPagination(prev => ({ 
        ...prev, 
        page: prev.page + 1 
      }));
    }
  };

  return (
    <div className="table-holder">
      <div className="table-header">
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
                <th>Symptoms</th>
                <th>Barangay</th>
                <th>Year</th>
                <th>Gender</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {symptoms.length > 0 ? (
                symptoms.map((symptom) => (
                  <tr key={`${symptom.id}-${symptom.created_at}`}>
                    <td>{symptom.symptoms}</td>
                    <td>{symptom.barangay}</td>
                    <td>{symptom.year}</td>
                    <td>{symptom.gender}</td>
                    <td>{symptom.latitude}</td>
                    <td>{symptom.longitude}</td>
                    <td>{symptom.created_at}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
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
        <div className="item center">
          {pagination.current_page < pagination.total_pages && (
            <button 
              className="load-more" 
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
        <div className="item right">
          <p>Page {pagination.current_page} of {pagination.total_pages}</p>
        </div>
      </div>
    </div>
  );
};

export default TableOldSymptoms;