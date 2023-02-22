import React, {useState} from "react";
import {
    Button,
    Grid,
    styled,
    TextField,
    Typography,
    axios,
    toast
} from "../lib/GlobalImports";
import {
    SubTitle,
    SendButton,
    LoginContainer,
    AvatarImage
} from "../lib/StyledComponents"
import {
 Languages,
 MainObjects,
 ObjectProperties,
 MessageStatusCodes,
 getFieldMessage,
 getGlobalMessage
} from "../config/MessageHandler";
import { useEffect } from "react";
import { axiosInstance } from "../lib/GlobalConfigs"
import {Link, useNavigate, useLocation} from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Login() {
    const { setAuth } = useAuth();

    const Navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [isSent, setIsSent] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sendLogin = async (e) => {
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
        }, 3000);
        e.preventDefault();

        if (!email) {
            toast.error(getFieldMessage(Languages.hu, "e-mail", MessageStatusCodes.error))
            return;
        }
        if (!password) {
            toast.error(getFieldMessage(Languages.hu, "jelszó", MessageStatusCodes.error))
            return;
        }

        // message
        if (password.length < 8) {
            toast.error(getFieldMessage(Languages.hu, "jelszó", MessageStatusCodes.warning))
            return;
        }

        await axiosInstance.post("signin", {
            email: email,
            password: password
            })
            .then((response) => {
                const data = response.data;
                const token = data.data.token;
                if (!token) {
                    throw new Error("A token üres!");
                }

                /* collect the token and send a request to the server */
                axiosInstance.get("getUserData", {
                    headers: {
                        "x-access-token": token
                    }
                })
                .then((response) => {
                    if (response.status == 200) {
                        const user = response.data.data.user;
                        let highestRole = 2001;
                        Array.from(user.roles).forEach(role => {
                            if (role > highestRole) {
                                highestRole = role;
                            }
                        })
                        const role = highestRole;
                        
                        toast.success("Sikeresen bejelentkeztél!")
                        localStorage.setItem("token", token);

                        setAuth({ user, token, role });
                        Navigate(from, { replace: true });
                    }
                })
                .catch((e) => {
                    setEmail('')
                    setPassword('')
                });
            })
            .catch(e => {
                if (e.response.status == 400)
                {
                    // sikertelen
                    toast.error("Sajnáljuk :/ Sikertelen bejelentkezés!")
                }
                else if (e.response.status == 422) 
                {
                    toast.error("Sikertelen bejelentkezés! Valamit nem töltött ki!");
                }
                else if (e.response.status == 403)
                {
                    // nincs aktiválva
                    toast.warning("Opss! Nincs aktiválva a fiók! Kérlek aktiváld a fiókodat!")
                }
                else if (e.response.status == 409)
                {
                    // nincs aktiválva
                    toast.warning("E-mail, jelszó páros helytelen!")
                }
        });
    }

    const handleEmailChange = (e) => { setEmail(e.target.value) }
    const handlePasswordChange = (e) => { setPassword(e.target.value) }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            Navigate(from);
        }
    }, [])

    return <React.Fragment>
        <AvatarImage src={'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA='} alt="profil kép" sx={{margin: 0}} />
        
        <SubTitle variant='h3'>Bejelentkezés</SubTitle>

        <form onSubmit={e=>sendLogin(e)}>
            <Grid container direction="column" spacing={1.5}>
                <Grid item>
                    <TextField
                        label="Email cím"
                        type="email"
                        onChange={e=>handleEmailChange(e)}
                        sx={{ minWidth: "300px" }}
                    />
                </Grid>

                <Grid item>
                    <TextField
                        label="Jelszó"
                        type="password"
                        onChange={e=>handlePasswordChange(e)}
                        sx={{ minWidth: "300px" }}
                    />
                    <Typography variant="body2">* A jelszónak legalább 8 karakternek kell lennie.</Typography>
                </Grid>

                <Grid item>
                    <Grid container direction="column" justifyContent="space-between">
                        <Grid item>
                            <Typography component={Link} to="/regisztracio">Nincs még fiókod?</Typography>
                        </Grid>
                        <Grid item>
                            <Typography component={Link} to="/ujjelszo">Elfelejtett jelszó</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    {
                        isSent
                        ?
                        <SendButton disabled>Belépés</SendButton>
                        :
                        <SendButton type="submit">Belépés</SendButton>
                    }
                </Grid>
            </Grid>
        </form>
    </React.Fragment>
}

export default Login;