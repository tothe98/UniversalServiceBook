import React, {useEffect, useState} from "react";
import {Button, Grid, styled, Toolbar, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {LoadingButton} from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import MailIcon from "../assets/mail.svg"

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem"
}))

const ReadedMailContentBox = styled('div')(({theme}) => ({
    position: "relative",
    width: "100",
    height: "auto",
    border: `1px solid ${theme.palette.common.blue}`,
    borderRadius: "5px",
    margin: "11px 0",
    padding: "10px"
}))

const UnReadedMailContentBox = styled('div')(({theme}) => ({
    position: "relative",
    width: "100",
    height: "auto",
    border: `1px solid ${theme.palette.common.lightgray}`,
    borderRadius: "5px",
    margin: "11px 0",
    padding: "10px"
}))

const MailImage = styled('img')(({theme}) => ({
    maxWidth: "43px",
    height: "100%",
    width: "100%"
}))

const MailButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button
}))

function Mails({handleChangeTab}) {
    const [mails, setMails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const receivedMails = [
            {
                id: 1,
                sender: "Anthony Josef",
                title: "title",
                body: "<h3>Lorem Ipsum</h3><br/>Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                attachments: [
                    {
                        img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                        message: "Gyújtáskapcsoló Csere"
                    }
                ],
                isReaded: false
            },
            {
                id: 1,
                sender: "David Alcheimer",
                title: "title",
                body: "<h3>Lorem Ipsum</h3><br/>Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                attachments: [
                    {
                        img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                        message: "Gyújtáskapcsoló Csere"
                    }
                ],
                isReaded: true
            },
            {
                id: 1,
                sender: "Claus Swab",
                title: "title",
                body: "<h3>Lorem Ipsum</h3><br/>Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                attachments: [
                    {
                        img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                        message: "Gyújtáskapcsoló Csere"
                    }
                ],
                isReaded: false
            },
            {
                id: 1,
                sender: "Chloe Fortheimer",
                title: "title",
                body: "<h3>Lorem Ipsum</h3><br/>Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                attachments: [
                    {
                        img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                        message: "Gyújtáskapcsoló Csere"
                    }
                ],
                isReaded: true
            }
        ]

        setIsLoading(false);
        setMails(receivedMails);
    }, []);


    if (isLoading)
    {
        return (<React.Fragment>
            <SubTitle variant='h3'>Leveleim...</SubTitle>

            <Grid container direction="row">
                <Grid item>
                    <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}>Betöltés...</LoadingButton>
                </Grid>
            </Grid>
        </React.Fragment>)
    }

    return (<React.Fragment>
        <SubTitle variant='h3'>Olvasatlan levelek</SubTitle>

        {
            mails && mails.map(mail => {
                return (mail.isReaded && <ReadedMailContentBox>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                        <Grid item>
                            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
                                <Grid item><MailImage src={MailIcon} alt="mail icon" /></Grid>
                                <Grid item><Typography>{mail.sender}</Typography></Grid>
                            </Grid>
                        </Grid>

                        <Grid item sx={{marginLeft: "auto"}}>
                            <MailButton component={Link} to={`/levelek/${mail.id}`}  onClick={e=>{handleChangeTab(2)}} >Megtekintem</MailButton>
                        </Grid>
                    </Grid>
                </ReadedMailContentBox>)
            })
        }

        <SubTitle variant='h3' sx={{marginTop: "1em"}}>Leveleim</SubTitle>

        {
            mails && mails.map(mail => {
                return (!mail.isReaded && <UnReadedMailContentBox>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                        <Grid item>
                            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
                                <Grid item><MailImage src={MailIcon} alt="mail icon" /></Grid>
                                <Grid item><Typography>{mail.sender}</Typography></Grid>
                            </Grid>
                        </Grid>

                        <Grid item sx={{marginLeft: "auto"}}>
                            <MailButton component={Link} to={`/levelek/${mail.id}`} onClick={e=>{handleChangeTab(2)}}>Megtekintem</MailButton>
                        </Grid>
                    </Grid>
                </UnReadedMailContentBox>)
            })
        }
    </React.Fragment>)
}

export default Mails;