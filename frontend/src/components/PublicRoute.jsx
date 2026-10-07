import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  // Auth Context se isAuthenticated aur user fetch kar rahe hain (token ki jagah)
  const { isAuthenticated, user } = useAuth();

  // Agar user logged in hai, to usko dashboard par bhej do
  if (isAuthenticated || user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Agar user logged in nahi hai, to Login/Register page show karo
  return <Outlet />;
};

export default PublicRoute;