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

function PageSelector({activePage, loggedIn, handleChangeTab}) {
    const underLarge = useMediaQuery(theme.breakpoints.down("lg"));

    const routes = [
        { name: 'Főoldal', link: '/', activeIndex: 0 },
        {
            name: 'Műhely', link: '/garazs', activeIndex: 1
        },
        { name: 'Leveleim', link: '/levelek', activeIndex: 2 },
        { name: 'Beállítások', link: '/beallitasok', activeIndex: 3 }
    ]

    useEffect(() => {
        [...routes].forEach(route => {
            switch (window.location.pathname)
            {
                case `${route.link}`:
                    if (activePage !== route.activeIndex)
                    {
                        handleChangeTab(route.activeIndex)
                    }
                    break;
                default:
                    break;
            }

            if (window.location.pathname.includes(route.link) && route.link !== "/")
            {
                if (activePage !== route.activeIndex)
                {
                    handleChangeTab(route.activeIndex)
                }
            }
        })
    }, [activePage, routes])

    return (<Wrapper container>
        <Grid container>
            <Grid item lg={loggedIn ? 3 : 1 } xs={0}></Grid>
            <Grid item lg={loggedIn ? 8 : 11} xs={12}>
                <Tabs value={activePage} textColor="#24292F" onChange={handleChangeTab} TabIndicatorProps={{style: {backgroundColor: "#909090"}}}>
                    {
                        routes.map((route, i) => {
                            return <MyTab key={route+"-"+i} label={route.name} component={Link} to={route.link} />
                        })
                    }
                </Tabs>
            </Grid>
            <Grid item lg={1} xs={0}></Grid>
        </Grid>
    </Wrapper>)
}

export default PageSelector;