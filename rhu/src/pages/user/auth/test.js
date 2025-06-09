import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../../../animations/page-transition';
import Swal from 'sweetalert2';
import GoogleIcon from '../../../assets/img/google.png';
import Logo from '../../../assets/svg/favicon.png';
import { login } from "../../../api/auth";
import '../../../assets/css/user/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verification_code: ""
  });
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return(
    <>
      <PageTransition>
        <div className='user'>
          <div className="main-log">
            <div className="top">
              <div className='app'>
                <div className="logo">
                  <img src={Logo}/>
                </div>
                <div className="app-name">
                  <div>Symp TrackLB</div>
                </div>
              </div>
            </div>
            <form className="bottom" onSubmit={handleSubmit}>
              <div className='under'>
                <div className="form-group">
                  <div className="inputs">
                    <label htmlFor="email">
                      Email<br/>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={needsVerification}
                      />
                    </label><br/>
                    <label htmlFor="password">
                      Password<br/>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={needsVerification}
                      />
                    </label>
                    
                    {needsVerification && (
                      <label htmlFor="verification_code">
                        Verification Code<br/>
                        <input
                          type="text"
                          id="verification_code"
                          name="verification_code"
                          value={formData.verification_code}
                          onChange={handleChange}
                          placeholder="Enter 6-digit code"
                        />
                      </label>
                    )}
                    
                    <button disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Login'}
                    </button>
                    
                    <div className='flex-nav'>
                      <Link to='/auth/user/forgot-password'>Forgot password?</Link>
                      <Link to='/auth/user/register' className='log'>Create account</Link>
                    </div>
                  </div>
                </div>
                <div className="divider">
                  <div className="left-line"></div>
                  <span>or</span>
                  <div className="right-line"></div>
                </div>
                <div className="google-sign">
                  <button>
                    <img src={GoogleIcon}/>
                    Sign in with Google
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </PageTransition>
    </>
  );
}

export default Login;