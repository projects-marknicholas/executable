import React, { useEffect, useState } from 'react';
import { getTotals } from '../../../api/data';

const DashboardDetails = () => {
  const [totals, setTotals] = useState({
    registrations: { current_month: 0, previous_month: 0 },
    symptoms: { current_month: 0, previous_month: 0 },
    accounts: { current_month: 0, previous_month: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch totals data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const result = await getTotals();

      if (result.status === 'success') {
        setTotals({
          registrations: result.data.total_registrations,
          symptoms: result.data.total_symptoms,
          accounts: result.data.total_accounts,
        });
      } else {
        setError(result.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper function to calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0; // Avoid division by zero
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="dash-details-grid">
        {/* Registrations */}
        <div className="item">
          <div className="flex-top">
            <p>Registrations</p>
            <span className="success">
              {calculatePercentageChange(
                totals.registrations.current_month,
                totals.registrations.previous_month
              ).toFixed(2)}%
            </span>
          </div>
          <h2>{totals.registrations.current_month}</h2>
          <div className="flex-bottom">
            <p>vs. last month</p>
            <span>{totals.registrations.previous_month}</span>
          </div>
        </div>

        {/* Reported Symptoms */}
        <div className="item">
          <div className="flex-top">
            <p>Reported Symptoms</p>
            <span className="success">
              {calculatePercentageChange(
                totals.symptoms.current_month,
                totals.symptoms.previous_month
              ).toFixed(2)}%
            </span>
          </div>
          <h2>{totals.symptoms.current_month}</h2>
          <div className="flex-bottom">
            <p>vs. last month</p>
            <span>{totals.symptoms.previous_month}</span>
          </div>
        </div>

        {/* Accounts */}
        <div className="item">
          <div className="flex-top">
            <p>Accounts</p>
            <span className="success">
              {calculatePercentageChange(
                totals.accounts.current_month,
                totals.accounts.previous_month
              ).toFixed(2)}%
            </span>
          </div>
          <h2>{totals.accounts.current_month}</h2>
          <div className="flex-bottom">
            <p>vs. last month</p>
            <span>{totals.accounts.previous_month}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardDetails;