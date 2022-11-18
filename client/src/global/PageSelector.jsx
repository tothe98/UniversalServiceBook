import {Grid, styled, Tab, Tabs} from '@mui/material';
import React, {useEffect} from 'react';
import { useState } from 'react';
import {Link} from "react-router-dom";

const MAX_HEIGHT = '108px';

const Wrapper = styled(Grid)(({theme}) => ({
    backgroundColor: theme.palette.common.gray,
    height: MAX_HEIGHT,
    alignItems: "flex-end",
    [theme.breakpoints.down("md")]: {
        height: "3.375rem"
    }
}))

function PageSelector({activePage, loggedIn, handleChangeTab}) {
    const routes = [
        { name: 'Főoldal', link: '/', activeIndex: 0 },
        {
            name: 'Garázs', link: '/garazs', activeIndex: 1
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
            <Grid item md={loggedIn ? 3 : 1 } xs={0}></Grid>
            <Grid item md={loggedIn ? 8 : 11} xs={12}>
                <Tabs value={activePage} onChange={handleChangeTab}>
                    {
                        routes.map((route, i) => {
                            return <Tab key={route+"-"+i} label={route.name} component={Link} to={route.link}/>
                        })
                    }
                </Tabs>
            </Grid>
            <Grid item md={1} xs={0}></Grid>
        </Grid>
    </Wrapper>)
}

export default PageSelector;