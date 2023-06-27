import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    profile_image: 'https://example.com/profile.jpg',
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
