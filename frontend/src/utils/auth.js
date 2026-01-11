import { jwtDecode } from "jwt-decode";

export const getValidUser = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // ⛔ Token expired
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }

    return JSON.parse(user);
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};
