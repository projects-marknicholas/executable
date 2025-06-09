import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboard, getOldSymptoms, getHistoricalSymptoms } from '../../../api/data';

const DashboardGraph = () => {
  const [graphData, setGraphData] = useState([]);
  const [oldSymptoms, setOldSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [displayOption, setDisplayOption] = useState('both');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [viewMode, setViewMode] = useState('individual');
  const [yearlyData, setYearlyData] = useState([]);
  const [symptomsCountData, setSymptomsCountData] = useState([]);

  // Function to process symptoms count data by removing timestamps and aggregating counts
  const processSymptomsCount = (symptomsData) => {
    const aggregated = {};
    
    Object.entries(symptomsData).forEach(([key, count]) => {
      // Extract the symptom name by removing the timestamp part
      const symptomName = key.split(' (')[0];
      
      // Aggregate counts by symptom name
      if (aggregated[symptomName]) {
        aggregated[symptomName] += count;
      } else {
        aggregated[symptomName] = count;
      }
    });
    
    // Convert to array format for the chart
    return Object.entries(aggregated)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard data
        const dashboardResponse = await getDashboard(startDate, endDate);
        
        // Fetch old symptoms list
        const symptomsResult = await getOldSymptoms();
        
        if (dashboardResponse.status === 'success' && symptomsResult.status === 'success') {
          // Transform the graph data
          const transformedData = Object.keys(dashboardResponse.data.graph_data.registrations).map((month) => ({
            month,
            registrations: dashboardResponse.data.graph_data.registrations[month],
            symptoms: dashboardResponse.data.graph_data.symptoms[month],
          }));
          
          setGraphData(transformedData);
          setOldSymptoms(symptomsResult.symptoms);

          // Process symptoms count data
          if (dashboardResponse.data.graph_data.symptoms_count) {
            const processedData = processSymptomsCount(dashboardResponse.data.graph_data.symptoms_count);
            setSymptomsCountData(processedData);
          }

          // Also fetch initial historical data if needed
          if (viewMode === 'old') {
            const historicalResult = await getHistoricalSymptoms({ symptom: selectedSymptom });
            if (historicalResult.status === 'success') {
              const transformedHistorical = Object.keys(historicalResult.data).map(key => ({
                year: key.replace('year_', ''),
                total: parseInt(historicalResult.data[key].total)
              }));
              setYearlyData(transformedHistorical);
            }
          }
        } else {
          setError(dashboardResponse.message || symptomsResult.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle view mode change
  const handleViewModeChange = async (e) => {
    const mode = e.target.value === 'old' ? 'old' : 'individual';
    setViewMode(mode);
    
    if (mode === 'old') {
      try {
        setLoading(true);
        const result = await getHistoricalSymptoms({ symptom: selectedSymptom });
        if (result.status === 'success') {
          const transformedData = Object.keys(result.data).map(key => ({
            year: key.replace('year_', ''),
            total: parseInt(result.data[key].total)
          }));
          setYearlyData(transformedData);
        }
      } catch (err) {
        setError('Failed to fetch historical data');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle symptom selection change
  const handleSymptomChange = async (e) => {
    const symptom = e.target.value;
    setSelectedSymptom(symptom);
    
    if (viewMode === 'old') {
      try {
        setLoading(true);
        const result = await getHistoricalSymptoms({ symptom });
        if (result.status === 'success') {
          const transformedData = Object.keys(result.data).map(key => ({
            year: key.replace('year_', ''),
            total: parseInt(result.data[key].total)
          }));
          setYearlyData(transformedData);
        }
      } catch (err) {
        setError('Failed to filter by symptom');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle date filter changes (for individual view only)
  const handleDateFilter = async () => {
    if (viewMode === 'old') return;

    const start = document.getElementById('start_date').value;
    const end = document.getElementById('end_date').value;

    if (start && end) {
      try {
        setLoading(true);
        setError(null);
        setStartDate(start);
        setEndDate(end);
        
        const result = await getDashboard(start, end);
        
        if (result.status === 'success') {
          const transformedData = Object.keys(result.data.graph_data.registrations).map((month) => ({
            month,
            registrations: result.data.graph_data.registrations[month],
            symptoms: result.data.graph_data.symptoms[month],
          }));
          setGraphData(transformedData);

          // Process symptoms count data
          if (result.data.graph_data.symptoms_count) {
            const processedData = processSymptomsCount(result.data.graph_data.symptoms_count);
            setSymptomsCountData(processedData);
          }
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please select both start and end dates.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="graph">
      <div className="graph-header">
        <h4>{viewMode === 'old' ? 'Historical Symptoms Data' : 'Registration and Symptoms'}</h4>
        <div className="flex-filter">
          <select 
            value={viewMode === 'old' ? 'old' : 'individual'}
            onChange={handleViewModeChange}
            className="filter-select"
          >
            <option value="individual">Individual report view</option>
            <option value="old">Old data view</option>
          </select>
          
          {viewMode === 'old' && (
            <select 
              style={{ width: '180px' }}
              value={selectedSymptom}
              onChange={handleSymptomChange}
              className="filter-select"
            >
              <option value="">All Symptoms</option>
              {oldSymptoms.map((symptom, index) => {
                const rawSymptom = symptom.replace(/\s*\(\d+\)$/, '');
                
                return (
                  <option 
                    key={index} 
                    value={rawSymptom} 
                  >
                    {symptom}  
                  </option>
                );
              })}
            </select>
          )}
          
          {viewMode === 'individual' && (
            <>
              <select 
                value={displayOption}
                onChange={(e) => setDisplayOption(e.target.value)}
                className="filter-select"
              >
                <option value="both">Both</option>
                <option value="registrations">Registration Only</option>
                <option value="symptoms">Symptom Only</option>
                <option value="symptomsCount">Symptom Report Counts</option>
              </select>
              <div className="date-filters">
                <input type="date" id="start_date" name="start_date" className="date-input" />
                <input type="date" id="end_date" name="end_date" className="date-input" />
                <button onClick={handleDateFilter} className="filter-button">Apply</button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="chart-container">
        {displayOption === 'symptomsCount' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={symptomsCountData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }} 
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                formatter={(value) => [`${value} reports`, 'Reports']}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Reports" 
                fill="#033baa" 
                barSize={30}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : viewMode === 'old' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={yearlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="total" 
                name={selectedSymptom || 'All Symptoms'} 
                fill="#033baa" 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={graphData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(displayOption === 'both' || displayOption === 'registrations') && (
                <Line
                  type="monotone"
                  dataKey="registrations"
                  name="Registrations"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              )}
              {(displayOption === 'both' || displayOption === 'symptoms') && (
                <Line
                  type="monotone"
                  dataKey="symptoms"
                  name="Symptoms"
                  stroke="#82ca9d"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DashboardGraph;