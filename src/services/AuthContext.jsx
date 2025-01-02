import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAccessTokenValid, checkRefreshToken } from './TokenUtil';
import { assignAuth } from './AuthUtil';

const getAuth = async () => {
  const token = localStorage.getItem('access');
  let auth = {
    isLoggedIn: false,
    email: null,
    auth: null,
    loginType : null,
  };
  if (token) {
    if (isAccessTokenValid(token)) {
      auth = assignAuth(true, token);
    } else {
      await checkRefreshToken();
    }
  } else {
    await checkRefreshToken();
  }
  return auth;
}

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const initialState = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);
  const [email, setEmail] = useState(initialState.email);
  const [auth, setAuth] = useState(initialState.auth);
  const [loginType, setLoginType] = useState(initialState.loginType);

  console.log(initialState);

  const updateAuthState = async () => {
    const newAuth = await getAuth();
    setIsLoggedIn(newAuth.isLoggedIn);
    setEmail(newAuth.email);
    setAuth(newAuth.auth);
    setLoginType(newAuth.loginType);
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
      <AuthContext.Provider value={{ isLoggedIn, email, auth, loginType, handleContextLogin, handleContextLogout }}>
          {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);