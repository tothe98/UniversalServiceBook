import { Box, List, ListItemButton, ListItemText, styled, Typography } from '@mui/material';
import React, { Component } from 'react';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

function Rightbar(props) {
    return (<Box color={"lightdark"}>
        <Typography>
            Elérhető szerelők
        </Typography>

        <Stack direction="row" spacing={-0.9}>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar alt="Remy Sharp" src="https://picsum.photos/200" />
            </StyledBadge>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar alt="Remy Sharp" src="https://picsum.photos/200" />
            </StyledBadge>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar alt="Remy Sharp" src="https://picsum.photos/200" />
            </StyledBadge>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar alt="Remy Sharp" src="https://picsum.photos/200" />
            </StyledBadge>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar alt="Remy Sharp" src="https://picsum.photos/200" />
            </StyledBadge>
        </Stack>
    </Box>)
}

export default Rightbar;