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

    if (data.status === 'success') {
      return { status: 'success', message: data.message, user: data.user };
    } else {
      return { status: 'error', message: data.message };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { status: 'error', message: 'An error occurred during registration. Please try again.' };
  }
};

export const register = async (userData) => {
  const url = `${endpoints.register}`;

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