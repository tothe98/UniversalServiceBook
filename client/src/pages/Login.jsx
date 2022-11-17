import React, {useState} from "react";
import {Button, Grid, styled, TextField, Typography} from "@mui/material";
import axios from "axios";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

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
            })
            .then(response => {
                const data = response.data;
                // ok
                console.log(data)
                localStorage.setItem("token", data.data.token);
                toast.success("Sikeresen bejelentkeztél!")
                global.location.href = "/"
                global.location.reload()
            })
            .catch(e => {
                if (e.response.status === 400)
                {
                    // sikertelen
                    toast.error("Sajnáljuk :/ Sikertelen bejelentkezés!")
                }
                else if (e.response.status === 403)
                {
                    // nincs aktiválva
                    toast.warning("Opss! Nincs aktiválva a fiók! Kérlek aktiváld a fiókodat!")
                }
        });
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

                <Grid item><Typography component={Link} to="/regisztracio">Nincs még fiókod?</Typography></Grid>

                <Grid item><SendButton type="submit">Belépés</SendButton></Grid>
            </Grid>
        </form>
    </React.Fragment>
}

export default Login;