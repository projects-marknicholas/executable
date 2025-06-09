import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from "sweetalert2";
import { registerFamily, fetchRegistersByUserId, updateRegistersByUserId, deleteFamily } from "../../../api/data";
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

const Family = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [members, setMembers] = useState([{ id: Date.now(), name: '', complete_address: '' }]);
  const [loading, setLoading] = useState(false);
  const [existingRegisterId, setExistingRegisterId] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [mapPosition, setMapPosition] = useState({
    lat: Number(user?.latitude) || 51.505,  // Ensure number type
    lng: Number(user?.longitude) || -0.09   // Ensure number type
  });

  useEffect(() => {
    if (showMapModal) {
      const mapInstance = L.map('map').setView([mapPosition.lat, mapPosition.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance);

      const markerInstance = L.marker([mapPosition.lat, mapPosition.lng], {
        draggable: true
      }).addTo(mapInstance);

      markerInstance.on('dragend', function(event) {
        const position = markerInstance.getLatLng();
        setMapPosition({
          lat: Number(position.lat),
          lng: Number(position.lng)
        });
      });

      setMap(mapInstance);
      setMarker(markerInstance);

      return () => {
        mapInstance.remove();
      };
    }
  }, [showMapModal]);

  const fetchUserRegisters = async () => {
    try {
      const result = await fetchRegistersByUserId();
      if (result.status === "success" && result.data.length > 0) {
        setMembers(
          result.data.map((item, index) => ({
            id: Date.now() + index,
            name: item.name || '',
            complete_address: item.complete_address || '',
            register_id: item.register_id || null
          }))
        );
        setExistingRegisterId(result.data[0].register_id);
      }
    } catch (error) {
      console.error("Error fetching registers:", error);
    }
  };

  useEffect(() => {
    fetchUserRegisters();
  }, []);

  const addMember = () => {
    setMembers([...members, { id: Date.now(), name: '', complete_address: '', register_id: null }]);
  };

  const removeMember = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleInputChange = (id, name, value) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, [name]: value } : member
      )
    );
  };

  const fetchAddressFromCoords = async (lat, lng, memberId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        handleInputChange(memberId, "complete_address", data.display_name);
        Swal.fire({
          icon: "success",
          title: "Address Updated",
          text: "The address has been updated successfully.",
        });
      } else {
        throw new Error("No address data found");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not fetch address for these coordinates.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = (memberId) => {
    if (!user?.latitude || !user?.longitude) {
      Swal.fire({
        icon: "error",
        title: "No Default Address",
        text: "No default coordinates found in your profile.",
      });
      return;
    }
    
    fetchAddressFromCoords(
      Number(user.latitude), 
      Number(user.longitude), 
      memberId
    );
  };

  const handleOpenMapModal = (memberId) => {
    setCurrentMemberId(memberId);
    setShowMapModal(true);
  };

  const handleConfirmLocation = () => {
    fetchAddressFromCoords(mapPosition.lat, mapPosition.lng, currentMemberId);
    setShowMapModal(false);
  };

  const handleInsertOrUpdate = async (member) => {
    setLoading(true);
    try {
      const payload = {
        user_id: user.user_id,
        name: member.name,
        complete_address: member.complete_address,
      };

      let result;
      if (member.register_id) {
        result = await updateRegistersByUserId({
          formData: payload,
          register_id: member.register_id,
        });
      } else {
        result = await registerFamily(payload);
      }

      if (result.status !== "success") {
        throw new Error(result.message);
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: member.register_id ? "Family member updated successfully." : "Family member added successfully.",
      });

      fetchUserRegisters();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "An error occurred while submitting the form. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (register_id) => {
    setLoading(true);
    try {
      const result = await deleteFamily(register_id);
      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Family member deleted successfully.",
        });
        fetchUserRegisters();  
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "An error occurred while deleting the member. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='adding'>
        <button className='add-btn' onClick={addMember} disabled={loading}>
          + Add a Family Member
        </button>
      </div>

      <AnimatePresence>
        {members.map((member) => (
          <React.Fragment key={member.id}>
            <motion.div
              className='type-selected'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <label>
                <span>Name</span>
                <input
                  type='text'
                  id={`name-${member.id}`}
                  name='name'
                  placeholder='Full Name'
                  autoComplete='off'
                  value={member.name}
                  onChange={(e) => handleInputChange(member.id, "name", e.target.value)}
                />
              </label>
              <label>
                <span>Complete Address</span>
                <div className='selected-flex'>
                  <input
                    type='text'
                    id={`address-${member.id}`}
                    name='complete_address'
                    placeholder='Complete Address'
                    autoComplete='off'
                    value={member.complete_address}
                    onChange={(e) => handleInputChange(member.id, "complete_address", e.target.value)}
                  />
                  {member.register_id && (
                    <button
                      className='del-btn'
                      onClick={() => handleDeleteMember(member.register_id)}
                      disabled={loading}
                    >
                      <img src={DeleteSvg} alt='Delete' />
                    </button>
                  )}
                </div>
                <div className="address-buttons">
                  <button
                    type='button'
                    className='address-btn'
                    onClick={() => handleSetDefaultAddress(member.id)}
                    disabled={loading}
                  >
                    Set Default Address
                  </button>
                </div><br/>
                <div className="address-buttons">
                  <button
                    type='button'
                    className='address-btn'
                    onClick={() => handleOpenMapModal(member.id)}
                    disabled={loading}
                  >
                    Set Custom Location
                  </button>
                </div>
              </label>
              <br/>
              <button
                className='update-btn'
                onClick={() => handleInsertOrUpdate(member)}
                disabled={loading}
              >
                {loading ? "Processing..." : member.register_id ? "Update Changes" : "Insert"}
              </button>
            </motion.div>
          </React.Fragment>
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

export default Family;