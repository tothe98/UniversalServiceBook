import {
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    styled,
    Toolbar,
    Typography,
    useMediaQuery
} from '@mui/material';
import React, {Component, useState} from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import theme from "../themes/theme";

const MAX_HEIGHT = '100px';
const MAX_WIDTH = '880px';

const Wrapper = styled(Grid)(({theme}) => ({
    maxHeight: MAX_HEIGHT,
    height: '100%',
    marginTop: "40px"
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
    margin: '0 5px'
}))

function Footer() {
    const [open, setOpen] = useState(false);
    const underMD = useMediaQuery(theme.breakpoints.down("md"));

    return <Wrapper container alignItems="center" justifyContent="center">
        <Grid container>
            <Grid item md={1} xs={0}></Grid>

            <Grid item md={10}  xs={12}>
                <MyHr />
                <FooterText disableGutters>
                    <Typography variant="h6">(C) Minden jog fenntartva.</Typography>

                    <SubMenuContainer>
                        {
                            underMD
                                ?
                                <FooterElement><IconButton><MenuIcon onClick={e=>setOpen(true)} /></IconButton></FooterElement>
                                :
                                <>
                                    <FooterElement component={Link} to="/#" >Segítség kérés</FooterElement>
                                    <FooterElement component={Link} to="/#" >Általános szerződési feltételek</FooterElement>
                                    <FooterElement component={Link} to="/#" >Elérhetőségeink</FooterElement>
                                </>
                        }
                    </SubMenuContainer>
                </FooterText>
            </Grid>

            <Grid item md={1} xs={0}></Grid>
        </Grid>

        <Drawer
            anchor="bottom"
            open={open}
            onClose={e=>{setOpen(false)}}
        >
            <List>
                <ListItem>
                    <ListItemText primary="Segítség kérés" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Általános szerződési feltételek" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Elérhetőségeink" />
                </ListItem>
            </List>
        </Drawer>
    </Wrapper>
}

export default Footer;