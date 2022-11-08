import {Grid, styled, Tab, Tabs} from '@mui/material';
import React from 'react';
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

function PageSelector() {
    const [value, setValue] = useState(0);

    const handlePageChange = (e, newValue) => {
        setValue(newValue);
    }

    return (<Wrapper container>
        <Grid container>
            <Grid item md={3} xs={0}></Grid>
            <Grid item md={8} xs={12}>
                <Tabs value={value} onChange={handlePageChange}>
                    <Tab label="Főoldal" component={Link} to="/"/>
                    <Tab label="Garázs" component={Link} to="/garazs"/>
                    <Tab label="Leveleim" component={Link} to="/levelek"/>
                </Tabs>
            </Grid>
            <Grid item md={1} xs={0}></Grid>
        </Grid>
    </Wrapper>)
}

export default PageSelector;