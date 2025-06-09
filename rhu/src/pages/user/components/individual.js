import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { registerIndividual, fetchRegistersByUserId, updateRegistersByUserId } from "../../../api/data";

const Individual = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    user_id: user.user_id,
    name: user.first_name + " " + user.last_name || "",
    complete_address: "",
  });
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [existingRegisterId, setExistingRegisterId] = useState(null); 

  // Fetch user's existing registration data
  const fetchUserRegisters = async () => {
    try {
      const result = await fetchRegistersByUserId();

      if (result.status === "success" && result.data.length > 0) {
        const latestRegister = result.data[0];
        setFormData((prevState) => ({
          ...prevState,
          name: latestRegister.name || prevState.name,
          complete_address: latestRegister.complete_address || prevState.complete_address,
        }));
        setExistingRegisterId(latestRegister.register_id);
        return true; // Return true if existing data was found
      }
    } catch (error) {
      console.error("Error fetching registers:", error);
    }
    return false; // Return false if no existing data
  };

  // Automatically fetch and set address
  const autoFetchAddress = async () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    setAddressLoading(true);
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      
      if (data?.display_name) {
        setFormData(prev => ({
          ...prev,
          complete_address: data.display_name
        }));
      }
    } catch (error) {
      console.log("Error getting location:", error.message);
      // Don't show error to user since this happens automatically
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const hasExistingData = await fetchUserRegisters();
      if (!hasExistingData && formData.complete_address === "") {
        await autoFetchAddress();
      }
    };
    initializeData();
  }, []);

  const handleSetAddress = async () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: "error",
        title: "Geolocation Not Supported",
        text: "Your browser does not support geolocation.",
      });
      return;
    }

    setLoading(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      
      setLoading(false);
      
      if (data?.display_name) {
        setFormData(prev => ({
          ...prev,
          complete_address: data.display_name
        }));
        Swal.fire({
          icon: "success",
          title: "Address Updated",
          text: "Your address has been updated successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "No Address Found",
          text: "Could not find an address for your location.",
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Location Error",
        text: error.message.includes("denied") 
          ? "Please enable location permissions in your browser settings."
          : "Could not retrieve your location. Please try again.",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.complete_address) {
      Swal.fire({
        icon: "error",
        title: "Address Required",
        text: "Please provide your complete address.",
      });
      return;
    }

    setLoading(true);

    try {
      let result;
      if (existingRegisterId) {
        result = await updateRegistersByUserId({ 
          formData, 
          register_id: existingRegisterId 
        });
      } else {
        result = await registerIndividual(formData);
      }

      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.message,
        });
        await fetchUserRegisters();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="type-selected">
        <label>
          <span>Name</span>
          <div className="selected-flex">
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
        </label>
        <label>
          <span>Complete Address</span>
          <div className="selected-flex">
            <input
              type="text"
              id="complete_address"
              name="complete_address"
              autoComplete="off"
              value={formData.complete_address}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="button"
            onClick={handleSetAddress}
            disabled={loading}
            placeholder={addressLoading ? "Fetching your address..." : ""}
          >
            {loading ? "Fetching Address..." : "Set address automatically"}
          </button>
        </label>
      </div>
      <button
        className="select-type-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </>
  );
};

export default Individual;