import { styled, Toolbar, Typography } from '@mui/material';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const MAX_HEIGHT = '100px';

const ContainerDiv = styled('div')(({theme}) => ({
    maxHeight: MAX_HEIGHT,
    height: '100%'
}))

const Title = styled(Typography)(({theme}) => ({
    ...theme.typography.link
}))

const TextContainer = styled(Toolbar)(({theme}) => ({
    marginLeft: 'auto'
}))

function Footer() {
    return <ContainerDiv>
        <hr />
        <Toolbar>
            <Typography>(C) Minden jog fenntartva.</Typography>

            <TextContainer>
                <Typography>Segítség kérés</Typography>
                <Typography>Általános szerződési feltételek</Typography>
                <Typography>Elérhetőségeink</Typography>
            </TextContainer>
        </Toolbar>
    </ContainerDiv>
}

export default Footer;