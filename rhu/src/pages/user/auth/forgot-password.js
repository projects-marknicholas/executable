import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../../../assets/svg/favicon.png';

// Components
import PageTransition from '../../../animations/page-transition';

// Assets
// import logo from '../../../assets/images/logo.png';

// CSS
import '../../../assets/css/user/auth.css';

import { forgotPassword } from '../../../api/auth';

const UserForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Forgot Password - RHU Disease Monitoring';
  }, []);

  const handleForgotPassword = async () => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter your email',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      if (response.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message,
        }).then(() => {
          setEmail(''); 
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message || 'Something went wrong',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send verification code',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className='user'>
        <div className="main-log">
          <div className="top">
            <div className='app'>
              <div className="logo">
                <img src={Logo} alt="App Logo" />
              </div>
              <div className="app-name">
                <div>Symp TrackLB</div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className='under'>
              <div className="form-group">
                <div className="inputs">
                  <label htmlFor="email">
                    Email<br/>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                  <button onClick={handleForgotPassword} disabled={loading}>
                    {loading ? 'Sending...' : 'Send verification code'}
                  </button>
                  <div className='flex-nav'>
                    <Link to='/auth/user/login' className='log'>Remember your password?</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserForgotPassword;
