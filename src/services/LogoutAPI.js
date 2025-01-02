const apiUrl = import.meta.env.VITE_API_URL;
const endpoint = "/logout";

const url = `${apiUrl}${endpoint}`;

export const logout = async (navigate) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    navigate('/');
  } catch (error) {
    console.error('로그아웃에 실패하였습니다.:', error.message);
    throw error;
  } finally {
    localStorage.removeItem('access');
  }
};