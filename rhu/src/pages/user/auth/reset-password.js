import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { resetPassword } from '../../../api/auth';

// Components
import PageTransition from '../../../animations/page-transition';

// CSS
import '../../../assets/css/user/auth.css';

const UserResetPassword = () => {
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and email from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  useEffect(() => {
    document.title = 'Reset Password - RHU Disease Monitoring';
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const response = await resetPassword({
      userData: { new_password: formData.new_password, confirm_password: formData.confirm_password },
      token,
      email
    });

    setLoading(false);

    if (response.status === 'success') {
      Swal.fire({
        title: 'Success!',
        text: response.message,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/auth/user/login');
      });
    } else {
      Swal.fire('Error', response.message, 'error');
    }
  };

  return (
    <PageTransition>
      <div className='user'>
        <div className="main-log">
          <div className="top">
            <div className='app'>
              <div className="logo">
                <img src="/path-to-logo.png" alt="App Logo" />
              </div>
              <div className="app-name">
                <div>Symp TrackLB</div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className='under'>
              <form className="form-group" onSubmit={handleSubmit}>
                <div className="inputs">
                  <label htmlFor="new_password">
                    New Password<br/>
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                    />
                  </label><br/>
                  <label htmlFor="confirm_password">
                    Confirm Password<br/>
                    <input
                      type="password"
                      id="confirm_password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                    />
                  </label>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Reset Password'}
                  </button>
                  <div className='flex-nav'>
                    <Link to='/auth/user/login' className='log'>Already have an account?</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserResetPassword;
