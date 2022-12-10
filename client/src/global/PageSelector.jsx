import {Grid, styled, Tab, Tabs, useMediaQuery} from '@mui/material';
import React, {useEffect} from 'react';
import { useState } from 'react';
import {Link} from "react-router-dom";
import theme from "../themes/theme";

const MAX_HEIGHT = '108px';

const Wrapper = styled(Grid)(({theme}) => ({
    backgroundColor: theme.palette.common.gray,
    height: MAX_HEIGHT,
    alignItems: "flex-end",
    paddingLeft: theme.global.basePadding,
    paddingRight: theme.global.basePadding,
    [theme.breakpoints.down("md")]: {
        height: "3.375rem"
    }
}))

const MyTab = styled(Tab)(({theme}) => ({
    ...theme.typography.h3,
    textTransform: "none"
}))

function PageSelector({activePage, loggedIn, handleChangeTab, routes}) {
    const underLarge = useMediaQuery(theme.breakpoints.down("lg"));

    return (<Wrapper container>
        <Grid container>
            <Grid item lg={loggedIn ? 3 : 1 } xs={0}></Grid>
            <Grid item lg={loggedIn ? 8 : 11} xs={12}>
                <Tabs value={activePage} textColor="#24292F" onChange={handleChangeTab} TabIndicatorProps={{style: {backgroundColor: "#909090"}}}>
                    {
                        loggedIn && routes.map((route, i) => {
                            if (route.name === "Leveleim") {

                            }
                            else {
                                return <MyTab key={route+"-"+i} label={route.name} disabled={route.name==="Leveleim"} sx={{ opacity: route.name === "Leveleim" ? 0.5 : 1 }} component={Link} to={route.link} />
                            }
                        })
                    }
                </Tabs>
            </Grid>
            <Grid item lg={1} xs={0}></Grid>
        </Grid>
    </Wrapper>)
}

export default PageSelector;