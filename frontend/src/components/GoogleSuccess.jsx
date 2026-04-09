import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");

        if (res.data.success) {
          localStorage.setItem("user", JSON.stringify(res.data.user));

          // 🔥 navbar update
          window.dispatchEvent(new Event("userChanged"));

          navigate("/");
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  return <h2>Logging you in...</h2>;
}