import React, {Component, useEffect, useState} from 'react';
import {
    MyCardSkeleton, 
    MyTextSkeleton
} from "../lib/Skeletons";
import {
    serviceInformationIcon
} from "../lib/GlobalIcons"
import {
    DOMPurify,
    Link,
    uuidv4,
    theme,
    axios,
    moment,
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
} from '../lib/GlobalImports';
import {
    SubTitle
} from '../lib/StyledComponents'
import {
    axiosInstance
} from '../lib/GlobalConfigs'
import VehicleCard from '../components/VehicleCard.component';
import InformationCard from '../components/InformationCard.component';

function Home({handleChangeTab}) {
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));

    /* loading screen variables */
    const [isLoading, setIsLoading] = useState(true);
    const [serviceInformations, setServiceInformations] = useState([]);
    const [lastActivityVehicles, setLastActivityVehicles] = useState([]);

    const getLastActivityVehicles = (token) => {
        setIsLoading(true);
        axiosInstance.get(`/lastViewed`, { headers: { "x-access-token": token } } )
            .then(res => {
                setLastActivityVehicles(res.data.data.lastViewed);
            })
            .catch(err => {

            })
        setIsLoading(false);
    }
    const getLastActivityServiceEntries = (token) => {
        setIsLoading(true);
        axiosInstance.get(`/serviceInformation`, { headers: { "x-access-token": token } } )
            .then(res => {
                setServiceInformations(res.data.data.servceInformation);
            })
            .catch(err => {

            })
        setIsLoading(false);
    }

    useEffect(() => {
        getLastActivityVehicles(localStorage.getItem("token"));
        getLastActivityServiceEntries(localStorage.getItem("token"));
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
                lastActivityVehicles
                ?
                lastActivityVehicles.map((vehicle, i) => {
                    return <VehicleCard vehicle={vehicle} i={i} handleChangeTab={handleChangeTab} />
                })
                :
                <Typography variant="h4" sx={{ opacity: 0.7 }} >Nincs legutóbbi aktivításod!</Typography>
            }

            <SubTitle variant='h3' sx={{marginTop: "2rem"}}>Szerviz Információk</SubTitle>

            {
                serviceInformations
                ?
                    serviceInformations.length
                    ?
                        serviceInformations.length > 0
                        ?
                            serviceInformations.map((information, i) => {
                                return <InformationCard key={information + " " + i} data={information} i={i} handleChangeTab={handleChangeTab} />
                            })
                        :
                        <Typography variant="h4" sx={{ opacity: 0.7 }} >Nincs legutóbbi aktivításod!</Typography>
                    :
                    <Typography variant="h4" sx={{ opacity: 0.7 }} >Nincs legutóbbi aktivításod!</Typography>
                :
                <Typography variant="h4" sx={{ opacity: 0.7 }} >Nincs legutóbbi aktivításod!</Typography>
            }
        </>
    )
}

export default Home;