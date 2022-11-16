import React, {useState} from "react";
import {Button, Grid, styled, TextField, Typography} from "@mui/material";
import axios from "axios";
import {toast} from "react-toastify";

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
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_URL
        })
        const response = await axiosInstance.post("signin", {
            email: email,
            password: password
        });
        const data = await response.data;
        if (response.status === 400)
        {
            // sikertelen
            toast.error("Sikertelen bejelentkezés!")
        }
        else if (response.status === 403)
        {
            // nincs aktiválva
            toast.warning("Nincs aktiválva a fiók!")
        }
        else if (response.status === 200)
        {
            // ok
            localStorage.setItem("token", data.data.token);
            toast.success("Sikeresen bejelentkeztél!")
            global.location.href = "/"
            global.location.reload()
        }
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