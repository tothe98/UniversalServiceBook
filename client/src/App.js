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

const Wrapper = styled('div')(({theme}) => ({
}))

const MyHr = styled('hr')(({theme}) => ({
    backgroundColor: theme.palette.common.lightgray
}))


function App() {
  const underLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const underSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const betweenSM_MD = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [activePage, setActivePage] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleChangeTab = (newValue) => {
    setActivePage(newValue)
  }

  const getUserDatas = async (token) => {
      const axiosInstance = axios.create({
          baseURL: process.env.REACT_APP_URL
      })
      const response = await axiosInstance.get("getUserData", {
          headers: {
              "x-access-token": token
          }
      });
      const data = await response.data;
      localStorage.setItem("user", JSON.stringify(data.data));
  }

  useEffect(() => {
      if (localStorage.getItem("token"))
      {
          getUserDatas(localStorage.getItem("token")).then(r => setLoggedIn(true));
      }
  });


  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <Header handleChangeTab={handleChangeTab} />
          { !underSmall && <PageSelector activePage={activePage} loggedIn={loggedIn} handleChangeTab={handleChangeTab} /> }
          <Wrapper>
              <Grid container direction={underLarge ? "column" : "row"}>
                  { loggedIn && <Grid item md={1} xs={0}></Grid> }
                  <Grid item md={loggedIn ? 2 : 1} xs={loggedIn ? 2 : 1} sx={{marginTop: underLarge || betweenSM_MD ? 0 : "-3.8125rem"}}>
                      { loggedIn && <Profile handleChangeTab={handleChangeTab} /> }
                  </Grid>

                  <Grid item md={loggedIn ? 8 : 11} xs={loggedIn ? 10 : 11} sx={{
                      paddingTop: underLarge || betweenSM_MD ? "1rem" : "53px",
                      paddingLeft: theme.global.basePadding,
                      paddingRight: theme.global.basePadding
                  }}>
                      <Routes>
                          <Route path='/' element={loggedIn ? <Home handleChangeTab={handleChangeTab} /> : <Login />} />
                          <Route path='/garazs' element={loggedIn ? <Garage handleChangeTab={handleChangeTab} /> : <Login />} />
                          <Route path='/garazs/:id' element={loggedIn ? <GarageVehiclePreview handleChangeTab={handleChangeTab} /> : <Login />} />
                          <Route path='/levelek' element={loggedIn ? <Mails handleChangeTab={handleChangeTab} /> : <Login />} />
                          <Route path='/levelek/:id' element={loggedIn ? <MailPreview handleChangeTab={handleChangeTab} /> : <Login />} />
                          <Route path='/beallitasok' element={loggedIn ? <Settings handleChangeTab={handleChangeTab} /> : <Login />} />
                          <Route path='/bejelentkezes' element={<Login />} />
                          <Route path='/regisztracio' element={<Registration />} />
                          <Route path='/*' element={loggedIn ? <Error /> : <Login />} />
                      </Routes>
                  </Grid>
                  { loggedIn && <Grid item md={1} xs={0}></Grid> }
              </Grid>
          </Wrapper>
        <Footer />
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
