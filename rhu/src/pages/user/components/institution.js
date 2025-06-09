import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from "sweetalert2";
import { registerInstitution, fetchRegistersByUserId, updateRegistersByUserId, deleteInstitution } from "../../../api/data";
import DeleteSvg from '../../../assets/svg/delete.svg';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Institution = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [institutions, setInstitutions] = useState([{ id: Date.now(), name: '', complete_address: '' }]);
  const [loading, setLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentInstId, setCurrentInstId] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [mapPosition, setMapPosition] = useState({
    lat: Number(user?.latitude) || 51.505,
    lng: Number(user?.longitude) || -0.09
  });

  useEffect(() => {
    if (showMapModal) {
      const mapInstance = L.map('map').setView([mapPosition.lat, mapPosition.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      const markerInstance = L.marker([mapPosition.lat, mapPosition.lng], {
        draggable: true
      }).addTo(mapInstance);

      markerInstance.on('dragend', function () {
        const pos = markerInstance.getLatLng();
        setMapPosition({ lat: Number(pos.lat), lng: Number(pos.lng) });
      });

      setMap(mapInstance);
      setMarker(markerInstance);

      return () => {
        mapInstance.remove();
      };
    }
  }, [showMapModal]);

  const fetchInstitutions = async () => {
    try {
      const result = await fetchRegistersByUserId(); // Adjust if different endpoint for institutions
      if (result.status === "success" && result.data.length > 0) {
        setInstitutions(result.data.map((item, index) => ({
          id: Date.now() + index,
          name: item.name || '',
          complete_address: item.complete_address || '',
          register_id: item.register_id || null
        })));
      }
    } catch (error) {
      console.error("Error fetching institutions:", error);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const addInstitution = () => {
    setInstitutions([...institutions, { id: Date.now(), name: '', complete_address: '' }]);
  };

  const removeInstitution = (id) => {
    setInstitutions(institutions.filter((inst) => inst.id !== id));
  };

  const handleInputChange = (id, name, value) => {
    setInstitutions(
      institutions.map((inst) =>
        inst.id === id ? { ...inst, [name]: value } : inst
      )
    );
  };

  const fetchAddressFromCoords = async (lat, lng, instId) => {
    try {
      setLoading(true);
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data?.display_name) {
        handleInputChange(instId, "complete_address", data.display_name);
        Swal.fire({ icon: "success", title: "Address Updated", text: "Address set successfully." });
      } else {
        throw new Error("No address found");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Unable to fetch address." });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = (instId) => {
    if (!user?.latitude || !user?.longitude) {
      Swal.fire({ icon: "error", title: "No Default Address", text: "No default coordinates in profile." });
      return;
    }
    fetchAddressFromCoords(Number(user.latitude), Number(user.longitude), instId);
  };

  const handleOpenMapModal = (instId) => {
    setCurrentInstId(instId);
    setShowMapModal(true);
  };

  const handleConfirmLocation = () => {
    fetchAddressFromCoords(mapPosition.lat, mapPosition.lng, currentInstId);
    setShowMapModal(false);
  };

  const handleInsertOrUpdate = async (inst) => {
    setLoading(true);
    try {
      const payload = {
        user_id: user.user_id,
        name: inst.name,
        complete_address: inst.complete_address
      };
      let result;
      if (inst.register_id) {
        result = await updateRegistersByUserId({ formData: payload, register_id: inst.register_id });
      } else {
        result = await registerInstitution(payload);
      }
      if (result.status !== "success") throw new Error(result.message);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: inst.register_id ? "Institution updated." : "Institution registered.",
      });
      fetchInstitutions();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (register_id) => {
    setLoading(true);
    try {
      const result = await deleteInstitution(register_id);
      if (result.status === "success") {
        Swal.fire({ icon: "success", title: "Deleted", text: "Institution deleted." });
        fetchInstitutions();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='adding'>
        <button className='add-btn' onClick={addInstitution} disabled={loading}>+ Add Institution</button>
      </div>

      <AnimatePresence>
        {institutions.map((inst) => (
          <motion.div
            className='type-selected'
            key={inst.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <label>
              <span>Name</span>
              <input
                type='text'
                name='name'
                value={inst.name}
                onChange={(e) => handleInputChange(inst.id, "name", e.target.value)}
              />
            </label>
            <label>
              <span>Complete Address</span>
              <div className='selected-flex'>
                <input
                  type='text'
                  name='complete_address'
                  value={inst.complete_address}
                  onChange={(e) => handleInputChange(inst.id, "complete_address", e.target.value)}
                />
                {inst.register_id && (
                  <button className='del-btn' onClick={() => handleDelete(inst.register_id)} disabled={loading}>
                    <img src={DeleteSvg} alt='Delete' />
                  </button>
                )}
              </div>
              <div className="address-buttons">
                <button className='address-btn' onClick={() => handleSetDefaultAddress(inst.id)} disabled={loading}>
                  Set Default Address
                </button>
              </div><br/>
              <div className="address-buttons">
                <button className='address-btn' onClick={() => handleOpenMapModal(inst.id)} disabled={loading}>
                  Set Custom Location
                </button>
              </div>
            </label>
            <br/>
            <button className='update-btn' onClick={() => handleInsertOrUpdate(inst)} disabled={loading}>
              {loading ? "Processing..." : inst.register_id ? "Update Changes" : "Insert"}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Map Modal */}
      {showMapModal && (
        <div className="map-modal">
          <div className="map-modal-content">
            <h3>Set Custom Location</h3>
            <p>Drag the marker to your desired location</p>
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
            <div className="map-coordinates">
              Latitude: {typeof mapPosition.lat === 'number' ? mapPosition.lat.toFixed(6) : 'N/A'}, 
              Longitude: {typeof mapPosition.lng === 'number' ? mapPosition.lng.toFixed(6) : 'N/A'}
            </div>
            <div className="map-modal-actions">
              <button className="cancel-btn" onClick={() => setShowMapModal(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleConfirmLocation}>Confirm Location</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Institution;
