import { createContext, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [loginState, setLoginState] = useState({
    isLoggedIn: false,
    user: null,
    accessToken: null,
  });

  return (
    <AuthContext.Provider value={{ loginState, setLoginState }}>
      {children}
    </AuthContext.Provider>
  );
};
