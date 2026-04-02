import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  if (user) return <Navigate to="/" replace />;

  return children;
}