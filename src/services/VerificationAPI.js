const apiUrl = import.meta.env.VITE_API_URL;
const endpoint = "/check";

const url = `${apiUrl}${endpoint}`;

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
    console.error(`${endpoint} 요청 실패:`, error.message);
    throw error;
  }
};

export const checkEmailExists = (email) => {
  const payload = { email };
  return fetchData('/email', 'POST', payload);
};

export const checkNickname = (userData) => {
  return fetchData('/nickname', 'POST', userData);
};

export const checkAccountLimit = (userName, contact) => {
  const payload = { userName, contact };
  return fetchData('/userLimit', 'POST', payload);
};

export const validateEmailExists = (account) => {
  return fetchData('/userInfo', 'POST', account);
};

export const checkPassword = (email, userPassword) => {
  const payload = { email, userPassword };
  return fetchData('/password', 'POST', payload);
};