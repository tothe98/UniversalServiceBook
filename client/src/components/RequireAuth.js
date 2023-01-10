/* This help us to protect our routes */
import { useLocation, Navigate, Outlet } from "react-router-dom";
import App from "../App";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

   return (
        /*Outlet = all children of this class*/
        auth?.roles?.find(role => 
          allowedRoles.includes(role)) 
               ? <Outlet /> 
               /* if we try to access a protected route and we do not have permission then we move to the login page 
               but afterwards if we wants to go back, we can't and that's why we need to put the replace property. */
               : auth?.user 
                    ? <Navigate to="/megtagadva" state={{ from: location }} replace />
                    : <Navigate to="/bejelentkezes" state={{ from: location }} replace />
   )
}

export default RequireAuth;