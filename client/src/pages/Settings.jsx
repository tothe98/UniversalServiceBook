import { Box, Grid } from '@mui/material';
import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Rightbar from '../components/Rightbar';

export default function Garage() {
    return (<>
        <Navbar />
        <Grid container spacing={2} sx={{marginTop: '1em'}}>
            <Grid item xlg={2} lg={2} md={2} sm={2} sx={{ display: { lg: 'initial', md: 'initial', sm: 'initial', xs: 'none' }}}>
                <Sidebar currentPage="settings"/>
            </Grid>
            <Grid item xlg={8} lg={8} md={8} sm={8}>
                <Box>
                    Settings
                </Box>
            </Grid>
            <Grid item xlg={2} lg={2} md={2} sm={2} sx={{ display: { lg: 'initial', md: 'none', sm: 'none', xs: 'none' }}}>
                <Rightbar />
            </Grid>
        </Grid>
    </>)
}   
