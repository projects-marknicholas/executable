import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// CSS
import '../../../assets/css/user/test.css';

// Components
import Swal from 'sweetalert2';

// Assets
import Logo from "../../../assets/svg/favicon.png";
import EmailSvg from "../../../assets/svg/email.svg";
import PasswordSvg from "../../../assets/svg/password.svg";
import Show from "../../../assets/svg/show.svg";
import Hide from "../../../assets/svg/hide.svg";

// API
import { login } from "../../../api/auth";

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verification_code: ""
  });
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Login - RHU Disease Monitoring';
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { email, password, verification_code } = formData;

    const result = await login({
      email,
      password,
      verification_code: needsVerification ? verification_code : ''
    });

    if (result.status === 'success') {
      const user = result.user;
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/category');
    } else {
      if (result.needs_verification) {
        setNeedsVerification(true);
      }
      Swal.fire('Error!', result.message, 'error');
    }
    setIsLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="login-form-profile">
            <span>
              <img src={Logo} alt="Logo"/>
            </span>
            <h3>Sign in to RHU</h3>
          </div>
          <div className="input-form-group">
            <label htmlFor="email">
              <span>Email *</span><br/>
              <div className="input-flex-group">
                <img src={EmailSvg} alt="Email"/>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="account@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={needsVerification}
                  required
                />
              </div>
            </label><br/>
            <label htmlFor="password">
              <span>Password *</span><br/>
              <div className="input-flex-group">
                <img src={PasswordSvg} alt="Password"/>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="●●●●●●●●●●"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={needsVerification}
                  required
                />
                <img 
                  src={showPassword ? Hide : Show} 
                  alt={showPassword ? "Hide Password" : "Show Password"} 
                  onClick={toggleShowPassword}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </label>
            
            {needsVerification && (
              <label htmlFor="verification_code">
                <span>Verification Code *</span><br/>
                <div className="input-flex-group">
                  <img src={PasswordSvg} alt="Verification Code"/>
                  <input
                    type="text"
                    name="verification_code"
                    id="verification_code"
                    placeholder="Enter 6-digit code"
                    value={formData.verification_code}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>
            )}
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Login'}
            </button>
            
            <div className="login-links">
              <Link to='/auth/user/forgot-password'>Forgot password?</Link>
              <Link to='/auth/user/register'>Create an account</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserLogin;
