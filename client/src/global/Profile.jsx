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
            <AvatarImage src='https://assets1.cbsnewsstatic.com/hub/i/2018/11/06/0c1af1b8-155a-458e-b105-78f1e7344bf4/2018-11-06t054310z-1334124005-rc1be15a8050-rtrmadp-3-people-sexiest-man.jpg' />
        </Grid>
        <Grid item>
            <Typography variant="h2">Profile Name</Typography>
        </Grid>
        <Grid item>
            <SettingsButton sx={{marginTop: "10px", marginLeft: underS ? "auto" : "" }} component={Link} to="/beallitasok">Beállítások</SettingsButton>
        </Grid>
    </Grid>
}

export default Profile;