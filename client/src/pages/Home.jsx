import { Box, styled, Typography } from '@mui/material';
import React, { Component } from 'react';
import Footer from '../global/Footer';
import Header from '../global/Header';
import PageSelector from '../global/PageSelector';
import Profile from '../global/Profile';

const PageBody = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
}))

function Home() {
    return (
        <React.Fragment>
            <Header />
            <PageSelector />
            <PageBody>
                <Profile />
            </PageBody>
            <Footer />
        </React.Fragment>
    )
}

export default Home;