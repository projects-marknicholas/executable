import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Components
import PageTransition from '../../../animations/page-transition';
import { getGreeting } from '../components/greetings';
import { Week } from '../components/week';
import { Tabs } from '../components/tabs';

// Assets
import LocationSvg from '../../../assets/svg/location.svg';
import SettingsSvg from '../../../assets/svg/settings.svg';

// CSS
import "../../../assets/css/user/default.css";

const UserHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const lat = user?.latitude;
  const lon = user?.longitude;

  const [address, setAddress] = useState('Fetching address...');
  
  // Get current month name
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  useEffect(() => {
    if (lat && lon) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
          setAddress(data.display_name || 'Address not found');
        })
        .catch(error => {
          console.error('Error fetching address:', error);
          setAddress('Failed to fetch address');
        });
    }
  }, [lat, lon]);

  return (
    <>
      <PageTransition>
        <div className='user'>
          <div className='home-main'>
            <nav>
              <div className='left'>
                <div className='profile-info'>
                  <h3>{getGreeting()}, {user?.first_name}!</h3>
                  <div className='address'>
                    <img src={LocationSvg} alt="Location Icon" />
                    {address}
                  </div>
                </div>
              </div>
              <div className='right'>
                <Link to="/settings" className='mode'>
                  <img src={SettingsSvg} alt="Settings Icon" />
                </Link>
              </div>
            </nav>

            <div className='home-section'>
              <div className='greetings'>
                <h1>Today is {currentMonth}</h1>
              </div>
              {Week()}
              {Tabs()}
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}

export default UserHome;