import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Aapka Auth Context import karein

const PublicRoute = () => {
  const { user, token } = useAuth(); // Auth state se user/token fetch karein

  // Agar user logged in hai, to usko dashboard par bhej do
  if (user || token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Agar user logged in nahi hai, to Login/Register page show karo
  return <Outlet />;
};

export default PublicRoute;