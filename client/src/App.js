import {Box, Grid, styled, ThemeProvider, Typography, useMediaQuery} from '@mui/material';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import {
    axios
} from './lib/GlobalImports'
import {
    axiosInstance
} from './lib/GlobalConfigs'
import React, {Component, useEffect, useState} from 'react';
import theme from './themes/theme'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home';
import Error from "./pages/Error";
import Garage from "./pages/Garage";
import Settings from "./pages/Settings";
import GarageVehiclePreview from "./pages/GarageVehiclePreview";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import MechanicWorkshop from "./pages/MechanicWorkshop";
import EmailVerification from "./pages/EmailVerification";
import AdminPage from "./pages/AdminPage";
import Layout from './components/Layout.component';
import OwnerPage from './pages/OwnerPage';
import Unauthorized from './pages/Unauthorized';
import Roles from './lib/Roles'
import useAuth from './hooks/useAuth';
import RequireAuth from "./context/RequireAuth"
import ForgotPassword from './pages/ForgotPassword';
import NewPassword from './pages/NewPassword';

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

    return (
    <ThemeProvider theme={theme}>
        <Routes>
        <Route path="/" element={<Layout activePage={activePage} routes={routes} 
                                            handleChangeTab={handleChangeTab} />}>
            { /*Public routes*/ }
            <Route path='/bejelentkezes' element={<Login />} />
            <Route path='/regisztracio' element={<Registration />} />
            <Route path='/aktivalas/:userid/:token' element={<EmailVerification />} />   
            <Route path='/ujjelszo' element={<ForgotPassword />} />
            <Route path='/elfelejtett/:userid/:verificationCode' element={<NewPassword />} />

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
