import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color={"lightdark"} sx={{color: 'white'}}>
          <Toolbar>
            <IconButton size='large' edge='start'>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' component='div' sx={{flexGrow: 1, mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              textDecoration: 'none'}}>
              Univerzális Szervízkönyv
            </Typography>

            <Button color='primary'></Button>
          </Toolbar>
        </AppBar>
    </Box>
  );
}

 
export default Navbar;