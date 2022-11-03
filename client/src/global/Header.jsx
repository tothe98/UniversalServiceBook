import { styled, Toolbar, Typography } from '@mui/material';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const MAX_HEIGHT = '100px';

const ContainerDiv = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.common.darkblack,
    maxHeight: MAX_HEIGHT,
    height: '100%'
}))

const Title = styled(Typography)(({theme}) => ({
    ...theme.typography.link
}))

function Header() {
    return <ContainerDiv>
        <Toolbar>
            <Title variant='h1' component={Link} to="/">
                Univerzális Szervíz Könyv
            </Title>
        </Toolbar>
    </ContainerDiv>
}

export default Header;