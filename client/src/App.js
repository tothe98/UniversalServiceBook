import {Box, Grid, styled, ThemeProvider, Typography, useMediaQuery} from '@mui/material';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import React, { Component } from 'react';
import theme from './themes/theme'
import Home from './pages/Home';
import Header from "./global/Header";
import PageSelector from "./global/PageSelector";
import Footer from "./global/Footer";
import Error from "./pages/Error";
import Profile from "./global/Profile";
import Garage from "./pages/Garage";
import Mails from "./pages/Mails";
import Settings from "./pages/Settings";

const Wrapper = styled('div')(({theme}) => ({
}))

const MyHr = styled('hr')(({theme}) => ({
    backgroundColor: theme.palette.common.lightgray
}))


function App() {
  const underS = useMediaQuery(theme.breakpoints.down("sm"));
  const betweenSM_MD = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
  /*theme.typography.h4 = {
      ...theme.typography.h4,
      [theme.breakpoints.between("lg", "xl")]: {
          fontSize: "1.25rem"
      },
      [theme.breakpoints.between("md", "lg")]: {
          fontSize: "0.9375rem"
      },
      [theme.breakpoints.between("sm", "md")]: {
          fontSize: "0.9375rem"
      },
      [theme.breakpoints.between("xs", "sm")]: {
          fontSize: "0.9375rem"
      }
  }
  theme.typography.h5 = {
      ...theme.typography.h5,
      [theme.breakpoints.between("lg", "xl")]: {
          fontSize: "1.25rem"
      },
      [theme.breakpoints.between("md", "lg")]: {
          fontSize: "0.9375rem"
      },
      [theme.breakpoints.between("sm", "md")]: {
          fontSize: "0.9375rem"
      },
      [theme.breakpoints.between("xs", "sm")]: {
          fontSize: "0.9375rem"
      }
  }
  theme.typography.h6 = {
      ...theme.typography.h6,
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
  }*/

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <Header />
          <PageSelector />
          <Wrapper>
              <Grid container direction={underS || betweenSM_MD ? "column" : "row"}>
                  <Grid item md={1} xs={0}></Grid>
                  <Grid item md={2} xs={2} sx={{marginTop: underS || betweenSM_MD ? 0 : "-3.8125rem"}}>
                      <Profile />
                      { underS || betweenSM_MD ? <MyHr /> : null }
                  </Grid>

                  <Grid item md={8} xs={10} sx={{paddingTop: underS || betweenSM_MD ? "1rem" : "53px"}}>
                      <Routes>
                          <Route path='/' element={<Home />} />
                          <Route path='/garazs' element={<Garage />} />
                          <Route path='/levelek' element={<Mails />} />
                          <Route path='/beallitasok' element={<Settings />} />
                        <Route path='/*' element={<Error />} />
                      </Routes>
                  </Grid>
                  <Grid item md={1} xs={0}></Grid>
              </Grid>
          </Wrapper>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
