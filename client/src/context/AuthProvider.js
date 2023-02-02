import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/GlobalConfigs";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getUserDatas = async (token) => {
        try
        {
            const response = await axiosInstance.get("getUserData", {
                headers: {
                    "x-access-token": token
                }
            });
            const user = response.data.data.user;
            let highestRole = 2001;
            Array.from(user.roles).forEach(role => {
                if (role > highestRole) {
                    highestRole = role;
                }
            })
            const role = highestRole;
            setAuth({ user, role });

            setIsLoading(false);
        } catch (err) {
            localStorage.removeItem("token");
            setAuth({ })
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // if someone refresh the page
        const token = localStorage.getItem("token");
        if (token) {
            axiosInstance.post("isValidToken", { token: token })
            .then(res => {
                if (res.status == 200) {
                    getUserDatas(token);
                }
            })
            .catch(err => {
                if (err) {
                    localStorage.removeItem("token");
                    setAuth({  });
                    setIsLoading(false);
                }
            })
        }
        else
        {
            setIsLoading(false);
        }
    }, []);

    return !isLoading && (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;