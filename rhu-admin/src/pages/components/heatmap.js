import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkLogo from "../../assets/svg/mark.svg";
import MarkDangerLogo from "../../assets/svg/mark-danger.svg";
import { getReports, getOldReports, getOldSymptoms, getBarangayReports } from "../../api/data";

// Status icons for Barangay View
const statusIcons = {
  normal: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  moderate: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  warning: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  danger: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  })
};

const normalIcon = L.icon({
  iconUrl: MarkLogo,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const dangerIcon = L.icon({
  iconUrl: MarkDangerLogo,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const createNumberedIcon = (number, isDanger, total = null) => {
  return L.divIcon({
    html: `<div style="position: relative; text-align: center;">
             <img src="${isDanger ? MarkDangerLogo : MarkLogo}" style="width: 32px; height: 32px;" alt="marker"/>
             <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); color: white; font-weight: bold; background-color: #000; padding: 5px 8px; border-radius: 8px; cursor: pointer;">
                ${total !== null ? total : number}
             </div>
           </div>`,
    className: "custom-marker-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const createBarangayIcon = (count, status) => {
  const color = 
    status === 'danger' ? 'red' :
    status === 'warning' ? 'orange' :
    status === 'moderate' ? 'goldenrod' : 'blue';
  
  return L.divIcon({
    html: `
      <div style="position: relative; text-align: center;">
        <div style="
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-weight: bold;
          background-color: ${color};
          padding: 3px 3px;
          border-radius: 50%;
          border: 2px solid white;
          min-width: 25px;
          text-align: center;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
        ">
          ${count}
        </div>
        <img 
          src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color === 'goldenrod' ? 'yellow' : color}.png" 
          style="width: 25px; height: 41px;" 
          alt="marker"
        />
      </div>
    `,
    className: "custom-barangay-icon",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
};

const cleanSymptom = (symptom) => {
  return symptom.split(' (')[0].trim();
};

const countSymptoms = (reports) => {
  const counts = {
    'All': reports.length,
    'Fever': 0,
    'Cough of more than 2 weeks': 0,
    'Sorethroat': 0,
    'Bloody diarrhea': 0,
    'Jaundice': 0,
    'Rashes': 0,
    'Cough': 0,
    'Cold': 0,
    'Diarrhea': 0,
    'Vomiting': 0,
    'Icterisia': 0
  };

  reports.forEach(report => {
    if (!report.symptoms) return;

    report.symptoms.split(',').forEach(rawSymptom => {
      const symptom = cleanSymptom(rawSymptom.trim());
      if (counts.hasOwnProperty(symptom)) {
        counts[symptom]++;
      }
    });
  });

  return counts;
};

const countSymptomsByBarangay = (reports) => {
  const counts = {};
  
  reports.forEach(report => {
    const barangay = report.reporting_location || report.barangay;
    if (!barangay) return;
    
    if (!counts[barangay]) {
      counts[barangay] = {
        total: 0,
        symptoms: {
          'Fever': 0,
          'Cough of more than 2 weeks': 0,
          'Sorethroat': 0,
          'Bloody diarrhea': 0,
          'Jaundice': 0,
          'Rashes': 0,
          'Cough': 0,
          'Cold': 0,
          'Diarrhea': 0,
          'Vomiting': 0,
          'Icterisia': 0
        }
      };
    }
    
    counts[barangay].total++;
    
    if (!report.symptoms) return;
    
    report.symptoms.split(',').forEach(rawSymptom => {
      const symptom = cleanSymptom(rawSymptom.trim());
      if (counts[barangay].symptoms.hasOwnProperty(symptom)) {
        counts[barangay].symptoms[symptom]++;
      }
    });
  });
  
  return counts;
};

const getBarangayCenter = (barangay) => {
  const barangayCenters = {
    "Anos": [14.17994, 121.23516],
    "Bagong Silang": [14.11901, 121.22357],
    "Bambang": [14.17777, 121.21817],
    "Batong Malake": [14.16737, 121.24310],
    "Baybayin": [14.18160, 121.22422],
    "Bayog": [14.19050, 121.24422],
    "Lalakay": [14.17290, 121.21422],
    "Maahas": [14.17656, 121.25653],
    "Malinta": [14.18559, 121.23018],
    "Mayondon": [14.18797, 121.23795],
    "Putho Tuntungin": [14.15139, 121.25181],
    "San Antonio": [14.17740, 121.24701],
    "Tadlak": [14.17998, 121.20911],
    "Timugan": [14.17919, 121.22426]
  };
  return barangayCenters[barangay] || [14.1709, 121.243];
};

const isValidOldReport = (report) => {
  return report && 
         report.barangay && 
         report.latitude && 
         report.longitude;
};

const Heatmap = () => {
  const [popupInfo, setPopupInfo] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [symptom, setSymptom] = useState("All");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [viewMode, setViewMode] = useState("Individual Reports View");
  const [olddata, setOldData] = useState("All");
  const [oldSymptom, setOldSymptom] = useState("All");
  const [allSymptomCounts, setAllSymptomCounts] = useState({});
  const [oldSymptoms, setOldSymptoms] = useState([]);
  const [barangayCounts, setBarangayCounts] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5000,
    totalRecords: 0,
    totalPages: 1
  });
  const [barangayViewData, setBarangayViewData] = useState({});
  const [symptomThresholds, setSymptomThresholds] = useState([]);
  const [barangayFilter, setBarangayFilter] = useState("");
  const [symptomFilter, setSymptomFilter] = useState("");

  const barangays = [
    { value: "All", label: "All" },
    { value: "Anos", label: "Anos" },
    { value: "Bagong Silang", label: "Bagong Silang" },
    { value: "Bambang", label: "Bambang" },
    { value: "Batong Malake", label: "Batong Malake" },
    { value: "Baybayin", label: "Baybayin" },
    { value: "Bayog", label: "Bayog" },
    { value: "Lalakay", label: "Lalakay" },
    { value: "Maahas", label: "Maahas" },
    { value: "Malinta", label: "Malinta" },
    { value: "Mayondon", label: "Mayondon" },
    { value: "Putho Tuntungin", label: "Putho-Tuntungin" },
    { value: "San Antonio", label: "San Antonio" },
    { value: "Tadlak", label: "Tadlak" },
    { value: "Timugan", label: "Timugan" }
  ];

  const symptoms = [
    { value: "", label: "All Symptoms" },
    { value: "fever", label: "Fever" },
    { value: "cough", label: "Cough" },
    { value: "cough of more than 2 weeks", label: "Cough of more than 2 weeks" },
    { value: "cold", label: "Cold" },
    { value: "sorethroat", label: "Sorethroat" },
    { value: "diarrhea", label: "Diarrhea" },
    { value: "bloody diarrhea", label: "Bloody diarrhea" },
    { value: "vomiting", label: "Vomiting" },
    { value: "jaundice", label: "Jaundice" },
    { value: "icterisia", label: "Icterisia" },
    { value: "rashes", label: "Rashes" }
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [countsResponse, symptomsResponse] = await Promise.all([
          getReports({
            symptom: "",
            page: 1,
            limit: 5000
          }),
          getOldSymptoms()
        ]);

        if (countsResponse?.status === "success") {
          setAllSymptomCounts(countSymptoms(countsResponse.data));
        }
        
        if (symptomsResponse?.status === "success") {
          setOldSymptoms(symptomsResponse.symptoms);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let response;
        
        if (viewMode === "Old Data View") {
          response = await getOldReports({ 
            barangay: olddata === "All" ? "" : olddata,
            symptom: oldSymptom === "All" ? "" : oldSymptom,
            page: pagination.page,
            limit: pagination.limit
          });
          
          if (response?.status === "success") {
            const validReports = response.data.filter(isValidOldReport);
            setMarkers(validReports.map((report, index) => ({
              lat: parseFloat(report.latitude),
              lng: parseFloat(report.longitude),
              label: report.barangay,
              symptoms: report.symptoms || 'No symptoms reported',
              barangay: report.barangay,
              total: report.total || 0,
              isDanger: false,
              number: index + 1
            })));
          }
        } else if (viewMode === "Barangay View") {
          response = await getBarangayReports({
            barangay: barangayFilter === "All" ? "" : barangayFilter,
            symptom: symptomFilter,
            page: 1,
            limit: 50
          });
          
          if (response?.status === "success") {
            const filteredData = {};
            if (barangayFilter && barangayFilter !== "All") {
              if (response.barangay_counts[barangayFilter]) {
                filteredData[barangayFilter] = response.barangay_counts[barangayFilter];
              }
            } else {
              Object.assign(filteredData, response.barangay_counts);
            }
            
            setBarangayViewData(filteredData || {});
            setSymptomThresholds(response.symptom_thresholds || []);
          }
        } else {
          response = await getReports({ 
            barangay: olddata === "All" ? "" : olddata,
            symptom: symptom === "All" ? "" : symptom,
            page: pagination.page,
            limit: pagination.limit
          });
          
          if (response?.status === "success") {
            setMarkers(response.data.map((report, index) => ({
              lat: parseFloat(report.latitude),
              lng: parseFloat(report.longitude),
              label: report.reporting_location,
              full_name: report.full_name,
              patient: report.name,
              address: report.address,
              profile: report.profile,
              symptoms: report.symptoms,
              isDanger: false,
              number: index + 1
            })));

            if (olddata === "All") {
              setBarangayCounts(countSymptomsByBarangay(response.data));
            } else {
              setBarangayCounts({});
            }
          }
        }

        if (response?.status === "success") {
          setPagination(prev => ({
            ...prev,
            totalRecords: response.pagination?.total_records || 0,
            totalPages: response.pagination?.total_pages || 1
          }));
          setAlert(response.alerts?.[0] || null);
        } else {
          setMarkers([]);
          setAlert(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMarkers([]);
        setAlert(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode, olddata, symptom, oldSymptom, pagination.page, pagination.limit, barangayFilter, symptomFilter]);

  const renderMapContent = () => {
    if (viewMode === "Barangay View") {
      const barangaysToShow = Object.entries(barangayViewData);
      
      if (barangaysToShow.length === 1) {
        const [barangayName, data] = barangaysToShow[0];
        const center = getBarangayCenter(barangayName);
        
        return (
          <>
            <Marker
              key={barangayName}
              position={center}
              icon={createBarangayIcon(data.count, data.symptom_status)}
            >
              <Popup>
                <div>
                  <h3>{barangayName}</h3>
                  <p>Total Cases: {data.count}</p>
                  <p>Status: <span style={{
                    color: 
                      data.symptom_status === 'danger' ? 'red' :
                      data.symptom_status === 'warning' ? 'orange' :
                      data.symptom_status === 'moderate' ? 'goldenrod' : 'green',
                    fontWeight: 'bold'
                  }}>
                    {data.symptom_status}
                  </span></p>
                  {symptomFilter && (
                    <p>
                      Threshold for {symptomFilter}: {
                        symptomThresholds.find(st => st.symptom === symptomFilter)?.threshold || 'N/A'
                      }
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
        );
      }
      
      return (
        <>
          {barangaysToShow.map(([barangayName, data]) => {
            const center = getBarangayCenter(barangayName);
            const icon = createBarangayIcon(data.count, data.symptom_status);
            
            return (
              <Marker
                key={barangayName}
                position={center}
                icon={icon}
              >
                <Popup>
                  <div>
                    <h3>{barangayName}</h3>
                    <p>Total Cases: {data.count}</p>
                    <p>Status: <span style={{
                      color: 
                        data.symptom_status === 'danger' ? 'red' :
                        data.symptom_status === 'warning' ? 'orange' :
                        data.symptom_status === 'moderate' ? 'goldenrod' : 'green',
                      fontWeight: 'bold'
                    }}>
                      {data.symptom_status}
                    </span></p>
                    {symptomFilter && (
                      <p>
                        Threshold for {symptomFilter}: {
                          symptomThresholds.find(st => st.symptom === symptomFilter)?.threshold || 'N/A'
                        }
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </>
      );
    } else {
      return (
        <>
          {markers.map((marker, index) => (
            <Marker
              key={`${marker.lat}-${marker.lng}-${index}`}
              position={[marker.lat, marker.lng]}
              icon={createNumberedIcon(
                marker.number, 
                marker.isDanger, 
                viewMode === "Old Data View" ? marker.total : null
              )}
              eventHandlers={{
                click: () => setPopupInfo(`Marker ${marker.number}: ${marker.label}`),
              }}
            >
              <Popup>
                {viewMode === "Old Data View" ? (
                  <>
                    <strong>Barangay: {marker.barangay}</strong><br/>
                    Total Cases: {marker.total}<br/>
                    Symptoms: {marker.symptoms}<br/>
                    {marker.year && marker.year !== 'N/A' && <>Year: {marker.year}<br/></>}
                    {marker.age && marker.age !== 'N/A' && <>Age Group: {marker.age}<br/></>}
                    {marker.gender && marker.gender !== 'N/A' && <>Gender: {marker.gender}<br/></>}
                    {marker.created_at && marker.created_at !== 'N/A' && (
                      <>Reported: {new Date(marker.created_at).toLocaleDateString()}</>
                    )}
                  </>
                ) : (
                  <>
                    <strong>Location: {marker.label}</strong><br/>
                    Registrator: {marker.full_name}<br/>
                    Patient: {marker.patient}<br/>
                    Symptoms: {marker.symptoms}<br/>
                    Address: {marker.address}
                  </>
                )}
              </Popup>
            </Marker>
          ))}

          {viewMode === "Individual Reports View" && olddata === "All" && Object.entries(barangayCounts).map(([barangay, data]) => {
            const center = getBarangayCenter(barangay);
            return (
              <Marker
                key={`barangay-total-${barangay}`}
                position={center}
                icon={createNumberedIcon(data.total, false)}
              >
                <Popup>
                  <strong>{barangay}</strong><br/>
                  Total Reports: {data.total}<br/>
                  {Object.entries(data.symptoms).map(([symptom, count]) => (
                    count > 0 && <div key={symptom}>{symptom}: {count}</div>
                  ))}
                </Popup>
              </Marker>
            );
          })}
        </>
      );
    }
  };

  const renderFilters = () => {
    if (viewMode === "Old Data View") {
      return (
        <>
          <select 
            className="drop" 
            value={olddata} 
            onChange={(e) => {
              setOldData(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          >
            {barangays.map(brgy => (
              <option key={brgy.value} value={brgy.value}>{brgy.label}</option>
            ))}
          </select>
          <select 
            className="drop-3" 
            value={oldSymptom} 
            onChange={(e) => {
              setOldSymptom(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          >
            <option value="All">All Symptoms</option>
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
        </>
      );
    } else if (viewMode === "Barangay View") {
      return (
        <>
          <select 
            className="drop" 
            value={barangayFilter} 
            onChange={(e) => {
              setBarangayFilter(e.target.value);
            }}
          >
            {barangays.map(brgy => (
              <option key={brgy.value} value={brgy.value}>{brgy.label}</option>
            ))}
          </select>
          <select 
            className="drop-3" 
            value={symptomFilter} 
            onChange={(e) => {
              setSymptomFilter(e.target.value);
            }}
          >
            {symptoms.map((symp) => (
              <option key={symp.value} value={symp.value}>
                {symp.label}
              </option>
            ))}
          </select>
        </>
      );
    } else {
      return (
        <>
          <select 
            className="drop" 
            value={olddata} 
            onChange={(e) => {
              setOldData(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          >
            {barangays.map(brgy => (
              <option key={brgy.value} value={brgy.value}>{brgy.label}</option>
            ))}
          </select>
          <select 
            className="drop-3" 
            value={symptom} 
            onChange={(e) => {
              setSymptom(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          >
            {Object.entries(allSymptomCounts).map(([key, count]) => (
              <option key={key} value={key}>
                {key} ({count})
              </option>
            ))}
          </select>
        </>
      );
    }
  };

  return (
    <div className="heatmap">
      <div className="filters">
        <select
          className="drop-2"
          value={viewMode}
          onChange={(e) => {
            setViewMode(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
        >
          <option value="Old Data View">Old Data View</option>
          <option value="Individual Reports View">Individual Reports View</option>
          <option value="Barangay View">Barangay View</option>
        </select>

        {renderFilters()}
      </div>

      {alert && (
        <div className="alert-notification">
          <div className="alert-content">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">{alert}</span>
            <button className="alert-close" onClick={() => setAlert(null)}>
              &times;
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <p>Loading {viewMode === "Old Data View" ? "historical" : viewMode === "Barangay View" ? "barangay" : "current"} reports...</p>
        </div>
      ) : (
        <>
          <MapContainer 
            center={
              viewMode === "Barangay View" && barangayFilter && barangayFilter !== "All" && barangayViewData[barangayFilter] 
                ? getBarangayCenter(barangayFilter) 
                : [14.1709, 121.243]
            } 
            zoom={
              viewMode === "Barangay View" && barangayFilter && barangayFilter !== "All" 
                ? 15
                : 13
            } 
            style={{ height: "500px", width: "100%", zIndex: "5" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {renderMapContent()}
          </MapContainer>

          {viewMode !== "Barangay View" && (
            <div className="pagination-controls">
              <button 
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} 
                disabled={pagination.page <= 1}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <button 
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} 
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}

          {viewMode === "Barangay View" && (
            <div className="legend">
              <div className="legend-item">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" alt="Normal" width="20" />
                <span>Normal</span>
              </div>
              <div className="legend-item">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png" alt="Moderate" width="20" />
                <span>Moderate (50%)</span>
              </div>
              <div className="legend-item">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png" alt="Warning" width="20" />
                <span>Warning (75%)</span>
              </div>
              <div className="legend-item">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" alt="Danger" width="20" />
                <span>Danger (100% above)</span>
              </div>
            </div>
          )}
        </>
      )}

      {popupInfo && (
        <div className="popup-info">
          {popupInfo}
          <button onClick={() => setPopupInfo(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Heatmap;