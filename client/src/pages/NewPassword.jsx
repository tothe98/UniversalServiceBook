import React, { Component } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../lib/GlobalConfigs';
import { MyTextField, SendButton, SubTitle } from '../lib/StyledComponents';

function NewPassword({}) {
    const { userid, verificationCode } = useParams();
    const [isSent, setIsSent] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newRePassword, setNewRePassword] = useState("");

    const sendNewPasswordRequest = async () => {
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
        }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));
        
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
                if (newPassword.length == 0 || newPassword.length == 0) {
                    toast.error("Nem töltött ki valamit!");
                }
                else
                {
                    toast.error("A jelszónak legalább 8 karakternek kell lennie!")
                }
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
        {
            isSent
            ?
            <SendButton sx={{ background: "green", color: "white" }} onClick={sendNewPasswordRequest}>Mentés</SendButton>
            :
            <SendButton sx={{ background: "green", color: "white" }} disabled>Mentés</SendButton>
        }
    </>
}

export default NewPassword;