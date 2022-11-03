import { Typography } from '@mui/material';
import React, { Component } from 'react';
import Footer from '../global/Footer';
import Header from '../global/Header';
import PageSelector from '../global/PageSelector';

function Home() {
    return (
        <React.Fragment>
            <Header />
            <PageSelector />
            <Footer />
        </React.Fragment>
    )
}

export default Home;