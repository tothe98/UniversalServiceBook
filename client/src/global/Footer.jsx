import React, {Component, useState} from 'react';
import {
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem, ListItemButton,
    ListItemText,
    Typography,
    useMediaQuery,
    theme,
    Link
} from '../lib/GlobalImports';
import {
    Wrapper,
    MyHr,
    FooterText,
    SubMenuContainer,
    FooterElement
} from '../lib/StyledComponents'
import {
    MenuIcon
} from '../lib/GlobalIcons'

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
            PaperProps={{ elevation: 9 }}
        >
            <List>
                <ListItem>
                    <ListItemButton component={Link} to="#">
                        <ListItemText primary="Segítség kérés" />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton component={Link} to="#">
                        <ListItemText primary="Általános szerződési feltételek" />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton component={Link} to="#">
                        <ListItemText primary="Elérhetőségeink" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    </Wrapper>
}

export default Footer;