import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    Grid,
    styled,
    Typography,
    useMediaQuery
} from "@mui/material";
import {Link} from "react-router-dom";
import theme from "../themes/theme";
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import DOMPurify from "isomorphic-dompurify";

const CONTENT_BOX_MAX_HEIGHT = "200px";
const CAR_NAME_BOX_MAX_HEIGHT = "80px";
const CAR_DETAiL_SPACING = 2;
const CAR_DETAIL_GRID_ITEM_SPACE = "1em";

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem",
    fontWeight: 800
}))

const ContentBox = styled('div')(({theme}) => ({
    position: "relative",
    height: "auto",
    border: `1px solid ${theme.palette.common.lightgray}`,
    borderRadius: "5px",
    margin: "11px 0",
    padding: "10px"
}))

const ContentBoxImage = styled('img')(({theme}) => ({
    width: "100%",
    maxHeight: CONTENT_BOX_MAX_HEIGHT,
    objectFit: "scale-down",
    height: "100%"
}))

const ViewButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button,
    position: "relative"
}))

const NameBox = styled('div')(({theme}) => ({
    maxHeight: CAR_NAME_BOX_MAX_HEIGHT,
    height: "auto",
    background: theme.palette.common.white,
    boxShadow: theme.shadows[25],
    margin: "23px 0",
    padding: "10px"
}))

const BackToCarsButton = styled(Button)(({theme}) => ({
    color: theme.palette.common.darkblack,
    textTransform: "none",
    borderColor: `#D0D7DE`,
    borderRadius: "5px"
}))

const MailAttachmentImage = styled("img")(({theme}) => ({
    maxWidth: "200px",
    height: "100%",
    width: "100%"
}))

function GarageVehiclePreview() {
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const [mail, setMail] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        // TODO: axios request to the api (getting the specified mail)
        const receivedMail = {
            id: 1,
            title: "Hi George!",
            sender: "Chloe Fortheimer",
            body: "<h3>Lorem Ipsum</h3><p>Lorem ipsum is simply dummy text of the printing and typesetting <mark>industry</mark>. " +
                "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type" +
                " and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, " +
                "remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and mor" +
                "e recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
            attachments: [
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                },
                {
                    img: "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.7-cdti-gyujtaskapcsolo_3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC_MEDIUM.jpg",
                    message: "Gyújtáskapcsoló Csere"
                }
            ],
            isReaded: true
        }

        setMail(receivedMail);
        setIsLoading(false)
    }, []);

    if (isLoading)
    {
        return (<React.Fragment>
            <BackToCarsButton startIcon={<KeyboardBackspaceOutlinedIcon />} component={Link} to="/leveleim">
                <SubTitle variant='h3' sx={{marginBottom: "0", marginLeft: "1em"}}>Leveleim</SubTitle>
            </BackToCarsButton>

            <NameBox>
                <Typography variant="h3" sx={{fontWeight: 900}}>{mail.title}</Typography>
                <Typography variant="h4" sx={{ color: "rgba(17, 17, 17, 0.74)", fontWeight: 400 }}>Tárgy: {mail.subject}</Typography>
            </NameBox>

            <Grid container direction="row">
                <Grid item>
                    <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}>Betöltés...</LoadingButton>
                </Grid>
            </Grid>
        </React.Fragment>)
    }

    return (<React.Fragment>
        <BackToCarsButton startIcon={<KeyboardBackspaceOutlinedIcon />} component={Link} to="/levelek">
            <SubTitle variant='h3' sx={{marginBottom: "0", marginLeft: "1em"}}>Leveleim</SubTitle>
        </BackToCarsButton>

        <NameBox>
            <Typography variant="h3" sx={{fontWeight: 900}}>{mail.sender}</Typography>
            <Typography variant="h4" sx={{ color: "rgba(17, 17, 17, 0.74)", fontWeight: 400 }}>Tárgy: {mail.title}</Typography>
        </NameBox>

        <Typography dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(mail.body)}}></Typography>

        { mail.attachments.length > 0 && <NameBox>
            <Typography variant="h3" sx={{fontWeight: 900}}>Csatolmányok</Typography>
        </NameBox>}

        {
            mail.attachments.length > 0 && <Grid container alignItems="flex-start" justifyContent="center" direction="row" wrap="wrap" spacing={1.5}>
                {
                    mail.attachments.map(attachment => {
                        return <Grid item>
                            <figure style={{margin: 0}}>
                                <MailAttachmentImage src={attachment.img} alt="attachment img" />
                                <figcaption>
                                    {attachment.message}
                                </figcaption>
                            </figure>
                        </Grid>
                    })
                }
            </Grid>
        }
    </React.Fragment>)
}

export default GarageVehiclePreview;