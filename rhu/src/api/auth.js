import { endpoints } from './config';

export const login = async (userData) => {
  const url = `${endpoints.login}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        status: 'error', 
        message: data.message || 'Login failed', 
        needs_verification: data.needs_verification || false 
      };
    }

    if (data.status === 'success') {
      return { 
        status: 'success', 
        message: data.message, 
        user: data.user 
      };
    } else {
      return { 
        status: 'error', 
        message: data.message, 
        needs_verification: data.needs_verification || false 
      };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { 
      status: 'error', 
      message: 'An error occurred during login. Please try again.',
      needs_verification: false 
    };
  }
};

export const register = async (formData) => {
  const url = `${endpoints.register}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData, 
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        status: 'error', 
        message: data.message || 'Registration failed' 
      };
    }

    if (data.status === 'success') {
      return { status: 'success', message: data.message };
    } else {
      return { status: 'error', message: data.message };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { 
      status: 'error', 
      message: 'An error occurred during registration. Please try again.' 
    };
  }
};

export const forgotPassword = async (userData) => {
  const url = `${endpoints.forgotPassword}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.status === 'success') {
      return { status: 'success', message: data.message };
    } else {
      return { status: 'error', message: data.message };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { status: 'error', message: 'An error occurred during registration. Please try again.' };
  }
};

export const resetPassword = async ({userData, token, email}) => {
  const url = `${endpoints.resetPassword}`;

  try {
    const response = await fetch(`${url}?token=${token}&email=${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.status === 'success') {
      return { status: 'success', message: data.message };
    } else {
      return { status: 'error', message: data.message };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { status: 'error', message: 'An error occurred during registration. Please try again.' };
  }
};