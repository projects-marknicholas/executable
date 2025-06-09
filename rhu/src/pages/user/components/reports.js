import { useState, useEffect } from 'react';
import { user_symptoms } from "../../../api/data";

const Reports = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const result = await user_symptoms();
        if (result.status === 'success') {
          setSymptoms(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to fetch symptoms data');
        console.error('Error fetching symptoms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  if (loading) {
    return <div className="tab-pane">Loading symptoms...</div>;
  }

  if (error) {
    return <div className="tab-pane">Error: {error}</div>;
  }

  return (
    <div className="tab-pane">
      <table>
        <thead>
          <tr>
            <th>Problem</th>
            <th>Date Reported</th>
            <th>Name</th>
            <th>Symptoms</th>
            <th>Description</th>
            <th>Location</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {symptoms.length > 0 ? (
            symptoms.map((report) => (
              <tr key={report.symptoms_id}>
                <td>{report.problem}</td>
                <td>{new Date(report.created_at).toLocaleDateString()}</td>
                <td>{report.name}</td>
                <td>{report.symptoms}</td>
                <td>{report.symptoms_description}</td>
                <td>{report.reporting_location}</td>
                <td>{report.address}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No symptoms reported yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;