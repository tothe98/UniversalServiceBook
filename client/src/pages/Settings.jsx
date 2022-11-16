import React, {useState} from "react";
import {Button, Grid, styled, TextField, Typography, Input} from "@mui/material";
import {Link} from "react-router-dom";

const AVATAR_MAX_HEIGHT = '200px';
const AVATAR_MAX_WIDTH = '200px';

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem"
}))

const AvatarImage = styled('img')(({theme}) => ({
    backgroundColor: theme.palette.common.gray,
    height: AVATAR_MAX_HEIGHT,
    width: AVATAR_MAX_WIDTH,
    objectFit: "cover",
    [theme.breakpoints.down("md")]: {
        width: "100px",
        height: '100%',
        marginBottom: "0px"
    }
}))

const FormActionButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button
}))

const FormCancelButton = styled(Button)(({theme}) => ({
    ...theme.mixins.cancelButton
}))

const MyGridItem = styled(Grid)(({theme}) => ({
    marginBottom: "30px",
    width: "100%"
}))

function Settings() {
    const handleProfileImageChange = (e) => {
        const profileImage = e.currentTarget.parentNode.parentNode.parentNode.querySelectorAll("#WallpaperItem")[0].querySelectorAll("#wallpaperIMG")[0];
        const file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (){
            profileImage.setAttribute('src', ""+fileReader.result);
        }
    }
    const { fName, lName, email, phone, home } = JSON.parse(localStorage.getItem("user")).user;

    return (<React.Fragment>
        <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
            <MyGridItem item>
                <Grid container direction="row" spacing={1.5}>
                    <Grid item id="WallpaperItem">
                        <AvatarImage src="https://picsum.photos/200" alt="profile image" id="wallpaperIMG" />
                    </Grid>

                    <Grid item>
                        <SubTitle variant='h3'>Profilkép beállítások</SubTitle>

                        <Grid container direction="column" sx={{marginTop: "auto"}}>
                            <input fullWidth name="wallpaper" placeholder="Kép kiválasztása..." type="file" onChange={e=>handleProfileImageChange(e)} />
                        </Grid>
                    </Grid>
                </Grid>
            </MyGridItem>

            <MyGridItem item>
                <SubTitle variant='h3'>Felhasználói adatok</SubTitle>

                <Grid container direction="column" spacing={1.5}>
                    <Grid item><TextField
                        disabled
                        fullWidth
                        id="outlined-disabled"
                        label="Felhasználói email"
                        defaultValue={email}
                    /></Grid>

                    <Grid item><TextField
                        fullWidth
                        id="outlined-disabled"
                        label="Kereszt név:"
                        defaultValue={fName}
                    /></Grid>

                    <Grid item><TextField
                        fullWidth
                        id="outlined-disabled"
                        label="Család név:"
                        defaultValue={lName}
                    /></Grid>

                    <Grid item><TextField
                        fullWidth
                        id="outlined-disabled"
                        label="Telefonszám"
                        defaultValue={phone}
                    /></Grid>

                    <Grid item><TextField
                        fullWidth
                        id="outlined-disabled"
                        label="Város"
                        defaultValue={ home ? home : ""}
                    /></Grid>
                </Grid>
            </MyGridItem>

            <MyGridItem item>
                <SubTitle variant='h3'>Jelszó beállítások</SubTitle>

                <Grid container direction="column" spacing={1.5}>
                    <Grid item><TextField
                        label="Régi jelszó"
                        defaultValue=""
                        fullWidth
                        type="password"
                    /></Grid>

                    <Grid item><TextField
                        label="Új jelszó*"
                        fullWidth
                        type="password"
                    /></Grid>

                    <Grid item><TextField
                        label="Új jelszó**"
                        fullWidth
                        type="password"
                    /></Grid>
                </Grid>
            </MyGridItem>

            <MyGridItem item>
                <Grid container direction="row" spacing={1.5} justifyContent="flex-end">
                    <Grid item><FormActionButton>Mentés</FormActionButton></Grid>
                    <Grid item><FormCancelButton variant="contained" component={Link} to="/">Elvetés</FormCancelButton></Grid>
                </Grid>
            </MyGridItem>
        </Grid>
    </React.Fragment>)
}

export default Settings;