import { endpoints } from './config';

export const getReports = async (params = {}) => {
  const { 
    symptom = '', 
    barangay = '', 
    page = '1', 
    limit = '50', 
    searchQuery = '', 
    threshold = '' 
  } = params;

  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return { 
      status: 'error', 
      message: 'API key not found. Please log in.', 
      data: [], 
      total_pages: 1, 
      total_records: 0 
    };
  }

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(barangay && { barangay }),
    ...(symptom && { symptom }),
  });

  const url = `${endpoints.getReports}?${queryParams.toString()}`;

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
        data: data.reports || [], 
        total_pages: data.total_pages || 1, 
        total_records: data.total_records || 0,
        monthly_count: data.monthly_count || 0, // Add monthly count from response
        alerts: data.alerts || [] // Add alerts from response
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch reports', 
        data: [], 
        total_pages: 1, 
        total_records: 0 
      };
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while fetching reports. Please try again later.', 
      data: [], 
      total_pages: 1, 
      total_records: 0 
    };
  }
};

export const updateReport = async (symptoms_id, problem = null) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return {
      status: 'error',
      message: 'API key not found. Please log in.',
    };
  }

  const url = endpoints.updateReport; 

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify([{ 
        symptoms_id,
        ...(problem !== null && { problem }),
      }]),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        status: 'success',
        message: data.message || 'Report updated successfully.',
        data: data,
      };
    } else {
      return {
        status: 'error',
        message: data.message || 'Failed to update report.',
      };
    }
  } catch (error) {
    console.error('Error updating report:', error);
    return {
      status: 'error',
      message: 'An error occurred while updating the report. Please try again later.',
    };
  }
};

export const getOldReports = async (params = {}) => {
  const { 
    barangay = '',
    symptom = '',
    page = '1', 
    limit = '5000'
  } = params;

  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return { 
      status: 'error', 
      message: 'API key not found. Please log in.', 
      data: [], 
      pagination: {
        total_records: 0,
        total_pages: 1,
        current_page: 1,
        per_page: 50
      }
    };
  }

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(barangay && { barangay }),
    ...(symptom && { symptom }),
  });

  const url = `${endpoints.getOldReports}?${queryParams.toString()}`;

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
        pagination: data.pagination || {
          total_records: 0,
          total_pages: 1,
          current_page: parseInt(page),
          per_page: parseInt(limit)
        }
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch reports', 
        data: [], 
        pagination: {
          total_records: 0,
          total_pages: 1,
          current_page: parseInt(page),
          per_page: parseInt(limit)
        }
      };
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while fetching reports. Please try again later.', 
      data: [], 
      pagination: {
        total_records: 0,
        total_pages: 1,
        current_page: parseInt(page),
        per_page: parseInt(limit)
      }
    };
  }
};

export const getBarangayReports = async (params = {}) => {
  const {
    symptom = '',
    barangay = '',
    page = '1',
    limit = '50'
  } = params;

  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return {
      status: 'error',
      message: 'API key not found. Please log in.',
      reports: [],
      total_pages: 1,
      total_records: 0,
      symptom_thresholds: [],
      barangay_counts: {}
    };
  }

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(barangay && { barangay }),
    ...(symptom && { symptom })
  });

  const url = `${endpoints.getBarangayReports}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      return {
        status: 'success',
        reports: data.reports || [],
        total_pages: data.total_pages || 1,
        total_records: data.total_records || 0,
        current_page: data.current_page || parseInt(page),
        symptom_thresholds: data.symptom_thresholds || [],
        barangay_counts: data.barangay_counts || {}
      };
    } else {
      return {
        status: 'error',
        message: data.message || 'Failed to fetch barangay reports',
        reports: [],
        total_pages: 1,
        total_records: 0,
        symptom_thresholds: [],
        barangay_counts: {}
      };
    }
  } catch (error) {
    console.error('Error fetching barangay reports:', error);
    return {
      status: 'error',
      message: 'An error occurred while fetching barangay reports. Please try again later.',
      reports: [],
      total_pages: 1,
      total_records: 0,
      symptom_thresholds: [],
      barangay_counts: {}
    };
  }
};

export const getOldSymptoms = async () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return { 
      status: 'error', 
      message: 'API key not found. Please log in.', 
      symptoms: [] 
    };
  }

  const url = `${endpoints.getOldSymptoms}`;

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
        symptoms: data.symptoms || [] 
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch symptoms', 
        symptoms: [] 
      };
    }
  } catch (error) {
    console.error('Error fetching old symptoms:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while fetching symptoms. Please try again later.', 
      symptoms: [] 
    };
  }
};

export const getHistoricalSymptoms = async (params = {}) => {
  const {
    symptom = ''
  } = params;

  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return {
      status: 'error',
      message: 'API key not found. Please log in.',
      data: {}
    };
  }

  const queryParams = new URLSearchParams();
  if (symptom) queryParams.append('symptom', symptom);

  const url = `${endpoints.getHistoricalSymptoms}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      return {
        status: 'success',
        data: data.data || {},
        message: data.message || ''
      };
    } else {
      return {
        status: 'error',
        message: data.message || 'Failed to fetch historical symptoms data',
        data: {}
      };
    }
  } catch (error) {
    console.error('Error fetching historical symptoms:', error);
    return {
      status: 'error',
      message: 'An error occurred while fetching historical symptoms. Please try again later.',
      data: {}
    };
  }
};

export const getRegisters = async (page = '1', limit = '50', searchQuery = '') => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return { status: 'error', message: 'API key not found. Please log in.' };
  }

  const url = searchQuery ? 
    `${endpoints.getRegisters}?page=${page}&limit${limit}&search=${searchQuery}` : 
    `${endpoints.getRegisters}?page=${page}&limit${limit}`;

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
        data: data.registers || [],
        total_pages: data.total_pages || 1,
        total_records: data.total_records || 0
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch registers'
      };
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: 'An error occurred while fetching registers. Please try again later.', 
    };
  }
};

export const getAccounts = async (page = '1', limit = '50', searchQuery = '') => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return { status: 'error', message: 'API key not found. Please log in.' };
  }

  const url = searchQuery ? 
    `${endpoints.getAccounts}?page=${page}&limit${limit}&search=${searchQuery}` : 
    `${endpoints.getAccounts}?page=${page}&limit${limit}`;

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
        data: data.accounts || [],
        pagination: data.pagination
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch accounts'
      };
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: 'An error occurred while fetching accounts. Please try again later.', 
    };
  }
};

export const updateAccountStatus = async (email, status) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;
  const url = `${endpoints.getAccounts}?email=${email}&status=${status}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    const data = await response.json();

    if (response.ok) {
      return { 
        status: 'success', 
        message: data.message || 'Account status updated successfully.',
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to update account status.',
      };
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: 'An error occurred while updating the account status. Please try again later.', 
    };
  }
};

export const getTotals = async() => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return { status: 'error', message: 'API key not found. Please log in.' };
  }

  const url = `${endpoints.getTotals}`;

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
        data: data.data
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch accounts'
      };
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: 'An error occurred while fetching accounts. Please try again later.', 
    };
  }
};

export const getDashboard = async(start_date, end_date) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return { status: 'error', message: 'API key not found. Please log in.' };
  }

  const url = `${endpoints.getTotals}?start_date=${start_date}&end_date=${end_date}`;

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
        data: data.data
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch accounts'
      };
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: 'An error occurred while fetching accounts. Please try again later.', 
    };
  }
};

export const getThreshold = async(start_date, end_date) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  if (!apiKey) {
    return { status: 'error', message: 'API key not found. Please log in.' };
  }

  const url = `${endpoints.getThreshold}?start_date=${start_date}&end_date=${end_date}`;

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
        data: data.data
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch accounts'
      };
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: 'An error occurred while fetching accounts. Please try again later.', 
    };
  }
};

export const insertSymptom = async (formData) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;
  const url = `${endpoints.postSymptom}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(formData) 
    });

    const data = await response.json();

    if (response.ok) {
      return { 
        status: 'success', 
        message: data.message || 'Symptom added successfully.',
        data: data 
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || data.error || 'Failed to add symptom.',
        errors: data.errors 
      };
    }
  } catch (error) {
    console.error('Error adding symptom:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while adding the symptom. Please try again later.',
      error: error.message 
    };
  }
};

export const updateSymptom = async (formData) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;
  const url = `${endpoints.updateSymptom}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(formData) 
    });

    const data = await response.json();

    if (response.ok) {
      return { 
        status: 'success', 
        message: data.message || 'Symptom updated successfully.',
        data: data 
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || data.error || 'Failed to update symptom.',
        errors: data.errors 
      };
    }
  } catch (error) {
    console.error('Error updating symptom:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while updating the symptom. Please try again later.',
      error: error.message 
    };
  }
};

export const getSymptom = async (page = '1', limit = '50', searchQuery = '') => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(searchQuery && { search: searchQuery }),
  });

  const url = `${endpoints.getSymptom}?${queryParams.toString()}`;

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

export const deleteSymptom = async (symptomId) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;
  const url = `${endpoints.deleteSymptom}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ symptom_list_id: symptomId })
    });

    const data = await response.json();

    if (response.ok) {
      return { 
        status: 'success', 
        message: data.message || 'Symptom deleted successfully.'
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || data.error || 'Failed to delete symptom.'
      };
    }
  } catch (error) {
    console.error('Error deleting symptom:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while deleting the symptom. Please try again later.',
      error: error.message 
    };
  }
};

export const getOldSymptom = async (page = '1', limit = '50', searchQuery = '') => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(searchQuery && { search: searchQuery }),
  });

  const url = `${endpoints.getOldSymptom}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (data.status = 'success') {
      return { 
        status: 'success', 
        data: data.data || [], 
        pagination: data.pagination
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to fetch data', 
        data: [], 
        pagination: data.pagination
      };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while fetching data. Please try again later.', 
      data: []
    };
  }
};

export const deleteAccount = async (userId) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;
  const url = `${endpoints.deleteAccount}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ user_id: userId })
    });

    const data = await response.json();

    if (response.ok) {
      return { 
        status: 'success', 
        message: data.message || 'Account deleted successfully.'
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || data.error || 'Failed to delete account.'
      };
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while deleting the account. Please try again later.',
      error: error.message 
    };
  }
};

export const updateStatus = async (status) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const apiKey = userData?.api_key;
  const url = `${endpoints.updateStatus}?status=${status}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    const data = await response.json();

    if (response.ok) {
      return { 
        status: 'success', 
        message: data.message || 'Global status updated successfully.',
      };
    } else {
      return { 
        status: 'error', 
        message: data.message || 'Failed to update global status.',
      };
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: 'An error occurred while updating the global status. Please try again later.', 
    };
  }
};

export const getSystemStatus = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    const apiKey = userData?.api_key;
    
    const response = await fetch(endpoints.displayStatus, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    const data = await response.json();

    if (response.ok) {
      return {
        status: 'success',
        systemStatus: data.system_status
      };
    } else {
      return {
        status: 'error',
        message: data.message || 'Failed to fetch system status'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Network error while fetching system status'
    };
  }
};
