import React, {useEffect} from 'react';
import { useState } from 'react';
import {
    Grid, 
    styled,
    Tabs,
    useMediaQuery,
    Link,
    theme
} from '../lib/GlobalImports';
import { MyTab } from '../lib/StyledComponents';
import Roles from '../lib/Roles';
import useAuth from '../hooks/useAuth';

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

function PageSelector({activePage, handleChangeTab, routes}) {
    const { auth } = useAuth();
    const underLarge = useMediaQuery(theme.breakpoints.down("lg"));

    return (<Wrapper container>
        <Grid container>
            <Grid item lg={auth?.user ? 3 : 1 } xs={0}></Grid>
            <Grid item lg={auth?.user ? 8 : 11} xs={12}>
                <Tabs value={activePage} textColor="#24292F" onChange={handleChangeTab} TabIndicatorProps={{style: {backgroundColor: "#909090"}}}>
                    {
                        /*
                         Documentation: Basically, when I render the tab components then It matters that the 
                                        active tab how increase. But there are some cases when the user is
                                        user 😄 or employee or owner or admin and that cases not every tab
                                        showed. example: Main Page Garage Options. In this case the old solution
                                        was not the best way to do this because It thrown error when I rendered
                                        the tabs for users since the user has three tabs (MainPage, Garage, Options)
                                        and the basicall the options page's active index is 4 but in this case it have to
                                        be 3 and this is why I made the new solution. The new solution's essence is 
                                        find the role of user and render the specific routes for the role. 
                        */
                    }
                    
                    {
                        auth?.user && auth?.role && auth.role == Roles.User && routes.USER.map((x,i) => {
                                    return <MyTab key={x+"-"+i} label={x.name} value={x.activeIndex}
                                            component={Link} to={x.link} />
                        })
                    }
                    {
                        auth?.user && auth?.role && auth.role == Roles.Employee && routes.EMPLOYEE.map((x,i) => {
                                    return <MyTab key={x+"-"+i} label={x.name} value={x.activeIndex}
                                            component={Link} to={x.link} />
                        })
                    }
                    {
                        auth?.user && auth?.role && auth.role == Roles.Admin && routes.ADMIN.map((x,i) => {
                                    return <MyTab key={x+"-"+i} label={x.name} value={x.activeIndex}
                                            component={Link} to={x.link} />
                        })
                    }
                    {
                        auth?.user && auth?.role && auth.role == Roles.Owner && routes.OWNER.map((x,i) => {
                                    return <MyTab key={x+"-"+i} label={x.name} value={x.activeIndex}
                                            component={Link} to={x.link} />
                        })
                    }
                </Tabs>
            </Grid>
            <Grid item lg={1} xs={0}></Grid>
        </Grid>
    </Wrapper>)
}

export default PageSelector;