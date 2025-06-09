import React, { useState, useEffect } from "react";

// Router
import { Link, useNavigate } from "react-router-dom";

// Components
import Swal from 'sweetalert2';

// Assets
import Logo from "../assets/svg/favicon.png";
import Show from "../assets/svg/show.svg";
import Hide from "../assets/svg/hide.svg";

// API
import { register } from "../api/auth";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send form data as JSON
    const { 
      first_name, 
      last_name, 
      email, 
      password, 
      confirm_password 
    } = formData;

    // This object should match the expected structure in your PHP backend
    const result = await register({
      first_name,
      last_name,
      email,
      password,
      confirm_password,
    });

    // Handle response
    if (result.status === 'success') {
      Swal.fire('Success!', result.message, 'success');
      navigate('/');
    } else {
      Swal.fire('Error!', result.message, 'error');
    }
  };

  // Page title
  useEffect(() => {
    document.title = 'Register - RHU';
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth">
      <form className="log-form" onSubmit={handleSubmit}>
        <div className="header">
          <Link to="/" className="auth">
            <img src={Logo} alt="Logo" />
          </Link>
          <h1>Sign up</h1>
          <p>
            or <Link to="/">sign in to your account</Link>
          </p>

          <div className="form-group">
            <label htmlFor="first_name">
              <div className="flex-label">
                <p>First name <span>*</span></p>
              </div>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                autoComplete="off"
              />
            </label>
            <br />
            <label htmlFor="last_name">
              <div className="flex-label">
                <p>Last name <span>*</span></p>
              </div>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                autoComplete="off"
              />
            </label>
            <br />
            <label htmlFor="email">
              <div className="flex-label">
                <p>Email address <span>*</span></p>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
              />
            </label>
            <br />
            <label htmlFor="password">
              <div className="flex-label">
                <p>Password <span>*</span></p>
                <span>Password must be at least 8 characters.</span>
              </div>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? Hide : Show}
                    alt="Show/Hide"
                    className="show-hide"
                  />
                </button>
              </div>
            </label>
            <label htmlFor="confirm_password">
              <div className="flex-label">
                <p>Confirm Password <span>*</span></p>
              </div>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? Hide : Show}
                    alt="Show/Hide"
                    className="show-hide"
                  />
                </button>
              </div>
            </label>
          </div>

          <div className="sign">
            <button
              className="sign-m"
              type="submit"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
