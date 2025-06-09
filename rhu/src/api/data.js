import { endpoints } from './config';

export const reportSymptoms = async (formData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.api_key : null;
  const userId = user ? user.user_id : null;
  const url = `${endpoints.reportSymptoms}?uid=${userId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // Send FormData directly
    });

    const data = await response.json();

    if (data.status === 'success') {
      return { status: 'success', message: data.message };
    } else {
      return { status: 'error', message: data.message };
    }
  } catch (error) {
    console.error('Error during submission:', error);
    return { status: 'error', message: 'An error occurred during submission. Please try again.' };
  }
};

export const user_symptoms = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.api_key : null;
  const userId = user ? user.user_id : null;
  
  if (!userId) {
    return { status: 'error', message: 'User ID not found in local storage' };
  }

  const url = `${endpoints.userSymptoms}?uid=${userId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status === 'success') {
      return { 
        status: 'success', 
        data: data.data || [],
        message: data.message || 'Symptoms retrieved successfully' 
      };
    } else {
      return { status: 'error', message: data.message || 'Failed to retrieve symptoms' };
    }
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while fetching symptoms. Please try again.' 
    };
  }
};

export const getSymptoms = async (page = '1', limit = '50', searchQuery = '') => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(searchQuery && { search: searchQuery }),
  });

  const url = `${endpoints.getSymptoms}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { 
        status: 'success', 
        data: data.data || [], 
        total_pages: data.total_pages || 1, 
        total_records: data.total_records || 0 
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch data', 
        data: [], 
        total_pages: 1, 
        total_records: 0 
      };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while fetching data. Please try again later.', 
      data: [], 
      total_pages: 1, 
      total_records: 0 
    };
  }
};

export const updateGender = async (formData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.api_key : null;
  const userId = user ? user.user_id : null;
  const url = `${endpoints.updateGender}?uid=${userId}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(formData), 
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return { status: 'success', message: data.message };
  } catch (error) {
    console.error('Error during updating data:', error);
    return { status: 'error', message: 'An error occurred while updating the data. Please try again.' };
  }
};

export const registerIndividual = async (formData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.api_key : null;
  const userId = user ? user.user_id : null;
  const url = `${endpoints.registerIndividual}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(formData), 
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return { status: 'success', message: data.message };
  } catch (error) {
    console.error('Error during inserting data:', error);
    return { status: 'error', message: 'An error occurred while inserting the data. Please try again.' };
  }
};

export const registerFamily = async (formData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.api_key : null;
  const userId = user ? user.user_id : null;
  const url = `${endpoints.registerFamily}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData), 
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return { status: 'success', message: data.message };
  } catch (error) {
    console.error('Error during inserting data:', error);
    return { status: 'error', message: 'An error occurred while inserting the data. Please try again.' };
  }
};

export const registerInstitution = async (formData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.api_key : null;
  const userId = user ? user.user_id : null;
  const url = `${endpoints.registerInstitution}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData), 
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return { status: 'success', message: data.message };
  } catch (error) {
    console.error('Error during inserting data:', error);
    return { status: 'error', message: 'An error occurred while inserting the data. Please try again.' };
  }
};

export const updateRegistersByUserId = async ({ formData, register_id }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.api_key : null;
  const url = `${endpoints.registers}?register_id=${register_id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(formData), 
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return { status: 'success', message: data.message };
  } catch (error) {
    console.error('Error during updating data:', error);
    return { status: 'error', message: 'An error occurred while updating the data. Please try again.' };
  }
};

export const deleteFamily = async (register_id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return { status: 'error', message: 'User not found. Please log in again.' };
  }

  const token = user.api_key;
  const url = `${endpoints.registerFamily}?register_id=${register_id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return { status: 'success', message: data.message };
  } catch (error) {
    console.error('Error during deleting data:', error);
    return { status: 'error', message: 'An error occurred while deleting the data. Please try again.' };
  }
};

export const deleteInstitution = async (register_id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return { status: 'error', message: 'User not found. Please log in again.' };
  }

  const token = user.api_key;
  const url = `${endpoints.registerInstitution}?register_id=${register_id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return { status: 'success', message: data.message };
  } catch (error) {
    console.error('Error during deleting data:', error);
    return { status: 'error', message: 'An error occurred while deleting the data. Please try again.' };
  }
};

export const fetchRegistersByUserId = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.api_key : null;
  const userId = user ? user.user_id : null;
  const url = `${endpoints.registers}?user_id=${userId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { status: "success", data: data.data }; 
    } else {
      return { status: "error", message: data.message || "Failed to fetch registers" };
    }
  } catch (error) {
    return { status: "error", message: "An error occurred while fetching the data. Please try again." };
  }
};

export const updateAccount = async (formData, user_id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.api_key : null;
  const url = `${endpoints.updateAccount}?uid=${user_id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(formData), 
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return { status: 'success', message: data.message };
  } catch (error) {
    console.error('Error during updating data:', error);
    return { status: 'error', message: 'An error occurred while updating the data. Please try again.' };
  }
};

export const updateCategory = async (user_id, category) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return { status: "error", message: "User not found" };

  const token = user.api_key;
  const url = `${endpoints.updateCategory}?uid=${user_id}&category=${category}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();
    if (data.status === "error") throw new Error(data.message);

    // Update local storage with new category
    const updatedUser = { ...user, user: { ...user.user, category } };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return { status: "success", message: data.message, user: updatedUser };
  } catch (error) {
    console.error("Error updating category:", error);
    return { status: "error", message: "Failed to update category. Try again." };
  }
};