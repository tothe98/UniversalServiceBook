import {Box, Button, Grid, styled, Toolbar, Typography, useMediaQuery} from '@mui/material';
import React, {Component, useEffect, useState} from 'react';
import DOMPurify from 'isomorphic-dompurify';
import {Link} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import serviceInformationIcon from "../assets/serviceInformationIcon.svg"
import theme from "../themes/theme";

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

/*
    Chassis number = Alvázszám,
    License plate number = Rendszám
    Motor number = Motorszám
    Registered services = Bejegyzett Szervízek
 */
function Home({handleChangeTab}) {
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));
    const [cars, setCars] = useState([]);
    const [serviceInformations, setServiceInformations] = useState([]);

    useEffect(() => {
        const cars = [
            {
                carId: "2e2zbahdb2a#",
                imageUrl: "https://hasznaltauto.medija.hu/2700439/18711995_1.jpg?v=1665186628",
                carName: "Honda Accord",
                chassisNumber: "JACUBS25DN7100010",
                licensePlateNumber: "AA AA 001",
                motorNumber: "Z14XEP19ET4682",
                registeredServices: 10
            },
            {
                carId: "2e2zbasdhdb2a#",
                imageUrl: "https://hasznaltauto.medija.hu/11497/18779656_1.jpg?v=1666966921",
                carName: "SEAT Alhambra",
                chassisNumber: "JACUBS25DN7100010",
                licensePlateNumber: "CA AA 021",
                motorNumber: "Z14XEP19ET4682",
                registeredServices: 43
            },
            {
                carId: "2e2zbahdveeeb2a#",
                imageUrl: "https://hasznaltauto.medija.hu/17297/18627843_1.jpg?v=1662994088",
                carName: "Honda Civic",
                chassisNumber: "JACUBS25DN7100010",
                licensePlateNumber: "AA AB 101",
                motorNumber: "Z14XEP19ET4682",
                registeredServices: 212
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

        setCars(cars);
        setServiceInformations(serviceInformations);
    }, []);


    return (
        <>
            <SubTitle variant='h3'>Legutóbbi aktivításaim</SubTitle>

            {
               cars.map(car => {
                    return <ContentBox key={uuidv4()}>
                       <Grid container spacing={2} direction={underS ? "column" : "row"} alignItems={underS ? "center" : "flex-start"} justifyContent={underS ? "center" : "flex-start"}>
                           <Grid item xs={2}>
                               <ContentBoxImage src={car.imageUrl} alt={car.carName} />
                           </Grid>

                           <Grid item xs={8}>
                               <Grid container direction="column" justifyContent="center" >
                                   <Typography variant="h4" xs>
                                       {car.carName}
                                   </Typography>

                                   <Grid item sx={{maxWidth: "628px"}}>
                                       <Grid container direction="row" spacing={2}>
                                           <Grid item><Typography variant="h5">Alvázszám:</Typography></Grid>
                                           <Grid item><Typography variant="h6">{car.chassisNumber}</Typography></Grid>
                                       </Grid>

                                       <Grid container direction="row" spacing={2}>
                                           <Grid item><Typography variant="h5">Rendszám:</Typography></Grid>
                                           <Grid item><Typography variant="h6">{car.licensePlateNumber}</Typography></Grid>
                                       </Grid>

                                       <Grid container direction="row" spacing={2}>
                                           <Grid item><Typography variant="h5">Motorszám:</Typography></Grid>
                                           <Grid item><Typography variant="h6">{car.motorNumber}</Typography></Grid>
                                       </Grid>

                                       <Grid container direction="row" spacing={2}>
                                           <Grid item><Typography variant="h5">Bejegyzett szervízek:</Typography></Grid>
                                           <Grid item><Typography variant="h6">{car.registeredServices}</Typography></Grid>
                                       </Grid>
                                   </Grid>
                               </Grid>
                           </Grid>

                           <Grid item xs sx={{position: underS ? "block" : "absolute", bottom: "2em", right: "2em"}}>
                               <ViewButton component={Link} to={`/garazs/${car.carId}`} onClick={e=>{handleChangeTab(1)}} >Megtekintem</ViewButton>
                           </Grid>
                       </Grid>
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
        </>
    )
}

export default Home;