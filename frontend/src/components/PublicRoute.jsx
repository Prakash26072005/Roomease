import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? <Navigate to="/" replace /> : children;
}