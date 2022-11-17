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
  const underS = useMediaQuery(theme.breakpoints.down("sm"));
  const betweenSM_MD = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [activePage, setActivePage] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  theme.typography.h1 = {
      ...theme.typography.h1,
      [theme.breakpoints.between("lg", "xl")]: {
          fontSize: "1.875rem"
      },
      [theme.breakpoints.between("md", "lg")]: {
          fontSize: "1.5625rem"
      },
      [theme.breakpoints.between("sm", "md")]: {
          fontSize: "1.25rem"
      },
      [theme.breakpoints.between("xs", "sm")]: {
          fontSize: "0.9375rem"
      }
  }
  theme.typography.h2 = {
      ...theme.typography.h2,
      [theme.breakpoints.between("lg", "xl")]: {
          fontSize: "1.5625rem"
      },
      [theme.breakpoints.between("md", "lg")]: {
          fontSize: "1.25rem"
      },
      [theme.breakpoints.between("sm", "md")]: {
          fontSize: "0.9375rem"
      },
      [theme.breakpoints.between("xs", "sm")]: {
          fontSize: "0.9375rem"
      }
  }
  theme.typography.h3 = {
      ...theme.typography.h3,
      [theme.breakpoints.between("lg", "xl")]: {
          fontSize: "1.5625rem"
      },
      [theme.breakpoints.between("md", "lg")]: {
          fontSize: "1.25rem"
      },
      [theme.breakpoints.between("sm", "md")]: {
          fontSize: "0.9375rem"
      },
      [theme.breakpoints.between("xs", "sm")]: {
          fontSize: "0.9375rem"
      }
  }

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
          setLoggedIn(true)
          getUserDatas(localStorage.getItem("token"));
      }
  });


  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <Header />
          <PageSelector activePage={activePage} handleChangeTab={handleChangeTab} />
          <Wrapper>
              <Grid container direction={underS || betweenSM_MD ? "column" : "row"}>
                  <Grid item md={1} xs={0}></Grid>
                  <Grid item md={2} xs={2} sx={{marginTop: underS || betweenSM_MD ? 0 : "-3.8125rem"}}>
                      <Profile />
                      { underS || betweenSM_MD ? <MyHr /> : null }
                  </Grid>

                  <Grid item md={8} xs={10} sx={{paddingTop: underS || betweenSM_MD ? "1rem" : "53px"}}>
                      <Routes>
                          <Route path='/' element={loggedIn ? <Home /> : <Login />} />
                          <Route path='/garazs' element={loggedIn ? <Garage /> : <Login />} />
                          <Route path='/garazs/:id' element={loggedIn ? <GarageVehiclePreview /> : <Login />} />
                          <Route path='/levelek' element={loggedIn ? <Mails /> : <Login />} />
                          <Route path='/levelek/:id' element={loggedIn ? <MailPreview /> : <Login />} />
                          <Route path='/beallitasok' element={loggedIn ? <Settings /> : <Login />} />
                          <Route path='/bejelentkezes' element={<Login />} />
                          <Route path='/regisztracio' element={<Registration />} />
                          <Route path='/*' element={loggedIn ? <Error /> : <Login />} />
                      </Routes>
                  </Grid>
                  <Grid item md={1} xs={0}></Grid>
              </Grid>
          </Wrapper>
        <Footer />
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
