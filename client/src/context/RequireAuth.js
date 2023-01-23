/* This help us to protect our routes */
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (!localStorage.getItem("token")) {
     return <Navigate to="/bejelentkezes" state={{ from: location }} replace />
    }

    if (!allowedRoles.includes(auth.role)) {
     if (auth?.user) {
          return <Navigate to="/megtagadva" state={{ from: location }} replace />
     }
     return <Navigate to="/bejelentkezes" state={{ from: location }} replace />
    }

    return <Outlet />
}

export default RequireAuth;