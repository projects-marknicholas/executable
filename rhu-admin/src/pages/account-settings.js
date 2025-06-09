import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

// Components
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";

// CSS
import "../assets/css/account-settings.css";

const AccountSettings = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    setUser({
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      email: userData.email || "",
      role: userData.role || "",
    });
  }, []);

  // Update document title
  useEffect(() => {
    document.title = "Account Settings - RHU";
  }, []);

  // Handle update button click
  const handleUpdate = (e) => {
    e.preventDefault(); 
    Swal.fire({
      icon: "info", 
      title: "Update Prohibited", 
      text: "Updating your profile information is prohibited.", 
      confirmButtonText: "OK", 
      confirmButtonColor: "#3085d6", 
    });
  };

  return (
    <>
      <div className="main-section">
        <Sidebar active="account-settings" />

        <div className="setup-sect">
          <Navbar />

          <div className="setup-header">Account Settings</div>

          <form className="account-settings">
            <div className="as-grid">
              <div className="item">
                <span>First Name</span>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={user.first_name}
                  readOnly
                />
              </div>
              <div className="item">
                <span>Last Name</span>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={user.last_name}
                  readOnly
                />
              </div>
              <div className="item">
                <span>Email Address</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  readOnly
                />
              </div>
              <div className="item">
                <span>Role</span>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={user.role}
                  disabled
                />
              </div>
            </div>
            <button onClick={handleUpdate}>Save Changes</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;