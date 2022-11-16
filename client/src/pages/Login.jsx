import React, {useState} from "react";
import {Button, Grid, styled, TextField, Typography} from "@mui/material";

const SubTitle = styled(Typography)(({theme}) => ({
    marginBottom: "2rem"
}))

const SendButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button,
}))

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sendLogin = async (e) => {
        e.preventDefault();
        console.log(email, password)
    }

    const handleEmailChange = (e) => { setEmail(e.target.value) }
    const handlePasswordChange = (e) => { setPassword(e.target.value) }

    return <React.Fragment>
        <SubTitle variant='h3'>Bejelentkezés</SubTitle>

        <form onSubmit={e=>sendLogin(e)}>
            <Grid container direction="column" spacing={1.5}>
                <Grid item>
                    <TextField
                        id="outlined"
                        label="Email cím"
                        type="email"
                        onChange={e=>handleEmailChange(e)}
                    />
                </Grid>

                <Grid item>
                    <TextField
                        id="outlined"
                        label="Jelszó"
                        type="password"
                        onChange={e=>handlePasswordChange(e)}
                    />
                </Grid>

                <Grid item><SendButton type="submit">Belépés</SendButton></Grid>
            </Grid>
        </form>
    </React.Fragment>
}

export default Login;