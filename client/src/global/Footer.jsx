import { styled, Toolbar, Typography } from '@mui/material';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const MAX_HEIGHT = '100px';
const MAX_WIDTH = '880px';

const ContainerDiv = styled('div')(({theme}) => ({
    maxHeight: MAX_HEIGHT,
    height: '100%',
    maxWidth: MAX_WIDTH,
    width: '100%',
    marginTop: '40px',
    marginLeft: 'auto',
    marginRight: 'auto'
}))

const MyHr = styled('hr')(({theme}) => ({
    margin: 0
}))

const FooterText = styled(Toolbar)(({theme}) => ({
}))

const SubMenuContainer = styled(Toolbar)(({theme}) => ({
    marginLeft: 'auto'
}))

const FooterElement = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    margin: '0 10px'
}))

function Footer() {
    return <ContainerDiv>
        <MyHr />
        <FooterText disableGutters>
            <Typography>(C) Minden jog fenntartva.</Typography>

            <SubMenuContainer>
                <FooterElement component={Link} to="/#" >Segítség kérés</FooterElement>
                <FooterElement component={Link} to="/#" >Általános szerződési feltételek</FooterElement>
                <FooterElement component={Link} to="/#" >Elérhetőségeink</FooterElement>
            </SubMenuContainer>
        </FooterText>
    </ContainerDiv>
}

export default Footer;