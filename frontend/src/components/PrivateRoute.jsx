import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("auth-token");
  const location = useLocation();
  useEffect(() => {
    if (!authToken) {
      toast.error("You are not logged in");
    }
  }, []);


  return authToken ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
