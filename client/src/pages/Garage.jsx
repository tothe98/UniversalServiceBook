import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {Button, Grid, styled, Typography, useMediaQuery} from "@mui/material";
import {Link} from "react-router-dom";
import theme from "../themes/theme";
import { v4 as uuidv4 } from 'uuid';

const CONTENT_BOX_MAX_HEIGHT = "200px";

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
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

function Garage() {
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));
    const [cars, setCars] = useState([]);

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
        setCars(cars);

    }, []);

    return (<React.Fragment>
        <SubTitle variant='h3'>Autóim</SubTitle>

        {
            cars && cars.map(car => {
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
                            <ViewButton component={Link} to={`/garazs/${car.carId}`} >Megtekintem</ViewButton>
                        </Grid>
                    </Grid>
                </ContentBox>
            })
        }
    </React.Fragment>)
}

export default Garage;