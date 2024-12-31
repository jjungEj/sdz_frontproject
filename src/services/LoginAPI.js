const apiUrl = import.meta.env.VITE_API_URL;
const endpoint = "/user/loginProcess";

const url = `${apiUrl}${endpoint}`;

export const loginProcess = async (LoginAcount) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(LoginAcount),
      credentials: 'include',
    });

    const authorizationHeader = response.headers.get('Authorization');
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      localStorage.setItem('access', token);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    setErrorMessage(error.message);
    throw error;
  }
};