/* This help us to protect our routes */
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { axiosInstance } from "../lib/GlobalConfigs";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (!localStorage.getItem("token")) {
     return <Navigate to="/bejelentkezes" state={{ from: location }} replace />
    }

    /*
    
    Error case: I am a simple user and I already have a token in my localStorage and I go to our site then
                the system will die because the system do not understand how i have a token. The problem is not just this,
                this is okay but if my token is invalid I cannot send requests to the server and the application crashed
                and always reload. This part is solve the problem.
    
    */
    if (localStorage.getItem("token")) {
        axiosInstance.post(`/isValidToken`, { token: localStorage.getItem("token") }, 
                                { headers: { "x-access-token": `${localStorage.getItem("token")}`} })
            .then((res) => {
                if  (res.status != 200 ) {
                    localStorage.removeItem("token");
                    return <Navigate to="/bejelentkezes" state={{ from: location }} replace />
                }
            })
            .catch((err) => {
                if  (err.response.status != 200 ) {
                    localStorage.removeItem("token");
                    return <Navigate to="/bejelentkezes" state={{ from: location }} replace />
                }
            })
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