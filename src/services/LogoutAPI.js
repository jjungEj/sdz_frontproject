import { useNavigate } from 'react-router-dom';

export const logout = (navigate) => {
  const url = 'http://localhost:8080/api/logout';
  const navigate = useNavigate();
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    })
    .then((response) => {
        if (!response.ok) {
          return response.json().then(errorData => {
              throw new Error(errorData.message);
          });
        }
        return navigate('/');
    })
    .catch((error) => {
        console.error('로그아웃에 실패하였습니다.:', error.message);
        throw error;
    })
    .finally(() => {
        localStorage.removeItem('access');
    })
};