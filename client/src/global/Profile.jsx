import {Button, Grid, Skeleton, styled, Toolbar, Typography, useMediaQuery, useTheme} from '@mui/material';
import React, {Component, useEffect, useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import theme from "../themes/theme";
import dayjs from "dayjs";
import {CalendarPicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import { MyCircularSkeleton, MyTextSkeleton } from '../lib/Skeletons'
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
const AVATAR_MAX_HEIGHT = '200px';
const AVATAR_MAX_WIDTH = '200px';

const Container = styled(Grid)(({theme}) => ({
    paddingLeft: theme.global.basePadding,
    paddingRight: theme.global.basePadding
}))

const MyGridItem = styled(Grid)(({theme}) => ({
    [theme.breakpoints.down("sm")]: {
        width: "100%"
    }
}))

const AvatarImage = styled('img')(({theme}) => ({
    backgroundColor: theme.palette.common.gray,
    height: AVATAR_MAX_HEIGHT,
    width: AVATAR_MAX_WIDTH,
    marginBottom: '40px',
    borderRadius: '50%',
    objectFit: "cover",
    verticalAlign: "middle",
    [theme.breakpoints.down("lg")]: {
        width: "150px",
        height: '150px',
        marginBottom: "0px"
    },
    [theme.breakpoints.down("md")]: {
        width: "100px",
        height: '100px',
        marginBottom: "0px"
    }
}))

const SettingsButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button,
    backgroundColor: theme.palette.common.lightgray,
    "&:hover": {
        backgroundColor: theme.palette.common.lightgray,
    },
    color: theme.palette.common.darkblack,
    [theme.breakpoints.down("sm")]: {
        minWidth: "100%"
    }
}))

const LogOutButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button,
    backgroundColor: theme.palette.common._RoseRed
}))

const MyCalendar = styled(CalendarPicker)(({theme}) => ({
    maxWidth: "260px",
    width: "auto",
    [theme.breakpoints.down("sm")]: {
        maxWidth: "100%"
    }
}))

function Profile({handleChangeTab, loggedIn}) {
    const { auth } = useAuth();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const underLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const underSmall = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        setIsLoading(true);
        setIsLoading(false);
    });

    if (isLoading) {
        return <>
            <Container container spacing={underLarge ? 1 : 2} direction={underLarge ? underSmall ? "column" : "row" : "column" } alignItems="center" justifyContent={underLarge ? "flex-start" : "center"} sx={{ marginTop: underLarge ? "1.5em" : 0, marginBottom: underLarge ? "1.5em" : 0 }}>

                {
                    underLarge
                        ?
                        (<MyGridItem item>
                            <Grid item>
                                <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1.5}>
                                    <Grid item>
                                        <MyCircularSkeleton variant="circular" />
                                    </Grid>

                                    <Grid item>
                                        <Typography variant="h2" align="center">
                                            <MyTextSkeleton variant="rectangular" />
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MyGridItem>)
                        :
                        (<React.Fragment>
                            <Grid item>
                                <MyCircularSkeleton variant="circular" />
                            </Grid>
                            <Grid item>
                                <Typography align="center" variant="h2">
                                    <MyTextSkeleton variant="rectangular" />
                                </Typography>
                            </Grid>
                        </React.Fragment>)
                }
                <MyGridItem item sx={{marginLeft: underLarge ? "auto" : 0, textAlign: "center"}}>
                    {
                        loggedIn
                        ?
                        <SettingsButton sx={{marginTop: "10px", marginLeft: underLarge ? "auto" : "" }} component={Link} to="/beallitasok" onClick={e=>{handleChangeTab(3)}}>
                            Beállítások
                        </SettingsButton>
                        :
                        <SettingsButton sx={{marginTop: "10px", marginLeft: underLarge ? "auto" : "" }} component={Link} to="/bejelentkezes" onClick={e=>{handleChangeTab(3)}}>
                            Belépés
                        </SettingsButton>
                    }
                </MyGridItem>

            </Container>
            {
                underLarge && <hr />
            }
        </>
    }

    return <>
        <Container container spacing={underLarge ? 1 : 2} direction={underLarge ? underSmall ? "column" : "row" : "column" } alignItems="center" justifyContent={underLarge ? "flex-start" : "center"} sx={{ marginTop: underLarge ? "1.5em" : 0, marginBottom: underLarge ? "1.5em" : 0 }}>

        {
            underLarge
                ?
                (<MyGridItem item>
                    <Grid item>
                        <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1.5}>
                            <Grid item>
                                <AvatarImage src={auth?.user?.picture !== undefined ? auth.user.picture : 'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA='} alt="profil kép" sx={{margin: 0}} />
                            </Grid>

                            <Grid item>
                                <Typography variant="h2" align="center">
                                {
                                    auth.user && (
                                    auth.user.fName + " " + auth.user.lName
                                )}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </MyGridItem>)
                :
                (<React.Fragment>
                    <Grid item>
                        <AvatarImage src={auth?.user?.picture !== undefined ? auth.user.picture : 'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA='} alt="profil kép" />
                    </Grid>
                    <Grid item>
                        <Typography align="center" variant="h2">
                            {
                            auth.user && (
                            auth.user.fName + " " + auth.user.lName
                            )}
                        </Typography>
                    </Grid>
                </React.Fragment>)
        }
        <MyGridItem item sx={{marginLeft: underLarge ? "auto" : 0, textAlign: "center"}}>
            {
                auth.user
                    ?
                    <>
                        <SettingsButton sx={{marginTop: "10px", marginLeft: underLarge ? "auto" : "" }} component={Link} to="/beallitasok" onClick={e=>{handleChangeTab(3)}}>
                            Beállítások
                        </SettingsButton>
                        <SettingsButton sx={{marginTop: "10px", marginLeft: underLarge ? "auto" : "", background: theme.palette.common.orange, color: theme.palette.common.white }} onClick={e=>{
                            handleChangeTab(1); 
                            localStorage.removeItem("token");
                            localStorage.removeItem("last_viewed");
                            toast.success("Sikeresen kijelentkeztél!");
                            window.location.href = "/bejelentkezes" }}>
                            Kijelentkezés
                        </SettingsButton>
                    </>
                    :
                    <SettingsButton sx={{marginTop: "10px", marginLeft: underLarge ? "auto" : "" }} component={Link} to="/bejelentkezes" onClick={e=>{handleChangeTab(3)}}>
                        Belépés
                    </SettingsButton>
            }
        </MyGridItem>

            {
                /*loggedIn && (biggerExtraLarge || underSmall) && <MyGridItem item xs>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MyCalendar date={date} onChange={(newDate) => setDate(newDate)} />
                    </LocalizationProvider>
                </MyGridItem> */
            }
    </Container>
    {
        underLarge && <hr />
    }
    </>
}

export default Profile;