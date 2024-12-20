import { jwtDecode } from 'jwt-decode';

export const fetchWithAuth = (url, options = {}) => {
    const token = localStorage.getItem('access');
    if (!isAccessTokenValid(token)) {
        throw new Error('토큰이 유효하지 않습니다. 로그인이 필요합니다.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    return fetch(url, { ...options, headers })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
        return response.json();
    })
    .catch(error => {
        console.error('API 요청에 실패하였습니다.:', error);
        throw error;
    });
};

export const getUserEmail = () => {
    const token = localStorage.getItem('access');
    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.email;
    } catch (error) {
        console.error('이메일을 가져오는데 실패하였습니다.:', error);
        return null;
    }
};

export const getUserRole = () => {
  const token = localStorage.getItem('access');
  if (!token) return null;

  try {
      const decodedToken = jwtDecode(token);
      return decodedToken.role;
  } catch (error) {
      console.error('권한을 가져오는데 실패하였습니다.:', error);
      return null;
  }
};

export function assignRole(isUser, token) {
  if (isUser && token) {
    const decodedToken = jwtDecode(token);
    return {
      email: decodedToken.email,
      isLoggedIn: true,
      role: decodedToken.role === 'ROLE_ADMIN' ? 'admin' : decodedToken.role === 'ROLE_USER' ? 'user' : false,
  };
  } else {
    return {
      email: null,
      isLoggedIn: false,
      role: false,
    };
  }
}