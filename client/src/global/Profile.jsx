import {Button, Grid, styled, Toolbar, Typography, useMediaQuery} from '@mui/material';
import React, {Component, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import theme from "../themes/theme";

const AVATAR_MAX_HEIGHT = '200px';
const AVATAR_MAX_WIDTH = '200px';

const AvatarImage = styled('img')(({theme}) => ({
    backgroundColor: theme.palette.common.gray,
    height: AVATAR_MAX_HEIGHT,
    width: AVATAR_MAX_WIDTH,
    marginBottom: '40px',
    borderRadius: '100%',
    objectFit: "cover",
    [theme.breakpoints.down("md")]: {
        width: "100px",
        height: '100%',
        marginBottom: "0px"
    }
}))

const SettingsButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button
}))

const LogOutButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button,
    backgroundColor: theme.palette.common._RoseRed
}))

function Profile() {
    const underS = useMediaQuery(theme.breakpoints.down("sm"));
    const [wallPaper, setWallpaper] = useState();

    useEffect(() => {
        setWallpaper(
            (JSON.parse(localStorage.getItem("user")) &&
                JSON.parse(localStorage.getItem("user")).user &&
                JSON.parse(localStorage.getItem("user")).user.picture)
                ?
                JSON.parse(localStorage.getItem("user")).user.picture
                :
                'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA='
        )
    });


    return <Grid container spacing={underS ? 1 : 2} direction="column" alignItems="center" justifyContent="center" sx={{ marginTop: underS ? "0.25em" : 0 }}>
        <Grid item>
            <AvatarImage src={wallPaper} alt="profil kép" />
        </Grid>
        <Grid item>
            <Typography variant="h2">
            {
                JSON.parse(localStorage.getItem("user")) && (
                JSON.parse(localStorage.getItem("user")).user.fName + " " + JSON.parse(localStorage.getItem("user")).user.lName
            )}
            </Typography>
        </Grid>
        <Grid item>
            <Grid container direction="column" alignItems="center" justifyContent="center">
                <Grid item>
                    <SettingsButton sx={{marginTop: "10px", marginLeft: underS ? "auto" : "" }} component={Link} to="/beallitasok">Beállítások</SettingsButton>
                </Grid>
                <Grid item>
                    <LogOutButton sx={{marginTop: "10px", marginLeft: underS ? "auto" : "" }} onClick={e=>{
                        localStorage.removeItem("token")
                        localStorage.removeItem("user")
                        global.location.reload()
                    }
                    }>Kijelentkezés</LogOutButton>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}

export default Profile;