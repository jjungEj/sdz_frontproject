import { jwtDecode } from 'jwt-decode';
import { assignRole } from './AuthUtil';

const isAccessTokenExist = (token) => {
  if (!token) {
      console.log('토큰이 존재하지 않습니다.');
      return false;
  }

  if (typeof token !== 'string') {
      console.log('유효하지 않은 토큰입니다.');
      return false;
  }

  console.log('토큰이 유효합니다.');
  return true;
}

const isAccessTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('토큰 만료 여부 검증 중 에러가 발생하였습니다.: ', error.message);
    return false;
  }
}

export const isAccessTokenValid = (token) => {
  if (!isAccessTokenExist(token)) {
    console.log('토큰이 존재하지 않습니다.');
    return false;
  }

  if (isAccessTokenExpired(token)) {
    localStorage.removeItem('access');
    console.log('토큰이 만료되었습니다.');
    return false;
  }

  console.log('토큰 검증에 성공하였습니다.');
  return true;
}

const hasCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) {
          return decodeURIComponent(cookie[1]);
      }
  }
  return null;
}

const reissueToken = () => {
  const url = 'http://localhost:8080/api/user/reissue';
  return fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include'
  })
  .then(response => {
    const authorizationHeader = response.headers.get('Authorization');
    if (authorizationHeader) {
      const newAccessToken = authorizationHeader.split(' ')[1];
      localStorage.setItem('access', newAccessToken);
      console.log('토큰이 성공적으로 재발급되었습니다.');
    }
    if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message);
      });
    }
  })
  .catch(error => {
    console.error('토큰 재발급 요청이 실패하였습니다.:', error);
    throw error;
  });
}

export function checkRefreshToken() {
  if (hasCookie("refresh")) {
    console.log('엑세스 토큰이 유효하지 않으므로 재발급을 요청합니다.');
    return reissueToken()
      .then(newToken => {
        if (newToken) {
          localStorage.setItem('access', newToken);
          assignRole(true, newToken);
          return true;
        }
        assignRole(false, null);
        return false;
      })
      .catch(error => {
        console.error('토큰 재발급에 실패하였습니다.:', error);
        return false;
      });
  }
}
