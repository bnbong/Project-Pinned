import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginState, setLoginState] = useState({
    isLoggedIn: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  });

  const login = (userData) => {
    // 로그인 처리 로직
    setUser(userData);
  };

  const logout = () => {
    // 로그아웃 처리 로직
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ loginState, setLoginState }}>
      {children}
    </AuthContext.Provider>
  );
};
