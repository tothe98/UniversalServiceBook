import {Box, Grid, styled, ThemeProvider, Typography, useMediaQuery} from '@mui/material';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import React, {Component, useEffect, useState} from 'react';
import theme from './themes/theme'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import RequireAuth from "./components/RequireAuth";
import Home from './pages/Home';
import Header from "./global/Header";
import PageSelector from "./global/PageSelector";
import Footer from "./global/Footer";
import Error from "./pages/Error";
import Profile from "./global/Profile";
import Garage from "./pages/Garage";
import Mails from "./pages/Mails";
import Settings from "./pages/Settings";
import GarageVehiclePreview from "./pages/GarageVehiclePreview";
import MailPreview from "./pages/MailPreview";
import Login from "./pages/Login";
import axios from "axios";
import Registration from "./pages/Registration";
import MechanicWorkshop from "./pages/MechanicWorkshop";
import EmailVerification from "./pages/EmailVerification";
import AdminPage from "./pages/AdminPage";
import { AuthProvider } from './context/AuthProvider';
import Layout from './components/Layout.component';
import OwnerPage from './pages/OwnerPage';
import Unauthorized from './pages/Unauthorized';
import Roles from '../src/components/Roles'
import useAuth from './hooks/useAuth';

function App() {
    const { auth, setAuth } = useAuth();
    const [activePage, setActivePage] = useState(1);
    const handleChangeTab = (newValue) => {
        setActivePage(newValue);
    }

    const routes = {
        USER: [
            { name: 'Főoldal', link: '/', activeIndex: 1 },    
            { name: 'Járműveim', link: '/jarmuveim', activeIndex: 2 },   
            { name: 'Beállítások', link: '/beallitasok', activeIndex: 3 } 
        ],
        EMPLOYEE: [
            { name: 'Főoldal', link: '/', activeIndex: 1 },    
            { name: 'Járműveim', link: '/jarmuveim', activeIndex: 2 },    
            { name: 'Műhely', link: '/muhely', activeIndex: 3 },
            { name: 'Beállítások', link: '/beallitasok', activeIndex: 4 }    
        ],
        OWNER: [
            { name: 'Főoldal', link: '/', activeIndex: 1 },    
            { name: 'Járműveim', link: '/jarmuveim', activeIndex: 2 },    
            { name: 'Műhely', link: '/muhely', activeIndex: 3 },    
            { name: 'Adminisztráció', link: '/adminisztracio', activeIndex: 4 },
            { name: 'Beállítások', link: '/beallitasok', activeIndex: 5 }
        ],
        ADMIN: [
            { name: 'Főoldal', link: '/', activeIndex: 1 },    
            { name: 'Járműveim', link: '/jarmuveim', activeIndex: 2 },    
            { name: 'Adminisztráció', link: '/adminisztracio', activeIndex: 3 },    
            { name: 'Beállítások', link: '/beallitasok', activeIndex: 4 }    
        ]
    }

    useEffect(() => {
        switch (auth.role) {
            case Roles.User:
                [...routes.USER].forEach(route => {
                    switch (window.location.pathname)
                    {
                        case `${route.link}`:
                            if (activePage !== route.activeIndex)
                            {
                                setActivePage(route.activeIndex)
                            }
                            break;
                        default:
                            break;
                    }

                    if (window.location.pathname.includes(route.link) && route.link !== "/")
                    {
                        if (activePage !== route.activeIndex)
                        {
                            setActivePage(route.activeIndex)
                        }
                    }
                })
                break;
            case Roles.Employee:
                [...routes.EMPLOYEE].forEach(route => {
                    switch (window.location.pathname)
                    {
                        case `${route.link}`:
                            if (activePage !== route.activeIndex)
                            {
                                setActivePage(route.activeIndex)
                            }
                            break;
                        default:
                            break;
                    }

                    if (window.location.pathname.includes(route.link) && route.link !== "/")
                    {
                        if (activePage !== route.activeIndex)
                        {
                            setActivePage(route.activeIndex)
                        }
                    }
                })
                break;
            case Roles.Owner:
                [...routes.OWNER].forEach(route => {
                    switch (window.location.pathname)
                    {
                        case `${route.link}`:
                            if (activePage !== route.activeIndex)
                            {
                                setActivePage(route.activeIndex)
                            }
                            break;
                        default:
                            break;
                    }

                    if (window.location.pathname.includes(route.link) && route.link !== "/")
                    {
                        if (activePage !== route.activeIndex)
                        {
                            setActivePage(route.activeIndex)
                        }
                    }
                })
                break;
            case Roles.Admin:
                [...routes.ADMIN].forEach(route => {
                    switch (window.location.pathname)
                    {
                        case `${route.link}`:
                            if (activePage !== route.activeIndex)
                            {
                                setActivePage(route.activeIndex)
                            }
                            break;
                        default:
                            break;
                    }

                    if (window.location.pathname.includes(route.link) && route.link !== "/")
                    {
                        if (activePage !== route.activeIndex)
                        {
                            setActivePage(route.activeIndex)
                        }
                    }
                })
                break;
        }
    }, [activePage, routes])

    const getUserDatas = async (token) => {
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BACKEND_URL
        })
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
        setAuth({ user, token, role });
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getUserDatas(localStorage.getItem("token"))
        }
    }, []);

    return (
    <ThemeProvider theme={theme}>
        <Routes>
        <Route path="/" element={<Layout activePage={activePage} routes={routes} 
                                            handleChangeTab={handleChangeTab} />}>
            { /*Public routes*/ }
            <Route path='/bejelentkezes' element={<Login />} />
            <Route path='/regisztracio' element={<Registration />} />
            <Route path='/aktivalas/:token' element={<EmailVerification />} />   

            { /*Protected routes*/ }
            <Route element={<RequireAuth allowedRoles={[Roles.User, Roles.Employee, Roles.Admin, Roles.Owner]} />}>
                <Route path='/' element={<Home handleChangeTab={handleChangeTab} /> } />
                <Route path='/muhely' element={<MechanicWorkshop handleChangeTab={handleChangeTab} /> } />
                <Route path='/jarmuveim' element={<Garage handleChangeTab={handleChangeTab} /> } />
                <Route path='/jarmuveim/:id' element={<GarageVehiclePreview activePage={activePage}  routes={routes} handleChangeTab={handleChangeTab} /> } />
                <Route path='/beallitasok' element={<Settings handleChangeTab={handleChangeTab} /> } />
            </Route>   

            {
                auth.user 
                ? 
                    auth.role == Roles.Owner 
                    ? 
                        <Route element={<RequireAuth allowedRoles={[Roles.Owner]} />}>
                            <Route path='/adminisztracio' element={<OwnerPage handleChangeTab={handleChangeTab} /> } />
                        </Route>
                    :
                        auth.role == Roles.Admin
                        ?
                            <Route element={<RequireAuth allowedRoles={[Roles.Admin]} />}>
                                <Route path='/adminisztracio' element={<AdminPage handleChangeTab={handleChangeTab} /> } />
                            </Route>
                        :
                        undefined
                : undefined
            }
            
            { /* Forbidden requests */ }
            <Route path='/megtagadva' element={<Unauthorized />} />

            { /* Caching missings */ }
            <Route path='*' element={<Error />} />
        </Route>
        </Routes>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
