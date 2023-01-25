import React, { Component } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../lib/GlobalConfigs';
import { MyTextField, SendButton, SubTitle } from '../lib/StyledComponents';

function NewPassword({}) {
    const { userid, verificationCode } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [newRePassword, setNewRePassword] = useState("");

    const sendNewPasswordRequest = async () => {
        await axiosInstance.post(`/newPassword`, {
            userId: userid,
            verificationCode: verificationCode,
            password: newPassword,
            cpassword: newRePassword
        })
        .then((res) => {
            if (res.status == 201) {
                toast.success("Sikeres jelszó módosítás!");
                setNewPassword("");
                setNewRePassword("");
                window.location.href = "/bejelentkezes";
            }
        })
        .catch(err => {
            if (err.response.status == 422) {
                toast.error("Nem töltött ki valamit!");
            }
            if (err.response.status == 409) {
                toast.error("Lejárt a jelszóváltoztatási ideje!");
            }
        })
    }

    return <>
        <SubTitle variant='h3'>Új jelszó létrehozása!</SubTitle>

        <MyTextField
            fullWidth
            id="outlined-disabled"
            label="Új jelszó"
            value={newPassword}
            color="success"
            type="password"
            onChange={e=>{setNewPassword(e.target.value)}}
        />
        <MyTextField
            fullWidth
            id="outlined-disabled"
            label="Új jelszó mégegyszer"
            value={newRePassword}
            color="success"
            type="password"
            onChange={e=>{setNewRePassword(e.target.value)}}
        />
        <SendButton sx={{ background: "green", color: "white" }} onClick={sendNewPasswordRequest}>Mentés</SendButton>
    </>
}

export default NewPassword;