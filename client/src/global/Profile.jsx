import {Button, Grid, styled, Toolbar, Typography, useMediaQuery} from '@mui/material';
import React, { Component } from 'react';
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

function Profile() {
    const underS = useMediaQuery(theme.breakpoints.down("sm"));

    return <Grid container spacing={underS ? 1 : 2} direction="column" alignItems="center" justifyContent="center" sx={{ marginTop: underS ? "0.25em" : 0 }}>
        <Grid item>
            <AvatarImage src={
                JSON.parse(localStorage.getItem("user")).user.picture ? JSON.parse(localStorage.getItem("user")).user.picture : 'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA='
            } alt="profil kép" />
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
            <SettingsButton sx={{marginTop: "10px", marginLeft: underS ? "auto" : "" }} component={Link} to="/beallitasok">Beállítások</SettingsButton>
        </Grid>
    </Grid>
}

export default Profile;