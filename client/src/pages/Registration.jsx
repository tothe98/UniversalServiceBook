import React, {useState} from "react";
import {
    Button,
    Grid,
    styled,
    TextField,
    Typography,
    axios,
    toast,
    Link
} from "../lib/GlobalImports";
import {
    SubTitle,
    SendButton
} from "../lib/StyledComponents"
import {
    axiosInstance
} from "../lib/GlobalConfigs"

function Registration() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [isSent, setIsSent] = useState(false);

    const sendRegistration = async (e) => {
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
        }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));
        
        e.preventDefault();

        if (!firstName) {
            toast.error("Kérlek töltsd ki a keresztnév mezőt!")
            return;
        }
        if (!lastName) {
            toast.error("Kérlek töltsd ki a vezetéknév mezőt!")
            return;
        }
        if (!email) {
            toast.error("Kérlek töltsd ki az email cím mezőt!")
            return;
        }
        if (!password) {
            toast.error("Kérlek töltsd ki az email cím mezőt!")
            return;
        }

        const response = await axiosInstance.post("signup", {
            fName: firstName,
            lName: lastName,
            email: email,
            password: password,
            phone: phoneNumber ? phoneNumber : "00"
        }, { headers: { "x-access-token": localStorage.getItem("token") }})
        .then(res => {
            toast.success("Sikeres regisztráció!")

            window.location.href = "/bejelentkezes"
        })
        .catch(err => {
            if (err.response.status == 422)
            {
                toast.error("Opss! Valamit nem töltöttél ki!")
            }
            else if (err.response.status == 409)
            {
                toast.error("Opss! Ezzel az e-mail címmel már létezik egy felhasználó!")
            }
            else
            {
                toast.error("Opss! Valami hiba történt a regisztráció során!")
            }

        })
        setEmail("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setPhoneNumber("");
    }

    return <React.Fragment>
        <SubTitle variant='h3'>Regisztráció</SubTitle>

        <form onSubmit={e=>sendRegistration(e)}>
            <Grid container direction="column" spacing={1.5}>
                <Grid item>
                    <TextField
                        label="Keresztnév "
                        type="text"
                        onChange={e=>setFirstName(e.target.value)}
                        sx={{ minWidth: "300px" }}
                        required
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Családnév "
                        type="text"
                        onChange={e=>setLastName(e.target.value)}
                        sx={{ minWidth: "300px" }}
                        required
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Email cím "
                        type="email"
                        onChange={e=>setEmail(e.target.value)}
                        sx={{ minWidth: "300px" }}
                        required
                    />
                </Grid>

                <Grid item>
                    <TextField
                        label="Jelszó "
                        type="password"
                        onChange={e=>setPassword(e.target.value)}
                        sx={{ minWidth: "300px" }}
                        required
                    />
                </Grid>

                <Grid item>
                    <TextField
                        label="Telefonszám"
                        type="tel"
                        onChange={e=>setPhoneNumber(e.target.value)}
                        sx={{ minWidth: "300px" }}
                    />
                </Grid>

                <Grid item><Typography variant="disabled">A regisztrációval elfogadod a szerződési feltételeinket.</Typography></Grid>

                <Grid item><Typography component={Link} to="/bejelentkezes">Van már fiókod?</Typography></Grid>

                <Grid item>
                    {
                        isSent
                        ?
                        <SendButton disabled>Regisztálok!</SendButton>
                        :
                        <SendButton type="submit">Regisztálok!</SendButton>
                    }
                </Grid>
            </Grid>
        </form>
    </React.Fragment>
}

export default Registration;