import { jwtDecode } from 'jwt-decode';

export const assignAuth = (isUser, token) => {
  if (isUser && token) {
    const decodedToken = jwtDecode(token);

    return {
      email: decodedToken.email,
      isLoggedIn: true,
      auth: decodedToken.auth === 'ROLE_ADMIN' ? 'admin' : decodedToken.auth === 'ROLE_USER' ? 'user' : null,
      loginType: decodedToken.loginType === 'social' ? 'social' : decodedToken.loginType === 'local' ? 'local' : null,
    };
  } else {
    return {
      email: null,
      isLoggedIn: false,
      auth: null,
      loginType : null,
    };
  }
}