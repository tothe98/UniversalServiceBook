import {
    Avatar,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton, ListItemText, Menu, MenuItem,
    styled,
    Toolbar,
    Typography,
    useMediaQuery
} from '@mui/material';
import React, {Component, useState} from 'react';
import { Link } from 'react-router-dom';
import theme from "../themes/theme";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined';
import GavelIcon from '@mui/icons-material/GavelOutlined';
import HomeIcon from '@mui/icons-material/CottageOutlined';
import GarageIcon from '@mui/icons-material/BuildOutlined';
import MailsIcon from '@mui/icons-material/EmailOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmailOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {toast} from "react-toastify";
import useAuth from '../hooks/useAuth';

const MAX_HEIGHT = '100px';

const Wrapper = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.common.darkblack,
    maxHeight: MAX_HEIGHT,
    height: "100%",
    padding: "32px 0",
    paddingLeft: theme.global.basePadding,
    paddingRight: theme.global.basePadding,
    zIndex: theme.zIndex.drawer + 1,
    position: "relative"
}))

const Title = styled(Typography)(({theme}) => ({
    ...theme.typography.link
}))

const SideMenu = styled(Grid)(({theme}) => ({
    marginLeft: "auto"
}))

const MyDrawer = styled(Drawer)(({theme}) => ({
    marginTop: "6.25rem",
    "& 	.MuiDrawer-paper": {
        backgroundColor: "rgba(36, 41, 47, 0.946555)",
        color: theme.palette.common.white
    }
}))

const MarginDiv = styled('div')(({theme}) => ({
    marginTop: "7.0rem"
}))

const MyAvatar = styled(Avatar)(({theme}) => ({
    color: theme.palette.common.white,
    background: "none",
    marginRight: "1em"
}))

const MyDivider = styled(Divider)(({theme}) => ({
    "& 	.MuiDivider-root": {
        color: theme.palette.common.gray
    }
}))

const SpaceInList = styled('div')(({theme}) => ({
    marginTop: "2rem"
}))

function Header({handleChangeTab}) {
    const { auth } = useAuth();
    const underS = useMediaQuery(theme.breakpoints.down("sm"))
    const [open, setOpen] = useState(false);
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const handleLogout = (e) => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Sikeresen kijelentkeztél!")
        global.location.reload()
        global.location.href="/"
        setOpen(!open)
    }

    return (
        <React.Fragment>
            <Wrapper>
                <Grid container >
                    <Grid item xs></Grid>
                    <Grid item lg={10} xs={11} >
                        <Title variant="h1" component={Link} to="/">
                            Univerzális Szervízkönyv
                        </Title>
                    </Grid>
                    {
                        underS && <SideMenu item xs={1}>
                            <IconButton><Typography variant="h1"><MenuIcon onClick={e=>setOpen(!open)} /></Typography></IconButton>
                        </SideMenu>
                    }
                    <Grid item xs></Grid>
                </Grid>
            </Wrapper>

            <MyDrawer
                PaperProps={{ elevation: 9 }}
                anchor="top"
                open={open}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
                onClose={e=>{setOpen(false)}}
            >
                <List >
                    <MarginDiv />

                    <SpaceInList />

                    <MyDivider variant="inset" component="li" />

                    <ListItem>
                        <ListItemButton component={Link} to="/">
                            <MyAvatar>
                                <HomeIcon />
                            </MyAvatar>
                            <ListItemText primary="Főoldal"  onClick={e=>{handleChangeTab(0); setOpen(!open)}} />
                        </ListItemButton>
                    </ListItem>

                    <MyDivider variant="inset" component="li" />

                    <ListItem>
                        <ListItemButton component={Link} to="/garazs"  onClick={e=>{handleChangeTab(1); setOpen(!open)}}>
                            <MyAvatar>
                                <GarageIcon />
                            </MyAvatar>
                            <ListItemText primary="Műhely" />
                        </ListItemButton>
                    </ListItem>

                    <MyDivider variant="inset" component="li" />

                    <ListItem>
                        <ListItemButton component={Link} to="/levelek"  onClick={e=>{handleChangeTab(2); setOpen(!open)}}>
                            <MyAvatar>
                                <MailsIcon />
                            </MyAvatar>
                            <ListItemText primary="Leveleim"/>
                        </ListItemButton>
                    </ListItem>

                    <SpaceInList />

                    <MyDivider variant="inset" component="li" />

                    <ListItem>
                        <ListItemButton component={Link} to="#">
                            <MyAvatar>
                                <HelpIcon />
                            </MyAvatar>
                            <ListItemText primary="Segítség kérés" />
                        </ListItemButton>
                    </ListItem>

                    <MyDivider variant="inset" component="li" />

                    <ListItem>
                        <ListItemButton component={Link} to="#">
                            <MyAvatar>
                                <GavelIcon />
                            </MyAvatar>
                            <ListItemText primary="Általános szerződési feltételek" />
                        </ListItemButton>
                    </ListItem>

                    <MyDivider variant="inset" component="li" />

                    <ListItem>
                        <ListItemButton component={Link} to="#">
                            <MyAvatar>
                                <AlternateEmailIcon />
                            </MyAvatar>
                            <ListItemText primary="Elérhetőségeink" />
                        </ListItemButton>
                    </ListItem>

                    <MyDivider variant="inset" component="li" />

                    <SpaceInList />


                    <ListItem>
                        <ListItemButton component={Link} to="/beallitasok" onClick={e=>{handleChangeTab(3); setOpen(!open)}}>
                            <MyAvatar>
                                <img src="https://picsum.photos/400" alt="profilkép" />
                            </MyAvatar>
                            <ListItemText primary={`${
                            auth.user && (
                            auth.user.lName + " " + auth.user.fName
                            )}`} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton onClick={e=>{handleLogout(e)}}>
                            <MyAvatar>
                                <LogoutOutlinedIcon />
                            </MyAvatar>
                            <ListItemText disableTypography primary="Kijelentkezés" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </MyDrawer>
        </React.Fragment>)
}

export default Header;