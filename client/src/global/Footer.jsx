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
                        <FooterElement variant='h6'>Molnár Dániel & Tóth Erik</FooterElement>
                    </SubMenuContainer>
                </FooterText>
            </Grid>

            <Grid item md={1} xs={0}></Grid>
        </Grid>
    </Wrapper>
}

export default Footer;