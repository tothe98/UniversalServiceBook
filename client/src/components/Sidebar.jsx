import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { Component } from 'react';

function Sidebar(props) {

    const currentPage = props.currentPage;
    const renderListElements = () => {
        if (currentPage === 'home')
        {
            return <List >
                        <ListItemButton  component="a" href="/" sx={{background: '#FFF500', ":hover": { background: '#FFF500' }, color: '#17181D' }}>
                            <ListItemText primary="Főoldal" sx={{textAlign: 'center'}} />
                        </ListItemButton>
                        <ListItemButton  component="a" href="/garage" >
                            <ListItemText primary="Garázs" sx={{textAlign: 'center'}} />
                        </ListItemButton>
                        <ListItemButton  component="a" href="/settings" >
                            <ListItemText primary="Beállítások" sx={{textAlign: 'center'}} />
                        </ListItemButton>
                    </List>
        }
        else if (currentPage === 'garage')
        {
            return <List >
                        <ListItemButton component="a" href="/" >
                            <ListItemText primary="Főoldal" sx={{textAlign: 'center'}} />
                        </ListItemButton>
                        <ListItemButton component="a" href="/garage" sx={{background: '#FFF500', ":hover": { background: '#FFF500' }, color: '#17181D' }}>
                            <ListItemText primary="Garázs" sx={{textAlign: 'center'}} />
                        </ListItemButton>
                        <ListItemButton component="a" href="/settings" >
                            <ListItemText primary="Beállítások" sx={{textAlign: 'center'}} />
                        </ListItemButton>
                    </List>
        }
        else if (currentPage === 'settings')
        {
            return <List >
                        <ListItemButton component="a" href="/" >
                            <ListItemText primary="Főoldal" sx={{textAlign: 'center'}} />
                        </ListItemButton>
                        <ListItemButton component="a" href="/garage">
                            <ListItemText primary="Garázs" sx={{textAlign: 'center'}} />
                        </ListItemButton>
                        <ListItemButton component="a" href="/settings" sx={{background: '#FFF500', ":hover": { background: '#FFF500' }, color: '#17181D' }}>
                            <ListItemText primary="Beállítások" sx={{textAlign: 'center'}} />
                        </ListItemButton>
                    </List>
        }
    }

    return (<Box sx={"lightdark"} justifyContent="flex-start" alignItems="flex-start">
        { renderListElements() }
    </Box>)
}

export default Sidebar;