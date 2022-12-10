import {Button, Grid, Skeleton, styled, Toolbar, Typography, useMediaQuery} from '@mui/material';
import React, {Component, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import theme from "../themes/theme";
import dayjs from "dayjs";
import {CalendarPicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import { MyCircularSkeleton, MyTextSkeleton } from '../lib/Skeletons'
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

function Profile({handleChangeTab}) {
    const [isLoading, setIsLoading] = useState(true);
    const biggerExtraLarge = useMediaQuery(theme.breakpoints.up("xl"));
    const underLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const underSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const [wallPaper, setWallpaper] = useState();
    let today = new Date();
    const [date, setDate] = useState(dayjs(today));

    useEffect(() => {
        setIsLoading(true);
        today = new Date();
        setWallpaper(
            (JSON.parse(localStorage.getItem("user")) &&
                JSON.parse(localStorage.getItem("user")).user &&
                JSON.parse(localStorage.getItem("user")).user.picture)
                ?
                JSON.parse(localStorage.getItem("user")).user.picture
                :
                'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA='
        )
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
                    <SettingsButton sx={{marginTop: "10px", marginLeft: underLarge ? "auto" : "" }} component={Link} to="/beallitasok" onClick={e=>{handleChangeTab(3)}}>
                        Beállítások
                    </SettingsButton>
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
                                <AvatarImage src={wallPaper} alt="profil kép" sx={{margin: 0}} />
                            </Grid>

                            <Grid item>
                                <Typography variant="h2" align="center">
                                {
                                    JSON.parse(localStorage.getItem("user")) && (
                                    JSON.parse(localStorage.getItem("user")).user.fName + " " + JSON.parse(localStorage.getItem("user")).user.lName
                                )}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </MyGridItem>)
                :
                (<React.Fragment>
                    <Grid item>
                        <AvatarImage src={wallPaper} alt="profil kép" />
                    </Grid>
                    <Grid item>
                        <Typography align="center" variant="h2">
                            {
                            JSON.parse(localStorage.getItem("user")) && (
                            JSON.parse(localStorage.getItem("user")).user.fName + " " + JSON.parse(localStorage.getItem("user")).user.lName
                            )}
                        </Typography>
                    </Grid>
                </React.Fragment>)
        }
        <MyGridItem item sx={{marginLeft: underLarge ? "auto" : 0, textAlign: "center"}}>
            <SettingsButton sx={{marginTop: "10px", marginLeft: underLarge ? "auto" : "" }} component={Link} to="/beallitasok" onClick={e=>{handleChangeTab(3)}}>
                Beállítások
            </SettingsButton>
        </MyGridItem>

            {
                (biggerExtraLarge || underSmall) && <MyGridItem item xs>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MyCalendar date={date} onChange={(newDate) => setDate(newDate)} />
                    </LocalizationProvider>
                </MyGridItem>
            }
    </Container>
    {
        underLarge && <hr />
    }
    </>
}

export default Profile;