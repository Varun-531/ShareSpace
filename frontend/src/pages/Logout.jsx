import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Logout = () => {
  const location = useLocation();
  useEffect(() => {
    localStorage.removeItem("auth-token");
  }, []);

  return <Navigate to="/home" state={{ from: location }} replace />;
};

export default Logout;
