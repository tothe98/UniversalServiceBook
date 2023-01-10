import React, {useState} from "react";
import {Button, Grid, styled, TextField, Typography} from "@mui/material";
import axios from "axios";
import {toast} from "react-toastify";
import {Link, useNavigate, useLocation} from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";

const SubTitle = styled(Typography)(({theme}) => ({
    marginBottom: "2rem"
}))

const SendButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button,
}))

function Login() {
    const { setAuth } = useAuth();

    const Navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sendLogin = async (e) => {
        e.preventDefault();
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BACKEND_URL
        })
        
        await axiosInstance.post("signin", {
            email: email,
            password: password
            })
            .then((response) => {
                const data = response.data;
                // token validation
                const token = data.data.token;
                if (!token) {
                    throw new Error("A token űres!");
                }

                /* collect the token and send a request to the server */
                axiosInstance.get("getUserData", {
                    headers: {
                        "x-access-token": token
                    }
                })
                .then((response) => {
                    if (response.status == 200) {
                        const user = response.data;
                        const roles = response.data.roles;
                        toast.success("Sikeresen bejelentkeztél!")
                        localStorage.setItem("token", ""+token);

                        setAuth({ user, token, roles });
                        Navigate(from, { replace: true });
                    }
                })
                .catch((e) => {
                    setEmail('')
                    setPassword('')
                });
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