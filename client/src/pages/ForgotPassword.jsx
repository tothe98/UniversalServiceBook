import React, { Component } from 'react';
import { useState } from 'react';
import { axiosInstance } from '../lib/GlobalConfigs';
import {
    Grid, theme, toast
} from '../lib/GlobalImports'
import {
    SubTitle
} from "../lib/StyledComponents"
import {
    MyTextField,
    SendButton
} from "../lib/StyledComponents"

function ForgotPassword() {
    const [email, setEmail] = useState("");

    const sendForgotPasswordRequest = async () => {
        await axiosInstance.post("/forgotPassword", { email: email })
            .then(res => {
                if (res.status == 200) {
                    setEmail("");
                    toast.success("Email elküldve!");
                }
            })
            .catch(err => {
                if (err.response.status == 422) {
                    toast.error("Ooops! Email mező nincs kitöltve!");
                }
                if (err.response.status == 404) {
                    toast.error("Ooops! Nem létezik ez az email cím!");
                }
                setEmail("");
            })
    }

    return <>
        <SubTitle variant='h3'>Elfelejtett jelszó kérelem</SubTitle>

        <MyTextField
            fullWidth
            id="outlined-disabled"
            label="Email cím"
            value={email}
            default={""}
            color="success"
            type="email"
            onChange={e=>{setEmail(e.target.value)}}
        />
        <SendButton onClick={sendForgotPasswordRequest}>Küldés</SendButton>
    </>
}

export default ForgotPassword;