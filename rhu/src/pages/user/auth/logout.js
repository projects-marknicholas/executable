import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('user');

    const timeoutId = setTimeout(() => {
      navigate('/');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return null;
}

export default Logout;
