import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Components
import PageTransition from '../../../animations/page-transition';
import UserGender from './gender';

// CSS
import '../../../assets/css/user/settings.css';

// API
import { updateAccount } from '../../../api/data';

const UserSettings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || ''
  });

  const [loading, setLoading] = useState(false);

  const handleReturn = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.first_name || !formData.last_name) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'First name and last name are required!',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await updateAccount(formData, user?.user_id); 

      if (response.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been successfully updated.',
        });

        // Update user data in localStorage except for email
        localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: response.message || 'Failed to update profile.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
      });
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/auth/logout');
  }

  const handleGender = () => {
    navigate('/gender', { state: { isEdit: true } }); 
  };

  return (
    <>
      <PageTransition>
        <div className='settings'>
          <div className='set'>
            <div className='set-bg' onClick={handleReturn}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#0339A8" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
            </div>
            <div>
              <h1>Account Settings</h1>
              <p>Manage your account settings preferences</p>
            </div>
          </div>

          <div className='setup'>
            <div className='head'>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M11.5 15H7a4 4 0 0 0-4 4v2"/>
                <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
                <circle cx="10" cy="7" r="4"/>
              </svg>
              <span>Profile</span>
            </div>

            <div className='input-2'>
              <div className='item'>
                <label htmlFor='first_name'>
                  <span>First Name</span>
                  <input
                    type='text'
                    name='first_name'
                    id='first_name'
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className='item'>
                <label htmlFor='last_name'>
                  <span>Last Name</span>
                  <input
                    type='text'
                    name='last_name'
                    id='last_name'
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            <div className='input-1'>
              <div className='item'>
                <label htmlFor='email'>
                  <span>Email Address</span>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    value={user?.email}
                    disabled 
                  />
                </label>
              </div>
              <div className='item'>
                <label htmlFor='gender'>
                  <span>Gender</span>
                  <input
                    type='text'
                    name='gender'
                    id='gender'
                    value={user?.gender}
                    disabled 
                  />
                </label>
              </div>
            </div>

            <button onClick={handleUpdate} disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            <button onClick={handleGender}>
              Update Gender
            </button>
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default UserSettings;
