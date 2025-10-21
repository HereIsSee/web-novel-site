import jwtDecode from "jwt-decode";

export function isLoggedIn() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    if (exp < Date.now() / 1000) {
      localStorage.removeItem("token"); // auto-remove expired token
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token"); // invalid token
    return false;
  }
}
