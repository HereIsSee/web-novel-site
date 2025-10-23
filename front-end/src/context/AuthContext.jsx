import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const { sub: id, unique_name: username, exp } = jwtDecode(storedToken);
        if (exp > Date.now() / 1000) {
          setToken(storedToken);
          setUser({ id, username });
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }

    setIsLoading(false);
  }, []);

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
    <AuthContext.Provider
      value={{ user, token, login, logout, isLoggedIn, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
