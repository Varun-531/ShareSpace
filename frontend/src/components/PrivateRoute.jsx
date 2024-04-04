import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("auth-token");
  const location = useLocation();
  if (!authToken) {
    toast.error("You must be logged in to access this page");
  }

  return authToken ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
