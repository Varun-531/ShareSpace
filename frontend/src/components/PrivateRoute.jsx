// import { Navigate, useLocation } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useEffect } from "react";

// const PrivateRoute = ({ children }) => {
//   const authToken = localStorage.getItem("auth-token");
//   const location = useLocation();
//   useEffect(() => {
//     if (!authToken) {
//       toast.error("You are not logged in");
//     }
//   }, []);

//   return authToken ? (
//     children
//   ) : (
//     <Navigate to="/" state={{ from: location }} replace />
//   );
// };

// export default PrivateRoute;

import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const PrivateRoute = ({ children }) => {
  const [cookies] = useCookies(["token"]);
  const authToken = cookies.token;
  const location = useLocation();

  useEffect(() => {
    if (!authToken) {
      toast.error("You are not logged in");
    }
  }, [authToken]);

  return authToken ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
