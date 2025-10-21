import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const { sub: id, unique_name: username, exp } = jwtDecode(storedToken);
        if (exp > Date.now() / 1000) {
          setToken(storedToken);
          setUser({ id, username });
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const { exp } = jwtDecode(token);
        if (exp > Date.now() / 1000) {
          setIsLoggedIn(true);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    const { sub: id, unique_name: username } = jwtDecode(token);
    setUser({ id, username });
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
