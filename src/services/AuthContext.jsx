import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAccessTokenValid, checkRefreshToken } from './TokenUtil';
import { assignRole } from './AuthUtil';

const getAuth = () => {
  const token = localStorage.getItem('access');
  let auth = {
    isLoggedIn: false,
    email: null,
    role: null,
  };
  if (token) {
    if (isAccessTokenValid(token)) {
      assignRole(true, token);
    } else {
      checkRefreshToken();
    }
  } else {
    checkRefreshToken();
  }
  return auth;
}

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const initialState = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);
  const [email, setEmail] = useState(initialState.email);
  const [role, setRole] = useState(initialState.role);

  const updateAuthState = () => {
    const newAuth = getAuth();
    setIsLoggedIn(newAuth.isLoggedIn);
    setEmail(newAuth.email);
    setRole(newAuth.role);
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
      <AuthContext.Provider value={{ isLoggedIn, email, role, handleContextLogin, handleContextLogout }}>
          {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);