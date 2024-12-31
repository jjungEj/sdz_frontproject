const url = 'http://localhost:8080/api/admin';

const fetchWithAuth = async (endpoint, method) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    };

    const options = { method, headers };

    const response = await fetch(`${url}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    throw error;
  }
};

export const getUserList = async (page, size, type, keyword) => {
  const queryParams = `?page=${page}&size=${size}&type=${type}&keyword=${keyword}`;
  try {
    const response = await fetch(`${url}/user-management${queryParams}`, {
      method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
} catch (error) {
  throw error;
}
};

export const updateLoginLock = (email) => {
  return fetchWithAuth(`/${email}/login-lock`, 'PUT');
};

export const updateAuth = (email) => {
  return fetchWithAuth(`/${email}/auth`, 'PUT');
};

export const deleteUser = (email) => {
  return fetchWithAuth(`/${email}`, 'DELETE');
};

export const deleteUsers = async (emails) => {
  try {
    const response = await fetch(`${url}/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify(emails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    throw error;
  }
};