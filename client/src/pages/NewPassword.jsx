import { Typography } from '@mui/material';
import React, { Component } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../lib/GlobalConfigs';
import { MyTextField, SendButton, SubTitle } from '../lib/StyledComponents';
import { Languages, MessageStatusCodes, getFieldMessage } from '../config/MessageHandler';

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

        if (!newPassword) {
            toast.error(getFieldMessage(Languages.hu, "új jelszó", MessageStatusCodes.error));
            return;
        }
        if (newPassword.length < 8) {
            toast.error(getFieldMessage(Languages.hu, "jelszó", MessageStatusCodes.warning));
            return;
        }
        if (!newRePassword) {
            toast.error(getFieldMessage(Languages.hu, "jelszó ismétlés", MessageStatusCodes.error));
            return;
        }
        if (newRePassword.length < 8) {
            toast.error(getFieldMessage(Languages.hu, "jelszó ismétlés", MessageStatusCodes.warning));
            return;
        }
        
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
        <Typography variant='body2'>* A jelszónak legalább 8 karakter hosszúnak kell lennie.</Typography>
        {
            isSent
            ?
            <SendButton sx={{ background: "green", color: "white" }} onClick={sendNewPasswordRequest} disabled>Mentés</SendButton>
            :
            <SendButton sx={{ background: "green", color: "white" }}>Mentés</SendButton>
        }
    </>
}

export default NewPassword;