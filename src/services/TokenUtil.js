import { jwtDecode } from 'jwt-decode';

const isRefreshTokenExist = (token) => {
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

const isRefreshTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('토큰 만료 여부 검증 중 에러가 발생하였습니다.: ', error.message);
    return false;
  }
}

export const isRefreshTokenValid = (token) => {
  if (!isRefreshTokenExist(token)) {
    console.log('토큰이 존재하지 않습니다.');
    return false;
  }

  if (isRefreshTokenExpired(token)) {
    console.log('토큰이 만료되었습니다.');
    return false;
  }

  console.log('토큰 검증에 성공하였습니다.');
  return true;
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
  if (!response.ok) {
      return response.json().then(errorData => {
          throw new Error(errorData.message);
      });
  }
  return response.json().then((data) => {
    const newAccessToken = response.headers.get('Authorization').split(' ')[1];
    localStorage.setItem('access', newAccessToken);
    console.log('토큰이 성공적으로 재발급되었습니다.');
    return newAccessToken;
  });
})
.catch(error => {
  console.error('토큰 재발급 요청이 실패하였습니다.:', error);
  throw error;
});
}

export const checkAndReissueToken = () => {
  if (!isRefreshTokenValid(token)) {
    console.log('토큰이 유효하지 않으므로 재발급을 요청합니다.');
    return reissueToken()
      .then(newToken => {
        if (newToken) {
          localStorage.setItem('access', newToken);
          return true;
        }
        return false;
      })
      .catch(error => {
        console.error('토큰 재발급에 실패하였습니다.:', error);
        return false;
      });
  }
  console.log('토큰이 유효합니다.')
  return Promise.resolve(true);
}

//////////////////////////////

export const isAccessTokenValid = (token) => {
  if (!isAccessTokenExist(token)) {
    console.log('토큰이 존재하지 않습니다.');
    return false;
  }

  if (isAccessTokenExpired(token)) {
    console.log('토큰이 만료되었습니다.');
    return false;
  }

  console.log('토큰 검증에 성공하였습니다.');
  return true;
}

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

function hasCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === name) {
        return true;
    }
  }
  return false;
}

export const checkRefreshToken = () => {
  if(hasCookie("access")){
    if (!isRefreshTokenValid(token)) {
      console.log('토큰이 유효하지 않으므로 재발급을 요청합니다.');
      return reissueToken()
        .then(newToken => {
          if (newToken) {
            localStorage.setItem('access', newToken);
            return true;
          }
          return false;
        })
        .catch(error => {
          console.error('토큰 재발급에 실패하였습니다.:', error);
          return false;
        });
    }
    console.log('토큰이 유효합니다.')
    return Promise.resolve(true);
  }
}
