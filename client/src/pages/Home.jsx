import {
    Alert,
    Box,
    Button,
    Card, CardActions, CardContent,
    CardHeader, CardMedia,
    Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,
    Grid,
    IconButton, Menu, Snackbar,
    styled,
    Toolbar, Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import React, {Component, useEffect, useState} from 'react';
import DOMPurify from 'isomorphic-dompurify';
import {Link} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import serviceInformationIcon from "../assets/serviceInformationIcon.svg"
import theme from "../themes/theme";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {MyCardSkeleton, MyTextSkeleton} from "../lib/Skeletons";
import axios from 'axios';
import moment from 'moment';

const CONTENT_BOX_MAX_HEIGHT = "200px";

const SubTitle = styled(Typography)(({theme}) => ({
    marginBottom: "2rem"
}))

const ContentBox = styled('div')(({theme}) => ({
    position: "relative",
    width: "100",
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

const CarCard = styled(Card)(({theme}) => ({
    padding: "0.2rem 1rem"
}))

const CarCardHeader = styled(CardHeader)(({theme}) => ({
    "& .MuiCardHeader-title": {
        ...theme.typography.h3
    },
    padding: 0
}))

/*
*
* Honda Accord
* ----- SPACE BETWEEN ..
* img
* license plate number: ...
* ----- SPACE BETWEEN ..
* 2110 le 2016 year
* */
const SPACE_BETWEEN_HEADER_AND_FOOTER = "0.9rem";

const CarCardMedia = styled(CardMedia)(({theme}) => ({
    maxHeight: "300px",
    maxWidth: "300px",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    marginTop: SPACE_BETWEEN_HEADER_AND_FOOTER
}))

const CarCardContent = styled(CardContent)(({theme}) => ({
}))

const CarCardActions = styled(CardActions)(({theme}) => ({
    marginTop: SPACE_BETWEEN_HEADER_AND_FOOTER,
    padding: 0
}))

const CarOptionsMenu = styled(Menu)(({theme}) => ({
    "&	.MuiMenu-paper": {
        borderRadius: "5px",
        border: theme.palette.common.lightgray
    }
}))

const CarDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialog-paper": {
        backgroundColor: "none",
        width: "100%"
    }
}))

const MenuText = styled(Typography)(({theme}) => ({
    color: theme.palette.common.darkblack
}))

const CarDialogText = styled(DialogContentText)(({theme}) => ({
}))

function Home({handleChangeTab}) {
    /* network settings */
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BACKEND_URL
    })

    /* loading screen variables */
    const [isLoading, setIsLoading] = useState(true);

    const [openCarOptions, changeCarOptions] = useState(false);
    const [carAnchorEl, setCarAnchorEL] = useState(null);
    const [carModal, setCarModal] = useState(false);
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));
    const [serviceInformations, setServiceInformations] = useState([]);
    const [lastActivityVehicles, setLastActivityVehicles] = useState([]);

    /* for dialog menu */
    const [deleteVehicleName, setDeleteVehicleName] = useState('');

    /* for snackbar */
    const [isSnackOpen, setIsSnackOpen] = useState(false);

    const CopyToClipBoard = (url) => {
        navigator.clipboard.writeText(url);
    }

    const getVehicleById = async (token, id) => {
        return new Promise((resolve, reject) => {
            /* Constrainst: id cannot be null, id have to be valid (format) */
            if (id)
            {
                // TODO: I have to tell to Erik to make an id checker
                axiosInstance.get(`/getVehicle/${id}`, { headers: { 'x-access-token': token } })
                    .then(res => {
                        const v = res.data.data.vehicle;
                        v['serviceEntries'] = res.data.data.serviceEntries;
                        resolve(v);
                    })
            }
        })
    }

    const getLastActivityVehicles = (token, vehicleIDs) => {
        setIsLoading(true);
        const promises = [];

        for (let i = 0; i < vehicleIDs.length; i++) {
            if (vehicleIDs[i] != null) {
                if (vehicleIDs[i].length == 24) {
                    /* TODO: When I add etc. kecske as an id it throws 500 error. */
                    promises.push(getVehicleById(token, vehicleIDs[i]));
                }
            }
        }

        Promise.all(promises)
            .then((results) => {
                const arr = [];
                results.forEach((result) => {
                    if (result != undefined) {
                        if (result != null) {
                            arr.push(result) 
                        }
                    }
                })
                setLastActivityVehicles(arr);
            })
            .catch((err) => {
                
            })
        setIsLoading(false);
    }

    useEffect(() => {
        const serviceInformations = [
            {
                id: "12a12e",
                chassisNumber: "AH22UBZVSDTAWD",
                message: `Figyelem az ön <b>Honda Accord</b> gépjárműve (alvz.szm: <b>JACUBS25DN7100010</b>) <b>2023.01.13</b>-án kötelező szervízen kell résztvennie!`
            },
            {
                id: "12a1asd2e",
                chassisNumber: "AH22UBZVSDTAWD",
                message: `Figyelem az ön <b>Renault Megane</b> gépjárműve (alvz.szm: <b>JACUBS25DN7100010</b>) a következő hónapban kötelező szervízen kell résztvennie!`
            },
            {
                id: "12acw12e",
                chassisNumber: "AH22UBZVSDTawdwdAWD",
                message: `Figyelem az ön <a>SEAT Alhambra</a> gépjárműve (alvz.szm: <b>JACUBS25DN7100010</b>) kötelező szervízen kell résztvennie! <mark>MA!</mark>`
            },
            {
                id: "12a12e",
                chassisNumber: "AHad22UBZVSDTAWD",
                message: `Figyelem az ön <b>Audi A7</b> gépjárművét (alvz.szm: <b>JACUBS25DN7100010</b>) sikeresen javítottuk!`
            },
            {
                id: "12a12e",
                chassisNumber: "AWDFH22UBZVSDTAWD",
                message: `Figyelem az ön <b>Honda Civic</b> gépjárműve (alvz.szm: <b>JACUBS25DN7100010</b>) megbukott a forgalmi teszten!`
            }
        ]

        if (localStorage.getItem("last_viewed")) {
            getLastActivityVehicles(localStorage.getItem("token"), 
                Array.from(JSON.parse(localStorage.getItem("last_viewed"))));
        }
        setServiceInformations(serviceInformations);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <>
                <div>
                    <MyTextSkeleton />
                    <MyCardSkeleton />
                </div>

                <div>
                    <MyTextSkeleton />
                    <MyCardSkeleton />
                </div>
            </>
        )
    }

    return (
        <>
            <SubTitle variant='h3'>Legutóbbi aktivításaim</SubTitle>

            {
                localStorage.getItem("last_viewed")
                ?
                    Array.from(JSON.parse(localStorage.getItem("last_viewed"))).length > 0
                    ?
                    <>
                        {
                            lastActivityVehicles
                                .map((vehicle, i) => {
                                    return <ContentBox key={vehicle+i}>
                                            <Grid container direction="column">
                                                <Grid item>
                                                    <CarCard>
                                                        <CarCardHeader
                                                            title={`${vehicle.manufacture} ${vehicle.model}`}
                                                        >
                                                        </CarCardHeader>

                                                        <Grid container direction={underMD ? "column" : "center"}
                                                            alignItems={underMD ? "center" : "flex-start"}
                                                            justifyContent={underMD && "center"}>
                                                            <Grid item>
                                                                <CarCardMedia
                                                                    component="img"
                                                                    image={vehicle['pictures'][0]}
                                                                    alt={`${vehicle.manufacture} ${vehicle.model}`}
                                                                />
                                                            </Grid>

                                                            <Grid item>
                                                                <CarCardContent>
                                                                    <Grid container direction="column" justifyContent="center">
                                                                        <Grid container direction="row" spacing={2}>
                                                                            <Grid item><Typography variant="h4">Alvázszám:</Typography></Grid>
                                                                            <Grid item><Typography
                                                                                variant="h4">{vehicle.vin}</Typography></Grid>
                                                                        </Grid>

                                                                        <Grid container direction="row" spacing={2}>
                                                                            <Grid item><Typography variant="h4">Rendszám:</Typography></Grid>
                                                                            <Grid item><Typography
                                                                                variant="h4">{vehicle.licenseNumber}</Typography></Grid>
                                                                        </Grid>

                                                                        <Grid container direction="row" spacing={2}>
                                                                            <Grid item><Typography variant="h4">Bejegyzett
                                                                                szervízek:</Typography></Grid>
                                                                            <Grid item><Typography
                                                                                variant="h4">{vehicle.serviceEntries.length}</Typography></Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </CarCardContent>
                                                            </Grid>
                                                        </Grid>

                                                        <CarCardActions>
                                                            {
                                                                underMD
                                                                    ?
                                                                    <Chip label={moment(vehicle.vintage).format("YYYY")} variant="outlined"/>
                                                                    :
                                                                    <><Chip label={moment(vehicle.vintage).format("YYYY")} variant="outlined"/>
                                                                        <Chip label={`${vehicle.mileage} km`} variant="outlined"/>
                                                                        <Chip label={`${vehicle.performanceLE} LE`} variant="outlined"/></>
                                                            }
                                                            <ViewButton sx={{marginLeft: "auto"}} component={Link}
                                                                        to={`/jarmuveim/${vehicle['_id']}`} onClick={e => {
                                                                handleChangeTab(1)
                                                            }}>Megtekintem</ViewButton>
                                                        </CarCardActions>
                                                    </CarCard>
                                                </Grid>
                                            </Grid>
                                        </ContentBox>
                                })
                        }
                    </>
                    :
                    <Typography variant="h4" sx={{ opacity: 0.7 }} >Nincs legutóbbi aktivításod!</Typography>
                :
                <Typography variant="h4" sx={{ opacity: 0.7 }} >Nincs legutóbbi aktivításod!</Typography>
            }

            <SubTitle variant='h3' sx={{marginTop: "2rem"}}>Szervíz Információk</SubTitle>

            {
                serviceInformations.map((info, i) => {
                    return <ContentBox key={uuidv4()}>
                        <Grid container spacing={2} direction={underS ? "column" : "row"}  alignItems="center" justifyContent={ underS ? "center" : "flex-start" }>
                            <Grid item xs={1}>
                                <Grid container direction="column" justifyContent="center" alignItems="center">
                                    <ContentBoxImage src={serviceInformationIcon} alt="Szervíz Információ" sx={{width: "4em", height: "4em"}} />
                                    <Typography>{i + 1}</Typography>
                                </Grid>
                            </Grid>

                            <Grid item xs={10} sx={{maxWidth: "628px", height: "auto"}}>
                                <Grid container direction="column" justifyContent="center" sx={{ textAlign: underS ? "center" : "" }} >
                                    <Typography variant="h4" xs>
                                        Szervíz Információ
                                    </Typography>
                                </Grid>
                                <Grid container direction="row" sx={{ textAlign: underS ? "center" : "" }} >
                                    <Grid item><Typography variant="h5" sx={{textAlign: "justify", maxWidth: "500px"}} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(info.message)}} /></Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs sx={{position: underS ? "block" : "absolute", bottom: "2em", right: "2em"}}>
                                <ViewButton component={Link} to={`/jarmuveim/2e2zbahdb2a#12`} onClick={e=>{handleChangeTab(2)}}  >Megtekintem</ViewButton>
                            </Grid>
                        </Grid>
                    </ContentBox>
                })
            }

            <CarDialog
                open={carModal}
                onClose={e=>setCarModal(!carModal)}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography variant="h2">Figyelmeztetés</Typography>
                </DialogTitle>

                <DialogContent>
                    <CarDialogText id="alert-dialog-description">
                        Biztosan törölni kívánja az alábbi elemet?
                        ( <b>{deleteVehicleName}</b> )
                    </CarDialogText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={e=>setCarModal(!carModal)} variant="contained" color="success">Mégsem</Button>
                    <Button onClick={e=>{setCarModal(!carModal); setIsSnackOpen(!isSnackOpen)}} variant="contained" color="error" autoFocus>
                        Törlés
                    </Button>
                </DialogActions>
            </CarDialog>

            <Snackbar open={isSnackOpen} autoHideDuration={6000} onClose={e=>setIsSnackOpen(!isSnackOpen)}>
                <Alert onClose={e=>setIsSnackOpen(!isSnackOpen)} severity="success" sx={{ width: '100%' }}>
                    Sikeresen törölted az alábbi elemet ({deleteVehicleName})!
                </Alert>
            </Snackbar>
        </>
    )
}

export default Home;