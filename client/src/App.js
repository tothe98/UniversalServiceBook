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
import Layout from './components/Layout';
import OwnerPage from './pages/OwnerPage';
import Unauthorized from './pages/Unauthorized';

const ROLES = {
    'User': 2001,
    'Admin': 2002,
    'Owner': 2003
}

function App() {
    const [activePage, setActivePage] = useState(0);
    const handleChangeTab = (newValue) => {
        setActivePage(newValue)
    }

    const routes = [
        { name: 'Főoldal', link: '/', activeIndex: 0 },
        { name: 'Járműveim', link: '/jarmuveim', activeIndex: 1 },
        { name: 'Műhely', link: '/muhely', activeIndex: 2 },
        { name: 'Beállítások', link: '/beallitasok', activeIndex: 3 },
        { name: 'Adminisztráció', link: '/adminisztracio', activeIndex: 4 }
    ]

    useEffect(() => {
        [...routes].forEach(route => {
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
    }, [activePage, routes])

    return (
    <ThemeProvider theme={theme}>
        <Routes>
        <Route path="/" element={<Layout activePage={activePage} routes={routes} 
                                            handleChangeTab={handleChangeTab} />}>
            { /*Public routes*/ }
            <Route path='/bejelentkezes' element={<Login />} />
            <Route path='/regisztracio' element={<Registration />} />
            <Route path='/aktivalas/:id' element={<EmailVerification />} />   

            { /*Protected routes*/ }
            { /*2001 = user*/ }
            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin, ROLES.Owner]} />}>
                <Route path='/' element={<Home handleChangeTab={handleChangeTab} /> } />
                <Route path='/muhely' element={<MechanicWorkshop handleChangeTab={handleChangeTab} /> } />
                <Route path='/jarmuveim' element={<Garage handleChangeTab={handleChangeTab} /> } />
                <Route path='/jarmuveim/:id' element={<GarageVehiclePreview handleChangeTab={handleChangeTab} /> } />
                <Route path='/beallitasok' element={<Settings handleChangeTab={handleChangeTab} /> } />
            </Route>   

            { /*2002 = admin*/ }
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path='/adminisztracio' element={<AdminPage handleChangeTab={handleChangeTab} /> } />
            </Route>

            { /*2003 = owner*/ }
            <Route element={<RequireAuth allowedRoles={[ROLES.Owner]} />}>
                <Route path='/adminisztracio' element={<OwnerPage handleChangeTab={handleChangeTab} /> } />
            </Route>
            
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
