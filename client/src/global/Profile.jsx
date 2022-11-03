import { Button, styled, Toolbar, Typography } from '@mui/material';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const AVATAR_MAX_HEIGHT = '240px';
const AVATAR_MAX_WIDTH = '240px';

const SideBar = styled('div')(({theme}) => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column'
}))

const AvatarImage = styled('img')(({theme}) => ({
    backgroundColor: theme.palette.common.gray,
    borderRadius: '100%',
    maxHeight: AVATAR_MAX_HEIGHT,
    maxWidth: AVATAR_MAX_WIDTH,
    marginBottom: '40px',
    height: '100%',
    width: '100%'
}))

function Profile() {
    return <SideBar>
        <AvatarImage src='https://picsum.photos/240/240' />
        <Typography>Profile Name</Typography>

        <Button variant='contained'>Beállítások</Button>
    </SideBar>
}

export default Profile;