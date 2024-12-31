export const logout = async (navigate) => {
  const url = 'http://localhost:8080/api/logout';
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