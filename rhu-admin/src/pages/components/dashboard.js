import React, { useState, useEffect } from "react";

// Components
import DashboardDetails from "./dashboard/details";
import DashboardGraph from "./dashboard/graph";
import Heatmap from "./heatmap";
import { getThreshold } from "../../api/data";
import { Link } from "react-router-dom";

const DashboardData = () => {
  const [thresholdData, setThresholdData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchThreshold = async () => {
    const today = new Date().toISOString().split('T')[0];

    const start = startDate || today;
    const end = endDate || today;

    setLoading(true);
    const response = await getThreshold(start, end);
    if (response.status === 'success') {
      setThresholdData(response.data);
    } else {
      setThresholdData([]);
      console.error(response.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchThreshold();
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'start_date') setStartDate(value);
    if (name === 'end_date') setEndDate(value);
  };

  const handleSearch = () => {
    fetchThreshold();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-details">
        <DashboardDetails />
        <DashboardGraph />
      </div>

      <Heatmap />

      {loading ? (
        <div>Loading Threshold Data...</div>
      ) : (
        <div className="dashboard-threshold">
          <div className="table-holder">
            <div className="table-header">
              <div className="table-btns">
                <Link to onClick={handleSearch}>Apply Filter</Link>
              </div>
              <div className="search-bar">
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  autoComplete="off"
                  value={startDate}
                  onChange={handleDateChange}
                />
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  autoComplete="off"
                  value={endDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className="table-scrolling">
              <table>
                <thead>
                  <tr>
                    <th>Symptom</th>
                    <th>Threshold</th>
                    <th>Total Reports</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="3">Loading...</td></tr>
                  ) : thresholdData.length === 0 ? (
                    <tr><td colSpan="3" style={{ textAlign: 'center' }}>No threshold exceeded.</td></tr>
                  ) : (
                    thresholdData.map((item, index) => (
                      <tr key={index}>
                        <td className="dashboard-threshold-td">{item.symptom}</td>
                        <td>{item.threshold}</td>
                        <td>{item.reported_count}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardData;
