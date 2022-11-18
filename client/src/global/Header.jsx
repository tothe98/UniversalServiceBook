import {Grid, styled, Toolbar, Typography, useMediaQuery} from '@mui/material';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import theme from "../themes/theme";

const MAX_HEIGHT = '100px';

const Wrapper = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.common.darkblack,
    maxHeight: MAX_HEIGHT,
    height: "100%",
    padding: "32px 0",
    paddingLeft: theme.global.basePadding,
    paddingRight: theme.global.basePadding
}))

const Title = styled(Typography)(({theme}) => ({
    ...theme.typography.link
}))

function Header() {
    const underS = useMediaQuery(theme.breakpoints.down("sm"))

    return (<Wrapper>
        <Grid container>
            <Grid item xs></Grid>
            <Grid item md={10} xs={12} >
                <Title variant="h1" component={Link} to="/">
                    Univerzális Szervízkönyv
                </Title>
            </Grid>
            <Grid item xs></Grid>
        </Grid>
    </Wrapper>)
}

export default Header;