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
    /* loading screen variables */
    const [isLoading, setIsLoading] = useState(true);

    const [openCarOptions, changeCarOptions] = useState(false);
    const [carAnchorEl, setCarAnchorEL] = useState(null);
    const [carModal, setCarModal] = useState(false);
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));
    const [vehicles, setVehicles] = useState([]);
    const [serviceInformations, setServiceInformations] = useState([]);
    const [openCopyToolTip, setOpenCopyToolTip] = useState(false);

    /* for dialog menu */
    const [deleteVehicleName, setDeleteVehicleName] = useState('');
    const [deleteVehicleID, setDeleteVehicleID] = useState('');

    /* for snackbar */
    const [isSnackOpen, setIsSnackOpen] = useState(false);

    const CopyToClipBoard = (url) => {
        navigator.clipboard.writeText(url);
    }

    useEffect(() => {
        const vehicles = [
            {
                carId: "2e2zbahdb2a#",
                imageUrl: "https://img.jofogas.hu/620x620aspect/Honda_Accord_Tourer_2_0_Elegance__Automata__Xen____659692224244378.jpg",
                carName: "Honda Accord",
                chassisNumber: "JACUBS25DN7100010",
                licensePlateNumber: "AA AA 001",
                motorNumber: "Z14XEP19ET4682",
                registeredServices: 10,
                year: 2004,
                km: 200_422,
                le: 232
            },
            {
                carId: "2e2zbasdhdb2a#",
                imageUrl: "https://autosoldalak.hu/auto_kepek/10403/6799b9ecbfd2d79af5820fdadb30d4f6.jpg",
                carName: "SEAT Alhambra",
                chassisNumber: "JACUBS25DN7100010",
                licensePlateNumber: "CA AA 021",
                motorNumber: "Z14XEP19ET4682",
                registeredServices: 43,
                year: 2010,
                km: 130_422,
                le: 130
            },
            {
                carId: "2e2zbahdveeeb2a#",
                imageUrl: "https://file.joautok.hu/car-for-sale-images/500x375/auto/img-20210614-140459_7rac40yw.jpg",
                carName: "Honda Civic",
                chassisNumber: "JACUBS25DN7100010",
                licensePlateNumber: "AA AB 101",
                motorNumber: "Z14XEP19ET4682",
                registeredServices: 212,
                year: 1998,
                km: 400_001,
                le: 90
            }
        ]
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

        setVehicles(vehicles);
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
                vehicles.map((vehicle,i) => {
                    return <ContentBox key={vehicle+i}>
                        <Grid container direction="column">
                            <Grid item>
                                <CarCard>
                                    <CarCardHeader
                                        title={vehicle.carName}
                                        action={
                                            <IconButton aria-label="settings" onClick={e => {
                                                changeCarOptions(true);
                                                setCarAnchorEL(e.target)
                                                setDeleteVehicleID(vehicle.carId)
                                                setDeleteVehicleName(vehicle.carName)
                                            }}>
                                                <MoreVertIcon/>
                                            </IconButton>
                                        }
                                    >
                                    </CarCardHeader>

                                    <Grid container direction={underMD ? "column" : "center"}
                                          alignItems={underMD ? "center" : "flex-start"}
                                          justifyContent={underMD && "center"}>
                                        <Grid item>
                                            <CarCardMedia
                                                component="img"
                                                image={vehicle.imageUrl}
                                                alt={vehicle.carName}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <CarCardContent>
                                                <Grid container direction="column" justifyContent="center">
                                                    <Grid container direction="row" spacing={2}>
                                                        <Grid item><Typography variant="h4">Alvázszám:</Typography></Grid>
                                                        <Grid item><Typography
                                                            variant="h4">{vehicle.chassisNumber}</Typography></Grid>
                                                    </Grid>

                                                    <Grid container direction="row" spacing={2}>
                                                        <Grid item><Typography variant="h4">Rendszám:</Typography></Grid>
                                                        <Grid item><Typography
                                                            variant="h4">{vehicle.licensePlateNumber}</Typography></Grid>
                                                    </Grid>

                                                    <Grid container direction="row" spacing={2}>
                                                        <Grid item><Typography variant="h4">Motorszám:</Typography></Grid>
                                                        <Grid item><Typography
                                                            variant="h4">{vehicle.motorNumber}</Typography></Grid>
                                                    </Grid>

                                                    <Grid container direction="row" spacing={2}>
                                                        <Grid item><Typography variant="h4">Bejegyzett
                                                            szervízek:</Typography></Grid>
                                                        <Grid item><Typography
                                                            variant="h4">{vehicle.registeredServices}</Typography></Grid>
                                                    </Grid>
                                                </Grid>
                                            </CarCardContent>
                                        </Grid>
                                    </Grid>

                                    <CarCardActions>
                                        {
                                            underMD
                                                ?
                                                <Chip label={vehicle.year} variant="outlined"/>
                                                :
                                                <><Chip label={vehicle.year} variant="outlined"/>
                                                    <Chip label={`${vehicle.km} km`} variant="outlined"/>
                                                    <Chip label={`${vehicle.le} LE`} variant="outlined"/></>
                                        }
                                        <ViewButton sx={{marginLeft: "auto"}} component={Link}
                                                    to={`/jarmuveim/${vehicle.carId}`} onClick={e => {
                                            handleChangeTab(1)
                                        }}>Megtekintem</ViewButton>
                                    </CarCardActions>
                                </CarCard>
                            </Grid>
                        </Grid>

                        <CarOptionsMenu
                            id="basic-menu"
                            anchorEl={carAnchorEl}
                            open={openCarOptions}
                            onClose={e => changeCarOptions(!openCarOptions)}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <Divider/>
                            <Button startIcon={<DoNotDisturbOnOutlinedIcon sx={{color: "red"}}/>}>
                                <MenuText variant="h4" onClick={e => {
                                    setCarModal(true);
                                    changeCarOptions(false)
                                }}>Törlés</MenuText>
                            </Button>
                            <Divider/>
                            <Tooltip
                                PopperProps={{
                                    disablePortal: true,
                                }}
                                open={openCopyToolTip}
                                onClick={e => setOpenCopyToolTip(!openCopyToolTip)}
                                onClose={e => setOpenCopyToolTip(!openCopyToolTip)}
                                title="Másolva a vágólapodra!"
                            >
                                <Button startIcon={<ShareOutlinedIcon/>}>
                                    <MenuText variant="h4"
                                              onClick={e => CopyToClipBoard(`${process.env.REACT_APP_CLIENT_URL}/jarmuveim/${vehicle.carId}`)}>Megosztás</MenuText>
                                </Button>
                            </Tooltip>
                        </CarOptionsMenu>
                    </ContentBox>
                })
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
                                <ViewButton component={Link} to={`/levelek/${info.id}`} onClick={e=>{handleChangeTab(2)}}  >Megtekintem</ViewButton>
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