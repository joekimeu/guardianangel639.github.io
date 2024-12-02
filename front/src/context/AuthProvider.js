import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: false });

  useEffect(() => {
    // Check if token exists in localStorage or cookies
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuth({ token });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuth({ token });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuth({ token: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;