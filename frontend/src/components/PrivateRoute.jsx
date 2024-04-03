import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
  const authToken = localStorage.getItem("auth-token");
  const location = useLocation();

  return (
    authToken ? (
      children
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  );
}

export default PrivateRoute;
