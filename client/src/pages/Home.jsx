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

const PageContent = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: '53px',
    marginLeft: '21px'
}))

function Home() {
    return (
        <React.Fragment>
            <Header />
            <PageSelector />
            <PageBody>
                <Profile />
                <PageContent>
                    <Typography variant='h3'>Legútóbbi aktivításaim</Typography>

                    <div>Autó 1</div>
                    <div>Autó 2</div>
                    <div>Autó 3</div>
                    <div>Autó 4</div>
                    <div>Autó 5</div>
                    
                    <Typography variant='h3'>Szervíz Információk</Typography>

                    <div>Szervíz 1</div>
                    <div>Szervíz 2</div>
                    <div>Szervíz 3</div>
                    <div>Szervíz4</div>
                    <div>Szervíz 5</div>
                </PageContent>
            </PageBody>
            <Footer />
        </React.Fragment>
    )
}

export default Home;