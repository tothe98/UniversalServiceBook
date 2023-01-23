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

    const sendRegistration = async (e) => {
        e.preventDefault();
        const response = await axiosInstance.post("signup", {
            fName: firstName,
            lName: lastName,
            email: email,
            password: password,
            phone: phoneNumber ? phoneNumber : ""
        }, { headers: { "x-access-token": localStorage.getItem("token") }});
        const data = await response.data;
        if (response.status == 200)
        {
            toast.success("Sikeres regisztráció!")
        }
        else
        {
            toast.error("Opss! Valami hiba történt a regisztráció során!")
        }
    }

    return <React.Fragment>
        <SubTitle variant='h3'>Regisztráció</SubTitle>

        <form onSubmit={e=>sendRegistration(e)}>
            <Grid container direction="column" spacing={1.5}>
                <Grid item>
                    <TextField
                        label="Kereszt név "
                        type="text"
                        onChange={e=>setFirstName(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Család név "
                        type="text"
                        onChange={e=>setLastName(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Email cím "
                        type="email"
                        onChange={e=>setEmail(e.target.value)}
                        required
                    />
                </Grid>

                <Grid item>
                    <TextField
                        label="Jelszó "
                        type="password"
                        onChange={e=>setPassword(e.target.value)}
                        required
                    />
                </Grid>

                <Grid item>
                    <TextField
                        label="Telefonszám"
                        type="tel"
                        onChange={e=>setPhoneNumber(e.target.value)}
                    />
                </Grid>

                <Grid item><Typography variant="disabled">A regisztrációval elfogadod a szerződési feltételeinket.</Typography></Grid>

                <Grid item><Typography component={Link} to="/bejelentkezes">Van már fiókod?</Typography></Grid>

                <Grid item><SendButton type="submit">Regisztálok!</SendButton></Grid>
            </Grid>
        </form>
    </React.Fragment>
}

export default Registration;