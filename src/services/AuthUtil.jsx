import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAndReissueToken } from './TokenUtil';
import { jwtDecode } from 'jwt-decode';

const getAuthData = () => {
  const token = localStorage.getItem('access');
  if(checkAndReissueToken(token)) {
    try {
      const decodedToken = jwtDecode(token);
      return {
          email: decodedToken.email,
          isLogIn: true,
          role: decodedToken.role === 'ROLE_ADMIN' ? 'admin' : decodedToken.role === 'ROLE_USER' ? 'user' : false,
      };
    } catch (error) {
      console.error('토큰 유효성 검증에 실패하였습니다:', error);
      localStorage.removeItem('access');
      return {
        email: null,
        isLogIn: false,
        role: false,
      };
    }
  } else {
    if(token) {
      localStorage.removeItem('access');
    }
    return {
      email: null,
      isLogIn: false,
      role: false,
    };
  }
}

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const initialState = getAuthData();
  const [isLogIn, setIsLogIn] = useState(initialState.isLogIn);
  const [email, setEmail] = useState(initialState.email);
  const [role, setRole] = useState(initialState.role);

  const updateAuthState = () => {
    const newAuthData = getAuthData();
    setIsLogIn(newAuthData.isLogIn);
    setEmail(newAuthData.email);
    setRole(newAuthData.role);
  };

  useEffect(() => {
    updateAuthState();
    const handleAuthChange = () => updateAuthState();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
        window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleContextLogin = () => {
      const event = new Event('authChange');
      window.dispatchEvent(event);
  };

  const handleContextLogout = () => {
      const event = new Event('authChange');
      window.dispatchEvent(event);
  };

  return (
      <AuthContext.Provider value={{ isLogIn, email, role, handleContextLogin, handleContextLogout }}>
          {children}
      </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

export const fetchWithAuth = (url, options = {}) => {
    const token = localStorage.getItem('access');

    if (!checkAndReissueToken(token)) {
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