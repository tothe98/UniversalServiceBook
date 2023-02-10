import { Outlet } from 'react-router-dom';
import {Box, Grid, styled, ThemeProvider, Typography, useMediaQuery} from '@mui/material';
import React, {Component, useEffect, useState} from 'react';
import theme from '../themes/theme'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '../context/AuthProvider';
import axios from 'axios';
import Header from '../global/Header';
import PageSelector from '../global/PageSelector';
import Profile from '../global/Profile';
import Footer from '../global/Footer';
import useAuth from '../hooks/useAuth';

const Wrapper = styled('div')(({theme}) => ({
}))

const MyHr = styled('hr')(({theme}) => ({
    backgroundColor: theme.palette.common.lightgray
}))

const Layout = ({handleChangeTab, routes, activePage}) => {
    const { auth } = useAuth();
    const underLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const underSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const betweenSM_MD = useMediaQuery(theme.breakpoints.between("sm", "md"));

    if (!auth.user) {
        return <>
            <Header 
                handleChangeTab={handleChangeTab}
                routes={routes}
            />
            <Wrapper>
                <Grid container direction={underLarge ? "column" : "row"}>
                    <Grid item xs={12} sx={{
                        textAlign: "center",
                        width: "100%",
                        paddingTop: theme.global.basePadding,
                        paddingLeft: theme.global.basePadding,
                        paddingRight: theme.global.basePadding
                    }}>
                        <Outlet />
                    </Grid>
                </Grid>
            </Wrapper>
            <Footer />
        </>
    }

    return <>
        <Header 
            handleChangeTab={handleChangeTab}
            routes={routes}
        />
          { !underSmall && <PageSelector routes={routes} 
                                         activePage={activePage} 
                                         handleChangeTab={handleChangeTab} /> }
          <Wrapper>
              <Grid container direction={underLarge ? "column" : "row"}>
                  <Grid item md={1} xs={0}></Grid>
                    {
                        auth?.user
                        &&
                        <Grid item xs={2} sx={{marginTop: underLarge || betweenSM_MD ? 0 : "-3.8125rem"}}>
                        <Profile handleChangeTab={handleChangeTab} />
                        </Grid>
                    }

                    {
                        auth?.user
                        ?
                        <Grid item md={8} xs={10} sx={{
                            paddingTop: underLarge || betweenSM_MD ? "1rem" : "53px",
                            paddingLeft: theme.global.basePadding,
                            paddingRight: theme.global.basePadding
                        }}>
                            <Outlet />
                        </Grid>
                        :
                        <Grid item xs={12} sx={{
                            paddingLeft: theme.global.basePadding,
                            paddingRight: theme.global.basePadding
                        }}>
                            <Outlet />
                        </Grid>
                    }
                  { auth?.user && <Grid item md={1} xs={0}></Grid> }
              </Grid>
          </Wrapper>
        <Footer />
    </>
}

export default Layout;