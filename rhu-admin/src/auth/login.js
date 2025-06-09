import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// CSS
import '../assets/css/auth.css';

// Components
import Swal from 'sweetalert2';

// Assets
import Logo from "../assets/svg/favicon.png";
import Show from "../assets/svg/show.svg";
import Hide from "../assets/svg/hide.svg";
import Google from "../assets/svg/google.svg";

// API
import { login } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      email, 
      password
    } = formData;

    // This object should match the expected structure in your PHP backend
    const result = await login({
      email,
      password
    });

    // Handle response
    if (result.status === 'success') {
      Swal.fire('Success!', result.message, 'success');
      const user = result.user;
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/admin');
    } else {
      Swal.fire('Error!', result.message, 'error');
    }
  };

  // Page title
  useEffect(() => {
    document.title = "Login - RHU";
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
          <h1>Sign in to start your session</h1>

          <div className="form-group">
            <label htmlFor="email">
              <div className="flex-label">
                <p>Email address <span>*</span><br /></p>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
              />
            </label><br />
            <label htmlFor="password">
              <div className="flex-label">
                <p>Password <span>*</span><br /></p>
                <Link to="/auth/forgot-password">Forgot your password?</Link>
              </div>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
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
          </div>

          <div className="sign">
            <button
              className="sign-m"
              type="submit"
            >
              Sign in
            </button>
            <div className="or">or login using your</div>
            <button
              className="sign-g"
              type="button"
            >
              <div><img src={Google} alt="Google" /> Google account</div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
