const url = 'http://localhost:8080/api/user';

const fetchData = async (endpoint, method, payload) => {
  try {
    const response = await fetch(`${url}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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

export const signUpProcess = async (newAccount) => {
  return fetchData('/sign-up', 'POST', newAccount);
};

export const UserInfo = async () => {
  try {
    const response = await fetch(`${url}/my-page`, {
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

export const updateLocal = async (userData) => {
  return fetchData(`/local/${userData.email}`, 'PUT', userData);
};

export const updateSocial = async (userData) => {
  return fetchData(`/social/${userData.email}`, 'PUT', userData);
};

export const deleteUser = async (email) => {
  try {
    const response = await fetch(`${url}/${email}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    throw error;
  } finally {
    localStorage.removeItem('access');
  }
};